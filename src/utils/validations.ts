import { z } from 'zod'
import { Region } from '../types'

// Esquema de validación para direcciones
const DireccionSchema = z.object({
  calle: z.string()
    .min(5, 'La calle debe tener al menos 5 caracteres')
    .max(100, 'La calle no puede exceder 100 caracteres'),
  colonia: z.string()
    .min(3, 'La colonia debe tener al menos 3 caracteres')
    .max(50, 'La colonia no puede exceder 50 caracteres'),
  municipio: z.string()
    .min(3, 'El municipio debe tener al menos 3 caracteres')
    .max(50, 'El municipio no puede exceder 50 caracteres'),
  localidad: z.string()
    .min(3, 'La localidad debe tener al menos 3 caracteres')
    .max(50, 'La localidad no puede exceder 50 caracteres'),
  codigoPostal: z.string()
    .regex(/^\d{5}$/, 'El código postal debe ser de 5 dígitos')
})

// Esquema de validación para contacto
const ContactoSchema = z.object({
  telefono: z.string()
    .regex(/^[\d\-\(\)\s+]+$/, 'Formato de teléfono inválido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional(),
  email: z.string()
    .email('Formato de correo electrónico inválido')
    .optional()
})

// Esquema principal para escuela
export const EscuelaFormSchema = z.object({
  cct: z.string()
    .regex(/^24EST\d{4}[A-Z]$/, 'CCT debe tener el formato 24EST####X (ej: 24EST0041C)')
    .length(10, 'CCT debe tener exactamente 10 caracteres'),
  
  nombre: z.string()
    .min(10, 'El nombre debe tener al menos 10 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .refine(val => val.includes('Secundaria'), {
      message: 'El nombre debe incluir la palabra "Secundaria"'
    }),
  
  numeroEST: z.number()
    .int('Debe ser un número entero')
    .min(1, 'El número EST debe ser mayor a 0')
    .max(999, 'El número EST no puede exceder 999'),
  
  region: z.nativeEnum(Region, {
    errorMap: () => ({ message: 'Debe seleccionar una región válida' })
  }),
  
  direccion: DireccionSchema,
  
  contacto: ContactoSchema,
  
  matriculaTotal: z.number()
    .int('Debe ser un número entero')
    .min(50, 'La matrícula debe ser al menos de 50 estudiantes')
    .max(3000, 'La matrícula no puede exceder 3000 estudiantes'),
  
  numeroDocentes: z.number()
    .int('Debe ser un número entero')
    .min(5, 'Debe tener al menos 5 docentes')
    .max(200, 'No puede exceder 200 docentes'),
  
  turno: z.enum(['MATUTINO', 'VESPERTINO', 'AMBOS'], {
    errorMap: () => ({ message: 'Debe seleccionar un turno válido' })
  }),
  
  activa: z.boolean()
})

// Tipo inferido del schema para TypeScript
export type EscuelaFormData = z.infer<typeof EscuelaFormSchema>

// Valores por defecto para el formulario
export const escuelaFormDefaults: Partial<EscuelaFormData> = {
  region: Region.NORTE,
  turno: 'MATUTINO',
  activa: true,
  matriculaTotal: 180,
  numeroDocentes: 12,
  direccion: {
    calle: '',
    colonia: '',
    municipio: '',
    localidad: '',
    codigoPostal: ''
  },
  contacto: {
    telefono: '',
    email: ''
  }
}

// Función helper para generar CCT automático
// Nota: El dígito verificador debe calcularse según el algoritmo oficial
// Por ahora retorna formato básico 24EST####X
export const generarCCT = (numeroEST: number): string => {
  const digitos = String(numeroEST).padStart(4, '0')
  // TODO: Implementar cálculo real del dígito verificador
  // Por ahora usar 'X' como placeholder
  return `24EST${digitos}X`
}

// Función helper para validar numero EST único
export const validarNumeroESTUnico = (numeroEST: number, escuelas: any[], escuelaId?: string): boolean => {
  return !escuelas.some(escuela => 
    escuela.numeroEST === numeroEST && escuela.id !== escuelaId
  )
}

// Opciones para selects
export const opcionesRegion = [
  { value: Region.NORTE, label: 'Norte' },
  { value: Region.SUR, label: 'Sur' }
]

