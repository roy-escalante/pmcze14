# 💰 Análisis de Costos - Almacenamiento de Evidencias PMCZE14

## 🚨 **Preocupación Válida: Los Costos Pueden Explotar**

### **📊 Supabase Storage - Pricing Real (2024)**

#### **Plan Gratuito:**
- ✅ **1GB Storage** incluido
- ✅ **2GB Transfer** mensual
- ✅ **Hasta 500MB** por archivo
- ❌ **Límite**: Solo para testing/desarrollo

#### **Plan Pro ($25/mes):**
- ✅ **100GB Storage** incluido
- ✅ **200GB Transfer** mensual
- ✅ **Después**: $0.021 por GB storage adicional
- ✅ **Transfer extra**: $0.09 por GB

## 💸 **Escenario Realista de Costos**

### **📈 Estimación Conservadora (Zona Escolar 14)**

```
Datos Base:
├── 6 escuelas en la zona
├── 4 diagnósticos por escuela/año
├── 24 diagnósticos totales/año
├── 15 criterios promedio por diagnóstico
├── 2 evidencias promedio por criterio
└── Total: 720 archivos/año

Tamaños Promedio:
├── Imagen: 2MB
├── Documento PDF: 1.5MB
├── Video corto: 15MB (¡PELIGRO!)
├── Audio: 5MB
└── Promedio ponderado: ~4MB/archivo

Cálculo Anual:
├── 720 archivos × 4MB = 2.88GB/año
├── Con thumbnails (10%): +288MB
├── Sin compresión: Total ~3.2GB/año
└── 💰 Costo: Plan gratuito suficiente por 3 años
```

### **😱 Escenario Pesimista (Sin Optimización)**

```
Si cada escuela sube videos largos:
├── 720 archivos × 25MB promedio = 18GB/año
├── 18GB - 1GB gratuito = 17GB extra
├── 17GB × $0.021/GB = $0.357/mes extra
├── + Transfer costs: ~$5/mes
└── 💰 Total: $25 + $5 + $0.36 = ~$30.36/mes
```

## 🛡️ **Estrategia de Optimización de Costos**

### **1. Compresión Inteligente**

```typescript
// Configuración de compresión por tipo
const COMPRESSION_CONFIG = {
  images: {
    maxWidth: 1920,
    maxHeight: 1080, 
    quality: 0.8,
    format: 'webp'  // 30% menos espacio que JPEG
  },
  videos: {
    maxSize: 5 * 1024 * 1024,  // 5MB máximo
    maxDuration: 300,  // 5 minutos máximo
    resolution: '720p',
    bitrate: '1Mbps'
  },
  documents: {
    maxSize: 2 * 1024 * 1024,  // 2MB máximo
    compression: true
  }
}
```

### **2. Límites Estrictos por Tipo de Usuario**

```typescript
const STORAGE_LIMITS = {
  DOCENTE: {
    maxFiles: 5,
    maxSizePerFile: 2 * 1024 * 1024,  // 2MB
    allowedTypes: ['image/*', 'application/pdf']
  },
  DIRECTOR: {
    maxFiles: 10,
    maxSizePerFile: 5 * 1024 * 1024,  // 5MB
    allowedTypes: ['image/*', 'application/pdf', 'video/*']
  },
  SUPERVISOR: {
    maxFiles: 20,
    maxSizePerFile: 10 * 1024 * 1024,  // 10MB
    allowedTypes: ['*']
  }
}
```

### **3. Política de Retención Automática**

```sql
-- Limpieza automática de evidencias antiguas
CREATE OR REPLACE FUNCTION cleanup_old_evidencias() 
RETURNS void AS $$
BEGIN
  -- Eliminar evidencias de diagnósticos de hace más de 5 años
  DELETE FROM evidencias_metadata 
  WHERE created_at < NOW() - INTERVAL '5 years';
  
  -- Comprimir evidencias de hace más de 2 años
  UPDATE evidencias_metadata 
  SET ruta_original = ruta_comprimido,
      ruta_comprimido = NULL
  WHERE created_at < NOW() - INTERVAL '2 years'
    AND ruta_comprimido IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar limpieza cada mes
SELECT cron.schedule('cleanup-evidencias', '0 0 1 * *', 'SELECT cleanup_old_evidencias();');
```

## 📉 **Arquitectura Económica Revisada**

### **🎯 Estructura Simplificada**

```
pmcze14-evidencias/ (Solo lo esencial)
├── diagnosticos/
│   ├── {diagnostico_id}/
│   │   ├── {criterio_id}_001.webp  (Imagen optimizada)
│   │   ├── {criterio_id}_002.pdf   (PDF comprimido)
│   │   └── {criterio_id}_003_video_thumb.jpg  (Solo thumbnail de video)
│   └── metadata.json (Un solo archivo de metadata)
└── temp/ (Auto-limpieza en 24hrs)
```

