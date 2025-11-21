import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Save, AlertCircle, CheckCircle, Clock, FileText, Award, Home, Heart, School, BookOpen, GraduationCap } from 'lucide-react'
import { DatosGeneralesDiagnosticoSchema, DimensionAprovechamientoSchema, FormularioRespuestasSchema, type DatosGeneralesDiagnosticoFormData, type DimensionAprovechamientoFormData, type FormularioRespuestasFormData } from '../../utils/validations'
import { useDiagnostico, useEscuelas } from '../../stores'
import { EstadoDiagnostico, FormularioTipo } from '../../types'
// import { SubirEvidenciasEconomico } from '../shared' // LEGACY: Ya no se usa
import EjerciciosIntegradores from './EjerciciosIntegradores'
import FormularioInstrumento from './FormularioInstrumento'
import { getFormularioConfig } from '../../config/formularios'

interface FormularioDiagnosticoProps {
  diagnosticoId?: string
  onCancelar?: () => void
}

const pasos = [
  {
    id: 1,
    titulo: 'Datos Generales',
    descripcion: 'Información básica del diagnóstico',
    icono: FileText
  },
  {
    id: 2,
    titulo: 'Indicadores Académicos',
    descripcion: 'Rendimiento, asistencia y EIA',
    icono: Award
  },
  {
    id: 3,
    titulo: 'Ambiente Familiar',
    descripcion: 'Apoyo familiar al aprendizaje',
    icono: Home
  },
  {
    id: 4,
    titulo: 'Desarrollo Integral',
    descripcion: 'Bienestar y motivación estudiantil',
    icono: Heart
  },
  {
    id: 5,
    titulo: 'Ambiente de Aprendizaje',
    descripcion: 'Clima escolar y convivencia',
    icono: School
  },
  {
    id: 6,
    titulo: 'Prácticas Docentes',
    descripcion: 'Métodos y estrategias de enseñanza',
    icono: BookOpen
  },
  {
    id: 7,
    titulo: 'Formación Docente',
    descripcion: 'Desarrollo profesional continuo',
    icono: GraduationCap
  },
  {
    id: 8,
    titulo: 'Revisión Final',
    descripcion: 'Validación y envío del diagnóstico',
    icono: CheckCircle
  }
]

// LEGACY: Opciones de valoración anteriores (ya no se usan)
// const opcionesValoracion = [
//   { value: 4, label: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
//   { value: 3, label: 'Bueno', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
//   { value: 2, label: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' },
//   { value: 1, label: 'Deficiente', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' }
// ]

