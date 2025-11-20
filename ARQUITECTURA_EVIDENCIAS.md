# 📁 Arquitectura de Almacenamiento de Evidencias - Estándares Industriales

## 🏗️ **Estructura Canónica Propuesta**

### **📂 Jerarquía de Carpetas en Supabase Storage**

```
pmcze14-evidencias/
├── diagnosticos/
│   ├── {diagnostico_id}/
│   │   ├── dimension_aprovechamiento/
│   │   │   ├── promedio_general/
│   │   │   │   ├── original/
│   │   │   │   │   ├── 2024-11-13_evidencia_001.pdf
│   │   │   │   │   └── 2024-11-13_grafica_rendimiento.png
│   │   │   │   ├── thumbnails/
│   │   │   │   │   └── thumb_grafica_rendimiento_150x150.jpg
│   │   │   │   └── compressed/
│   │   │   │       └── comp_evidencia_001.pdf
│   │   │   ├── eficiencia_terminal/
│   │   │   ├── indice_reprobacion/
│   │   │   └── indice_desercion/
│   │   ├── dimension_practicas_docentes/
│   │   ├── dimension_formacion_docente/
│   │   └── metadata/
│   │       ├── manifest.json
│   │       └── audit_log.json
│   └── templates/
│       ├── formato_evidencias.md
│       └── esquemas_validacion.json
├── temp/
│   └── uploads/
│       └── {session_id}/
└── backups/
    └── {año}/{mes}/
```

### **🎯 Nomenclatura de Archivos (ISO 8601 + Descriptivo)**

```
{fecha}_{tipo}_{secuencia}_{descriptor}.{ext}
2024-11-13_evidencia_001_reporte_calificaciones.pdf
2024-11-13_imagen_002_aula_matematicas.jpg
2024-11-13_video_003_clase_demostrativa.mp4
2024-11-13_audio_004_entrevista_director.m4a
```

## 🔧 **Implementación Técnica**

### **1. Servicio de Almacenamiento de Evidencias**

```typescript
interface EstructuraEvidencia {
  diagnosticoId: string
  dimension: 'aprovechamiento' | 'practicas_docentes' | 'formacion_docente'
  criterio: string
  tipoArchivo: 'original' | 'thumbnail' | 'compressed'
  metadata: ArchivoMetadata
}

interface ArchivoMetadata {
  nombreOriginal: string
  nombreGenerado: string
  rutaCompleta: string
  tamaño: number
  tipoMime: string
  checksum: string
  fechaSubida: Date
  usuarioId: string
  descripcion?: string
  tags: string[]
}
```

### **2. Bucket Configuration (Supabase Storage)**

```sql
-- Configuración del bucket en Supabase
CREATE OR REPLACE FUNCTION create_evidencias_bucket() 
RETURNS void AS $$
BEGIN
  -- Crear bucket público para evidencias
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'pmcze14-evidencias',
    'PMCZE14 Evidencias Diagnóstico',
    true,
    10485760, -- 10MB limit
    ARRAY[
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/mp4',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  );
END;
$$ LANGUAGE plpgsql;
```

### **3. Políticas de Seguridad (RLS)**

```sql
-- RLS para evidencias por diagnóstico
CREATE POLICY "Usuarios pueden subir evidencias a sus diagnósticos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pmcze14-evidencias' 
  AND (storage.foldername(name))[1] = 'diagnosticos'
  AND (storage.foldername(name))[2] IN (
    SELECT id::text FROM diagnosticos 
    WHERE usuario_id = auth.uid()
  )
);

CREATE POLICY "Usuarios pueden ver evidencias de diagnósticos permitidos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pmcze14-evidencias'
  AND (
    -- Propios diagnósticos
    (storage.foldername(name))[2] IN (
      SELECT id::text FROM diagnosticos WHERE usuario_id = auth.uid()
    )
    OR
    -- Supervisores e inspectores pueden ver todo
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() 
      AND rol IN ('SUPERVISOR', 'INSPECTOR')
    )
  )
);
```

## 🛠️ **Servicios de Evidencias**

### **1. EvidenciasService.ts**