### **💡 Optimizaciones Clave**

#### **A) Un Solo Archivo por Evidencia**
- ❌ ~~Original + Thumbnail + Compressed~~
- ✅ **Solo versión optimizada**
- 💰 **Ahorro: 70% de espacio**

#### **B) Videos → Solo Screenshots**
- ❌ ~~Subir video completo (15-50MB)~~
- ✅ **Screenshot + enlace externo** (YouTube/Drive)
- 💰 **Ahorro: 95% en videos**

#### **C) Metadata en JSON, No en DB**
- ❌ ~~Tabla SQL con metadata~~
- ✅ **archivo manifest.json** por diagnóstico
- 💰 **Ahorro: Sin costo de queries extra**

## 🔧 **Implementación de Bajo Costo**

### **1. Componente Optimizado**

```typescript
const CHEAP_UPLOAD_CONFIG = {
  maxFileSize: 2 * 1024 * 1024,  // 2MB límite estricto
  maxFilesPerCriterio: 2,        // Solo 2 evidencias por criterio
  autoCompress: true,            // Compresión automática
  allowedTypes: [
    'image/jpeg', 'image/png',   // Solo imágenes comunes
    'application/pdf'            // Solo PDFs
  ],
  // NO videos, NO audio, NO documentos Office
}

const uploadFile = async (file: File, diagnosticoId: string, criterio: string) => {
  // 1. Validar tamaño ANTES de procesar
  if (file.size > CHEAP_UPLOAD_CONFIG.maxFileSize) {
    throw new Error('Archivo muy grande. Máximo 2MB')
  }

  // 2. Comprimir automáticamente
  const compressedFile = await compressFile(file)
  
  // 3. Ruta simple sin subdirectorios
  const fileName = `${diagnosticoId}_${criterio}_${Date.now()}.webp`
  
  // 4. Subir solo la versión comprimida
  return await supabase.storage
    .from('pmcze14-evidencias')
    .upload(fileName, compressedFile)
}
```

### **2. Alternative: Storage Externo Gratuito**

```typescript
// Para casos donde Supabase sea muy caro
const EXTERNAL_STORAGE_OPTIONS = {
  images: {
    provider: 'imgur',      // 15GB gratis
    apiKey: process.env.IMGUR_API_KEY,
    compression: true
  },
  documents: {
    provider: 'google_drive',  // 15GB gratis
    folderId: process.env.GDRIVE_FOLDER_ID
  },
  backup: {
    provider: 'github',     // Ilimitado para públicos
    repo: 'pmcze14/evidencias-backup'
  }
}
```

## 📊 **Proyección de Costos Optimizada**

### **✅ Con Optimizaciones (Realista)**

```
Almacenamiento Anual:
├── 720 archivos × 800KB promedio = 576MB/año
├── Metadata JSON: ~50MB/año  
├── Total: ~626MB/año
└── 💰 Costo: GRATIS por 5+ años

Transfer Mensual:
├── Descarga evidencias: ~200MB/mes
├── Subida: ~50MB/mes
├── Total: 250MB/mes
└── 💰 Costo: GRATIS (bajo límite de 2GB)

Total Real: $0/mes por los primeros 5 años 🎉
```

### **🚀 Escalabilidad Futura**

```
Año 5 (con 10 zonas escolares):
├── Almacenamiento: ~6GB total
├── Transfer: ~2.5GB/mes
├── Costo Supabase: $25/mes (Plan Pro)
└── Costo por zona: $2.5/mes ($30/año por zona)

¡Totalmente sostenible! 💪
```

## ✅ **Recomendación Final: Estrategia Híbrida**

### **🎯 Implementación en Fases**

#### **Fase 1 (Ahora): Minimalista**
- ✅ Solo imágenes + PDFs
- ✅ 2MB límite estricto  
- ✅ Compresión automática
- ✅ Supabase gratis
- 💰 **Costo: $0/mes**

#### **Fase 2 (Si crece): Optimizada**
- ✅ Videos como screenshots + links
- ✅ Audio como transcripciones
- ✅ Limpieza automática
- 💰 **Costo: <$10/mes**

#### **Fase 3 (Enterprise): Completa**
- ✅ CDN propio
- ✅ Compresión avanzada
- ✅ Multi-cloud backup
- 💰 **Costo: $25-50/mes**

## 🎯 **Conclusión: Costos Bajo Control**

**La arquitectura optimizada mantiene los costos en CERO durante los primeros años, escalando gradualmente solo cuando el valor agregado lo justifique.**

**¡Tu preocupación era totalmente válida y la hemos resuelto!** 🏆