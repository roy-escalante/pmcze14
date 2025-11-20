# Plan de Instrucciones para Copiloto IA - Sistema PMCZE14

## 📋 Contexto General

El sistema PMCZE14 necesita ser reestructurado completamente basándose en la reunión del 18 de noviembre de 2025 entre Rodrigo e Itzcoatl. Se detectaron errores fundamentales en la interpretación inicial de los requisitos.

---

## 🎯 Objetivos Principales de la Reestructuración

### 1. Cambio de Enfoque del Módulo Diagnóstico

**Problema Identificado:**
- La IA generó secciones incorrectas basándose en interpretación previa
- No se revisaron los formularios de Google Forms proporcionados por Itzcoatl
- El diagnóstico actual evalúa resultados en lugar de capturar datos de entrada

**Solución Requerida:**
- El diagnóstico debe basarse EXCLUSIVAMENTE en los formularios de Google Forms enviados
- Cada paso del diagnóstico debe corresponder a uno de los formularios
- Los formularios son la "única fuente de verdad" para el diagnóstico

---

## 🔄 Reestructuración del Flujo de Trabajo

### Flujo Actual (INCORRECTO)
```
Diagnóstico → Captura de Prácticas Docentes → Evaluación Manual
```

### Flujo Correcto (A IMPLEMENTAR)
```
1. Captura de Datos (Formularios Google) 
   ↓
2. Análisis Automático (IA)
   ↓
3. Problematización (Nueva sección)
   ↓
4. Planeación (con jerarquización)
   ↓
5. Evaluación (Prácticas docentes, clima aula, etc.)
```

---

## 📝 Tareas Específicas para el Copiloto

### TAREA 1: Revisar y Mapear Formularios de Google

**Objetivo:** Entender la estructura de los instrumentos de diagnóstico

**Acciones:**
1. Revisar el documento "Orientaciones para elaborar el programa analítico" (ya enviado)
2. Identificar las ligas de formularios de Google Forms
3. Crear un mapa de cada formulario:
   - Nombre del formulario
   - Tipo de instrumento (alumnos, padres, docentes)
   - Variables que mide
   - Escalas utilizadas (Likert, porcentajes, etc.)
   - Cómo se relaciona con las dimensiones del PMC

**Entregable:**
- Documento de mapeo: "Formulario X → Dimensión Y → Criterios Z"

---

### TAREA 2: Rediseñar el Módulo de Diagnóstico

**Objetivo:** Transformar el diagnóstico de evaluación a captura de datos

**Cambios Requeridos:**

#### 2.1 Eliminar Secciones Actuales Incorrectas
- ❌ Quitar "Prácticas Docentes" como paso de captura
- ❌ Quitar "Ambientes de Aprendizaje" como paso de captura  
- ❌ Quitar "Uso de Programa de Estudios" como paso de captura
- ❌ Quitar cualquier sección de "evaluación" del diagnóstico

#### 2.2 Crear Nuevos Pasos Basados en Formularios

**Estructura Nueva:**

```
PASO 1: Datos Generales de la Escuela
- Mantener tal cual está (CCT, nombre, director, región)

PASO 2: Instrumento - Ambiente Familiar
- Corresponde al formulario de padres de familia
- Capturar datos según variables del formulario original

PASO 3: Instrumento - Desarrollo Integral
- Corresponde al formulario de estudiantes  
- Incluir todas las variables del instrumento original

PASO 4: Instrumento - Ambiente de Aprendizaje
- Datos del instrumento de docentes
- Escala Likert según manual

PASO 5: Instrumento - [Otros formularios restantes]
- Revisar cuántos formularios adicionales hay
- Crear un paso por cada uno
```

**Consideraciones Técnicas:**
- Cada formulario puede ser embebido o replicado en la interfaz
- Usar los MISMOS tipos de campo que Google Forms (radio, checkbox, escala)
- Respetar las escalas EXACTAS del manual gubernamental

---

### TAREA 3: Ajustar Indicadores Académicos