export const opcionesTurno = [
  { value: 'MATUTINO', label: 'Matutino' },
  { value: 'VESPERTINO', label: 'Vespertino' },
  { value: 'AMBOS', label: 'Ambos Turnos' }
]

// Mensajes de error personalizados en español
export const mensajesError = {
  required: 'Este campo es obligatorio',
  invalid_type: 'Tipo de dato inválido',
  too_small: 'El valor es muy pequeño',
  too_big: 'El valor es muy grande',
  invalid_email: 'Formato de correo inválido',
  invalid_cct: 'Formato de CCT inválido'
}

// ===== VALIDACIONES PARA DIAGNÓSTICO NEM =====

// Esquema para criterio de evaluación
const CriterioEvaluacionSchema = z.object({
  id: z.string().min(1, 'ID requerido'),
  nombre: z.string().min(1, 'Nombre del criterio es obligatorio'),
  descripcion: z.string().min(1, 'Descripción es obligatoria'),
  valoracion: z.number().min(1).max(4, 'La valoración debe estar entre 1 y 4'),
  evidencias: z.string().optional(),
  observaciones: z.string().optional()
})

// Esquema para datos generales del diagnóstico
export const DatosGeneralesDiagnosticoSchema = z.object({
  escuelaId: z.string().min(1, 'Debe seleccionar una escuela'),
  nombreEscuela: z.string().min(1, 'Nombre de la escuela es obligatorio'),
  cct: z.string().min(1, 'CCT es obligatorio'),
  cicloEscolar: z.string()
    .regex(/^\d{4}-\d{4}$/, 'Formato debe ser YYYY-YYYY'),
  fechaInicio: z.date(),
  fechaFin: z.date().optional(),
  responsable: z.object({
    nombre: z.string().min(1, 'Nombre del responsable es obligatorio'),
    cargo: z.string().min(1, 'Cargo es obligatorio'),
    email: z.string().email('Email inválido')
  }),
  participantes: z.array(z.string()).min(1, 'Debe haber al menos un participante')
})

// Esquemas para cada dimensión NEM
export const DimensionAprovechamientoSchema = z.object({
  indicadoresAcademicos: z.object({
    // Promedios por grado (valores numéricos 0.0 - 10.0)
    promedioGeneral1ro: z.number()
      .min(0, 'El promedio debe ser mayor o igual a 0')
      .max(10, 'El promedio no puede ser mayor a 10'),
    promedioGeneral2do: z.number()
      .min(0, 'El promedio debe ser mayor o igual a 0')
      .max(10, 'El promedio no puede ser mayor a 10'),
    promedioGeneral3ro: z.number()
      .min(0, 'El promedio debe ser mayor o igual a 0')
      .max(10, 'El promedio no puede ser mayor a 10'),

    // Porcentajes (valores numéricos 0 - 100)
    eficienciaTerminal: z.number()
      .min(0, 'El porcentaje debe ser mayor o igual a 0')
      .max(100, 'El porcentaje no puede ser mayor a 100'),
    indiceReprobacion: z.number()
      .min(0, 'El porcentaje debe ser mayor o igual a 0')
      .max(100, 'El porcentaje no puede ser mayor a 100'),
    indiceDesercion: z.number()
      .min(0, 'El porcentaje debe ser mayor o igual a 0')
      .max(100, 'El porcentaje no puede ser mayor a 100')
  }),
  evaluacionesExternas: z.object({
    planea: CriterioEvaluacionSchema.optional(),
    enlace: CriterioEvaluacionSchema.optional(),
    otras: z.array(CriterioEvaluacionSchema).optional()
  }).optional(),
  asistenciaAlumnos: z.object({
    // Porcentaje numérico 0-100
    promedioAsistencia: z.number()
      .min(0, 'El porcentaje debe ser mayor o igual a 0')
      .max(100, 'El porcentaje no puede ser mayor a 100'),

    // Campo de texto descriptivo (NO "crónico", solo "Control de ausentismo")
    controlAusentismo: z.string()
      .min(10, 'Debe describir las medidas implementadas (mínimo 10 caracteres)')
      .max(500, 'La descripción no puede exceder 500 caracteres')
  }),
  // NUEVO: Ejercicios Integradores de Aprendizaje
  ejerciciosIntegradores: z.object({
    // Opción 1: Subir documento PDF
    documentoPDF: z.string().optional(), // URL del archivo subido

    // Opción 2: Captura manual por área y categoría
    areas: z.object({
      manejoInformacion: z.object({
        noEvidencia: z.number().int().min(0, 'Debe ser un número positivo'),
        requiereApoyo: z.number().int().min(0, 'Debe ser un número positivo'),
        enProceso: z.number().int().min(0, 'Debe ser un número positivo'),
        alcanzado: z.number().int().min(0, 'Debe ser un número positivo')
      }).optional(),
      discriminacionInformacion: z.object({
        noEvidencia: z.number().int().min(0, 'Debe ser un número positivo'),
        requiereApoyo: z.number().int().min(0, 'Debe ser un número positivo'),
        enProceso: z.number().int().min(0, 'Debe ser un número positivo'),
        alcanzado: z.number().int().min(0, 'Debe ser un número positivo')
      }).optional(),
      calculoMental: z.object({
        noEvidencia: z.number().int().min(0, 'Debe ser un número positivo'),
        requiereApoyo: z.number().int().min(0, 'Debe ser un número positivo'),
        enProceso: z.number().int().min(0, 'Debe ser un número positivo'),
        alcanzado: z.number().int().min(0, 'Debe ser un número positivo')
      }).optional()
    }).optional()
  }).optional()
})

