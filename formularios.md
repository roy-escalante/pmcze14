# 📋 MAPEO DE GOOGLE FORMS - INSTRUMENTOS DE DIAGNÓSTICO PMCZE14

**Proyecto:** Programa de Mejora Continua Zona Escolar 14  
**Documento:** Mapeo de Instrumentos de Evaluación  
**Fecha:** 20 Noviembre 2025  
**Basado en:** Reunión 18 Nov 2025 + Ruta Metodológica NEM

---

## 🎯 DECISIÓN ARQUITECTÓNICA CRÍTICA

> **"El diagnóstico debe generarse a partir de la información recopilada de esas ligas de formularios [...] esos son los formularios que tendrán que contestar los maestros."**  
> — Itzcoatl Merino González (Min. 00:46:58)

**IMPLICACIÓN TÉCNICA:**

El sistema NO debe crear formularios desde cero. Debe:
1. **INTEGRAR** los Google Forms existentes
2. **PROCESAR** las respuestas automáticamente
3. **ANALIZAR** los datos con la IA según los manuales
4. **GENERAR** reportes y propuestas de acción

---

## 📊 ESTRUCTURA GENERAL DE INSTRUMENTOS

Según la **Ruta Metodológica** del Análisis Socioeducativo, existen **5 ASPECTOS FUNDAMENTALES**:

```
┌─────────────────────────────────────────────────────────────┐
│         ANÁLISIS SOCIOEDUCATIVO - 5 ASPECTOS               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AMBIENTE FAMILIAR                                      │
│     └─ Instrumento: Form Padres de Familia                │
│        └─ Tipo: Escala Likert 1-5                         │
│                                                             │
│  2. AMBIENTE DE DESARROLLO INTEGRAL                        │
│     └─ Instrumento: Form Estudiantes                      │
│        └─ Tipo: Escala Likert 1-5                         │
│                                                             │
│  3. PRÁCTICAS DOCENTES                                     │
│     └─ Instrumento: Form Docentes - Prácticas             │
│        └─ Tipo: Escala Likert 1-5                         │
│                                                             │
│  4. FORMACIÓN DOCENTE                                      │
│     └─ Instrumento: Form Docentes - Formación             │
│        └─ Tipo: Escala Likert 1-5                         │
│                                                             │
│  5. CONTEXTO EXTERNO/ENTORNO COMUNITARIO                   │
│     └─ Instrumento: Form Comunidad/Contexto               │
│        └─ Tipo: Escala Likert 1-5                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**🔑 PRINCIPIO CLAVE:**

> "Toda esa información que generan estos instrumentos nos va a ayudar a todo lo demás."  
> — Itzcoatl (Min. 00:53:38)

---

## 📝 DETALLE POR INSTRUMENTO

### INSTRUMENTO 1️⃣: Formulario Padres de Familia

**🎯 Dimensión NEM:** Entorno - Familia  
**👥 Dirigido a:** Padres, madres y tutores  
**📊 Escala:** Likert 1-5 (Totalmente en desacuerdo → Totalmente de acuerdo)  
**⏱️ Tiempo estimado:** 10-15 minutos

#### Estructura del Formulario

```markdown
## SECCIÓN A: DATOS DEMOGRÁFICOS
┌──────────────────────────────────────┐
│ • Relación con el estudiante         │
│ • Grado que cursa su hijo(a)         │
│ • Escuela (EST)                       │
│ • Nivel educativo del padre/madre    │
│ • Ocupación principal                 │
│ • Número de hijos                     │
└──────────────────────────────────────┘

## SECCIÓN B: AMBIENTE DEL HOGAR
Escala Likert 1-5:
1 = Nunca  
2 = Casi nunca  
3 = A veces  
4 = Casi siempre  
5 = Siempre

□ Mi hijo(a) tiene un espacio adecuado para estudiar en casa
□ Contamos con materiales de apoyo (libros, internet, computadora)
□ Superviso las tareas y actividades escolares de mi hijo(a)
□ Participo en las reuniones y actividades de la escuela
□ Mantengo comunicación constante con los maestros
□ Conozco los logros y dificultades de mi hijo(a) en la escuela
□ Establezco horarios para estudio y descanso
□ Fomento la lectura en casa
□ Apoyo las actividades extraescolares de mi hijo(a)
□ En casa se promueve el respeto y la comunicación

## SECCIÓN C: APOYO AL APRENDIZAJE
□ ¿Con qué frecuencia ayuda con las tareas?
   • Diario  • 3-4 veces/semana  • 1-2 veces/semana  • Nunca

□ ¿Cuánto tiempo dedica su hijo(a) al estudio en casa?
   • Menos de 30 min  • 30-60 min  • 1-2 horas  • Más de 2 horas

□ Recursos disponibles en casa:
   ☐ Internet
   ☐ Computadora/Tablet
   ☐ Libros de consulta
   ☐ Espacio de estudio
   ☐ Escritorio propio

## SECCIÓN D: EXPECTATIVAS EDUCATIVAS
□ ¿Hasta qué nivel educativo le gustaría que llegara su hijo(a)?
   • Secundaria  • Preparatoria  • Universidad  • Posgrado

□ ¿Considera que la escuela está cumpliendo con sus expectativas?
   Likert 1-5

□ ¿Qué aspectos considera más importantes en la educación? (Seleccione 3)
   ☐ Calificaciones altas
   ☐ Desarrollo de valores
   ☐ Preparación para el trabajo
   ☐ Habilidades sociales
   ☐ Pensamiento crítico
   ☐ Creatividad
```

#### Variables Clave para Análisis de IA

```javascript
// Estructura de datos esperada
interface RespuestaPadresFamilia {
  // Demográficos
  relacionEstudiante: string;
  gradoEstudiante: "1°" | "2°" | "3°";
  escuelaCCT: string;
  nivelEducativoPadre: string;
  
  // Ambiente del hogar (Likert 1-5)
  espacioEstudio: number;
  materialesApoyo: number;
  supervisionTareas: number;
  participacionEscolar: number;
  comunicacionMaestros: number;
  conocimientoLogros: number;
  horariosEstudio: number;
  fomentaLectura: number;
  apoyoExtraescolar: number;
  ambienteFamiliar: number;
  
  // Apoyo al aprendizaje
  frecuenciaAyudaTareas: string;
  tiempoEstudioCasa: string;
  recursosDisponibles: string[];
  
  // Expectativas
  nivelEducativoEsperado: string;
  satisfaccionEscuela: number;
  aspectosImportantes: string[];
}