**Cambios Específicos:**

#### 3.1 Promedio General de la Escuela
- ❌ Eliminar: Opciones cualitativas (Excelente, Bueno, Regular, Deficiente)
- ✅ Cambiar a: Campo numérico decimal (ejemplo: 9.7, 8.5, 6.3)
- ✅ Agregar: Promedio por grado (1°, 2°, 3°) en lugar de por grupo

#### 3.2 Eficiencia Terminal
- ❌ Eliminar: Categorías cualitativas
- ✅ Cambiar a: Porcentaje numérico (0-100%)

#### 3.3 Índice de Reprobación
- ❌ Eliminar: Categorías cualitativas  
- ✅ Cambiar a: Porcentaje numérico (0-100%)

#### 3.4 Índice de Desertores
- ❌ Eliminar: Categorías cualitativas
- ✅ Cambiar a: Porcentaje numérico (0-100%)

#### 3.5 Promedio de Asistencia
- ❌ Eliminar: Categorías cualitativas
- ✅ Cambiar a: Porcentaje numérico (0-100%)

#### 3.6 Control de Ausentismo
- ❌ Eliminar: Adjetivo "crónico"
- ✅ Renombrar a: "Control de Ausentismo"
- ❌ Eliminar: Categorías cualitativas
- ✅ Cambiar a: Campo de texto descriptivo libre
- Descripción: "Describe las medidas implementadas para controlar el ausentismo"

---

### TAREA 4: Agregar Ejercicios Integradores de Aprendizaje

**Objetivo:** Integrar nueva sección de diagnóstico académico

**Especificaciones:**

**Ubicación:** Dentro de "Aprovechamiento Académico"

**Campos a Crear:**
```
Nombre: Ejercicios Integradores de Aprendizaje (EIA)

Categorías de Evaluación:
1. No Evidencia
2. Requiere Apoyo  
3. En Proceso
4. Alcanzado

Áreas a Evaluar:
- Manejo de Información
- Discriminación de Información
- Cálculo Mental
- [Otras según documento de Itzcoatl]

Formato de Captura:
- Opción A: Subir documento PDF con resultados
- Opción B: Captura manual por área y categoría
- Mostrar ambas opciones al usuario
```

**Justificación:**
Los EIA son fundamentales para correlacionar con eficiencia terminal y validar coherencia de datos.

---

### TAREA 5: Implementar Módulo "Problematización"

**Objetivo:** Crear nueva sección entre Análisis y Planeación

**Flujo:**
```
Diagnóstico (Captura) 
  ↓
Análisis (IA procesa datos de formularios)
  ↓
PROBLEMATIZACIÓN ← [NUEVA SECCIÓN]
  ↓
Planeación (Jerarquización y acciones)
  ↓
Seguimiento
```

**Funcionalidades de Problematización:**

1. **Input de IA:**
   - Recibe análisis de los formularios aplicados
   - Identifica problemáticas basándose en manuales SEP

2. **Presentación al Usuario:**
   - Lista de problemáticas detectadas (puede ser extensa: 350+ ítems)
   - Cada problemática con:
     - Descripción
     - Dimensión afectada
     - Nivel de severidad (sugerido por IA)
     - Contexto específico

3. **Jerarquización Interactiva:**
   - Sistema de "Drag & Drop" para reordenar prioridades
   - Usuario puede:
     - Subir problemáticas (aumentar prioridad)
     - Bajar problemáticas (disminuir prioridad)
     - Editar descripción de problemática
     - Combinar problemáticas similares
     - Eliminar problemáticas no relevantes

4. **Ejemplo de Caso de Uso:**
```
Problemática 1: Embarazo adolescente en EST 4
Problemática 2: Estudiante amamantando en EST 81

Aunque parecen similares, tienen contextos distintos:
- EST 4: Prevención necesaria
- EST 81: Apoyo a estudiante madre (problema resuelto)

El supervisor puede:
- Poner EST 4 como prioridad 1
- Bajar EST 81 a prioridad baja o marcar como "atendido"
```

