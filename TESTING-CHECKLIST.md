# 🧪 CHECKLIST DE TESTING - MEGA-SPRINT 1

## Sistema v2: Múltiples Respuestas por Instrumento

Este documento contiene los pasos para verificar que la implementación del sistema v2 funciona correctamente.

---

## 📋 PRE-REQUISITOS

### 1. Verificar Configuración de Entorno

```bash
# Asegúrate de que tu .env tiene las credenciales correctas:
cat .env
```

Deberías ver:
```
VITE_SUPABASE_URL=https://dtpnziyigsaqojsdntzn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Verificar Conexión a Supabase

```bash
npm install
npx tsx scripts/check-database.ts
```

**Resultado esperado:** Todas las tablas deberían ser accesibles, incluyendo `respuestas_instrumentos`.

---

## 🔄 PASO 1: APLICAR MIGRACIÓN

Si la tabla `respuestas_instrumentos` NO existe, aplica la migración:

### Opción A: Supabase Dashboard (Recomendado)

1. Ve a: https://supabase.com/dashboard/project/dtpnziyigsaqojsdntzn/editor
2. Abre el archivo: `database/migrations/003_respuestas_multiples.sql`
3. Copia TODO el contenido
4. Pégalo en el Editor SQL de Supabase
5. Haz clic en "Run" o presiona Ctrl+Enter
6. Verifica que no haya errores

### Opción B: Supabase CLI

```bash
supabase db push
```

### ✅ Verificación

```bash
npx tsx scripts/check-database.ts
```

Deberías ver:
```
✅ Tabla "respuestas_instrumentos" existe y es accesible
✅ TODAS LAS TABLAS ESTÁN LISTAS
```

---

## 🌱 PASO 2: EJECUTAR SEEDER

### 2.1 Limpiar Base de Datos (Opcional)

Si ya tienes datos de prueba anteriores:

```bash
npm run seed:reset
```

O manualmente en Supabase SQL Editor:

```sql
-- Eliminar todos los datos de prueba
DELETE FROM respuestas_instrumentos;
DELETE FROM diagnosticos;
DELETE FROM usuarios;
DELETE FROM escuelas;
```

### 2.2 Ejecutar Seeder

```bash
npm run seed
```

### ✅ Resultados Esperados

El seeder debería crear:

- **6 escuelas** (EST 41, EST 77, EST 81, EST 4, EST 7, EST 82)
- **12+ usuarios** (1 supervisor, 2 inspectores, 6 directores, 3+ docentes)
- **8-10 diagnósticos** (1-2 por escuela)
- **400-600 respuestas de instrumentos** distribuidas en:
  - 10-15 respuestas AMBIENTE_FAMILIAR por diagnóstico
  - 20-30 respuestas DESARROLLO_INTEGRAL por diagnóstico
  - 10-15 respuestas PRACTICAS_DOCENTES por diagnóstico
  - 8-12 respuestas FORMACION_DOCENTE por diagnóstico
  - 2-3 respuestas AMBIENTE_APRENDIZAJE por diagnóstico

### Salida esperada:

```
🌱 Iniciando seeding de base de datos PMCZE14...

📚 Insertando escuelas...
✅ 6 escuelas insertadas

👥 Creando usuarios...
   ✓ itzcoatl.merino@edu.slp.gob.mx (SUPERVISOR)
   ✓ inspector.norte@edu.slp.gob.mx (INSPECTOR)
   ...
✅ 12 usuarios creados

📊 Generando diagnósticos...
✅ 9 diagnósticos generados

📝 Generando respuestas de instrumentos (v2 - múltiples respondentes)...
   Generando 12 respuestas AMBIENTE_FAMILIAR para Escuela Secundaria Técnica No. 41...
   Generando 25 respuestas DESARROLLO_INTEGRAL para Escuela Secundaria Técnica No. 41...
   ...
📥 Insertando 450 respuestas en base de datos...
   ✓ Lote 1: 100 respuestas insertadas
   ...
✅ 450 respuestas de instrumentos generadas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SEEDING COMPLETADO EXITOSAMENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 Escuelas:              6
👥 Usuarios:              12
📊 Diagnósticos:          9
📝 Respuestas (v2):       450
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔍 PASO 3: VERIFICAR DATOS EN SUPABASE

### 3.1 Verificar Tabla respuestas_instrumentos

Ve a: https://supabase.com/dashboard/project/dtpnziyigsaqojsdntzn/editor

Ejecuta estas queries:

```sql
-- 1. Contar respuestas por tipo de instrumento
SELECT
  formulario_tipo,
  COUNT(*) as total_respuestas
FROM respuestas_instrumentos
GROUP BY formulario_tipo
ORDER BY formulario_tipo;
```

**Resultado esperado:**
```
AMBIENTE_APRENDIZAJE    | 18-27
AMBIENTE_FAMILIAR       | 90-135
DESARROLLO_INTEGRAL     | 180-270
FORMACION_DOCENTE       | 72-108
PRACTICAS_DOCENTES      | 90-135
```