// Cálculo de indicadores
function calcularIndicadoresAmbienteFamiliar(respuestas: RespuestaPadresFamilia[]): Indicadores {
  return {
    promedioAmbienteHogar: calcularPromedio(respuestas.map(r => 
      [r.espacioEstudio, r.materialesApoyo, r.supervisionTareas, ...].flat()
    )),
    nivelApoyoEducativo: clasificar(promedioAmbienteHogar),
    participacionPadres: calcularPromedio(respuestas.map(r => 
      [r.participacionEscolar, r.comunicacionMaestros].flat()
    )),
    recursosDisponibles: analizarRecursos(respuestas),
    expectativasEducativas: analizarExpectativas(respuestas)
  }
}
```

---

### INSTRUMENTO 2️⃣: Formulario Estudiantes

**🎯 Dimensión NEM:** Desarrollo Integral  
**👥 Dirigido a:** Estudiantes de 1°, 2° y 3° grado  
**📊 Escala:** Likert 1-5 + Preguntas abiertas  
**⏱️ Tiempo estimado:** 15-20 minutos

#### Estructura del Formulario

```markdown
## SECCIÓN A: DATOS DEL ESTUDIANTE
┌──────────────────────────────────────┐
│ • Grado y grupo                       │
│ • Edad                                │
│ • Género                              │
│ • Escuela (EST)                       │
└──────────────────────────────────────┘

## SECCIÓN B: CLIMA DEL AULA
Escala Likert 1-5:

### B.1 Ambiente de Aprendizaje
□ Me siento seguro(a) en mi salón de clases
□ Mis compañeros me tratan con respeto
□ Puedo expresar mis ideas sin temor
□ El maestro(a) escucha mis opiniones
□ Me gusta trabajar en equipo con mis compañeros
□ El salón está limpio y ordenado
□ Hay materiales suficientes para trabajar
□ Me siento motivado(a) para aprender

### B.2 Relación con Docentes
□ Los maestros explican de forma clara
□ Me ayudan cuando tengo dudas
□ Son justos en sus evaluaciones
□ Me motivan a mejorar
□ Utilizan ejemplos interesantes para enseñar

### B.3 Convivencia Escolar
□ En mi escuela se respetan las diferencias
□ Me siento parte de un grupo
□ He presenciado situaciones de acoso (bullying)
□ Sé a quién acudir si tengo un problema
□ Me gusta asistir a la escuela

## SECCIÓN C: PRÁCTICAS DE ENSEÑANZA
□ ¿Con qué frecuencia tus maestros...?
   Likert 1-5 (Nunca → Siempre)

   • Usan tecnología en las clases
   • Te ponen a trabajar en equipo
   • Te dejan investigar por tu cuenta
   • Relacionan lo que aprendes con la vida real
   • Te dan retroalimentación sobre tus trabajos
   • Realizan actividades fuera del salón
   • Te permiten elegir cómo hacer tus proyectos

## SECCIÓN D: MOTIVACIÓN Y APRENDIZAJE
□ ¿Qué tanto te gusta cada materia?
   Likert 1-5 por materia:
   • Español
   • Matemáticas
   • Ciencias (Biología/Física/Química)
   • Historia
   • Geografía
   • Formación Cívica y Ética
   • Inglés
   • Educación Física
   • Artes
   • Tecnología

□ ¿Cuánto tiempo dedicas a estudiar en casa cada día?
   • Menos de 30 min  • 30-60 min  • 1-2 horas  • Más de 2 horas

□ ¿Qué te motiva a estudiar? (Selecciona 3)
   ☐ Aprender cosas nuevas
   ☐ Sacar buenas calificaciones
   ☐ Hacer felices a mis padres
   ☐ Tener un buen futuro
   ☐ Ser mejor persona
   ☐ Hacer amigos
   ☐ Participar en actividades

## SECCIÓN E: DESARROLLO INTEGRAL
□ ¿Participas en actividades extraescolares?
   ☐ Deportes  ☐ Arte/Música  ☐ Clubes  ☐ Ninguna

□ ¿Cómo calificarías tu salud en general?
   • Excelente  • Buena  • Regular  • Mala

□ ¿Con qué frecuencia...?
   Likert 1-5:
   • Desayunas antes de ir a la escuela
   • Duermes al menos 8 horas
   • Haces ejercicio
   • Lees por placer
   • Usas dispositivos electrónicos

## SECCIÓN F: PREGUNTAS ABIERTAS
□ ¿Qué es lo que más te gusta de tu escuela?
   [Texto libre]

□ ¿Qué cambiarías de tu escuela para mejorarla?
   [Texto libre]

□ ¿Cómo te imaginas tu futuro después de la secundaria?
   [Texto libre]
```

#### Variables Clave para Análisis

```javascript
interface RespuestaEstudiante {
  // Datos básicos
  grado: "1°" | "2°" | "3°";
  grupo: string;
  edad: number;
  genero: "Masculino" | "Femenino" | "Otro" | "Prefiero no decir";
  escuelaCCT: string;
  
  // Clima del aula (Likert 1-5)
  seguridadAula: number;
  respetoCompañeros: number;
  expresionIdeas: number;
  escuchaMaestro: number;
  trabajoEquipo: number;
  condicionesFisicas: number;
  materialesSuficientes: number;
  motivacionAprender: number;
  
  // Relación con docentes (Likert 1-5)
  claridadExplicaciones: number;
  apoyoDudas: number;
  justiciaEvaluaciones: number;
  motivacionMaestros: number;
  ejemplosInteresantes: number;
  
  // Convivencia (Likert 1-5)
  respetoDiferencias: number;
  sentidoPertenencia: number;
  presenciaAcoso: number; // IMPORTANTE: Detectar bullying
  conoceSoportes: number;
  gustaAsistir: number;
  
  // Prácticas de enseñanza (Likert 1-5)
  usoTecnologia: number;
  trabajoColaborativo: number;
  investigacionAutonoma: number;
  relacionVidaReal: number;
  retroalimentacion: number;
  actividadesExternas: number;
  autonomiaProyectos: number;
  
  // Motivación por materia (Likert 1-5)
  gustoMaterias: {
    español: number;
    matematicas: number;
    ciencias: number;
    historia: number;
    geografia: number;
    civicaEtica: number;
    ingles: number;
    educacionFisica: number;
    artes: number;
    tecnologia: number;
  };
  
  // Hábitos de estudio
  tiempoEstudioCasa: string;
  motivadores: string[];
  