**Diseño de Interfaz (Guía):**
```
┌─────────────────────────────────────────┐
│  PROBLEMATIZACIÓN - Zona Escolar 14     │
├─────────────────────────────────────────┤
│                                         │
│  IA identificó 47 problemáticas         │
│  Ordena por prioridad (arrastra ↕️)     │
│                                         │
│  [#1] █████████ Embarazo adolescente    │
│       EST 4 - 3 casos detectados        │
│       [✏️ Editar] [🗑️ Eliminar]          │
│                                         │
│  [#2] █████████ Bajo rendimiento mate   │
│       EST 77, 81 - Promedio <6.0        │
│       [✏️ Editar] [🗑️ Eliminar]          │
│                                         │
│  ...                                    │
│                                         │
│  [#47] ████░░░░ Infraestructura         │
│        EST 41 - Sanitarios              │
│        [✏️ Editar] [🗑️ Eliminar]          │
│                                         │
│  [Guardar Jerarquización] [Continuar]  │
└─────────────────────────────────────────┘
```

**Tecnología Sugerida:**
- Librería: `react-beautiful-dnd` o `@dnd-kit/core`
- Persistencia: Guardar orden en Supabase
- Validación: Mínimo 1 problemática debe tener prioridad alta

---

### TAREA 6: Rediseñar Módulo de Planeación

**Objetivo:** Generar Plan de Mejora basado en problematización

**Inputs:**
1. Lista jerarquizada de problemáticas (de Problematización)
2. Manuales y lineamientos SEP (entrenamiento IA)
3. Contexto de cada escuela

**Proceso de IA:**
```
Para cada problemática (en orden de prioridad):
  1. Generar objetivo SMART
  2. Definir 1-3 metas medibles
  3. Proponer 3 acciones por meta
  4. Sugerir responsables
  5. Estimar tiempos y recursos
```

**Interfaz de Validación Humana:**
```
┌─────────────────────────────────────────┐
│  PLANEACIÓN - Problemática #1           │
├─────────────────────────────────────────┤
│                                         │
│  🎯 Objetivo (generado por IA):         │
│  ┌─────────────────────────────────┐   │
│  │ Reducir en 50% los casos de    │   │
│  │ embarazo adolescente en EST 4   │   │
│  │ durante el ciclo 2025-2026      │   │
│  └─────────────────────────────────┘   │
│  [✏️ Editar Objetivo]                   │
│                                         │
│  📊 Metas (generadas por IA):           │
│  1. ☑️ Implementar programa de educación│
│     sexual en 100% de los grupos       │
│     [✏️] [🗑️]                            │
│                                         │
│  2. ☑️ Realizar 3 talleres con padres  │
│     de familia                         │
│     [✏️] [🗑️]                            │
│                                         │
│  [+ Agregar Meta]                      │
│                                         │
│  ⚡ Acciones para Meta 1:               │
│  a) Coordinar con Centro de Salud      │
│     Responsable: [Selector]            │
│     Fecha: [Calendario]                │
│  b) Capacitar a docentes               │
│  c) Elaborar materiales didácticos     │
│                                         │
│  [Guardar] [Siguiente Problemática]    │
└─────────────────────────────────────────┘
```

**Validaciones:**
- Cada problemática prioritaria debe tener al menos 1 objetivo
- Cada objetivo debe tener al menos 1 meta
- Cada meta debe tener al menos 1 acción
- Toda acción debe tener responsable y fecha

---

### TAREA 7: Rediseñar Módulo de Evaluación

**Cambio Conceptual Fundamental:**

#### ANTES (Incorrecto):
- Evaluación es parte del diagnóstico inicial
- Se captura al inicio del ciclo

#### DESPUÉS (Correcto):
- Evaluación es la ÚLTIMA etapa
- Evalúa si se cumplieron los objetivos/metas/acciones planificados
- Se realiza al FINAL del ciclo o de forma periódica

**Nueva Estructura:**