```typescript
class EvidenciasService {
  private bucket = 'pmcze14-evidencias'
  
  async subirEvidencia(
    diagnosticoId: string,
    dimension: string,
    criterio: string,
    archivo: File,
    descripcion?: string
  ): Promise<ArchivoEvidencia> {
    
    // 1. Generar ruta estructurada
    const ruta = this.generarRutaEvidencia(diagnosticoId, dimension, criterio, archivo)
    
    // 2. Validar archivo
    await this.validarArchivo(archivo)
    
    // 3. Generar thumbnail si es imagen
    const thumbnail = await this.generarThumbnail(archivo)
    
    // 4. Comprimir si es necesario
    const archivoComprimido = await this.comprimirArchivo(archivo)
    
    // 5. Subir archivos a Supabase
    const [original, thumb, compressed] = await Promise.all([
      this.subirArchivo(`${ruta}/original/${archivo.name}`, archivo),
      thumbnail ? this.subirArchivo(`${ruta}/thumbnails/thumb_${archivo.name}`, thumbnail) : null,
      this.subirArchivo(`${ruta}/compressed/comp_${archivo.name}`, archivoComprimido)
    ])
    
    // 6. Registrar en base de datos
    const metadata = await this.registrarMetadata(diagnosticoId, dimension, criterio, {
      original,
      thumbnail: thumb,
      compressed,
      descripcion,
      archivo
    })
    
    return metadata
  }

  private generarRutaEvidencia(diagnosticoId: string, dimension: string, criterio: string, archivo: File): string {
    const timestamp = new Date().toISOString().split('T')[0]
    return `diagnosticos/${diagnosticoId}/dimension_${dimension}/${criterio}`
  }

  private async validarArchivo(archivo: File): Promise<void> {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const tiposPermitidos = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/mp4',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (archivo.size > maxSize) {
      throw new Error(`Archivo muy grande. Máximo ${maxSize / 1024 / 1024}MB`)
    }

    if (!tiposPermitidos.includes(archivo.type)) {
      throw new Error('Tipo de archivo no permitido')
    }
  }

  async listarEvidencias(diagnosticoId: string, dimension?: string, criterio?: string): Promise<ArchivoEvidencia[]> {
    let ruta = `diagnosticos/${diagnosticoId}`
    
    if (dimension) ruta += `/dimension_${dimension}`
    if (criterio) ruta += `/${criterio}`
    
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .list(ruta, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })
    
    if (error) throw error
    
    return data?.map(file => this.mapearArchivoEvidencia(file)) || []
  }

  async eliminarEvidencia(ruta: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([ruta])
    
    if (error) throw error
    
    // También eliminar registro de metadata
    await this.eliminarMetadata(ruta)
  }

  async obtenerUrlDescarga(ruta: string, tipoDescarga: 'original' | 'compressed' = 'original'): Promise<string> {
    const rutaFinal = tipoDescarga === 'compressed' ? 
      ruta.replace('/original/', '/compressed/').replace(/^/, 'comp_') : 
      ruta

    const { data } = await supabase.storage
      .from(this.bucket)
      .createSignedUrl(rutaFinal, 3600) // 1 hora
    
    return data?.signedUrl || ''
  }
}
```

### **2. Base de Datos para Metadata**

```sql
-- Tabla para metadata de evidencias
CREATE TABLE evidencias_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,
    dimension VARCHAR(50) NOT NULL,
    criterio VARCHAR(100) NOT NULL,
    
    -- Información del archivo
    nombre_original VARCHAR(255) NOT NULL,
    nombre_generado VARCHAR(255) NOT NULL,
    ruta_original TEXT NOT NULL,
    ruta_thumbnail TEXT,
    ruta_comprimido TEXT,
    
    -- Metadatos técnicos
    tipo_mime VARCHAR(100) NOT NULL,
    tamaño_bytes INTEGER NOT NULL,
    checksum VARCHAR(64),
    
    -- Información descriptiva
    descripcion TEXT,
    tags TEXT[],
    
    -- Auditoría
    usuario_id UUID NOT NULL REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT evidencias_unique_ruta UNIQUE(ruta_original)
);

-- Índices para performance
CREATE INDEX idx_evidencias_diagnostico ON evidencias_metadata(diagnostico_id);
CREATE INDEX idx_evidencias_dimension_criterio ON evidencias_metadata(dimension, criterio);
CREATE INDEX idx_evidencias_usuario ON evidencias_metadata(usuario_id);
CREATE INDEX idx_evidencias_fecha ON evidencias_metadata(created_at);
```

## 🔄 **Flujo de Subida Optimizado**

### **Proceso Step-by-Step:**

1. **📤 Upload Inicial**
   ```
   Cliente → Temporal → Validación → Procesamiento → Storage Final
   ```

2. **🔍 Validación Multi-Capa**
   - Tipo de archivo (MIME)
   - Tamaño (< 10MB)
   - Contenido (anti-malware básico)
   - Permisos de usuario

3. **⚡ Procesamiento Asíncrono**
   - Generación de thumbnails
   - Compresión inteligente
   - Extracción de metadatos
   - Generación de checksums

4. **💾 Almacenamiento Estructurado**
   - Original en `original/`
   - Thumbnail en `thumbnails/`
   - Comprimido en `compressed/`
   - Metadata en PostgreSQL

## 🚀 **Beneficios de Esta Arquitectura**

### **✅ Escalabilidad**
- Estructura clara y predecible
- Fácil navegación y búsqueda
- Soporte para millones de archivos

### **🔒 Seguridad**
- RLS a nivel de bucket
- Políticas granulares por usuario/rol
- URLs firmadas para acceso temporal
- Validación estricta de archivos

### **⚡ Performance**
- Thumbnails precargados
- Versiones comprimidas
- CDN de Supabase
- Carga lazy de evidencias

### **🔍 Trazabilidad**
- Metadata completa
- Audit log
- Versionado de cambios
- Respaldo automático

### **🛠️ Mantenibilidad**
- Separación por contexto
- Limpieza automática de temporales
- Migración sencilla
- Backup estructurado

## 📊 **Estimación de Almacenamiento**

```
Por Diagnóstico (promedio):
├── 20 criterios evaluados
├── 3 evidencias por criterio = 60 archivos
├── Tamaño promedio: 2MB por archivo
├── Total original: 120MB
├── Thumbnails: 5MB
├── Comprimidos: 60MB
└── Total por diagnóstico: ~185MB

Para 1000 diagnósticos anuales:
└── Almacenamiento total: ~185GB/año
```

**Esta arquitectura cumple con estándares enterprise y es escalable para el crecimiento del sistema PMCZE14** 🏆