  // Desarrollo integral
  actividadesExtraescolares: string[];
  saludGeneral: string;
  habitosSaludables: {
    desayunar: number;
    dormir8horas: number;
    ejercicio: number;
    lecturaPlacer: number;
    usoDispositivos: number;
  };
  
  // Respuestas abiertas (para análisis cualitativo IA)
  queGustaEscuela: string;
  queCambiariaEscuela: string;
  visionFuturo: string;
}

// Indicadores calculados
function calcularIndicadoresDesarrolloIntegral(respuestas: RespuestaEstudiante[]): Indicadores {
  return {
    // Clima escolar
    climaAulaPromedio: calcularPromedio(...),
    nivelConvivencia: clasificar(...),
    incidenciasAcoso: detectarProblemas(respuestas, 'presenciaAcoso'),
    
    // Calidad de enseñanza (perspectiva estudiante)
    satisfaccionPracticasDocentes: calcularPromedio(...),
    usoMetodologiasActivas: analizar(...),
    
    // Motivación y engagement
    motivacionGlobal: calcularPromedio(...),
    materiasMayorInteres: ranking(respuestas, 'gustoMaterias'),
    materiasMayorDificultad: ranking(respuestas, 'gustoMaterias', 'asc'),
    
    // Desarrollo integral
    participacionExtraescolar: calcularPorcentaje(...),
    habitosSaludables: evaluarHabitos(...),
    
    // Análisis cualitativo (NLP con IA)
    temasRecurrentesPositivos: analizarTextoIA(respuestas.map(r => r.queGustaEscuela)),
    areasMejoraIdentificadas: analizarTextoIA(respuestas.map(r => r.queCambiariaEscuela)),
    aspiracionesEstudiantes: analizarTextoIA(respuestas.map(r => r.visionFuturo))
  }
}
```

---

### INSTRUMENTO 3️⃣: Formulario Docentes - Prácticas

**🎯 Dimensión NEM:** Prácticas Docentes  
**👥 Dirigido a:** Maestros de todas las asignaturas  
**📊 Escala:** Likert 1-5 + Preguntas mixtas  
**⏱️ Tiempo estimado:** 20-25 minutos

#### Estructura del Formulario

```markdown
## SECCIÓN A: DATOS DEL DOCENTE
┌──────────────────────────────────────┐
│ • Nombre completo                     │
│ • Escuela (EST)                       │
│ • Asignatura(s) que imparte          │
│ • Grado(s) que atiende               │
│ • Años de experiencia docente        │
│ • Nivel académico (Lic/Maest/Doc)   │
└──────────────────────────────────────┘

## SECCIÓN B: PLANEACIÓN DIDÁCTICA
Escala Likert 1-5 (Nunca → Siempre):

□ Elaboro planes de clase considerando el programa de estudios vigente
□ Incluyo los aprendizajes esperados en mi planeación
□ Diseño actividades diferenciadas según necesidades de los estudiantes
□ Planifico evaluaciones alineadas con los aprendizajes esperados
□ Reviso y ajusto mi planeación según los resultados obtenidos
□ Incorporo el uso de tecnología en mi planeación
□ Contemplo actividades para el desarrollo socioemocional

## SECCIÓN C: AMBIENTES DE APRENDIZAJE
Likert 1-5:

### C.1 Clima del Aula
□ Promuevo un ambiente de respeto y confianza
□ Fomento la participación de todos los estudiantes
□ Establezco normas claras de convivencia
□ Atiendo situaciones de conflicto de manera oportuna
□ Creo espacios para que los estudiantes expresen sus emociones

### C.2 Organización del Espacio
□ Organizo el mobiliario según las actividades
□ Utilizo materiales didácticos diversos
□ Mantengo el aula limpia y ordenada
□ Exhibo trabajos de los estudiantes
□ Cuento con recursos tecnológicos funcionales

## SECCIÓN D: USO DEL PROGRAMA DE ESTUDIOS
Likert 1-5:

□ Conozco los contenidos del programa de mi asignatura
□ Comprendo los propósitos generales de la asignatura
□ Identifico la progresión de aprendizajes por grado
□ Vinculo contenidos con otras asignaturas
□ Adapto el programa al contexto de mis estudiantes
□ Utilizo los libros de texto como recurso complementario
□ Consulto los recursos adicionales sugeridos en el programa

## SECCIÓN E: ESTRATEGIAS DE ENSEÑANZA
□ ¿Con qué frecuencia utiliza las siguientes estrategias?
   Likert 1-5 (Nunca → Siempre):

   • Aprendizaje Basado en Proyectos (ABP)
   • Aprendizaje Basado en Problemas
   • Trabajo colaborativo
   • Aprendizaje por indagación
   • Clase invertida (Flipped Classroom)
   • Gamificación
   • Aprendizaje situado
   • Debates y discusiones
   • Mapas mentales/conceptuales
   • Estudio de casos
   • Experimentos/Prácticas
   • Uso de organizadores gráficos

## SECCIÓN F: EVALUACIÓN DEL APRENDIZAJE
Likert 1-5:

### F.1 Tipos de Evaluación
□ Realizo evaluación diagnóstica al inicio del ciclo/bloque
□ Implemento evaluación formativa durante el proceso
□ Aplico evaluación sumativa al final del periodo
□ Utilizo la autoevaluación como herramienta
□ Promuevo la coevaluación entre estudiantes
□ Doy retroalimentación oportuna y específica
□ Utilizo rúbricas o listas de cotejo

### F.2 Instrumentos de Evaluación
□ ¿Qué instrumentos utiliza con mayor frecuencia?
   Seleccione todos los que aplique:
   ☐ Exámenes escritos
   ☐ Proyectos
   ☐ Presentaciones orales
   ☐ Portafolios de evidencias
   ☐ Rúbricas
   ☐ Listas de cotejo
   ☐ Guías de observación
   ☐ Diarios de aprendizaje
   ☐ Mapas conceptuales
   ☐ Ensayos/reportes

### F.3 Uso de Resultados
□ Analizo los resultados de las evaluaciones
□ Identifico áreas de oportunidad en mi práctica
□ Diseño estrategias de mejora basadas en resultados
□ Comunico los resultados a padres de familia
□ Realizo ajustes en mi enseñanza según resultados

## SECCIÓN G: ATENCIÓN A LA DIVERSIDAD
Likert 1-5:

□ Identifico las necesidades educativas de mis estudiantes
□ Adapto materiales para estudiantes con dificultades
□ Ofrezco actividades de refuerzo y ampliación
□ Implemento adecuaciones curriculares cuando es necesario
□ Colaboro con educación especial (USAER)
□ Considero estilos de aprendizaje en mi enseñanza
□ Promuevo la inclusión de todos los estudiantes