```
MÓDULO EVALUACIÓN
├─ Evaluación de Objetivos
│  └─ ¿Se cumplió el objetivo? (Sí/No/Parcial)
│     └─ Evidencias
│     └─ Análisis cualitativo
│
├─ Evaluación de Prácticas Docentes
│  ├─ Calidad de planeación didáctica
│  ├─ Uso de programas de estudio
│  ├─ Estrategias de evaluación
│  └─ Gestión pedagógica
│
├─ Evaluación de Clima de Aula
│  └─ (Datos de escala Likert del instrumento)
│
└─ Evaluación de Impacto
   ├─ Cambios en indicadores académicos
   ├─ Percepción de la comunidad
   └─ Sostenibilidad de mejoras
```

**Rol de la IA en Evaluación:**
```
Input IA:
- Objetivos planteados
- Metas definidas  
- Acciones programadas
- Evidencias capturadas
- Nuevos datos de formularios

Output IA:
- Comparación antes/después
- Nivel de cumplimiento
- Análisis de brechas
- Sugerencias de ajuste
- Recomendaciones para siguiente ciclo
```

---

### TAREA 8: Configurar Integración de IA

**Objetivo:** Preparar el sistema para procesamiento automatizado

**Fase 1: Entrenamiento de IA (Documentación)**

Documentos a integrar como "fuente de verdad":
1. ✅ Orientaciones para elaborar programa analítico (ya enviado)
2. ⏳ Manuales metodológicos (pendiente de Itzcoatl)
3. ⏳ Ruta metodológica completa (pendiente)
4. ⏳ Lineamientos estatales (pendiente)

**Proceso de Entrenamiento:**
```
1. IA lee y procesa documentos oficiales
2. Extrae:
   - Variables válidas por dimensión
   - Escalas de medición correctas
   - Correlaciones entre indicadores
   - Criterios de priorización
   - Formatos de objetivos/metas/acciones
3. Almacena en base de conocimiento
4. Valida contra ejemplos reales
```

**Fase 2: Funciones de IA a Implementar**

#### Función 1: Análisis de Formularios
```
Input: Datos de todos los formularios aplicados
Proceso:
- Agrupa por dimensión
- Calcula estadísticos (media, moda, desviación)
- Identifica outliers
- Genera correlaciones

Output: 
- Dashboard de análisis socioeducativo
- Indicadores por dimensión
- Alertas de áreas críticas
```

#### Función 2: Detección de Problemáticas
```
Input: Análisis de formularios + Contexto escuela
Proceso:
- Compara con estándares del manual
- Identifica brechas
- Clasifica por severidad
- Agrupa problemáticas relacionadas

Output:
- Lista priorizada de problemáticas
- Justificación de cada una
- Sugerencia de prioridad inicial
```

#### Función 3: Generación de Plan de Mejora
```
Input: Problemáticas jerarquizadas + Manuales SEP
Proceso:
- Genera objetivos SMART por problemática
- Propone metas medibles
- Sugiere acciones concretas
- Estima recursos y tiempos
- Asigna responsables sugeridos

Output:
- Programa de Mejora Continua borrador
- Cronograma tentativo
- Matriz de responsabilidades
```

#### Función 4: Evaluación de Cumplimiento
```
Input: Plan original + Evidencias + Nuevos datos
Proceso:
- Compara situación inicial vs final
- Mide nivel de cumplimiento
- Identifica factores de éxito/fracaso
- Valida con evidencias

Output:
- Reporte de evaluación
- Nivel de logro por objetivo
- Recomendaciones de ajuste
```

**Consideraciones Técnicas:**
- API a usar: Claude API (Anthropic)
- Modelo recomendado: `claude-sonnet-4-20250514`
- Manejo de contexto: Documentos en embeddings
- Caching: Respuestas comunes cacheadas
- Fallback: Si IA falla, permitir captura manual

---

### TAREA 9: Implementar Sistema de Formularios

**Objetivo:** Replicar o embeber los Google Forms en la aplicación

