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
 */
export interface DimensionAprovechamiento {
  indicadoresAcademicos: {
    promedioGeneral: CriterioEvaluacion
    eficienciaTerminal: CriterioEvaluacion
    indiceReprobacion: CriterioEvaluacion
    indiceDesercion: CriterioEvaluacion
  }
  evaluacionesExternas: {
    planea?: CriterioEvaluacion
    enlace?: CriterioEvaluacion
    otras?: CriterioEvaluacion[]
  }
  asistenciaAlumnos: {
    promedioAsistencia: CriterioEvaluacion
    ausentismoCronico: CriterioEvaluacion
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
