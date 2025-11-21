/**
 * 📊 DIAGNOSTIC DASHBOARD (v2)
 *
 * Dashboard principal para el sistema de múltiples respuestas por instrumento
 * Reemplaza el formulario lineal con navegación flexible por cards
 *
 * Características:
 * - Navegación no-lineal (puedes llenar en cualquier orden)
 * - Múltiples respuestas por instrumento
 * - Progreso visual por cada tipo de instrumento
 * - Botones para ver lista y agregar respuestas
 */

import { useEffect, useState } from 'react'
import { ArrowLeft, FileText, Users, GraduationCap, BookOpen, Building2, Plus, List } from 'lucide-react'
import { useDiagnostico, useRespuestasInstrumentos } from '../../stores'
import { FormularioTipo } from '../../types'
import ListaRespuestas from './ListaRespuestas'
import ModalAgregarRespuesta from './ModalAgregarRespuesta'

interface DiagnosticoDashboardProps {
  diagnosticoId?: string
  onCancelar: () => void
}

interface InstrumentoInfo {
  tipo: FormularioTipo
  titulo: string
  descripcion: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  metaRespuestas: number // Cuántas respuestas se esperan idealmente
}

const instrumentos: InstrumentoInfo[] = [
  {
    tipo: FormularioTipo.AMBIENTE_FAMILIAR,
    titulo: 'Ambiente Familiar',
    descripcion: 'Entrevistas con padres, madres y tutores',
    icon: <Users className="w-6 h-6" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    metaRespuestas: 50 // Meta sugerida
  },
  {
    tipo: FormularioTipo.DESARROLLO_INTEGRAL,
    titulo: 'Desarrollo Integral',
    descripcion: 'Bienestar y motivación estudiantil',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    metaRespuestas: 287 // Todos los estudiantes
  },
  {
    tipo: FormularioTipo.PRACTICAS_DOCENTES,
    titulo: 'Prácticas Docentes',
    descripcion: 'Evaluación de metodologías de enseñanza',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    metaRespuestas: 18 // Todos los docentes
  },
  {
    tipo: FormularioTipo.FORMACION_DOCENTE,
    titulo: 'Formación Docente',
    descripcion: 'Capacitación y desarrollo profesional',
    icon: <FileText className="w-6 h-6" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    metaRespuestas: 18 // Todos los docentes
  },
  {
    tipo: FormularioTipo.AMBIENTE_APRENDIZAJE,
    titulo: 'Ambiente de Aprendizaje',
    descripcion: 'Observación del contexto educativo',
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    metaRespuestas: 3 // 2-3 observadores
  }
]