## SECCIÓN H: USO DE TECNOLOGÍA
□ ¿Qué herramientas digitales utiliza?
   Seleccione todas las que aplique:
   ☐ Plataformas educativas (Classroom, Teams, etc.)
   ☐ Videos educativos
   ☐ Presentaciones interactivas
   ☐ Simuladores/Laboratorios virtuales
   ☐ Aplicaciones móviles educativas
   ☐ Recursos en línea (Khan Academy, etc.)
   ☐ Herramientas de evaluación en línea
   ☐ Redes sociales educativas
   ☐ Ninguna

□ Frecuencia de uso de tecnología en clases:
   • Diario  • 3-4 veces/semana  • 1-2 veces/semana  • Nunca

## SECCIÓN I: PREGUNTAS ABIERTAS
□ Describa una estrategia exitosa que haya implementado recientemente
   [Texto libre]

□ ¿Qué dificultades enfrenta en su práctica docente?
   [Texto libre]

□ ¿Qué apoyos o recursos necesita para mejorar su enseñanza?
   [Texto libre]
```

#### Variables Clave para Análisis

```javascript
interface RespuestaDocentePracticas {
  // Datos básicos
  nombreCompleto: string;
  escuelaCCT: string;
  asignaturas: string[];
  grados: string[];
  añosExperiencia: number;
  nivelAcademico: "Licenciatura" | "Maestría" | "Doctorado";
  
  // Planeación didáctica (Likert 1-5)
  elaboraPlanesPrograma: number;
  incluyeAprendizajes: number;
  actividadesDiferenciadas: number;
  evaluacionesAlineadas: number;
  ajustaPlaneacion: number;
  incorporaTecnologia: number;
  desarrolloSocioemocional: number;
  
  // Ambientes de aprendizaje (Likert 1-5)
  climaAula: {
    promueveRespeto: number;
    fomentaParticipacion: number;
    normasConvivencia: number;
    atiendConflictos: number;
    espacioEmociones: number;
  };
  organizacionEspacio: {
    organizaMobiliario: number;
    materialesDiversos: number;
    aulalimpiaOrdenada: number;
    exhibeTrabjos: number;
    recursosTecnologicos: number;
  };
  
  // Uso del programa (Likert 1-5)
  conoceContenidos: number;
  comprendePropósitos: number;
  identificaProgresion: number;
  vinculaContenidos: number;
  adaptaContexto: number;
  utilizaLibrosTexto: number;
  consultaRecursos: number;
  
  // Estrategias de enseñanza (Likert 1-5)
  estrategias: {
    abp: number;
    abproblemas: number;
    trabajoColaborativo: number;
    indagacion: number;
    claseInvertida: number;
    gamificacion: number;
    aprendizajeSituado: number;
    debates: number;
    mapasMentales: number;
    estudioCasos: number;
    experimentos: number;
    organizadoresGraficos: number;
  };
  
  // Evaluación (Likert 1-5)
  evaluacion: {
    diagnostica: number;
    formativa: number;
    sumativa: number;
    autoevaluacion: number;
    coevaluacion: number;
    retroalimentacion: number;
    usaRubricas: number;
  };
  instrumentosEvaluacion: string[];
  usoResultados: {
    analizaResultados: number;
    identificaOportunidades: number;
    diseñaEstrategiasMejora: number;
    comunicaPadres: number;
    realizaAjustes: number;
  };
  
  // Atención a la diversidad (Likert 1-5)
  identificaNecesidades: number;
  adaptaMateriales: number;
  actividadesRefuerzo: number;
  adecuacionesCurriculares: number;
  colaboraUSAER: number;
  consideraEstilos: number;
  promueveInclusión: number;
  
  // Uso de tecnología
  herramientasDigitales: string[];
  frecuenciaUsoTecnologia: string;
  
  // Respuestas abiertas (análisis cualitativo IA)
  estrategiaExitosa: string;
  dificultadesPractica: string;
  apoyosNecesarios: string;
}

// Indicadores calculados
function calcularIndicadoresPracticasDocentes(respuestas: RespuestaDocentePracticas[]): Indicadores {
  return {
    // Planeación
    calidadPlaneacion: calcularPromedio(...),
    alineacionPrograma: evaluar(...),
    
    // Ambientes de aprendizaje
    calidadClimaAula: calcularPromedio(...),
    organizacionEspacioAprendizaje: evaluar(...),
    
    // Metodologías activas
    usoMetodologiasActivas: calcularPromedio(respuestas.map(r => 
      Object.values(r.estrategias)
    )),
    diversidadEstrategias: contarEstrategiasUsadas(...),
    
    // Evaluación
    diversidadInstrumentos: contarInstrumentos(...),
    evaluacionIntegral: evaluar(...),
    retroalimentacionEfectiva: calcularPromedio(...),
    
    // Atención a la diversidad
    practicasInclusivas: calcularPromedio(...),
    
    // Tecnología
    integacionTecnologia: evaluarIntegracion(...),
    herramientasDigitalesUsadas: contar(...),
    
    // Análisis cualitativo (NLP con IA)
    practicasExitosas: analizarTextoIA(respuestas.map(r => r.estrategiaExitosa)),
    necesidadesFormacion: analizarTextoIA(respuestas.map(r => r.apoyosNecesarios)),
    retosIdentificados: analizarTextoIA(respuestas.map(r => r.dificultadesPractica))
  }
}
```

---

### INSTRUMENTO 4️⃣: Formulario Docentes - Formación

**🎯 Dimensión NEM:** Formación Docente  
**👥 Dirigido a:** Todos los docentes  
**📊 Escala:** Likert 1-5 + Preguntas mixtas  
**⏱️ Tiempo estimado:** 15-20 minutos

#### Estructura del Formulario

```markdown
## SECCIÓN A: PERFIL ACADÉMICO Y PROFESIONAL
┌──────────────────────────────────────┐
│ • Formación inicial (Normal/Univ)   │
│ • Especialidad/Licenciatura          │
│ • Estudios de posgrado               │
│ • Certificaciones adicionales        │
│ • Años de servicio docente          │
│ • Años en la escuela actual         │
└──────────────────────────────────────┘

## SECCIÓN B: DESARROLLO PROFESIONAL CONTINUO
Escala Likert 1-5:

### B.1 Participación en Cursos
□ Participé en cursos de actualización el ciclo pasado
□ Los cursos tomados fueron relevantes para mi práctica
□ Apliqué lo aprendido en los cursos en mi aula
□ Busco de forma autónoma oportunidades de formación
□ Comparto lo aprendido con mis colegas

