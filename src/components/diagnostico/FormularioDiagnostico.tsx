import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Save, AlertCircle, CheckCircle, Clock, FileText, Users, Target, Award } from 'lucide-react'
import { DatosGeneralesDiagnosticoSchema, DimensionAprovechamientoSchema, DimensionPracticasDocentesSchema, DimensionFormacionDocenteSchema, type DatosGeneralesDiagnosticoFormData, type DimensionAprovechamientoFormData, type DimensionPracticasDocentesFormData, type DimensionFormacionDocenteFormData } from '../../utils/validations'
import { useDiagnostico, useEscuelas } from '../../stores'
import { EstadoDiagnostico } from '../../types'
import { SubirEvidenciasEconomico } from '../shared'
import EjerciciosIntegradores from './EjerciciosIntegradores'

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
    titulo: 'Aprovechamiento Académico',
    descripcion: 'Rendimiento y asistencia de alumnos',
    icono: Award
  },
  {
    id: 3,
    titulo: 'Prácticas Docentes',
    descripcion: 'Métodos y estrategias de enseñanza',
    icono: Users
  },
  {
    id: 4,
    titulo: 'Formación Docente',
    descripcion: 'Desarrollo profesional del personal',
    icono: Target
  },
  {
    id: 5,
    titulo: 'Revisión Final',
    descripcion: 'Validación y envío del diagnóstico',
    icono: CheckCircle
  }
]