```sql
-- 2. Ver distribución por rol de respondentes
SELECT
  formulario_tipo,
  respondente_rol,
  COUNT(*) as total
FROM respuestas_instrumentos
GROUP BY formulario_tipo, respondente_rol
ORDER BY formulario_tipo, respondente_rol;
```

**Resultado esperado:**
- AMBIENTE_FAMILIAR: Padre, Madre, Tutor
- DESARROLLO_INTEGRAL: Alumno, Alumna
- PRACTICAS_DOCENTES: Docente
- FORMACION_DOCENTE: Docente
- AMBIENTE_APRENDIZAJE: Director

```sql
-- 3. Ver respuestas de un diagnóstico específico
SELECT
  formulario_tipo,
  respondente_nombre,
  respondente_rol,
  respondente_grado,
  porcentaje_completitud,
  created_at
FROM respuestas_instrumentos
WHERE diagnostico_id = (SELECT id FROM diagnosticos LIMIT 1)
ORDER BY formulario_tipo, respondente_nombre
LIMIT 20;
```

```sql
-- 4. Probar la vista de estadísticas
SELECT * FROM vista_estadisticas_respuestas
ORDER BY diagnostico_id, formulario_tipo;
```

**Resultado esperado:** Una fila por cada combinación de diagnóstico + tipo de formulario, mostrando:
- total_respuestas
- completitud_promedio
- roles_distintos
- grados_distintos

---

## 🧪 PASO 4: TESTING DE STORE ZUSTAND

### 4.1 Crear Componente de Prueba

Crea un archivo temporal para testing: `src/test/TestRespuestasStore.tsx`

```tsx
import { useEffect } from 'react'
import { useRespuestasInstrumentosStore } from '../stores/respuestasInstrumentosStore'

export function TestRespuestasStore() {
  const {
    respuestas,
    cargando,
    error,
    cargarRespuestas,
    obtenerRespuestasPorTipo,
    obtenerEstadisticas,
    contarRespuestas
  } = useRespuestasInstrumentosStore()

  useEffect(() => {
    // Reemplaza este ID con un diagnostico_id real de tu base de datos
    const testDiagnosticoId = 'TU_DIAGNOSTICO_ID_AQUI'
    cargarRespuestas(testDiagnosticoId)
  }, [])

  if (cargando) return <div>Cargando respuestas...</div>
  if (error) return <div>Error: {error}</div>

  const ambienteFamiliar = obtenerRespuestasPorTipo(respuestas[0]?.diagnostico_id, 'AMBIENTE_FAMILIAR')
  const estadisticasAF = obtenerEstadisticas(respuestas[0]?.diagnostico_id, 'AMBIENTE_FAMILIAR')
  const totalAF = contarRespuestas(respuestas[0]?.diagnostico_id, 'AMBIENTE_FAMILIAR')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">TEST: Store de Respuestas Instrumentos</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Total de Respuestas: {respuestas.length}</h2>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">AMBIENTE_FAMILIAR ({totalAF} respuestas)</h2>
        <ul>
          {ambienteFamiliar.slice(0, 5).map(r => (
            <li key={r.id}>
              {r.respondente.nombre} - {r.respondente.rol} - Grado: {r.respondente.grado}
            </li>
          ))}
        </ul>
      </div>

      {estadisticasAF && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Estadísticas AMBIENTE_FAMILIAR</h2>
          <pre>{JSON.stringify(estadisticasAF, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

### 4.2 Agregar al Router (temporal)

En `src/App.tsx`, agrega:

```tsx
import { TestRespuestasStore } from './test/TestRespuestasStore'