### B.2 Temas de Formación Reciente
□ En el último año, he tomado cursos sobre:
   Seleccione todos los que aplique:
   ☐ Programa de estudios NEM
   ☐ Estrategias didácticas innovadoras
   ☐ Evaluación formativa
   ☐ Uso de tecnología educativa
   ☐ Educación socioemocional
   ☐ Atención a la diversidad/Inclusión
   ☐ Gestión del aula
   ☐ Contenidos disciplinares de mi asignatura
   ☐ Tutoría y acompañamiento
   ☐ Ninguno

### B.3 Autoformación
□ ¿Con qué frecuencia...?
   Likert 1-5 (Nunca → Siempre):
   
   • Leo libros o artículos sobre educación
   • Consulto recursos educativos en línea
   • Veo videos o tutoriales para mejorar mi práctica
   • Experimento con nuevas estrategias en el aula
   • Reflexiono sobre mi práctica docente
   • Busco retroalimentación de colegas o directivos

## SECCIÓN C: COLABORACIÓN PROFESIONAL
Likert 1-5:

### C.1 Trabajo en Equipo
□ Participo activamente en los Consejos Técnicos Escolares
□ Colaboro con mis colegas en la planeación de actividades
□ Comparto materiales y recursos con otros docentes
□ Trabajo de forma coordinada con el personal de apoyo (USAER)
□ Participo en proyectos interdisciplinarios

### C.2 Comunidades de Aprendizaje
□ Pertenezco a una comunidad de aprendizaje entre docentes
□ Intercambio experiencias con maestros de otras escuelas
□ Participo en redes o grupos de docentes (presenciales o virtuales)
□ Colaboro en la elaboración de materiales educativos
□ Participo en observación entre pares

### C.3 Mentoría
□ He servido como mentor(a) de docentes novatos
□ He recibido mentoría de docentes con más experiencia
□ Apoyo a colegas cuando tienen dudas o dificultades
□ Solicito apoyo de colegas cuando lo necesito

## SECCIÓN D: INNOVACIÓN PEDAGÓGICA
Likert 1-5:

### D.1 Uso de Tecnologías
□ Utilizo plataformas digitales para gestionar mi clase
□ Implemento recursos multimedia en mis clases
□ Uso aplicaciones educativas específicas de mi asignatura
□ Fomento el uso responsable de tecnología en estudiantes
□ Me actualizo constantemente en herramientas digitales

### D.2 Estrategias Innovadoras
□ Implemento estrategias de aprendizaje activo
□ Diseño proyectos que vinculan la escuela con la comunidad
□ Promuevo el trabajo interdisciplinario
□ Utilizo metodologías innovadoras (Design Thinking, STEAM, etc.)
□ Adapto estrategias según los intereses de los estudiantes

### D.3 Investigación Educativa
□ Realizo investigación sobre mi práctica docente
□ Documento experiencias exitosas para compartir
□ Leo investigaciones educativas para mejorar mi práctica
□ Participo en estudios o proyectos de investigación educativa
□ Aplico resultados de investigaciones en mi aula

## SECCIÓN E: NECESIDADES DE FORMACIÓN
□ ¿En qué temas le gustaría recibir formación?
   Ordene del 1 (más importante) al 10 (menos importante):
   
   __ Estrategias didácticas innovadoras
   __ Evaluación formativa y retroalimentación
   __ Uso de tecnología en el aula
   __ Atención a la diversidad e inclusión
   __ Educación socioemocional
   __ Gestión del aula y disciplina
   __ Actualización en mi disciplina
   __ Diseño de proyectos integradores
   __ Vinculación con padres de familia
   __ Desarrollo de habilidades socioemocionales propias

□ ¿Qué formato de formación prefiere?
   • Cursos presenciales
   • Cursos en línea (sincrónicos)
   • Cursos en línea (asincrónicos)
   • Talleres prácticos
   • Webinars
   • Comunidades de práctica
   • Coaching/Mentoría individual
   • Observación entre pares

## SECCIÓN F: PREGUNTAS ABIERTAS
□ Describa un aprendizaje significativo de su formación reciente que haya transformado su práctica
   [Texto libre]

□ ¿Qué obstáculos enfrenta para continuar su desarrollo profesional?
   [Texto libre]

□ ¿Qué propuestas tiene para mejorar la formación docente en la zona?
   [Texto libre]
```

#### Variables Clave para Análisis

```javascript
interface RespuestaDocenteFormacion {
  // Perfil académico
  formacionInicial: string;
  especialidad: string;
  posgrado: "Ninguno" | "Especialidad" | "Maestría" | "Doctorado";
  certificaciones: string[];
  añosServicio: number;
  añosEscuelaActual: number;
  
  // Desarrollo profesional (Likert 1-5)
  participacionCursos: number;
  relevanciacursos: number;
  aplicacionAprendizajes: number;
  busquedaAutonoma: number;
  compartirAprendizajes: number;
  
  // Temas de formación
  temasFormacionReciente: string[];
  
  // Autoformación (Likert 1-5)
  lectura: number;
  consultaRecursos: number;
  videosTutoriales: number;
  experimentacion: number;
  reflexion: number;
  buscaRetroalimentacion: number;
  
  // Colaboración profesional (Likert 1-5)
  trabajoEquipo: {
    participaCTE: number;
    colaboraPlaneacion: number;
    comparteMateriales: number;
    coordinaUSAER: number;
    proyectosInterdisciplinarios: number;
  };
  comunidadesAprendizaje: {
    perteneceComunidad: number;
    intercambioExperiencias: number;
    redesDocentes: number;
    elaboracionMateriales: number;
    observacionPares: number;
  };
  mentoria: {
    esmentor: number;
    recibiMentoria: number;
    apoyaColegas: number;
    solicitaApoyo: number;
  };
  
  // Innovación pedagógica (Likert 1-5)
  usoTecnologias: {
    plataformasDigitales: number;
    recursosMultimedia: number;
    aplicacionesEducativas: number;
    fomentaUsoResponsable: number;
    actualizacionConstante: number;
  };
  estrategiasInnovadoras: {
    aprendizajeActivo: number;
    proyectosComunidad: number;
    trabajoInterdisciplinario: number;
    metodologiasInnovadoras: number;
    adaptaIntereses: number;
  };
  investigacionEducativa: {
    realizaInvestigacion: number;
    documentaExperiencias: number;
    leeInvestigaciones: number;
    participaProyectos: number;
    aplicaResultados: number;
  };
  