const opcionesValoracion = [
  { value: 4, label: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' },
  { value: 3, label: 'Bueno', color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200' },
  { value: 2, label: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-50 border-yellow-200' },
  { value: 1, label: 'Deficiente', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200' }
]

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
  const [evidenciasPorCriterio, setEvidenciasPorCriterio] = useState<{
    [criterio: string]: Array<{
      id: string
      nombre: string
      tipo: string
      tamaño: number
      url: string
      fechaSubida: Date
    }>
  }>({})
  
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

  const formPracticasDocentes = useForm<DimensionPracticasDocentesFormData>({
    resolver: zodResolver(DimensionPracticasDocentesSchema),
    defaultValues: {
      planeacionDidactica: {
        elaboracionPlanes: { id: 'elaboracion_planes', nombre: 'Elaboración de Planes', descripcion: 'Calidad y pertinencia de los planes de clase elaborados' },
        adecuacionesNEE: { id: 'adecuaciones_nee', nombre: 'Adecuaciones NEE', descripcion: 'Adaptaciones curriculares para estudiantes con necesidades especiales' },
        usoProgramasEstudio: { id: 'uso_programas', nombre: 'Uso de Programas de Estudio', descripcion: 'Aplicación efectiva de los programas educativos oficiales' }
      },
      ambienteAprendizaje: {
        climaAula: { id: 'clima_aula', nombre: 'Clima del Aula', descripcion: 'Ambiente favorable para el aprendizaje en el salón de clases' },
        inclusionDiversidad: { id: 'inclusion_diversidad', nombre: 'Inclusión y Diversidad', descripcion: 'Atención a la diversidad cultural, social y académica' },
        convivenciaPacifica: { id: 'convivencia_pacifica', nombre: 'Convivencia Pacífica', descripcion: 'Promoción de relaciones armoniosas entre estudiantes' }
      },
      evaluacionAprendizaje: {
        instrumentosEvaluacion: { id: 'instrumentos_evaluacion', nombre: 'Instrumentos de Evaluación', descripcion: 'Variedad y pertinencia de las herramientas de evaluación utilizadas' },
        retroalimentacion: { id: 'retroalimentacion', nombre: 'Retroalimentación', descripcion: 'Calidad y frecuencia de la retroalimentación proporcionada a los estudiantes' },
        registroAvances: { id: 'registro_avances', nombre: 'Registro de Avances', descripcion: 'Sistematización del seguimiento del progreso estudiantil' }
      },
      liderazgoDirectivo: {
        gestionPedagogica: { id: 'gestion_pedagogica', nombre: 'Gestión Pedagógica', descripcion: 'Liderazgo académico y orientación pedagógica del equipo directivo' },
        acompanamiento: { id: 'acompanamiento', nombre: 'Acompañamiento Docente', descripcion: 'Apoyo y supervisión al trabajo docente en el aula' },
        toma_decisiones: { id: 'toma_decisiones', nombre: 'Toma de Decisiones', descripcion: 'Proceso de toma de decisiones basado en evidencia educativa' }
      }
    }
  })

  const formFormacionDocente = useForm<DimensionFormacionDocenteFormData>({
    resolver: zodResolver(DimensionFormacionDocenteSchema),
    defaultValues: {
      desarrolloProfesional: {
        participacionCursos: { id: 'participacion_cursos', nombre: 'Participación en Cursos', descripcion: 'Participación en cursos de actualización disciplinar y pedagógica' },
        aplicacionAprendizajes: { id: 'aplicacion_aprendizajes', nombre: 'Aplicación de Aprendizajes', descripcion: 'Aplicación de conocimientos adquiridos en el aula' },
        autoformacion: { id: 'autoformacion', nombre: 'Autoformación', descripcion: 'Procesos de autoformación y desarrollo profesional autónomo' }
      },
      colaboracionProfesional: {
        trabajoEnEquipo: { id: 'trabajo_equipo', nombre: 'Trabajo en Equipo', descripcion: 'Colaboración efectiva en equipos de trabajo pedagógico' },
        intercambioExperiencias: { id: 'intercambio_experiencias', nombre: 'Intercambio de Experiencias', descripcion: 'Participación en espacios de intercambio profesional' },
        mentoriaDocente: { id: 'mentoria_docente', nombre: 'Mentoría Docente', descripcion: 'Participación en programas de mentoría y acompañamiento' }
      },
      innovacionPedagogica: {
        useTecnologias: { id: 'use_tecnologias', nombre: 'Uso de Tecnologías', descripcion: 'Integración de tecnologías educativas en la práctica docente' },
        estrategiasInnovadoras: { id: 'estrategias_innovadoras', nombre: 'Estrategias Innovadoras', descripcion: 'Implementación de estrategias pedagógicas innovadoras' },
        investigacionEducativa: { id: 'investigacion_educativa', nombre: 'Investigación Educativa', descripcion: 'Participación en proyectos de investigación educativa' }
      }
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
        // Validación para Prácticas Docentes
        try {
          const valores = formPracticasDocentes.getValues()
          const tieneAlgunaValoracion = (
            valores.planeacionDidactica?.elaboracionPlanes?.valoracion ||
            valores.planeacionDidactica?.adecuacionesNEE?.valoracion ||
            valores.planeacionDidactica?.usoProgramasEstudio?.valoracion ||
            valores.ambienteAprendizaje?.climaAula?.valoracion ||
            valores.ambienteAprendizaje?.inclusionDiversidad?.valoracion ||
            valores.ambienteAprendizaje?.convivenciaPacifica?.valoracion ||
            valores.evaluacionAprendizaje?.instrumentosEvaluacion?.valoracion ||
            valores.evaluacionAprendizaje?.retroalimentacion?.valoracion ||
            valores.evaluacionAprendizaje?.registroAvances?.valoracion ||
            valores.liderazgoDirectivo?.gestionPedagogica?.valoracion ||
            valores.liderazgoDirectivo?.acompanamiento?.valoracion ||
            valores.liderazgoDirectivo?.toma_decisiones?.valoracion
          )
          
          if (!tieneAlgunaValoracion) {
            alert('Debe seleccionar al menos una valoración antes de continuar')
            esValido = false
          } else {
            const guardadoExitoso = await guardarPracticasDocentes()
            esValido = guardadoExitoso
          }
        } catch (error) {
          console.error('Error en validación paso 3:', error)
          esValido = false
        }
        break
      case 4:
        // Validación para Formación Docente
        try {
          const valores = formFormacionDocente.getValues()
          const tieneAlgunaValoracion = (
            valores.desarrolloProfesional?.participacionCursos?.valoracion ||
            valores.desarrolloProfesional?.aplicacionAprendizajes?.valoracion ||
            valores.desarrolloProfesional?.autoformacion?.valoracion ||
            valores.colaboracionProfesional?.trabajoEnEquipo?.valoracion ||
            valores.colaboracionProfesional?.intercambioExperiencias?.valoracion ||
            valores.colaboracionProfesional?.mentoriaDocente?.valoracion ||
            valores.innovacionPedagogica?.useTecnologias?.valoracion ||
            valores.innovacionPedagogica?.estrategiasInnovadoras?.valoracion ||
            valores.innovacionPedagogica?.investigacionEducativa?.valoracion
          )
          
          if (!tieneAlgunaValoracion) {
            alert('Debe seleccionar al menos una valoración antes de continuar')
            esValido = false
          } else {
            const guardadoExitoso = await guardarFormacionDocente()
            esValido = guardadoExitoso
          }
        } catch (error) {
          console.error('Error en validación paso 4:', error)
          esValido = false
        }
        break
      case 5:
        // Último paso - puede enviar
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

  const guardarPracticasDocentes = async () => {
    if (!diagnosticoActual) {
      console.error('No hay diagnóstico activo')
      return false
    }
    
    const datos = formPracticasDocentes.getValues()
    
    try {
      await actualizarDiagnostico(diagnosticoActual.id, {
        dimensionPracticasDocentes: datos
      })
      console.log('Prácticas docentes guardadas exitosamente')
      return true
    } catch (error) {
      console.error('Error al guardar prácticas docentes:', error)
      alert('Error al guardar la información. Inténtelo de nuevo.')
      return false
    }
  }

  const guardarFormacionDocente = async () => {
    if (!diagnosticoActual) {
      console.error('No hay diagnóstico activo')
      return false
    }
    
    const datos = formFormacionDocente.getValues()
    
    try {
      await actualizarDiagnostico(diagnosticoActual.id, {
        dimensionFormacionDocente: datos
      })
      console.log('Formación docente guardada exitosamente')
      return true
    } catch (error) {
      console.error('Error al guardar formación docente:', error)
      alert('Error al guardar la información. Inténtelo de nuevo.')
      return false
    }
  }

  const renderCriterioEvaluacion = (
    criterio: string,
    nombre: string,
    descripcion: string,
    register: any,
    errors: any,
    watchForm: any,
    setValue: any
  ) => {
    const criterioKey = `${criterio}` as const
    const valoracionActual = watchForm(`${criterio}.valoracion`)
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        {/* Campos ocultos para los datos requeridos */}
        <input type="hidden" {...register(`${criterio}.id`)} value={criterio.split('.').pop() || ''} />
        <input type="hidden" {...register(`${criterio}.nombre`)} value={nombre} />
        <input type="hidden" {...register(`${criterio}.descripcion`)} value={descripcion} />
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{nombre}</h4>
          <p className="text-sm text-gray-600">{descripcion}</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Valoración *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opcionesValoracion.map((opcion) => {
                const isSelected = valoracionActual === opcion.value
                return (
                <div
                  key={opcion.value}
                  className={`relative flex items-center p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                    isSelected
                      ? opcion.bgColor
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    // Usar setValue directamente para asegurar que funcione
                    setValue(`${criterio}.valoracion`, opcion.value)
                  }}
                >
                  <input
                    type="radio"
                    name={`${criterio}_valoracion`}
                    value={opcion.value}
                    checked={isSelected}
                    {...register(`${criterio}.valoracion`, { 
                      valueAsNumber: true,
                      required: 'La valoración es requerida'
                    })}
                    className="sr-only"
                    readOnly
                  />
                  <div className={`w-4 h-4 border-2 rounded-full mr-3 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${
                      isSelected ? opcion.color : 'text-gray-700'
                    }`}>
                      {opcion.label}
                    </span>
                  </div>
                </div>
                )
              })}
            </div>
            {errors[criterio]?.valoracion && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors[criterio].valoracion.message}
              </p>
            )}
          </div>

          {/* Componente de Evidencias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Evidencias
            </label>
            <SubirEvidenciasEconomico
              evidencias={evidenciasPorCriterio[criterioKey] || []}
              onAgregarEvidencia={(archivo: any) => {
                setEvidenciasPorCriterio(prev => ({
                  ...prev,
                  [criterioKey]: [...(prev[criterioKey] || []), archivo]
                }))
              }}
              onEliminarEvidencia={(archivoId: string) => {
                setEvidenciasPorCriterio(prev => ({
                  ...prev,
                  [criterioKey]: prev[criterioKey]?.filter(archivo => archivo.id !== archivoId) || []
                }))
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              {...register(`${criterio}.observaciones`)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Observaciones adicionales sobre este criterio..."
            />
          </div>
        </div>
      </div>
    )
  }

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
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-900 mb-4">Prácticas Docentes</h3>
        <p className="text-green-700">
          Evalúe las metodologías, estrategias de enseñanza y prácticas pedagógicas implementadas en la escuela.
        </p>
      </div>

      <div className="space-y-8">
        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Planeación Didáctica
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'planeacionDidactica.elaboracionPlanes',
            'Elaboración de Planes de Clase',
            'Calidad y pertinencia de los planes de clase elaborados por los docentes',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'planeacionDidactica.adecuacionesNEE',
            'Adecuaciones para NEE',
            'Adaptaciones curriculares para estudiantes con necesidades educativas especiales',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'planeacionDidactica.usoProgramasEstudio',
            'Uso de Programas de Estudio',
            'Aplicación efectiva de los programas educativos oficiales vigentes',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}
        </div>

        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-8">
          Ambiente de Aprendizaje
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'ambienteAprendizaje.climaAula',
            'Clima del Aula',
            'Ambiente favorable para el aprendizaje en el salón de clases',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'ambienteAprendizaje.inclusionDiversidad',
            'Inclusión y Diversidad',
            'Atención a la diversidad cultural, social y académica de los estudiantes',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'ambienteAprendizaje.convivenciaPacifica',
            'Convivencia Pacífica',
            'Promoción de relaciones armoniosas y respetuosas entre estudiantes',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}
        </div>

        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-8">
          Evaluación del Aprendizaje
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'evaluacionAprendizaje.instrumentosEvaluacion',
            'Instrumentos de Evaluación',
            'Variedad y pertinencia de las herramientas de evaluación utilizadas',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'evaluacionAprendizaje.retroalimentacion',
            'Retroalimentación',
            'Calidad y frecuencia de la retroalimentación proporcionada a los estudiantes',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'evaluacionAprendizaje.registroAvances',
            'Registro de Avances',
            'Sistematización del seguimiento del progreso estudiantil',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}
        </div>

        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-8">
          Liderazgo Directivo
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'liderazgoDirectivo.gestionPedagogica',
            'Gestión Pedagógica',
            'Liderazgo académico y orientación pedagógica del equipo directivo',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'liderazgoDirectivo.acompanamiento',
            'Acompañamiento Docente',
            'Apoyo y supervisión al trabajo docente en el aula',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}

          {renderCriterioEvaluacion(
            'liderazgoDirectivo.toma_decisiones',
            'Toma de Decisiones',
            'Proceso de toma de decisiones basado en evidencia educativa',
            formPracticasDocentes.register,
            formPracticasDocentes.formState.errors,
            formPracticasDocentes.watch,
            formPracticasDocentes.setValue
          )}
        </div>
      </div>
    </div>
  )

  const renderPaso4 = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-purple-900 mb-4">Formación Docente</h3>
        <p className="text-purple-700">
          Evalúe los programas de desarrollo profesional y capacitación del personal educativo.
        </p>
      </div>

      <div className="space-y-8">
        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Capacitación Continua
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'capacitacionContinua.cursosActualizacion',
            'Cursos de Actualización Pedagógica',
            'Participación del personal en cursos de actualización pedagógica',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'capacitacionContinua.talleresTecnologia',
            'Talleres de Tecnología Educativa',
            'Capacitación en herramientas y tecnología educativa',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'capacitacionContinua.seminariosGestion',
            'Seminarios de Gestión Escolar',
            'Participación en seminarios de gestión y administración escolar',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}
        </div>

        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-8">
          Programas de Desarrollo
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'programasDesarrollo.especializacionAreas',
            'Especialización en Áreas Temáticas',
            'Especialización del personal en áreas temáticas específicas',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'programasDesarrollo.certificacionesProfesionales',
            'Certificaciones Profesionales',
            'Obtención de certificaciones profesionales relevantes',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'programasDesarrollo.programasPosgrado',
            'Programas de Posgrado',
            'Participación en programas de maestría o doctorado',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}
        </div>

        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-8">
          Colaboración Profesional
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'colaboracionProfesional.comunidadesAprendizaje',
            'Comunidades de Aprendizaje',
            'Participación en comunidades de aprendizaje profesional',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'colaboracionProfesional.intercambioExperiencias',
            'Intercambio de Experiencias',
            'Intercambio de experiencias educativas entre docentes',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'colaboracionProfesional.mentoriasDocentes',
            'Mentorías entre Docentes',
            'Programas de mentoría y acompañamiento entre docentes',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}
        </div>

        <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mt-8">
          Evaluación del Desempeño
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCriterioEvaluacion(
            'evaluacionDesempeno.observacionesClase',
            'Observaciones de Clase',
            'Observaciones estructuradas del desempeño en el aula',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'evaluacionDesempeno.planesMejora',
            'Planes de Mejora Individual',
            'Elaboración y seguimiento de planes de mejora individual',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}

          {renderCriterioEvaluacion(
            'evaluacionDesempeno.retroalimentacionEstructurada',
            'Retroalimentación Estructurada',
            'Retroalimentación estructurada sobre el desempeño docente',
            formFormacionDocente.register,
            formFormacionDocente.formState.errors,
            formFormacionDocente.watch,
            formFormacionDocente.setValue
          )}
        </div>
      </div>
    </div>
  )

  const renderPaso5 = () => {
    const obtenerResumen = () => {
      const datosGenerales = formDatosGenerales.getValues()
      const aprovechamiento = formAprovechamiento.getValues()
      const practicasDocentes = formPracticasDocentes.getValues()
      
      const contarValoraciones = (dimension: any) => {
        let total = 0
        let completadas = 0
        
        const recorrer = (obj: any) => {
          for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
              if (obj[key].valoracion) {
                total++
                if (obj[key].valoracion > 0) completadas++
              } else {
                recorrer(obj[key])
              }
            }
          }
        }
        recorrer(dimension)
        return { total, completadas }
      }
      
      const resumenAprovechamiento = contarValoraciones(aprovechamiento)
      const resumenPracticas = contarValoraciones(practicasDocentes)
      const formacionDocente = formFormacionDocente.getValues()
      const resumenFormacion = contarValoraciones(formacionDocente)
      
      return {
        datosGenerales,
        resumenAprovechamiento,
        resumenPracticas,
        resumenFormacion,
        totalCriterios: resumenAprovechamiento.total + resumenPracticas.total + resumenFormacion.total,
        totalCompletados: resumenAprovechamiento.completadas + resumenPracticas.completadas + resumenFormacion.completadas
      }
    }
    
    const resumen = obtenerResumen()
    const porcentajeCompletado = resumen.totalCriterios > 0 
      ? Math.round((resumen.totalCompletados / resumen.totalCriterios) * 100)
      : 0
    
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Revisión Final del Diagnóstico</h3>
          <p className="text-blue-700">
            Revise toda la información capturada antes de enviar el diagnóstico para su validación.
          </p>
        </div>

        {/* Resumen de completitud */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Progreso del Diagnóstico</h4>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Criterios evaluados</span>
              <span>{resumen.totalCompletados} de {resumen.totalCriterios}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${porcentajeCompletado}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">{porcentajeCompletado}% completado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">🏆 Aprovechamiento Académico</h5>
              <p className="text-sm text-gray-600">
                {resumen.resumenAprovechamiento.completadas} de {resumen.resumenAprovechamiento.total} criterios evaluados
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div 
                  className="bg-green-500 h-1 rounded-full" 
                  style={{ width: `${resumen.resumenAprovechamiento.total > 0 ? (resumen.resumenAprovechamiento.completadas / resumen.resumenAprovechamiento.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">👥 Prácticas Docentes</h5>
              <p className="text-sm text-gray-600">
                {resumen.resumenPracticas.completadas} de {resumen.resumenPracticas.total} criterios evaluados
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div 
                  className="bg-purple-500 h-1 rounded-full" 
                  style={{ width: `${resumen.resumenPracticas.total > 0 ? (resumen.resumenPracticas.completadas / resumen.resumenPracticas.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-3">📚 Formación Docente</h5>
              <p className="text-sm text-gray-600">
                {resumen.resumenFormacion.completadas} de {resumen.resumenFormacion.total} criterios evaluados
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div 
                  className="bg-blue-500 h-1 rounded-full" 
                  style={{ width: `${resumen.resumenFormacion.total > 0 ? (resumen.resumenFormacion.completadas / resumen.resumenFormacion.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Datos de la escuela */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Información de la Escuela</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Escuela:</span>
              <p className="text-gray-900">{resumen.datosGenerales.nombreEscuela || 'No especificada'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">CCT:</span>
              <p className="text-gray-900">{resumen.datosGenerales.cct || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Ciclo Escolar:</span>
              <p className="text-gray-900">{resumen.datosGenerales.cicloEscolar || 'No especificado'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Responsable:</span>
              <p className="text-gray-900">{resumen.datosGenerales.responsable?.nombre || 'No especificado'}</p>
            </div>
          </div>
        </div>

        {/* Advertencias y validaciones */}
        {porcentajeCompletado < 50 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Diagnóstico incompleto:</strong> Se recomienda evaluar al menos el 50% de los criterios antes de enviar.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              type="button"
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              onClick={async () => {
                try {
                  if (!diagnosticoActual) {
                    alert('Error: No hay diagnóstico activo')
                    return
                  }
                  
                  // Guardar todos los datos
                  const datosGenerales = formDatosGenerales.getValues()
                  const aprovechamiento = formAprovechamiento.getValues() 
                  const practicasDocentes = formPracticasDocentes.getValues()
                  const formacionDocente = formFormacionDocente.getValues()
                  
                  await actualizarDiagnostico(diagnosticoActual.id, {
                    datosGenerales,
                    dimensionAprovechamiento: aprovechamiento,
                    dimensionPracticasDocentes: practicasDocentes,
                    dimensionFormacionDocente: formacionDocente,
                    estado: EstadoDiagnostico.BORRADOR
                  })
                  
                  // Si llegamos aquí, el guardado fue exitoso
                  alert('✓ Borrador guardado correctamente')
                } catch (error) {
                  console.error('Error al guardar borrador:', error)
                  alert('⚠️ Error al guardar el borrador. Verifique su conexión e inténtelo de nuevo.')
                }
              }}
            >
              💾 Guardar como Borrador
            </button>
            
            <button 
              type="button"
              className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                porcentajeCompletado >= 30
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={porcentajeCompletado < 30}
              onClick={async () => {
                if (porcentajeCompletado >= 30) {
                  try {
                    if (!diagnosticoActual) {
                      alert('Error: No hay diagnóstico activo')
                      return
                    }
                    
                    // Guardar antes de enviar
                    const datosCompletos = {
                      datosGenerales: formDatosGenerales.getValues(),
                      dimensionAprovechamiento: formAprovechamiento.getValues(),
                      dimensionPracticasDocentes: formPracticasDocentes.getValues(),
                      dimensionFormacionDocente: formFormacionDocente.getValues(),
                      estado: EstadoDiagnostico.COMPLETADO
                    }
                    
                    await actualizarDiagnostico(diagnosticoActual.id, datosCompletos)
                    alert(`✓ Diagnóstico enviado para validación (${porcentajeCompletado}% completado)`)
                  } catch (error) {
                    console.error('Error al enviar diagnóstico:', error)
                    alert('⚠️ Error al enviar el diagnóstico. Inténtelo de nuevo.')
                  }
                }
              }}
            >
              🚀 Enviar para Validación
            </button>
          </div>
          
          {porcentajeCompletado < 30 && (
            <p className="text-xs text-center text-gray-500">
              Necesitas completar al menos 30% del diagnóstico para enviarlo.
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