**Opciones de Implementación:**

#### Opción A: Embedded Google Forms
```
Pros:
✅ No requiere reprogramar
✅ Datos van directo a Google Sheets
✅ Mantiene lógica de formulario original

Contras:
❌ Dependencia de Google
❌ UX inconsistente con app
❌ Sincronización manual con Supabase
```

#### Opción B: Replicar Formularios en App
```
Pros:
✅ Control total de UX
✅ Integración directa con Supabase  
✅ Offline-first posible
✅ Validaciones personalizadas

Contras:
❌ Más desarrollo inicial
❌ Mantenimiento de dos versiones
```

**Recomendación:** Opción B (replicar en app)

**Implementación Sugerida:**

1. **Por cada formulario de Google:**
   ```
   - Crear schema Zod que replique exactamente:
     * Nombres de campos
     * Tipos de datos
     * Validaciones
     * Escalas (Likert, etc.)
   
   - Diseñar interfaz que respete:
     * Orden de preguntas
     * Agrupación por secciones
     * Instrucciones originales
     * Formato de respuestas
   ```

2. **Mapeo de Escalas:**
   ```
   Escala Likert (ejemplo del manual):
   1 = Totalmente en desacuerdo
   2 = En desacuerdo  
   3 = Neutral
   4 = De acuerdo
   5 = Totalmente de acuerdo
   
   En código:
   const escalaLikert = [
     { value: 1, label: "Totalmente en desacuerdo" },
     { value: 2, label: "En desacuerdo" },
     { value: 3, label: "Neutral" },
     { value: 4, label: "De acuerdo" },
     { value: 5, label: "Totalmente de acuerdo" }
   ]
   ```

3. **Sincronización de Datos:**
   ```
   Flujo:
   Usuario completa formulario en app
     ↓
   Guarda en Supabase (tabla: respuestas_formularios)
     ↓
   Opcional: Exporta a Google Sheets para backup
     ↓
   IA procesa datos para análisis
   ```

---

### TAREA 10: Actualizar Esquema de Base de Datos

**Cambios en Supabase:**

#### Nuevas Tablas a Crear:

```sql
-- Tabla: respuestas_formularios
CREATE TABLE respuestas_formularios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID REFERENCES diagnosticos(id),
  tipo_instrumento TEXT, -- 'padres', 'estudiantes', 'docentes'
  datos JSONB, -- Almacena respuestas flexiblemente
  fecha_aplicacion TIMESTAMP,
  respondentes INT, -- Cantidad de personas que respondieron
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: problematizacion
CREATE TABLE problematizacion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID REFERENCES diagnosticos(id),
  problematica TEXT,
  dimension TEXT,
  severidad INT, -- 1-5, sugerido por IA
  prioridad_usuario INT, -- Orden asignado por usuario
  contexto TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: plan_mejora
CREATE TABLE plan_mejora (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problematizacion_id UUID REFERENCES problematizacion(id),
  objetivo TEXT,
  metas JSONB, -- Array de metas
  acciones JSONB, -- Array de acciones por meta
  responsables JSONB,
  cronograma JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: evaluacion
CREATE TABLE evaluacion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_mejora_id UUID REFERENCES plan_mejora(id),
  fecha_evaluacion TIMESTAMP,
  nivel_cumplimiento TEXT, -- 'logrado', 'parcial', 'no_logrado'
  evidencias JSONB,
  analisis_cualitativo TEXT,
  recomendaciones TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla: ejercicios_integradores
CREATE TABLE ejercicios_integradores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID REFERENCES diagnosticos(id),
  grado INT, -- 1, 2, 3
  area TEXT, -- 'manejo_informacion', 'calculo_mental', etc.
  no_evidencia INT,
  requiere_apoyo INT,
  en_proceso INT,
  alcanzado INT,
  documento_url TEXT, -- PDF con resultados completos
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Modificar Tabla Existente: diagnosticos

```sql
-- Agregar campos para indicadores numéricos
ALTER TABLE diagnosticos
  ADD COLUMN promedio_general_1ro DECIMAL(3,2),
  ADD COLUMN promedio_general_2do DECIMAL(3,2),
  ADD COLUMN promedio_general_3ro DECIMAL(3,2),
  ADD COLUMN eficiencia_terminal DECIMAL(5,2), -- Porcentaje
  ADD COLUMN indice_reprobacion DECIMAL(5,2),
  ADD COLUMN indice_desertores DECIMAL(5,2),
  ADD COLUMN promedio_asistencia DECIMAL(5,2),
  ADD COLUMN medidas_ausentismo TEXT; -- Campo descriptivo