  // Necesidades de formación
  temasInteres: { tema: string; prioridad: number }[];
  formatoPreferido: string;
  
  // Respuestas abiertas (análisis cualitativo IA)
  aprendizajeSignificativo: string;
  obstaculosDesarrollo: string;
  propuestasMejora: string;
}

// Indicadores calculados
function calcularIndicadoresFormacionDocente(respuestas: RespuestaDocenteFormacion[]): Indicadores {
  return {
    // Perfil académico
    nivelFormacion: analizar(...),
    añosExperienciaPromedio: calcularPromedio(...),
    
    // Desarrollo profesional continuo
    participacionFormacion: calcularPromedio(...),
    calidadFormacion: evaluar(...),
    aplicacionPractica: calcularPromedio(...),
    autoformacion: calcularPromedio(...),
    
    // Colaboración
    trabajoColaborativo: calcularPromedio(...),
    integacionComunidades: evaluar(...),
    practicasMentoria: analizar(...),
    
    // Innovación
    integacionTecnologica: calcularPromedio(...),
    practicasInnovadoras: evaluar(...),
    culturainvestigacion: calcularPromedio(...),
    
    // Necesidades detectadas
    temasPrioritarios: ranking(respuestas, 'temasInteres'),
    formatosPreferidos: contarPreferencias(...),
    brechasFormacion: identificarBrechas(...),
    
    // Análisis cualitativo (NLP con IA)
    impactosFormacion: analizarTextoIA(respuestas.map(r => r.aprendizajeSignificativo)),
    barrerasDesarrollo: analizarTextoIA(respuestas.map(r => r.obstaculosDesarrollo)),
    oportunidadesMejora: analizarTextoIA(respuestas.map(r => r.propuestasMejora))
  }
}
```

---

### INSTRUMENTO 5️⃣: Formulario Contexto Externo/Comunidad

**🎯 Dimensión NEM:** Entorno - Contexto Externo  
**👥 Dirigido a:** Directivos, docentes y personal comunitario  
**📊 Escala:** Likert 1-5 + Observación  
**⏱️ Tiempo estimado:** 15-20 minutos

#### Estructura del Formulario

```markdown
## SECCIÓN A: CARACTERÍSTICAS DE LA COMUNIDAD
┌──────────────────────────────────────┐
│ • Nombre de la localidad             │
│ • Tipo de comunidad                  │
│   ○ Urbana  ○ Rural  ○ Indígena     │
│ • Población aproximada               │
│ • Servicios disponibles             │
└──────────────────────────────────────┘

## SECCIÓN B: INFRAESTRUCTURA Y SERVICIOS
□ La comunidad cuenta con:
   Seleccione todos los que aplique:
   ☐ Agua potable
   ☐ Electricidad
   ☐ Drenaje
   ☐ Pavimentación
   ☐ Transporte público
   ☐ Internet/Conectividad
   ☐ Centro de salud
   ☐ Biblioteca pública
   ☐ Espacios deportivos
   ☐ Casa de cultura

## SECCIÓN C: CONTEXTO SOCIOECONÓMICO
Escala Likert 1-5:

□ La mayoría de las familias tienen empleos estables
□ Los estudiantes tienen acceso a servicios básicos en sus hogares
□ Las familias pueden cubrir las necesidades educativas de sus hijos
□ Existe apoyo de programas sociales (becas, apoyos alimentarios)
□ La comunidad participa activamente en la escuela

## SECCIÓN D: CONTEXTO CULTURAL
□ Lengua(s) que se habla(n) en la comunidad:
   ☐ Español
   ☐ Náhuatl
   ☐ Téenek (Huasteco)
   ☐ Otra: _____________

□ ¿Qué porcentaje de la población es indígena?
   • 0-25%  • 26-50%  • 51-75%  • 76-100%

□ ¿Se celebran festividades o tradiciones locales?
   • Sí  • No

   Si sí, ¿cuáles?: [Texto libre]

□ ¿La escuela incorpora elementos culturales locales?
   Likert 1-5

## SECCIÓN E: SEGURIDAD Y BIENESTAR
Likert 1-5:

□ La comunidad es segura para los estudiantes
□ Existen problemas de violencia o delincuencia
□ Los estudiantes pueden trasladarse seguros a la escuela
□ Hay incidencia de adicciones en la comunidad
□ Existen riesgos naturales (inundaciones, deslaves, etc.)

## SECCIÓN F: RELACIÓN ESCUELA-COMUNIDAD
Likert 1-5:

□ La comunidad valora la educación
□ Los padres participan en actividades escolares
□ Existen organizaciones comunitarias que apoyan la escuela
□ La escuela abre sus espacios para actividades comunitarias
□ Hay colaboración entre la escuela y autoridades locales
□ La escuela responde a las necesidades de la comunidad

## SECCIÓN G: RECURSOS COMUNITARIOS
□ ¿Qué recursos educativos ofrece la comunidad?
   Seleccione todos los que aplique:
   ☐ Biblioteca municipal
   ☐ Casa de cultura
   ☐ Museos o centros históricos
   ☐ Espacios naturales educativos
   ☐ Talleres comunitarios
   ☐ Expertos locales (artesanos, agricultores, etc.)
   ☐ Organizaciones civiles
   ☐ Ninguno

## SECCIÓN H: PROBLEMÁTICAS IDENTIFICADAS
□ Principales problemáticas de la comunidad:
   Ordene del 1 (más grave) al 10 (menos grave):
   
   __ Pobreza/Desempleo
   __ Migración
   __ Violencia/Inseguridad
   __ Adicciones
   __ Embarazo adolescente
   __ Deserción escolar
   __ Desnutrición
   __ Falta de servicios básicos
   __ Aislamiento geográfico
   __ Discriminación

## SECCIÓN I: OPORTUNIDADES Y FORTALEZAS
□ Principales fortalezas de la comunidad:
   [Texto libre]

□ Recursos o personas que podrían contribuir a mejorar la educación:
   [Texto libre]

□ Proyectos comunitarios exitosos que involucran a la escuela:
   [Texto libre]
```

#### Variables Clave para Análisis

```javascript
interface RespuestaContextoExterno {
  // Características básicas
  nombreLocalidad: string;
  tipoComunidad: "Urbana" | "Rural" | "Indígena";
  poblacionAproximada: number;
  escuelaCCT: string;
  
  // Infraestructura y servicios
  serviciosDisponibles: string[];
  
