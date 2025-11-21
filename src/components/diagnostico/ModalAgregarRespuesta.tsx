/**
 * ➕ MODAL AGREGAR/EDITAR RESPUESTA
 *
 * Modal para capturar una nueva respuesta o editar una existente
 *
 * Características:
 * - Formulario para información del respondente
 * - Integración con formularios de instrumentos
 * - Validación de datos
 * - Guardado en BD mediante store
 */

import { useState, useEffect } from 'react'
import { X, User, Save } from 'lucide-react'
import { useRespuestasInstrumentos } from '../../stores'
import { FormularioTipo, RolRespondente, RespuestaInstrumento, DatosRespondente } from '../../types'

interface ModalAgregarRespuestaProps {
  diagnosticoId: string
  formularioTipo: FormularioTipo
  respuestaId?: string // Si está presente, es modo edición
  onCerrar: () => void
  onGuardado: () => void
}

const getTituloInstrumento = (tipo: FormularioTipo): string => {
  const titulos = {
    [FormularioTipo.AMBIENTE_FAMILIAR]: 'Ambiente Familiar',
    [FormularioTipo.DESARROLLO_INTEGRAL]: 'Desarrollo Integral',
    [FormularioTipo.PRACTICAS_DOCENTES]: 'Prácticas Docentes',
    [FormularioTipo.FORMACION_DOCENTE]: 'Formación Docente',
    [FormularioTipo.AMBIENTE_APRENDIZAJE]: 'Ambiente de Aprendizaje'
  }
  return titulos[tipo] || tipo
}

const getRolesDisponibles = (tipo: FormularioTipo): RolRespondente[] => {
  switch (tipo) {
    case FormularioTipo.AMBIENTE_FAMILIAR:
      return [RolRespondente.PADRE, RolRespondente.MADRE, RolRespondente.TUTOR]

    case FormularioTipo.DESARROLLO_INTEGRAL:
      return [RolRespondente.ALUMNO, RolRespondente.ALUMNA]

    case FormularioTipo.PRACTICAS_DOCENTES:
    case FormularioTipo.FORMACION_DOCENTE:
      return [RolRespondente.DOCENTE]

    case FormularioTipo.AMBIENTE_APRENDIZAJE:
      return [RolRespondente.DIRECTOR, RolRespondente.SUBDIRECTOR, RolRespondente.OBSERVADOR_EXTERNO]

    default:
      return Object.values(RolRespondente)
  }
}

const necesitaGrado = (tipo: FormularioTipo): boolean => {
  return tipo === FormularioTipo.AMBIENTE_FAMILIAR || tipo === FormularioTipo.DESARROLLO_INTEGRAL
}

const necesitaEdadGenero = (tipo: FormularioTipo): boolean => {
  return tipo === FormularioTipo.DESARROLLO_INTEGRAL
}

const necesitaAsignaturaExperiencia = (tipo: FormularioTipo): boolean => {
  return tipo === FormularioTipo.PRACTICAS_DOCENTES || tipo === FormularioTipo.FORMACION_DOCENTE
}