```

---

### TAREA 11: Crear Flujo de Auto-Guardado Robusto

**Problema Actual:**
- Auto-guardado cada 30 segundos puede fallar
- Usuario puede perder datos si cierra navegador

**Solución Mejorada:**

```typescript
// Implementar estrategia triple:

1. LocalStorage (Inmediato)
   - Guardar en navegador cada cambio
   - Recuperar al recargar página
   - No requiere internet

2. IndexedDB (Respaldo Local)
   - Para datos más pesados (formularios completos)
   - Persistente entre sesiones
   - Soporta búsquedas

3. Supabase (Cloud)
   - Sincronización cada 30 segundos
   - Al cambiar de paso (forzado)
   - Al completar sección
   - Retry automático si falla
```

**Indicadores de Estado:**
```
┌─────────────────────────────────┐
│  Guardando... ⏳                │  → En proceso
│  Guardado ✓ (hace 10 seg)      │  → Exitoso
│  Error al guardar ⚠️ [Reintentar]│  → Fallido
│  Sin conexión 📡 (guardado local)│  → Offline
└─────────────────────────────────┘
```

---

### TAREA 12: Implementar Sistema de Validación de Claves CST

**Problema Identificado:**
- Claves CST actuales son de telesecundarias
- Necesitan cambiarse por claves de EST

**Especificación:**

```
Formato de Clave CST (Secundarias Técnicas):
24EST####X

Donde:
- 24 = Clave del estado (San Luis Potosí)
- EST = Tipo de escuela (Secundaria Técnica)
- #### = Número de escuela (4 dígitos)
- X = Dígito verificador

Ejemplos reales a usar:
- EST 4  → 24EST0004D
- EST 7  → 24EST0007A
- EST 41 → 24EST0041C
- EST 77 → 24EST0077B
- EST 81 → 24EST0081E  
- EST 82 → 24EST0082D
```

**Validación en Formulario:**
```typescript
// Schema Zod
const CSTSchema = z.string()
  .regex(/^24EST\d{4}[A-Z]$/, "Formato inválido de CCT")
  .refine((val) => {
    // Validar que sea una de las 6 escuelas
    const escuelasValidas = [
      '24EST0004D', '24EST0007A', '24EST0041C',
      '24EST0077B', '24EST0081E', '24EST0082D'
    ];
    return escuelasValidas.includes(val);
  }, "La escuela no pertenece a la Zona 14");