export const DimensionPracticasDocentesSchema = z.object({
  planeacionDidactica: z.object({
    elaboracionPlanes: CriterioEvaluacionSchema,
    adecuacionesNEE: CriterioEvaluacionSchema,
    usoProgramasEstudio: CriterioEvaluacionSchema
  }),
  ambienteAprendizaje: z.object({
    climaAula: CriterioEvaluacionSchema,
    inclusionDiversidad: CriterioEvaluacionSchema,
    convivenciaPacifica: CriterioEvaluacionSchema
  }),
  evaluacionAprendizaje: z.object({
    instrumentosEvaluacion: CriterioEvaluacionSchema,
    retroalimentacion: CriterioEvaluacionSchema,
    registroAvances: CriterioEvaluacionSchema
  }),
  liderazgoDirectivo: z.object({
    gestionPedagogica: CriterioEvaluacionSchema,
    acompanamiento: CriterioEvaluacionSchema,
    toma_decisiones: CriterioEvaluacionSchema
  })
})

export const DimensionFormacionDocenteSchema = z.object({
  desarrolloProfesional: z.object({
    participacionCursos: CriterioEvaluacionSchema,
    aplicacionAprendizajes: CriterioEvaluacionSchema,
    autoformacion: CriterioEvaluacionSchema
  }),
  colaboracionProfesional: z.object({
    trabajoEnEquipo: CriterioEvaluacionSchema,
    intercambioExperiencias: CriterioEvaluacionSchema,
    mentoriaDocente: CriterioEvaluacionSchema
  }),
  innovacionPedagogica: z.object({
    useTecnologias: CriterioEvaluacionSchema,
    estrategiasInnovadoras: CriterioEvaluacionSchema,
    investigacionEducativa: CriterioEvaluacionSchema
  })
})

// Esquema completo del diagnóstico NEM
export const DiagnosticoNEMSchema = z.object({
  datosGenerales: DatosGeneralesDiagnosticoSchema,
  dimensionAprovechamiento: DimensionAprovechamientoSchema.optional(),
  dimensionPracticasDocentes: DimensionPracticasDocentesSchema.optional(),
  // Se pueden agregar más dimensiones según se implementen
})

// Tipos derivados de los esquemas
export type DatosGeneralesDiagnosticoFormData = z.infer<typeof DatosGeneralesDiagnosticoSchema>
export type DimensionAprovechamientoFormData = z.infer<typeof DimensionAprovechamientoSchema>
export type DimensionPracticasDocentesFormData = z.infer<typeof DimensionPracticasDocentesSchema>
export type DimensionFormacionDocenteFormData = z.infer<typeof DimensionFormacionDocenteSchema>

// Valores por defecto para el formulario
export const diagnosticoFormDefaults: Partial<DatosGeneralesDiagnosticoFormData> = {
  cicloEscolar: '2024-2025',
  fechaInicio: new Date(),
  responsable: {
    nombre: '',
    cargo: 'Director(a)',
    email: ''
  },
  participantes: []
}