  // Contexto socioeconómico (Likert 1-5)
  empleosEstables: number;
  accesoServiciosBasicos: number;
  capacidadEconomicaFamilias: number;
  apoyoProgramasSociales: number;
  participacionComunidad: number;
  
  // Contexto cultural
  lenguas: string[];
  porcentajePoblacionIndigena: string;
  celebraFestividades: boolean;
  festividades: string;
  incorporacionElementosCulturales: number;
  
  // Seguridad y bienestar (Likert 1-5)
  seguridadComunidad: number;
  problemasViolencia: number; // Invertir escala
  trasladoSeguro: number;
  incidenciaAdicciones: number; // Invertir escala
  riesgosNaturales: number; // Invertir escala
  
  // Relación escuela-comunidad (Likert 1-5)
  valoraEducacion: number;
  participacionPadres: number;
  apoyoOrganizaciones: number;
  escuelaAbreEspacios: number;
  colaboracionAutoridades: number;
  escuelaRespondeNecesidades: number;
  
  // Recursos comunitarios
  recursosEducativos: string[];
  
  // Problemáticas
  problematicas: { problema: string; gravedad: number }[];
  
  // Oportunidades (análisis cualitativo IA)
  fortalezasComunidad: string;
  recursosPersonas: string;
  proyectosExitosos: string;
}

// Indicadores calculados
function calcularIndicadoresContextoExterno(respuestas: RespuestaContextoExterno[]): Indicadores {
  return {
    // Perfil socioeconómico
    nivelSocioeconomico: clasificar(...),
    disponibilidadServicios: calcularPorcentaje(...),
    
    // Diversidad cultural
    diversidadLingüistica: analizar(...),
    integacionCultural: evaluar(...),
    
    // Seguridad y riesgos
    nivelSeguridad: calcularPromedio(...),
    riesgosIdentificados: listar(...),
    
    // Vinculación escuela-comunidad
    calidadVinculacion: calcularPromedio(...),
    participacionComunitaria: evaluar(...),
    
    // Recursos disponibles
    recursosAprovechables: contar(...),
    oportunidadesVinculacion: identificar(...),
    
    // Problemáticas prioritarias
    problemasPrioritarios: ranking(respuestas, 'problematicas'),
    factoresRiesgo: identificarRiesgos(...),
    
    // Análisis cualitativo (NLP con IA)
    fortalezasIdentificadas: analizarTextoIA(respuestas.map(r => r.fortalezasComunidad)),
    actoresClaveIdentificados: analizarTextoIA(respuestas.map(r => r.recursosPersonas)),
    buenasPracticas: analizarTextoIA(respuestas.map(r => r.proyectosExitosos))
  }
}
```

---

## 🔄 INTEGRACIÓN DE FORMULARIOS AL SISTEMA

### Estrategia de Implementación

```markdown
## FASE 1: CAPTURA DE DATOS (Semanas 1-2)

### Opción A: Integración Directa con Google Forms API
```javascript
// Usar Google Forms API para obtener respuestas
import { google } from 'googleapis';

async function obtenerRespuestasForm(formId: string) {
  const forms = google.forms('v1');
  
  const respuestas = await forms.forms.responses.list({
    formId: formId,
  });
  
  return procesarRespuestas(respuestas.data.responses);
}
```

**PROS:**
- Datos en tiempo real
- No duplicar trabajo de captura
- Mantiene Google Forms como interfaz familiar

**CONTRAS:**
- Dependencia de Google API
- Cuotas de uso
- Necesita configuración OAuth

---

### Opción B: Importación por CSV/Excel
```javascript
// Exportar respuestas de Google Forms a CSV
// Importar CSV al sistema PMCZE14
async function importarCSV(archivo: File, tipoInstrumento: string) {
  const datos = await leerCSV(archivo);
  const respuestasProcesadas = mapearCampos(datos, tipoInstrumento);
  await guardarRespuestas(respuestasProcesadas);
}
```

**PROS:**
- Sin dependencias externas
- Control total del proceso
- Facilita backup

**CONTRAS:**
- Proceso manual
- Posibles errores de formato
- No es tiempo real

---

### Opción C: Formularios Nativos en PMCZE14
```typescript
// Replicar estructura de Google Forms en React
function FormularioEstudiantes() {
  const { register, handleSubmit } = useForm<RespuestaEstudiante>();
  
  return (
    <form onSubmit={handleSubmit(guardarRespuesta)}>
      {/* Campos tipo Likert */}
      <LikertScale 
        label="Me siento seguro en mi salón"
        {...register("seguridadAula")}
      />
      {/* ... más campos */}
    </form>
  );
}
```

**PROS:**
- Control total de UX
- Validaciones en tiempo real
- Sin costos externos

**CONTRAS:**
- Mayor desarrollo inicial
- Migrar formularios existentes

---

## 📊 RECOMENDACIÓN PARA PMCZE14

### ENFOQUE HÍBRIDO (Mejor de ambos mundos)

```markdown
FASE INICIAL (MVP):
✅ Opción B - Importación CSV
   - Usar Google Forms existentes
   - Exportar respuestas periódicamente
   - Importar al sistema para análisis

FASE INTERMEDIA:
✅ Opción A - Integración API
   - Conectar Google Forms API
   - Sincronización automática
   - Mantener Google Forms como interfaz

FASE AVANZADA:
✅ Opción C - Formularios Nativos
   - App móvil offline
   - UX optimizada
   - Control total
```

---

## 🤖 ANÁLISIS CON IA - FLUJO DE PROCESAMIENTO

### Arquitectura de Análisis

```typescript
// Pipeline de procesamiento con IA

interface PipelineAnalisis {
  // 1. Recolección
  recolectar: () => Promise<RespuestasRaw[]>;
  
  // 2. Limpieza
  limpiar: (datos: RespuestasRaw[]) => DatosLimpios[];
  
  // 3. Análisis cuantitativo
  analizarCuantitativo: (datos: DatosLimpios[]) => Indicadores;
  
  // 4. Análisis cualitativo (IA)
  analizarCualitativo: (textos: string[]) => InsightsIA;
  
  // 5. Correlaciones (IA)
  encontrarCorrelaciones: (indicadores: Indicadores) => Correlaciones;
  
  // 6. Problemáticas (IA)
  identificarProblematicas: (datos: TodosLosDatos) => Problematica[];
  
  // 7. Propuestas de acción (IA)
  generarPropuestas: (problematicas: Problematica[]) => PropuestaAccion[];
  
  // 8. Jerarquización (IA + Humano)
  jerarquizar: (propuestas: PropuestaAccion[]) => PropuestasPriorizadas;
}
```