```

---

## 📊 Priorización de Tareas

### 🔥 Prioridad Crítica (Hacer PRIMERO)
1. ✅ **TAREA 1:** Revisar formularios de Google Forms
2. ✅ **TAREA 2:** Rediseñar módulo de diagnóstico
3. ✅ **TAREA 3:** Ajustar indicadores académicos
4. ✅ **TAREA 12:** Corregir claves CST

### ⚡ Prioridad Alta (Siguiente Semana)
5. ✅ **TAREA 4:** Agregar Ejercicios Integradores
6. ✅ **TAREA 10:** Actualizar esquema de base de datos
7. ✅ **TAREA 9:** Implementar sistema de formularios
8. ✅ **TAREA 11:** Mejorar auto-guardado

### 🎯 Prioridad Media (2-3 Semanas)
9. ✅ **TAREA 5:** Implementar Problematización
10. ✅ **TAREA 6:** Rediseñar Planeación
11. ✅ **TAREA 7:** Rediseñar Evaluación

### 📚 Prioridad Baja (Fase 2)
12. ✅ **TAREA 8:** Configurar integración de IA completa

---

## 🎨 Consideraciones de UX/UI

### Principios de Diseño Específicos:

1. **Claridad Absoluta:**
   - Etiquetas en español claro
   - Instrucciones visibles y concisas
   - Tooltips explicativos en conceptos técnicos

2. **Feedback Constante:**
   - Indicador de progreso por sección
   - Confirmación visual de cada guardado
   - Mensajes de error específicos (no genéricos)

3. **Accesibilidad:**
   - Contraste adecuado (WCAG AA mínimo)
   - Navegable completamente con teclado
   - Textos alternativos en imágenes
   - Tamaños de fuente legibles (mínimo 16px)

4. **Responsive:**
   - Mobile-first approach
   - Formularios adaptables a pantalla pequeña
   - Menús colapsables en móvil
   - Botones grandes (mínimo 44x44px)

5. **Offline-First:**
   - Funcionar sin internet cuando sea posible
   - Sincronizar automáticamente al reconectar
   - Indicador claro de estado de conexión

---

## 🔒 Consideraciones de Seguridad

### Datos Sensibles a Proteger:

1. **Información de Menores:**
   - Nombres de estudiantes
   - Rendimiento académico individual
   - Situaciones personales/familiares
   - Datos de salud (embarazos, etc.)

2. **Medidas Obligatorias:**
   - ✅ Encriptación en tránsito (HTTPS)
   - ✅ Encriptación en reposo (Supabase RLS)
   - ✅ Autenticación robusta
   - ✅ Control de acceso por roles
   - ⏳ Logs de auditoría (quién accedió a qué)
   - ⏳ Anonimización en reportes agregados

3. **Permisos por Rol:**
   ```
   Supervisor:
   - Ver todas las escuelas
   - Editar cualquier diagnóstico
   - Generar reportes de zona
   
   Inspector (Regional):
   - Ver escuelas de su región
   - Editar diagnósticos de su región
   - Generar reportes regionales
   
   Director:
   - Ver solo su escuela
   - Editar diagnóstico de su escuela
   - Generar reportes de su escuela
   
   Docente:
   - Ver información general de su escuela
   - Responder formularios
   - No editar diagnósticos
   ```

---

## 📅 Timeline Estimado

```
SEMANA 1 (Actual):
✅ Revisión de formularios
✅ Mapeo de estructura
✅ Corrección de claves CST
✅ Ajuste de indicadores académicos

SEMANA 2:
□ Rediseño completo módulo diagnóstico
□ Implementación de formularios en app
□ Actualización de base de datos

SEMANA 3:
□ Implementación de EIA
□ Mejora de auto-guardado
□ Testing de formularios

SEMANA 4:
□ Módulo Problematización
□ Sistema drag & drop

SEMANA 5-6:
□ Rediseño Planeación
□ Rediseño Evaluación
□ Integración IA (básica)

SEMANA 7-8:
□ Testing integral
□ Corrección de bugs
□ Optimización
□ Preparación para despliegue

