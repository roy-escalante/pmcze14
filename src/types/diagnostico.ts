/**
 * Tipos para el Módulo de Diagnóstico Educativo
 * Basado en las 5 dimensiones de la Nueva Escuela Mexicana (NEM)
 */

/**
 * Dimensiones del diagnóstico según la NEM
 */
export enum DimensionNEM {
  APROVECHAMIENTO_ACADEMICO = 'APROVECHAMIENTO_ACADEMICO',
  PRACTICAS_DOCENTES = 'PRACTICAS_DOCENTES', 
  FORMACION_DOCENTE = 'FORMACION_DOCENTE',
  PARTICIPACION_COMUNIDAD = 'PARTICIPACION_COMUNIDAD',
  DESEMPENO_AUTORIDAD = 'DESEMPENO_AUTORIDAD'
}

/**
 * Escala de valoración para indicadores
 */
export enum EscalaValoracion {
  EXCELENTE = 4,
  BUENO = 3,
  REGULAR = 2,
  DEFICIENTE = 1
}

/**
 * Criterio de evaluación con su indicador
 */
export interface CriterioEvaluacion {
  id: string
  nombre: string
  descripcion: string
  valoracion: EscalaValoracion
  evidencias?: string
  observaciones?: string
}

/**
 * Dimensión 1: Aprovechamiento académico y asistencia de los alumnos
 * ACTUALIZADO: Ahora usa valores numéricos directos en lugar de CriterioEvaluacion
 */
export interface DimensionAprovechamiento {
  indicadoresAcademicos: {
    // Promedios por grado (valores numéricos 0.0 - 10.0)
    promedioGeneral1ro: number
    promedioGeneral2do: number
    promedioGeneral3ro: number
    // Porcentajes (valores numéricos 0 - 100)
    eficienciaTerminal: number
    indiceReprobacion: number
    indiceDesercion: number
  }
  evaluacionesExternas?: {
    planea?: CriterioEvaluacion
    enlace?: CriterioEvaluacion
    otras?: CriterioEvaluacion[]
  }
  asistenciaAlumnos: {
    promedioAsistencia: number  // Porcentaje 0-100
    controlAusentismo: string   // Descripción de medidas implementadas
  }
  // Ejercicios Integradores de Aprendizaje
  ejerciciosIntegradores?: {
    documentoPDF?: string  // URL del documento subido
    areas?: {
      manejoInformacion?: {
        noEvidencia: number
        requiereApoyo: number
        enProceso: number
        alcanzado: number
      }
      discriminacionInformacion?: {
        noEvidencia: number
        requiereApoyo: number
        enProceso: number
        alcanzado: number
      }
      calculoMental?: {
        noEvidencia: number
        requiereApoyo: number
        enProceso: number
        alcanzado: number
      }
    }
  }
}

/**
 * Dimensión 2: Prácticas docentes y directivas
 */
export interface DimensionPracticasDocentes {
  planeacionDidactica: {
    elaboracionPlanes: CriterioEvaluacion
    adecuacionesNEE: CriterioEvaluacion
    usoProgramasEstudio: CriterioEvaluacion
  }
  ambienteAprendizaje: {
    climaAula: CriterioEvaluacion
    inclusionDiversidad: CriterioEvaluacion
    convivenciaPacifica: CriterioEvaluacion
  }
  evaluacionAprendizaje: {
    instrumentosEvaluacion: CriterioEvaluacion
    retroalimentacion: CriterioEvaluacion
    registroAvances: CriterioEvaluacion
  }
  liderazgoDirectivo: {
    gestionPedagogica: CriterioEvaluacion
    acompanamiento: CriterioEvaluacion
    toma_decisiones: CriterioEvaluacion
  }
}

/**
 * Dimensión 3: Formación, actualización y desarrollo profesional
 */
export interface DimensionFormacionDocente {
  desarrolloProfesional: {
    participacionCursos: CriterioEvaluacion
    aplicacionAprendizajes: CriterioEvaluacion
    autoformacion: CriterioEvaluacion
  }
  colaboracionProfesional: {
    trabajoEnEquipo: CriterioEvaluacion
    intercambioExperiencias: CriterioEvaluacion
    mentoriaDocente: CriterioEvaluacion
  }
  innovacionPedagogica: {
    useTecnologias: CriterioEvaluacion
    estrategiasInnovadoras: CriterioEvaluacion
    investigacionEducativa: CriterioEvaluacion
  }
}

/**
 * Dimensión 4: Avance de los planes y programas educativos
 */
export interface DimensionPlanesPrograma {
  cumplimientoCurricular: {
    avanceProgramatico: CriterioEvaluacion
    transversalidadTemas: CriterioEvaluacion
    articulacionNiveles: CriterioEvaluacion
  }
  adaptacionCurricular: {
    contextualizacion: CriterioEvaluacion
    atencionDiversidad: CriterioEvaluacion
    necesidadesEducativas: CriterioEvaluacion
  }
}

/**
 * Dimensión 5: Participación de los padres de familia en la escuela
 */
export interface DimensionParticipacionFamilia {
  involucramiento: {
    asistenciaReuniones: CriterioEvaluacion
    participacionDecisiones: CriterioEvaluacion
    apoyoTareasCasa: CriterioEvaluacion
  }
  comunicacionEscuelaFamilia: {
    canalesComunicacion: CriterioEvaluacion
    transparenciaInfo: CriterioEvaluacion
    respuestaInquietudes: CriterioEvaluacion
  }
  colaboracionMejora: {
    participacionComites: CriterioEvaluacion
    propuestasInnovacion: CriterioEvaluacion
    gestionRecursos: CriterioEvaluacion
  }
}