### Ejemplo de Análisis con IA

```typescript
// Usar la IA para correlacionar datos de múltiples instrumentos

async function analizarAmbienteAprendizaje(
  respuestasEstudiantes: RespuestaEstudiante[],
  respuestasDocentes: RespuestaDocentePracticas[],
  respuestasPadres: RespuestaPadresFamilia[]
): Promise<AnalisisAmbienter> {
  
  // 1. Calcular indicadores individuales
  const climaAulaEstudiantes = calcularPromedio(
    respuestasEstudiantes.map(r => r.seguridadAula)
  );
  
  const climaAulaDocentes = calcularPromedio(
    respuestasDocentes.map(r => r.climaAula.promueveRespeto)
  );
  
  const apoyoFamiliar = calcularPromedio(
    respuestasPadres.map(r => r.supervisionTareas)
  );
  
  // 2. Usar IA para encontrar correlaciones
  const prompt = `
    Analiza estos indicadores y encuentra correlaciones:
    
    - Clima del aula (perspectiva estudiantes): ${climaAulaEstudiantes}/5
    - Clima del aula (perspectiva docentes): ${climaAulaDocentes}/5
    - Apoyo familiar: ${apoyoFamiliar}/5
    
    Considera también estos datos cualitativos:
    - Estudiantes comentan: "${respuestasEstudiantes[0].queGustaEscuela}"
    - Docentes reportan: "${respuestasDocentes[0].dificultadesPractica}"
    
    Identifica:
    1. Correlaciones positivas/negativas
    2. Factores de riesgo
    3. Áreas de oportunidad
    4. Propuestas de acción específicas
  `;
  
  const analisisIA = await llamarClaudeAPI(prompt);
  
  return {
    indicadores: { climaAulaEstudiantes, climaAulaDocentes, apoyoFamiliar },
    correlaciones: analisisIA.correlaciones,
    problematicas: analisisIA.problematicas,
    propuestas: analisisIA.propuestas
  };
}
```

---

## 📋 DOCUMENTO DE "ORIENTACIONES" - FUENTE DE VERDAD

> **"Este documento es aquí están todos los formularios que te los pasé en el promt y ahí las ligas ya están."**  
> — Itzcoatl (Min. 01:13:05)

### Importancia del Documento

```markdown
El documento de "Orientaciones para elaborar el programa analítico" contiene:

✅ Todos los formularios (ligas de Google Forms)
✅ Definición de escalas (Likert, etc.)
✅ Métricas oficiales SEP/NEM
✅ Criterios de evaluación
✅ Procedimientos de análisis
✅ Estructura de reportes

🎯 PARA LA IA:
Este documento es la "ÚNICA FUENTE DE VERDAD" para:
- Interpretar las respuestas
- Calcular indicadores
- Generar reportes
- Proponer acciones

La IA debe:
1. Leer y comprender este documento
2. Usarlo como referencia para todos los análisis
3. NO inventar criterios externos
4. Alinearse 100% con los lineamientos estatales
```

---

## 🎯 SIGUIENTES PASOS TÉCNICOS

### Checklist de Implementación

```markdown
## FASE INMEDIATA (Esta semana)

### Backend
- [ ] Crear tablas en Supabase para cada instrumento
- [ ] Definir esquemas JSON para respuestas
- [ ] Configurar storage para archivos CSV

### Frontend
- [ ] Página de importación de CSV
- [ ] Preview de datos importados
- [ ] Validación de formato

### IA
- [ ] Subir documento "Orientaciones" a contexto IA
- [ ] Crear prompts base para análisis
- [ ] Probar análisis con datos de prueba

---

## FASE SIGUIENTE (Próximas 2 semanas)

### Análisis Cuantitativo
- [ ] Implementar cálculo de indicadores por instrumento
- [ ] Dashboard de visualización básica
- [ ] Comparativos inter-escuelas

### Análisis Cualitativo (IA)
- [ ] Pipeline de procesamiento de textos abiertos
- [ ] Identificación de temas recurrentes
- [ ] Generación de resúmenes automáticos

### Correlaciones
- [ ] Cruces de datos entre instrumentos
- [ ] Matriz de correlaciones
- [ ] Identificación de patrones

---

## FASE AVANZADA (Siguientes 4 semanas)

### Problematización
- [ ] IA identifica problemáticas automáticamente
- [ ] Jerarquización sugerida por IA
- [ ] Interfaz drag-and-drop para ajustar prioridades

### Propuestas de Acción
- [ ] IA genera propuestas basadas en manuales
- [ ] Validación humana de propuestas
- [ ] Generación de plan de mejora

### Reportes
- [ ] Generación automática de documentos
- [ ] Exportación a PDF/Word
- [ ] Plantillas personalizables
```

---

## 📞 CONTACTO Y REFERENCIAS

**Responsable del Proyecto:**  
Itzcoatl Merino González  
Supervisor Zona Escolar 14  
Secundarias Técnicas - Huasteca Potosina, SLP

**Documentos de Referencia:**
- ✅ Ruta Metodológica del Análisis Socioeducativo
- ✅ Orientaciones para elaborar el programa analítico
- ✅ Manuales SEP/NEM (fuente de verdad para IA)
- ✅ Formularios de Google Forms (ligas en documento Orientaciones)

**Última Actualización:** 20 Noviembre 2025

---

## 🎓 NOTAS PEDAGÓGICAS PARA EL AGENTE IA

```markdown
Cuando trabajes con estos formularios, recuerda:

1. **ESCALA LIKERT**
   Analogía: Es como una rúbrica de evaluación
   1 = Insuficiente
   2 = Requiere apoyo
   3 = Satisfactorio  
   4 = Destacado
   5 = Excelente

2. **ANÁLISIS CUALITATIVO**
   No es solo contar palabras.
   Es identificar:
   - Temas recurrentes
   - Sentimientos expresados
   - Necesidades implícitas
   - Oportunidades de mejora

3. **CORRELACIONES**
   Ejemplo: Si "apoyo familiar" es bajo Y 
   "motivación estudiante" es baja,
   la IA debe sugerir intervenciones
   que involucren a las familias.

4. **RESPETO CULTURAL**
   La Huasteca Potosina es bilingüe/bicultural.
   Respuestas en contexto indígena pueden
   reflejar cosmovisiones diferentes.
   La IA debe ser sensible a esto.
```

---

**FIN DEL DOCUMENTO**

Este mapeo será la base para que Claude Code implemente todo el sistema de análisis de diagnóstico del PMCZE14. 🚀