export default function ModalAgregarRespuesta({
  diagnosticoId,
  formularioTipo,
  respuestaId,
  onCerrar,
  onGuardado
}: ModalAgregarRespuestaProps) {
  const {
    respuestas,
    agregarRespuesta,
    actualizarRespuesta
  } = useRespuestasInstrumentos()

  const [paso, setPaso] = useState<1 | 2>(1) // 1: Datos respondente, 2: Formulario
  const [guardando, setGuardando] = useState(false)

  // Datos del respondente
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState<RolRespondente | ''>('')
  const [grado, setGrado] = useState('')
  const [grupo, setGrupo] = useState('')
  const [edad, setEdad] = useState<number | ''>('')
  const [genero, setGenero] = useState<'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decir' | ''>('')
  const [asignatura, setAsignatura] = useState('')
  const [anosExperiencia, setAnosExperiencia] = useState<number | ''>('')
  const [observaciones, setObservaciones] = useState('')

  // Cargar datos si es modo edición
  useEffect(() => {
    if (respuestaId) {
      const respuesta = respuestas.find(r => r.id === respuestaId)
      if (respuesta) {
        setNombre(respuesta.respondente.nombre)
        setRol(respuesta.respondente.rol)
        setGrado(respuesta.respondente.grado || '')
        setGrupo(respuesta.respondente.grupo || '')
        setEdad(respuesta.respondente.edad || '')
        setGenero(respuesta.respondente.genero || '')
        setAsignatura(respuesta.respondente.asignatura || '')
        setAnosExperiencia(respuesta.respondente.anosExperiencia || '')
        setObservaciones(respuesta.respondente.observaciones || '')
      }
    }
  }, [respuestaId, respuestas])

  const handleGuardarDatosRespondente = () => {
    // Validar campos requeridos
    if (!nombre.trim()) {
      alert('Por favor ingresa el nombre del respondente')
      return
    }
    if (!rol) {
      alert('Por favor selecciona el rol del respondente')
      return
    }

    if (necesitaGrado(formularioTipo) && !grado) {
      alert('Por favor selecciona el grado')
      return
    }

    // Pasar al paso 2 (formulario de preguntas)
    setPaso(2)
  }

  const handleGuardarRespuesta = async () => {
    setGuardando(true)

    try {
      const datosRespondente: DatosRespondente = {
        nombre: nombre.trim(),
        rol: rol as RolRespondente,
        grado: grado || undefined,
        grupo: grupo || undefined,
        edad: typeof edad === 'number' ? edad : undefined,
        genero: genero || undefined,
        asignatura: asignatura || undefined,
        anosExperiencia: typeof anosExperiencia === 'number' ? anosExperiencia : undefined,
        observaciones: observaciones || undefined
      }

      // TODO: Capturar respuestas del formulario
      const respuestasFormulario = {}

      const nuevaRespuesta: Omit<RespuestaInstrumento, 'id'> = {
        diagnosticoId,
        formularioTipo,
        respondente: datosRespondente,
        respuestas: respuestasFormulario,
        porcentajeCompletitud: 0 // Se calculará según las respuestas
      }

      if (respuestaId) {
        await actualizarRespuesta(respuestaId, nuevaRespuesta)
      } else {
        await agregarRespuesta(nuevaRespuesta)
      }

      onGuardado()
      onCerrar()
    } catch (error) {
      console.error('Error al guardar respuesta:', error)
      alert('Error al guardar la respuesta. Por favor intenta de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const rolesDisponibles = getRolesDisponibles(formularioTipo)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {respuestaId ? 'Editar Respuesta' : 'Nueva Respuesta'}
            </h2>
            <p className="text-blue-100">
              {getTituloInstrumento(formularioTipo)}
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            disabled={guardando}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Indicador de pasos */}
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${paso === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Datos del Respondente</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${paso === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paso === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Formulario</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          {paso === 1 ? (
            /* PASO 1: Datos del Respondente */
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <User className="w-4 h-4 inline mr-2" />
                  Por favor completa la información del respondente antes de continuar con el formulario.
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: María González López"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as RolRespondente)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un rol</option>
                  {rolesDisponibles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Grado y Grupo (si aplica) */}
              {necesitaGrado(formularioTipo) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grado <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={grado}
                      onChange={(e) => setGrado(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona</option>
                      <option value="1° Grado">1° Grado</option>
                      <option value="2° Grado">2° Grado</option>
                      <option value="3° Grado">3° Grado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grupo
                    </label>
                    <select
                      value={grupo}
                      onChange={(e) => setGrupo(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Edad y Género (si aplica) */}
              {necesitaEdadGenero(formularioTipo) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Edad
                    </label>
                    <input
                      type="number"
                      value={edad}
                      onChange={(e) => setEdad(e.target.value ? parseInt(e.target.value) : '')}
                      min="11"
                      max="18"
                      placeholder="Ej: 13"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Género
                    </label>
                    <select
                      value={genero}
                      onChange={(e) => setGenero(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Selecciona</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                      <option value="Prefiero no decir">Prefiero no decir</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Asignatura y Experiencia (si aplica) */}
              {necesitaAsignaturaExperiencia(formularioTipo) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asignatura
                    </label>
                    <input
                      type="text"
                      value={asignatura}
                      onChange={(e) => setAsignatura(e.target.value)}
                      placeholder="Ej: Matemáticas"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Años de Experiencia
                    </label>
                    <input
                      type="number"
                      value={anosExperiencia}
                      onChange={(e) => setAnosExperiencia(e.target.value ? parseInt(e.target.value) : '')}
                      min="0"
                      max="50"
                      placeholder="Ej: 5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={3}
                  placeholder="Notas adicionales (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            /* PASO 2: Formulario de preguntas */
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  📝 El formulario de preguntas se integrará en el siguiente paso del desarrollo.
                </p>
              </div>

              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <p className="text-gray-600 mb-2">Formulario de {getTituloInstrumento(formularioTipo)}</p>
                <p className="text-sm text-gray-500">(Componente en integración - MEGA-SPRINT 2)</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={guardando}
          >
            Cancelar
          </button>

          <div className="flex space-x-3">
            {paso === 2 && (
              <button
                onClick={() => setPaso(1)}
                className="px-4 py-2 text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                disabled={guardando}
              >
                ← Volver
              </button>
            )}

            {paso === 1 ? (
              <button
                onClick={handleGuardarDatosRespondente}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Continuar →
              </button>
            ) : (
              <button
                onClick={handleGuardarRespuesta}
                className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                disabled={guardando}
              >
                <Save className="w-4 h-4 mr-2" />
                {guardando ? 'Guardando...' : 'Guardar Respuesta'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