// Componente para agregar participantes
const ParticipantesInput = ({ value, onChange }: { value: string[], onChange: (value: string[]) => void }) => {
  const [nuevoParticipante, setNuevoParticipante] = useState('')

  const agregarParticipante = () => {
    if (nuevoParticipante.trim() && !value.includes(nuevoParticipante.trim())) {
      onChange([...value, nuevoParticipante.trim()])
      setNuevoParticipante('')
    }
  }

  const eliminarParticipante = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={nuevoParticipante}
          onChange={(e) => setNuevoParticipante(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), agregarParticipante())}
          placeholder="Nombre del participante..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={agregarParticipante}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Agregar
        </button>
      </div>
      
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Participantes agregados:</p>
          <div className="space-y-1">
            {value.map((participante, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-900">{participante}</span>
                <button
                  type="button"
                  onClick={() => eliminarParticipante(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FormularioDiagnostico({ diagnosticoId, onCancelar }: FormularioDiagnosticoProps) {
  const [pasoActual, setPasoActual] = useState(1)
  const [autoGuardado, setAutoGuardado] = useState<Date | null>(null)
  
  // Estado para evidencias por criterio
  // LEGACY: Estado de evidencias anterior (ya no se usa)
  // const [evidenciasPorCriterio, setEvidenciasPorCriterio] = useState<{
  //   [criterio: string]: Array<{
  //     id: string
  //     nombre: string
  //     tipo: string
  //     tamaño: number
  //     url: string
  //     fechaSubida: Date
  //   }>
  // }>({})
  
  // Stores
  const { 
    diagnosticoActual, 
    crearDiagnostico, 
    actualizarDiagnostico, 
    seleccionarDiagnostico,
    autoGuardar
  } = useDiagnostico()
  const { escuelas } = useEscuelas()

  // Formularios para cada paso
  const formDatosGenerales = useForm<DatosGeneralesDiagnosticoFormData>({
    resolver: zodResolver(DatosGeneralesDiagnosticoSchema),
    defaultValues: {
      cicloEscolar: '2024-2025',
      fechaInicio: new Date(),
      responsable: {
        cargo: 'Director(a)',
        nombre: '',
        email: ''
      },
      participantes: ['Director(a) de la escuela'] // Valor por defecto
    }
  })

  const formAprovechamiento = useForm<DimensionAprovechamientoFormData>({
    resolver: zodResolver(DimensionAprovechamientoSchema),
    defaultValues: {
      indicadoresAcademicos: {
        // Valores numéricos por defecto
        promedioGeneral1ro: 0,
        promedioGeneral2do: 0,
        promedioGeneral3ro: 0,
        eficienciaTerminal: 0,
        indiceReprobacion: 0,
        indiceDesercion: 0
      },
      asistenciaAlumnos: {
        promedioAsistencia: 0,
        controlAusentismo: ''
      },
      ejerciciosIntegradores: {
        documentoPDF: '',
        areas: {
          manejoInformacion: {
            noEvidencia: 0,
            requiereApoyo: 0,
            enProceso: 0,
            alcanzado: 0
          },
          discriminacionInformacion: {
            noEvidencia: 0,
            requiereApoyo: 0,
            enProceso: 0,
            alcanzado: 0
          },
          calculoMental: {
            noEvidencia: 0,
            requiereApoyo: 0,
            enProceso: 0,
            alcanzado: 0
          }
        }
      }
    }
  })

  // Formularios de Google Forms (pasos 3-7)
  const formAmbienteFamiliar = useForm<FormularioRespuestasFormData>({
    resolver: zodResolver(FormularioRespuestasSchema),
    defaultValues: {
      formularioTipo: FormularioTipo.AMBIENTE_FAMILIAR,
      respuestas: {},
      porcentajeCompletitud: 0
    }
  })

  const formDesarrolloIntegral = useForm<FormularioRespuestasFormData>({
    resolver: zodResolver(FormularioRespuestasSchema),
    defaultValues: {
      formularioTipo: FormularioTipo.DESARROLLO_INTEGRAL,
      respuestas: {},
      porcentajeCompletitud: 0
    }
  })

  const formAmbienteAprendizaje = useForm<FormularioRespuestasFormData>({
    resolver: zodResolver(FormularioRespuestasSchema),
    defaultValues: {
      formularioTipo: FormularioTipo.AMBIENTE_APRENDIZAJE,
      respuestas: {},
      porcentajeCompletitud: 0
    }
  })

  const formPracticasDocentes = useForm<FormularioRespuestasFormData>({
    resolver: zodResolver(FormularioRespuestasSchema),
    defaultValues: {
      formularioTipo: FormularioTipo.PRACTICAS_DOCENTES,
      respuestas: {},
      porcentajeCompletitud: 0
    }
  })

  const formFormacionDocente = useForm<FormularioRespuestasFormData>({
    resolver: zodResolver(FormularioRespuestasSchema),
    defaultValues: {
      formularioTipo: FormularioTipo.FORMACION_DOCENTE,
      respuestas: {},
      porcentajeCompletitud: 0
    }
  })

  // Efectos
  useEffect(() => {
    if (diagnosticoId) {
      seleccionarDiagnostico(diagnosticoId)
    }
  }, [diagnosticoId, seleccionarDiagnostico])

  useEffect(() => {
    if (diagnosticoActual) {
      // Cargar datos en los formularios
      if (diagnosticoActual.datosGenerales) {
        formDatosGenerales.reset(diagnosticoActual.datosGenerales)
      }
      if (diagnosticoActual.dimensionAprovechamiento) {
        formAprovechamiento.reset(diagnosticoActual.dimensionAprovechamiento)
      }
    }
  }, [diagnosticoActual, formDatosGenerales, formAprovechamiento])

  // Auto-guardado cada 30 segundos
  useEffect(() => {
    if (!diagnosticoActual) return

    const interval = setInterval(async () => {
      try {
        await autoGuardar(diagnosticoActual.id)
        setAutoGuardado(new Date())
      } catch (error) {
        console.error('Error en auto-guardado:', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [diagnosticoActual, autoGuardar])

  const handleSiguientePaso = async () => {
    let esValido = true
    
    // Validar paso actual
    switch (pasoActual) {
      case 1:
        esValido = await formDatosGenerales.trigger()
        if (esValido) {
          await guardarDatosGenerales()
        }
        break
      case 2:
        // Validar que los datos académicos básicos estén capturados
        try {
          const valores = formAprovechamiento.getValues()
          const tieneDatosBasicos = (
            (valores.indicadoresAcademicos?.promedioGeneral1ro && valores.indicadoresAcademicos.promedioGeneral1ro > 0) ||
            (valores.indicadoresAcademicos?.promedioGeneral2do && valores.indicadoresAcademicos.promedioGeneral2do > 0) ||
            (valores.indicadoresAcademicos?.promedioGeneral3ro && valores.indicadoresAcademicos.promedioGeneral3ro > 0) ||
            (valores.indicadoresAcademicos?.eficienciaTerminal && valores.indicadoresAcademicos.eficienciaTerminal > 0) ||
            (valores.asistenciaAlumnos?.promedioAsistencia && valores.asistenciaAlumnos.promedioAsistencia > 0)
          )

          if (!tieneDatosBasicos) {
            alert('Debe capturar al menos algunos indicadores académicos antes de continuar')
            esValido = false
          } else {
            const guardadoExitoso = await guardarAprovechamiento()
            esValido = guardadoExitoso
          }
        } catch (error) {
          console.error('Error en validación paso 2:', error)
          esValido = false
        }
        break
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // Formularios de Google Forms - validación opcional (permiten continuar aunque estén vacíos)
        esValido = true
        break
      case 8:
        // Último paso - Revisión final
        esValido = true
        break
    }
    
    if (esValido && pasoActual < pasos.length) {
      setPasoActual(pasoActual + 1)
    }
  }

  const handlePasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1)
    }
  }

  const guardarDatosGenerales = async () => {
    const datos = formDatosGenerales.getValues()
    
    try {
      if (!diagnosticoActual) {
        // Crear nuevo diagnóstico
        await crearDiagnostico({
          datosGenerales: datos,
          estado: EstadoDiagnostico.EN_CAPTURA
        })
      } else {
        // Actualizar diagnóstico existente
        await actualizarDiagnostico(diagnosticoActual.id, {
          datosGenerales: datos
        })
      }
    } catch (error) {
      console.error('Error al guardar datos generales:', error)
    }
  }

  const guardarAprovechamiento = async () => {
    if (!diagnosticoActual) {
      console.error('No hay diagnóstico activo')
      return false
    }
    
    const datos = formAprovechamiento.getValues()
    
    try {
      await actualizarDiagnostico(diagnosticoActual.id, {
        dimensionAprovechamiento: datos
      })
      console.log('Aprovechamiento guardado exitosamente')
      return true
    } catch (error) {
      console.error('Error al guardar aprovechamiento:', error)
      alert('Error al guardar la información. Inténtelo de nuevo.')
      return false
    }
  }

  // LEGACY: Función de guardado anterior (ahora se usa FormularioInstrumento)
  // const guardarPracticasDocentes = async () => {
  //   if (!diagnosticoActual) {
  //     console.error('No hay diagnóstico activo')
  //     return false
  //   }
  //   
  //   const datos = formPracticasDocentes.getValues()
  //   
  //   try {
  //     await actualizarDiagnostico(diagnosticoActual.id, {
  //       dimensionPracticasDocentes: datos
  //     })
  //     console.log('Prácticas docentes guardadas exitosamente')
  //     return true
  //   } catch (error) {
  //     console.error('Error al guardar prácticas docentes:', error)
  //     alert('Error al guardar la información. Inténtelo de nuevo.')
  //     return false
  //   }
  // }

  // LEGACY: Función de guardado anterior (ahora se usa FormularioInstrumento)
  // const guardarFormacionDocente = async () => {
  //   if (!diagnosticoActual) {
  //     console.error('No hay diagnóstico activo')
  //     return false
  //   }
  //   
  //   const datos = formFormacionDocente.getValues()
  //   
  //   try {
  //     await actualizarDiagnostico(diagnosticoActual.id, {
  //       dimensionFormacionDocente: datos
  //     })
  //     console.log('Formación docente guardada exitosamente')
  //     return true
  //   } catch (error) {
  //     console.error('Error al guardar formación docente:', error)
  //     alert('Error al guardar la información. Inténtelo de nuevo.')
  //     return false
  //   }
  // }

  // LEGACY: Función de render anterior (ahora se usa FormularioInstrumento)
  // Esta función ya no se usa pero se mantiene comentada por referencia
  // const renderCriterioEvaluacion = (...) => { ... }

  const renderPaso1 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Datos Generales del Diagnóstico</h3>
        <p className="text-blue-700">
          Proporciona la información básica para iniciar el diagnóstico educativo de tu escuela.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Escuela *
          </label>
          <select
            {...formDatosGenerales.register('escuelaId')}
            onChange={(e) => {
              const escuelaSeleccionada = escuelas.find(esc => esc.id === e.target.value)
              if (escuelaSeleccionada) {
                formDatosGenerales.setValue('nombreEscuela', escuelaSeleccionada.nombre)
                formDatosGenerales.setValue('cct', escuelaSeleccionada.cct)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccionar escuela...</option>
            {escuelas.map((escuela) => (
              <option key={escuela.id} value={escuela.id}>
                {escuela.nombre} - {escuela.cct}
              </option>
            ))}
          </select>
          <input type="hidden" {...formDatosGenerales.register('nombreEscuela')} />
          <input type="hidden" {...formDatosGenerales.register('cct')} />
          {formDatosGenerales.formState.errors.escuelaId && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {formDatosGenerales.formState.errors.escuelaId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciclo Escolar *
          </label>
          <input
            type="text"
            {...formDatosGenerales.register('cicloEscolar')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="2024-2025"
          />
          {formDatosGenerales.formState.errors.cicloEscolar && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {formDatosGenerales.formState.errors.cicloEscolar.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio *
          </label>
          <input
            type="date"
            {...formDatosGenerales.register('fechaInicio', { valueAsDate: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formDatosGenerales.formState.errors.fechaInicio && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {formDatosGenerales.formState.errors.fechaInicio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable - Nombre *
          </label>
          <input
            type="text"
            {...formDatosGenerales.register('responsable.nombre')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre completo del director"
          />
          {formDatosGenerales.formState.errors.responsable?.nombre && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {formDatosGenerales.formState.errors.responsable.nombre.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cargo *
          </label>
          <input
            type="text"
            {...formDatosGenerales.register('responsable.cargo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formDatosGenerales.formState.errors.responsable?.cargo && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {formDatosGenerales.formState.errors.responsable.cargo.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            {...formDatosGenerales.register('responsable.email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="correo@escuela.edu.mx"
          />
          {formDatosGenerales.formState.errors.responsable?.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={16} className="mr-1" />
              {formDatosGenerales.formState.errors.responsable.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Campo de participantes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Participantes en el Diagnóstico *
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Agrega los nombres de las personas que participarán en la elaboración del diagnóstico (docentes, administrativos, etc.)
        </p>
        <ParticipantesInput 
          value={formDatosGenerales.watch('participantes') || []}
          onChange={(participantes) => formDatosGenerales.setValue('participantes', participantes)}
        />
        {formDatosGenerales.formState.errors.participantes && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            {formDatosGenerales.formState.errors.participantes.message}
          </p>
        )}
      </div>
    </div>
  )

  const renderPaso2 = () => (
    <div className="space-y-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-900 mb-4">
          Aprovechamiento Académico y Asistencia
        </h3>
        <p className="text-green-700">
          Ingrese los datos numéricos del rendimiento académico y asistencia de los estudiantes.
        </p>
      </div>

      {/* PROMEDIOS GENERALES POR GRADO */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Promedios Generales por Grado
        </h4>
        <p className="text-sm text-gray-600">Ingrese los promedios en escala 0.0 - 10.0</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promedio 1° Grado *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              {...formAprovechamiento.register('indicadoresAcademicos.promedioGeneral1ro', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
            />
            {formAprovechamiento.formState.errors.indicadoresAcademicos?.promedioGeneral1ro && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.indicadoresAcademicos.promedioGeneral1ro.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promedio 2° Grado *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              {...formAprovechamiento.register('indicadoresAcademicos.promedioGeneral2do', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
            />
            {formAprovechamiento.formState.errors.indicadoresAcademicos?.promedioGeneral2do && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.indicadoresAcademicos.promedioGeneral2do.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promedio 3° Grado *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              {...formAprovechamiento.register('indicadoresAcademicos.promedioGeneral3ro', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.0"
            />
            {formAprovechamiento.formState.errors.indicadoresAcademicos?.promedioGeneral3ro && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.indicadoresAcademicos.promedioGeneral3ro.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* INDICADORES PORCENTUALES */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Indicadores Académicos (Porcentajes)
        </h4>
        <p className="text-sm text-gray-600">Ingrese los porcentajes en escala 0 - 100</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Eficiencia Terminal (%) *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Porcentaje de estudiantes que completan exitosamente el nivel educativo
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...formAprovechamiento.register('indicadoresAcademicos.eficienciaTerminal', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {formAprovechamiento.formState.errors.indicadoresAcademicos?.eficienciaTerminal && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.indicadoresAcademicos.eficienciaTerminal.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Índice de Reprobación (%) *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Porcentaje de estudiantes que no aprueban las materias
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...formAprovechamiento.register('indicadoresAcademicos.indiceReprobacion', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {formAprovechamiento.formState.errors.indicadoresAcademicos?.indiceReprobacion && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.indicadoresAcademicos.indiceReprobacion.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Índice de Deserción (%) *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Porcentaje de estudiantes que abandonan sus estudios
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...formAprovechamiento.register('indicadoresAcademicos.indiceDesercion', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {formAprovechamiento.formState.errors.indicadoresAcademicos?.indiceDesercion && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.indicadoresAcademicos.indiceDesercion.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ASISTENCIA */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Asistencia de Estudiantes
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promedio de Asistencia (%) *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Porcentaje promedio de asistencia de los estudiantes a clases
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...formAprovechamiento.register('asistenciaAlumnos.promedioAsistencia', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            {formAprovechamiento.formState.errors.asistenciaAlumnos?.promedioAsistencia && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.asistenciaAlumnos.promedioAsistencia.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Control de Ausentismo *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Describa las medidas implementadas para controlar y reducir el ausentismo
            </p>
            <textarea
              {...formAprovechamiento.register('asistenciaAlumnos.controlAusentismo')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Llamadas telefónicas a padres, visitas domiciliarias, seguimiento semanal..."
            />
            {formAprovechamiento.formState.errors.asistenciaAlumnos?.controlAusentismo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {formAprovechamiento.formState.errors.asistenciaAlumnos.controlAusentismo.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* EJERCICIOS INTEGRADORES DE APRENDIZAJE */}
      <EjerciciosIntegradores
        register={formAprovechamiento.register}
        errors={formAprovechamiento.formState.errors}
        setValue={formAprovechamiento.setValue}
        watch={formAprovechamiento.watch}
      />
    </div>
  )

  const renderPaso3 = () => (
    <div className="space-y-6">
      <FormularioInstrumento
        config={getFormularioConfig(FormularioTipo.AMBIENTE_FAMILIAR)}
        register={formAmbienteFamiliar.register}
        errors={formAmbienteFamiliar.formState.errors}
        setValue={formAmbienteFamiliar.setValue}
        watch={formAmbienteFamiliar.watch}
      />
    </div>
  )

  const renderPaso4 = () => (
    <div className="space-y-6">
      <FormularioInstrumento
        config={getFormularioConfig(FormularioTipo.DESARROLLO_INTEGRAL)}
        register={formDesarrolloIntegral.register}
        errors={formDesarrolloIntegral.formState.errors}
        setValue={formDesarrolloIntegral.setValue}
        watch={formDesarrolloIntegral.watch}
      />
    </div>
  )

  const renderPaso5 = () => (
    <div className="space-y-6">
      <FormularioInstrumento
        config={getFormularioConfig(FormularioTipo.AMBIENTE_APRENDIZAJE)}
        register={formAmbienteAprendizaje.register}
        errors={formAmbienteAprendizaje.formState.errors}
        setValue={formAmbienteAprendizaje.setValue}
        watch={formAmbienteAprendizaje.watch}
      />
    </div>
  )

  const renderPaso6 = () => (
    <div className="space-y-6">
      <FormularioInstrumento
        config={getFormularioConfig(FormularioTipo.PRACTICAS_DOCENTES)}
        register={formPracticasDocentes.register}
        errors={formPracticasDocentes.formState.errors}
        setValue={formPracticasDocentes.setValue}
        watch={formPracticasDocentes.watch}
      />
    </div>
  )

  const renderPaso7 = () => (
    <div className="space-y-6">
      <FormularioInstrumento
        config={getFormularioConfig(FormularioTipo.FORMACION_DOCENTE)}
        register={formFormacionDocente.register}
        errors={formFormacionDocente.formState.errors}
        setValue={formFormacionDocente.setValue}
        watch={formFormacionDocente.watch}
      />
    </div>
  )

  const renderPaso8 = () => {
    const obtenerProgreso = () => {
      const formularios = [
        { nombre: 'Ambiente Familiar', form: formAmbienteFamiliar },
        { nombre: 'Desarrollo Integral', form: formDesarrolloIntegral },
        { nombre: 'Ambiente Aprendizaje', form: formAmbienteAprendizaje },
        { nombre: 'Prácticas Docentes', form: formPracticasDocentes },
        { nombre: 'Formación Docente', form: formFormacionDocente }
      ]

      return formularios.map(({ nombre, form }) => {
        const valores = form.getValues()
        const respuestas = valores.respuestas || {}
        const totalPreguntas = Object.keys(respuestas).length
        const respondidas = Object.values(respuestas).filter((r: any) =>
          r.respuestaNumerica !== undefined || r.respuestaTexto
        ).length
        const porcentaje = totalPreguntas > 0 ? Math.round((respondidas / totalPreguntas) * 100) : 0

        return { nombre, total: totalPreguntas, respondidas, porcentaje }
      })
    }

    const progresos = obtenerProgreso()
    const datosGenerales = formDatosGenerales.getValues()
    const aprovechamiento = formAprovechamiento.getValues()

    const promedioTotal = progresos.reduce((sum, p) => sum + p.porcentaje, 0) / progresos.length
    const porcentajeCompletado = Math.round(promedioTotal)

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Revisión Final del Diagnóstico</h3>
          <p className="text-blue-700">
            Revise el progreso de cada sección antes de enviar el diagnóstico.
          </p>
        </div>

        {/* Progreso global */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Progreso Global</h4>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Completitud Total</span>
              <span className="text-sm font-bold text-blue-600">{porcentajeCompletado}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${porcentajeCompletado}%` }}
              ></div>
            </div>
          </div>

          {/* Desglose por formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {progresos.map((progreso, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">{progreso.nombre}</h5>
                <p className="text-sm text-gray-600 mb-2">
                  {progreso.respondidas} de {progreso.total} preguntas
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${progreso.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Datos de la escuela */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la Escuela</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Escuela:</span>
              <p className="text-gray-900">{datosGenerales.nombreEscuela || 'No especificada'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">CCT:</span>
              <p className="text-gray-900">{datosGenerales.cct || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Ciclo Escolar:</span>
              <p className="text-gray-900">{datosGenerales.cicloEscolar || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Responsable:</span>
              <p className="text-gray-900">{datosGenerales.responsable?.nombre || 'No especificado'}</p>
            </div>
          </div>
        </div>

        {/* Advertencias */}
        {porcentajeCompletado < 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Nota:</strong> Se recomienda completar al menos el 80% de las preguntas para un diagnóstico completo.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={async () => {
                try {
                  if (!diagnosticoActual) {
                    alert('Error: No hay diagnóstico activo')
                    return
                  }

                  await actualizarDiagnostico(diagnosticoActual.id, {
                    datosGenerales,
                    dimensionAprovechamiento: aprovechamiento,
                    estado: EstadoDiagnostico.BORRADOR
                  })

                  alert('✓ Borrador guardado correctamente')
                } catch (error) {
                  console.error('Error al guardar borrador:', error)
                  alert('⚠️ Error al guardar el borrador')
                }
              }}
            >
              💾 Guardar como Borrador
            </button>

            <button
              type="button"
              className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                porcentajeCompletado >= 50
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={porcentajeCompletado < 50}
              onClick={async () => {
                if (porcentajeCompletado >= 50) {
                  try {
                    if (!diagnosticoActual) {
                      alert('Error: No hay diagnóstico activo')
                      return
                    }

                    await actualizarDiagnostico(diagnosticoActual.id, {
                      datosGenerales,
                      dimensionAprovechamiento: aprovechamiento,
                      estado: EstadoDiagnostico.COMPLETADO
                    })

                    alert(`✓ Diagnóstico enviado (${porcentajeCompletado}% completado)`)
                  } catch (error) {
                    console.error('Error al enviar diagnóstico:', error)
                    alert('⚠️ Error al enviar el diagnóstico')
                  }
                }
              }}
            >
              🚀 Enviar Diagnóstico
            </button>
          </div>

          {porcentajeCompletado < 50 && (
            <p className="text-xs text-center text-gray-500">
              Completa al menos el 50% del diagnóstico para enviarlo
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {diagnosticoId ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico Educativo'}
          </h1>
          <p className="text-gray-600 mt-2">
            Diagnóstico basado en las 5 dimensiones de la Nueva Escuela Mexicana (NEM)
          </p>
        </div>
        
        {autoGuardado && (
          <div className="flex items-center text-sm text-green-600">
            <Clock size={16} className="mr-1" />
            Auto-guardado: {autoGuardado.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          {pasos.map((paso) => {
            const Icono = paso.icono
            const esActual = paso.id === pasoActual
            const esCompletado = paso.id < pasoActual
            
            return (
              <div
                key={paso.id}
                className={`flex items-center ${paso.id !== pasos.length ? 'flex-1' : ''}`}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    esActual
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : esCompletado
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <Icono size={20} />
                </div>
                
                <div className="ml-3 min-w-0">
                  <p className={`text-sm font-medium ${
                    esActual || esCompletado ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {paso.titulo}
                  </p>
                  <p className={`text-xs ${
                    esActual || esCompletado ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {paso.descripcion}
                  </p>
                </div>
                
                {paso.id !== pasos.length && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    paso.id < pasoActual ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {pasoActual === 1 && renderPaso1()}
        {pasoActual === 2 && renderPaso2()}
        {pasoActual === 3 && renderPaso3()}
        {pasoActual === 4 && renderPaso4()}
        {pasoActual === 5 && renderPaso5()}
        {pasoActual === 6 && renderPaso6()}
        {pasoActual === 7 && renderPaso7()}
        {pasoActual === 8 && renderPaso8()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handlePasoAnterior}
          disabled={pasoActual === 1}
          className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} className="mr-2" />
          Anterior
        </button>

        <div className="flex space-x-3">
          {onCancelar && (
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          
          <button
            type="button"
            onClick={handleSiguientePaso}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {pasoActual === pasos.length ? (
              <>
                <Save size={20} className="mr-2" />
                Finalizar Diagnóstico
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}