/**
 * Estado del diagnóstico
 */
export enum EstadoDiagnostico {
  BORRADOR = 'BORRADOR',
  EN_CAPTURA = 'EN_CAPTURA',
  COMPLETADO = 'COMPLETADO',
  VALIDADO = 'VALIDADO',
  APROBADO = 'APROBADO'
}

/**
 * Datos generales del diagnóstico
 */
export interface DatosGeneralesDiagnostico {
  escuelaId: string
  nombreEscuela: string
  cct: string
  cicloEscolar: string
  fechaInicio: Date
  fechaFin?: Date
  responsable: {
    nombre: string
    cargo: string
    email: string
  }
  participantes: string[] // Lista de participantes en el diagnóstico
}

/**
 * Puntajes calculados por dimensión
 */
export interface PuntajeDimension {
  dimension: DimensionNEM
  puntajeObtenido: number
  puntajeMaximo: number
  porcentaje: number
  nivel: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE'
  fortalezas: string[]
  areasOportunidad: string[]
}

/**
 * Diagnóstico completo de una escuela según NEM
 */
export interface DiagnosticoNEM {
  id: string
  datosGenerales: DatosGeneralesDiagnostico
  estado: EstadoDiagnostico
  
  // Las 5 dimensiones de la NEM
  dimensionAprovechamiento?: DimensionAprovechamiento
  dimensionPracticasDocentes?: DimensionPracticasDocentes
  dimensionFormacionDocente?: DimensionFormacionDocente
  dimensionPlanesPrograma?: DimensionPlanesPrograma
  dimensionParticipacionFamilia?: DimensionParticipacionFamilia
  
  // Resultados calculados
  puntajes?: PuntajeDimension[]
  puntajeGeneral?: number
  nivelGeneral?: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE'
  
  // Metadatos
  version: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Plantilla de criterios para cada dimensión
 */
export interface PlantillaDimension {
  dimension: DimensionNEM
  nombre: string
  descripcion: string
  criterios: {
    seccion: string
    items: {
      id: string
      nombre: string
      descripcion: string
      peso: number // Peso relativo del criterio
    }[]
  }[]
}

/**
 * ============================================
 * TIPOS PARA FORMULARIOS DE GOOGLE FORMS
 * ============================================
 */

/**
 * Tipos de formularios basados en Google Forms
 */
export enum FormularioTipo {
  AMBIENTE_FAMILIAR = 'ambiente_familiar',
  DESARROLLO_INTEGRAL = 'desarrollo_integral',
  AMBIENTE_APRENDIZAJE = 'ambiente_aprendizaje',
  PRACTICAS_DOCENTES = 'practicas_docentes',
  FORMACION_DOCENTE = 'formacion_docente'
}

/**
 * Tipos de preguntas soportadas
 */
export enum TipoPregunta {
  LIKERT5 = 'likert5',        // Escala 1-5
  LIKERT4 = 'likert4',        // Escala 1-4
  TEXTO = 'texto',            // Texto libre
  NUMERO = 'numero',          // Numérico
  SELECT = 'select',          // Selección única
  MULTISELECT = 'multiselect', // Selección múltiple
  BOOLEAN = 'boolean',        // Sí/No
  FECHA = 'fecha'             // Fecha
}

/**
 * Configuración de una pregunta individual
 */
export interface PreguntaConfig {
  id: string
  texto: string
  tipo: TipoPregunta
  opciones?: string[]          // Para select/multiselect
  requerido?: boolean
  ayuda?: string               // Texto de ayuda
  placeholder?: string         // Placeholder para inputs
  min?: number                 // Para números
  max?: number                 // Para números
  step?: number                // Para números
}

/**
 * Configuración de una sección de preguntas
 */
export interface SeccionConfig {
  id: string
  titulo: string
  descripcion?: string
  preguntas: PreguntaConfig[]
}

/**
 * Configuración completa de un formulario
 */
export interface FormularioConfig {
  formularioTipo: FormularioTipo
  version: string
  titulo: string
  descripcion: string
  icono?: string
  secciones: SeccionConfig[]
}

/**
 * Respuesta a una pregunta individual
 */
export interface RespuestaFormulario {
  id?: string
  diagnosticoId: string
  formularioTipo: FormularioTipo
  seccion: string
  preguntaId: string
  preguntaTexto: string
  tipoRespuesta: TipoPregunta
  respuestaNumerica?: number
  respuestaTexto?: string
  observaciones?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Indicador calculado a partir de respuestas
 */
export interface IndicadorCalculado {
  id?: string
  diagnosticoId: string
  dimension: string
  criterio: string
  valorNumerico: number
  nivelDesempeno: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE'
  calculadoDesde: string[]  // Array de pregunta_ids
  metadatos?: {
    desviacionEstandar?: number
    minimo?: number
    maximo?: number
    n?: number  // Cantidad de respuestas
    correlaciones?: Record<string, number>
  }
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Estado de progreso de un formulario
 */
export interface ProgresoFormulario {
  formularioTipo: FormularioTipo
  totalPreguntas: number
  preguntasRespondidas: number
  porcentajeCompletitud: number
  ultimaActualizacion?: Date
}

/**
 * Resumen de todos los formularios de un diagnóstico
 */
export interface ResumenFormularios {
  diagnosticoId: string
  progresos: ProgresoFormulario[]
  porcentajeTotal: number
  todosCompletos: boolean
}