export default function DiagnosticoDashboard({ diagnosticoId, onCancelar }: DiagnosticoDashboardProps) {
  const { diagnosticos } = useDiagnostico()
  const {
    cargarRespuestas,
    contarRespuestas,
    obtenerEstadisticas,
    cargando
  } = useRespuestasInstrumentos()

  const [vistaActual, setVistaActual] = useState<'dashboard' | 'lista'>('dashboard')
  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState<FormularioTipo | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [respuestaEditando, setRespuestaEditando] = useState<string | undefined>(undefined)

  const diagnostico = diagnosticos.find(d => d.id === diagnosticoId)

  useEffect(() => {
    if (diagnosticoId) {
      cargarRespuestas(diagnosticoId)
    }
  }, [diagnosticoId, cargarRespuestas])

  const handleVerLista = (tipo: FormularioTipo) => {
    setInstrumentoSeleccionado(tipo)
    setVistaActual('lista')
  }

  const handleAgregarRespuesta = (tipo: FormularioTipo) => {
    setInstrumentoSeleccionado(tipo)
    setRespuestaEditando(undefined)
    setModalAbierto(true)
  }

  const handleEditarRespuesta = (id: string, tipo: FormularioTipo) => {
    setInstrumentoSeleccionado(tipo)
    setRespuestaEditando(id)
    setModalAbierto(true)
  }

  const handleCerrarModal = () => {
    setModalAbierto(false)
    setRespuestaEditando(undefined)
  }

  const handleRespuestaGuardada = () => {
    // Recargar respuestas después de guardar
    if (diagnosticoId) {
      cargarRespuestas(diagnosticoId)
    }
  }

  const handleVolverDashboard = () => {
    setVistaActual('dashboard')
    setInstrumentoSeleccionado(null)
  }

  // Si estamos viendo la lista de un instrumento específico
  if (vistaActual === 'lista' && instrumentoSeleccionado && diagnosticoId) {
    return (
      <>
        <ListaRespuestas
          diagnosticoId={diagnosticoId}
          formularioTipo={instrumentoSeleccionado}
          onVolver={handleVolverDashboard}
          onAgregarRespuesta={() => handleAgregarRespuesta(instrumentoSeleccionado)}
          onEditarRespuesta={(id) => handleEditarRespuesta(id, instrumentoSeleccionado)}
        />

        {/* Modal para agregar/editar respuesta */}
        {modalAbierto && diagnosticoId && instrumentoSeleccionado && (
          <ModalAgregarRespuesta
            diagnosticoId={diagnosticoId}
            formularioTipo={instrumentoSeleccionado}
            respuestaId={respuestaEditando}
            onCerrar={handleCerrarModal}
            onGuardado={handleRespuestaGuardada}
          />
        )}
      </>
    )
  }

  // Vista principal del dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onCancelar}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la lista de diagnósticos
          </button>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {diagnosticoId ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
                </h1>
                {diagnostico && (
                  <>
                    <p className="text-lg text-gray-700 font-medium">
                      {diagnostico.datosGenerales.nombreEscuela}
                    </p>
                    <p className="text-sm text-gray-600">
                      CCT: {diagnostico.datosGenerales.cct} • Ciclo: {diagnostico.datosGenerales.cicloEscolar}
                    </p>
                  </>
                )}
              </div>

              <div className="text-right">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Sistema v2</p>
                  <p className="text-lg font-bold text-blue-900">Navegación Flexible</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Llena los instrumentos en cualquier orden
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            📋 Instrucciones
          </h2>
          <div className="text-gray-700 space-y-2">
            <p>
              • <strong>Navegación libre:</strong> Puedes llenar los instrumentos en el orden que prefieras
            </p>
            <p>
              • <strong>Múltiples respuestas:</strong> Agrega tantas entrevistas como necesites (ej: 50 padres, 287 estudiantes, 18 maestros)
            </p>
            <p>
              • <strong>Progreso independiente:</strong> Cada instrumento tiene su propio progreso
            </p>
            <p>
              • <strong>Ver lista:</strong> Revisa todas las respuestas capturadas por instrumento
            </p>
          </div>
        </div>

        {/* Grid de Instrumentos */}
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instrumentos.map((instrumento) => {
              const totalRespuestas = diagnosticoId ? contarRespuestas(diagnosticoId, instrumento.tipo) : 0
              const estadisticas = diagnosticoId ? obtenerEstadisticas(diagnosticoId, instrumento.tipo) : null
              const progreso = (totalRespuestas / instrumento.metaRespuestas) * 100
              const progresoDisplay = Math.min(progreso, 100)

              return (
                <div
                  key={instrumento.tipo}
                  className={`bg-white rounded-lg shadow-lg border-2 ${instrumento.borderColor} overflow-hidden transition-all hover:shadow-xl`}
                >
                  {/* Header del Card */}
                  <div className={`${instrumento.bgColor} p-6 border-b-2 ${instrumento.borderColor}`}>
                    <div className="flex items-center mb-3">
                      <div className={`${instrumento.color} mr-3`}>
                        {instrumento.icon}
                      </div>
                      <h3 className={`text-lg font-bold ${instrumento.color}`}>
                        {instrumento.titulo}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {instrumento.descripcion}
                    </p>
                  </div>

                  {/* Progreso */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Respuestas capturadas
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {totalRespuestas} / {instrumento.metaRespuestas}
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            progresoDisplay >= 100
                              ? 'bg-green-500'
                              : progresoDisplay >= 50
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${progresoDisplay}%` }}
                        ></div>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {progresoDisplay.toFixed(0)}% completado
                      </p>
                    </div>

                    {/* Estadísticas adicionales */}
                    {estadisticas && estadisticas.totalRespuestas > 0 && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">
                          Completitud promedio: <span className="font-bold">{estadisticas.completitudPromedio.toFixed(0)}%</span>
                        </p>
                        {estadisticas.rolesDistintos > 0 && (
                          <p className="text-xs text-gray-600">
                            Roles diferentes: <span className="font-bold">{estadisticas.rolesDistintos}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerLista(instrumento.tipo)}
                        className={`flex-1 flex items-center justify-center px-4 py-2 ${instrumento.bgColor} ${instrumento.color} border ${instrumento.borderColor} rounded-lg hover:opacity-80 transition-colors font-medium text-sm`}
                        disabled={totalRespuestas === 0}
                      >
                        <List className="w-4 h-4 mr-2" />
                        Ver lista
                        {totalRespuestas > 0 && ` (${totalRespuestas})`}
                      </button>

                      <button
                        onClick={() => handleAgregarRespuesta(instrumento.tipo)}
                        className={`flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm shadow-md`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer con indicador general */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Progreso General del Diagnóstico
              </h3>
              <p className="text-sm text-gray-600">
                {diagnosticoId
                  ? `Total de respuestas capturadas: ${instrumentos.reduce((sum, inst) => sum + contarRespuestas(diagnosticoId, inst.tipo), 0)}`
                  : 'Comienza agregando respuestas a cualquier instrumento'}
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={onCancelar}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Guardar y Cerrar
              </button>
            </div>
          </div>
        </div>

        {/* Modal para agregar/editar respuesta */}
        {modalAbierto && diagnosticoId && instrumentoSeleccionado && (
          <ModalAgregarRespuesta
            diagnosticoId={diagnosticoId}
            formularioTipo={instrumentoSeleccionado}
            respuestaId={respuestaEditando}
            onCerrar={handleCerrarModal}
            onGuardado={handleRespuestaGuardada}
          />
        )}
      </div>
    </div>
  )
}