SEMANA 9-10:
□ Piloto con usuarios reales
□ Ajustes basados en feedback
□ Documentación final
□ Capacitación a usuarios
```

---

## 📝 Entregables por Fase

### Fase 1: Fundamentos (Semana 1-2)
- ✅ Documento de mapeo de formularios
- ✅ Estructura nueva de diagnóstico
- ✅ Esquemas de validación actualizados
- ✅ Base de datos migrada

### Fase 2: Captura (Semana 3-4)
- □ Formularios funcionales en app
- □ Sistema de guardado robusto
- □ Validaciones completas
- □ Manual de usuario básico

### Fase 3: Análisis (Semana 5-6)
- □ Módulo Problematización
- □ Módulo Planeación rediseñado
- □ Módulo Evaluación rediseñado
- □ IA integrada (versión básica)

### Fase 4: Refinamiento (Semana 7-8)
- □ Sistema completo testeado
- □ Bugs críticos resueltos
- □ Performance optimizado
- □ Interfaz pulida

### Fase 5: Lanzamiento (Semana 9-10)
- □ Piloto con 2 escuelas
- □ Feedback incorporado
- □ Documentación completa
- □ Usuarios capacitados

---

## 🤝 Coordinación con Itzcoatl

### Documentos Pendientes de Recibir:
1. ⏳ **Manuales completos** (para entrenamiento IA)
2. ⏳ **Ruta metodológica completa** (documento detallado)
3. ⏳ **Ejemplo de entregable perfecto** ("artesanal" hecho a lápiz)
4. ⏳ **Último documento con ligas** de formularios actualizadas

### Reuniones de Seguimiento:
- **Jueves/Viernes:** Conferencias de 10 minutos para revisar avances
- **Lunes 24:** Reunión presencial en San Luis
- **Objetivo Primero de Diciembre:** Presentación a autoridades (opcional)

---

## ✅ Criterios de Éxito

El sistema estará listo para producción cuando:

### Funcionales:
- ✅ Todos los formularios capturan datos correctamente
- ✅ El flujo completo (Diagnóstico → Problematización → Planeación → Evaluación) funciona
- ✅ Los datos se guardan sin pérdidas
- ✅ Los reportes se generan automáticamente

### Técnicos:
- ✅ Cero errores críticos en consola
- ✅ Performance < 3 segundos en carga
- ✅ Funciona en móvil, tablet y desktop
- ✅ Accesibilidad WCAG AA cumplida

### Educativos:
- ✅ Alineación total con normativa SEP/NEM
- ✅ Terminología correcta (según manuales)
- ✅ Útil para usuarios reales (feedback positivo)
- ✅ Reduce tiempo de trabajo vs. método manual

### Seguridad:
- ✅ Datos sensibles protegidos
- ✅ Roles y permisos funcionando
- ✅ Backups automáticos activos
- ✅ Cumple LFPDPPP

---

## 🎓 Notas para el Copiloto IA

### Cómo Interpretar Este Plan:

1. **No es código, es estrategia:**
   - Primero entiende QUÉ hacer
   - Luego decide CÓMO implementarlo
   - Siempre explica POR QUÉ tomas decisiones

2. **Prioriza educación:**
   - Explicar conceptos mientras programas
   - Usar analogías del contexto educativo
   - Validar que todo tenga sentido pedagógico

3. **Sé flexible pero fiel al plan:**
   - Si encuentras mejor solución técnica, proponla
   - Pero SIEMPRE mantén la visión funcional
   - No cambies requisitos sin consultar

4. **Documenta todo:**
   - Cada decisión técnica importante
   - Cada cambio de rumbo
   - Cada bug encontrado y solucionado

5. **Pide clarificación:**
   - Si algo no está claro en este plan
   - Si encuentras contradicciones
   - Si necesitas más contexto

---

## 📞 Contacto y Dudas

**Para dudas técnicas:**
- Revisar BLUEPRINT.MD
- Consultar documentación oficial
- Preguntar a Rodrigo con contexto claro

**Para dudas funcionales/educativas:**
- Coordinarse con Itzcoatl
- Revisar manuales SEP
- Validar con ejemplos reales

---

## 🎯 Mensaje Final para el Copiloto

Este proyecto NO es solo una aplicación web.

Es una herramienta que impactará la educación de cientos de estudiantes en la Huasteca Potosina.

Tu trabajo tiene consecuencias reales en vidas reales.

**Programa con excelencia. Diseña con empatía. Ejecuta con precisión.**

¡Éxito en el desarrollo! 🚀

---

**Documento vivo - Versión 1.0**  
**Fecha:** 20 Noviembre 2025  
**Autor:** Rodrigo con asistencia de IA  
**Próxima revisión:** Post-reunión con Itzcoatl (Lunes 24)