// En tus rutas:
<Route path="/test" element={<TestRespuestasStore />} />
```

### 4.3 Ejecutar App y Probar

```bash
npm run dev
```

Abre: http://localhost:5173/test

### ✅ Verificación

Deberías ver:
- Total de respuestas cargadas (50-80 por diagnóstico)
- Lista de 5 respuestas AMBIENTE_FAMILIAR
- Estadísticas mostrando:
  - totalRespuestas: 10-15
  - completitudPromedio: 95-100%
  - rolesDistintos: 2-3 (Padre, Madre, Tutor)
  - porRol: { Padre: X, Madre: Y, Tutor: Z }

---

## 🔄 PASO 5: TESTING DE OPERACIONES CRUD

### 5.1 Test de CREATE (Agregar Respuesta)

En el componente de prueba, agrega:

```tsx
const handleAgregarRespuesta = async () => {
  const nuevaRespuesta = {
    diagnosticoId: 'TU_DIAGNOSTICO_ID',
    formularioTipo: 'AMBIENTE_FAMILIAR' as const,
    respondente: {
      nombre: 'María Prueba López',
      rol: 'Madre' as const,
      grado: '1° Grado'
    },
    respuestas: {
      af_demo_1: { preguntaId: 'af_demo_1', valor: 'Madre', tipo: 'select' },
      af_demo_2: { preguntaId: 'af_demo_2', valor: '1° Grado', tipo: 'select' }
    },
    porcentajeCompletitud: 10
  }

  const resultado = await agregarRespuesta(nuevaRespuesta)
  if (resultado) {
    alert('✅ Respuesta agregada exitosamente!')
  }
}
```

### 5.2 Test de UPDATE (Actualizar Respuesta)

```tsx
const handleActualizarRespuesta = async (id: string) => {
  const exito = await actualizarRespuesta(id, {
    porcentajeCompletitud: 100,
    respuestas: {
      // ... respuestas actualizadas
    }
  })

  if (exito) {
    alert('✅ Respuesta actualizada!')
  }
}
```

### 5.3 Test de DELETE (Eliminar Respuesta)

```tsx
const handleEliminarRespuesta = async (id: string) => {
  if (confirm('¿Seguro que quieres eliminar esta respuesta?')) {
    const exito = await eliminarRespuesta(id)
    if (exito) {
      alert('✅ Respuesta eliminada!')
    }
  }
}
```

---

## 📊 PASO 6: VERIFICAR INTEGRIDAD DE DATOS

### 6.1 Verificar Campos JSONB

```sql
-- Ver estructura de respuestas JSONB
SELECT
  formulario_tipo,
  respondente_nombre,
  jsonb_object_keys(respuestas) as pregunta_ids
FROM respuestas_instrumentos
LIMIT 10;
```

### 6.2 Verificar Completitud

```sql
-- Verificar porcentajes de completitud
SELECT
  formulario_tipo,
  AVG(porcentaje_completitud) as promedio_completitud,
  MIN(porcentaje_completitud) as min_completitud,
  MAX(porcentaje_completitud) as max_completitud
FROM respuestas_instrumentos
GROUP BY formulario_tipo;
```

**Resultado esperado:** Promedios entre 85-100%

### 6.3 Verificar Respondentes Únicos

```sql
-- Contar respondentes únicos por tipo
SELECT
  formulario_tipo,
  COUNT(DISTINCT respondente_nombre) as respondentes_unicos
FROM respuestas_instrumentos
GROUP BY formulario_tipo;
```

---

## ✅ CHECKLIST FINAL

Marca cada item cuando esté completado:

- [ ] Migración aplicada exitosamente
- [ ] Tabla respuestas_instrumentos existe y es accesible
- [ ] Seeder ejecutado sin errores
- [ ] 6 escuelas creadas
- [ ] 12+ usuarios creados
- [ ] 8-10 diagnósticos creados
- [ ] 400-600 respuestas de instrumentos creadas
- [ ] Distribución correcta por tipo de instrumento
- [ ] Distribución correcta por rol de respondente
- [ ] Vista de estadísticas funciona
- [ ] Store Zustand carga respuestas correctamente
- [ ] Operación CREATE funciona
- [ ] Operación UPDATE funciona
- [ ] Operación DELETE funciona
- [ ] Campos JSONB contienen datos válidos
- [ ] Porcentajes de completitud son realistas (85-100%)
- [ ] Respondentes tienen nombres únicos y realistas

---

## 🐛 PROBLEMAS COMUNES

### Error: "relation 'respuestas_instrumentos' does not exist"

**Solución:** Aplica la migración 003_respuestas_multiples.sql en Supabase Dashboard.

### Error: "duplicate key value violates unique constraint"

**Solución:** Limpia la base de datos antes de ejecutar el seeder nuevamente.

```sql
DELETE FROM respuestas_instrumentos;
DELETE FROM diagnosticos;
```

### Error: "TypeError: fetch failed"

**Solución:** Verifica que las credenciales en .env sean correctas y que tengas conexión a internet.

### Seeder se queda "colgado"

**Solución:** Verifica que:
1. La migración se haya aplicado correctamente
2. No haya restricciones de foreign keys bloqueando inserciones
3. El usuario tenga permisos adecuados

---

## 📝 NOTAS FINALES

Una vez que todos los checks estén ✅, puedes:

1. **Eliminar el componente de prueba** (`src/test/TestRespuestasStore.tsx`)
2. **Continuar con MEGA-SPRINT 2** (Componentes UI para el nuevo sistema)
3. **Hacer commit de los cambios**

```bash
git add .
git commit -m "feat: Implementar sistema v2 de múltiples respuestas por instrumento

- Nueva tabla respuestas_instrumentos con soporte para múltiples entries
- Store Zustand con operaciones CRUD completas
- Seeder actualizado para generar 400-600 respuestas realistas
- Generadores de respuestas para los 5 tipos de instrumentos
- Vista SQL para estadísticas agregadas

MEGA-SPRINT 1 COMPLETADO ✅"
```

---

**Última actualización:** 2025-11-21
**Sprint:** MEGA-SPRINT 1 - Base de datos + Arquitectura
