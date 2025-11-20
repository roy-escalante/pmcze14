import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, School, User, BarChart } from 'lucide-react'
import { useDiagnostico, useEscuelas } from '../../stores'
import { EstadoDiagnostico } from '../../types'
import FormularioDiagnostico from './FormularioDiagnostico'
import ResultadosDiagnostico from './ResultadosDiagnostico'

type Vista = 'lista' | 'formulario' | 'resultados'

const estadoColors = {
  [EstadoDiagnostico.BORRADOR]: 'bg-gray-100 text-gray-800',
  [EstadoDiagnostico.EN_CAPTURA]: 'bg-blue-100 text-blue-800',
  [EstadoDiagnostico.COMPLETADO]: 'bg-green-100 text-green-800',
  [EstadoDiagnostico.VALIDADO]: 'bg-purple-100 text-purple-800',
  [EstadoDiagnostico.APROBADO]: 'bg-emerald-100 text-emerald-800'
}

export default function GestionDiagnosticos() {
  const [vista, setVista] = useState<Vista>('lista')
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<EstadoDiagnostico | 'TODOS'>('TODOS')
  const [filtroEscuela, setFiltroEscuela] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  const { 
    diagnosticos, 
    eliminarDiagnostico, 
    obtenerEstadisticas
  } = useDiagnostico()
  
  const { escuelas } = useEscuelas()

  const estadisticas = obtenerEstadisticas()

  // Filtrar diagnósticos
  let diagnosticosFiltrados = diagnosticos

  if (busqueda) {
    diagnosticosFiltrados = diagnosticosFiltrados.filter(d => 
      d.datosGenerales.nombreEscuela.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.datosGenerales.cct.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.datosGenerales.responsable.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  if (filtroEstado !== 'TODOS') {
    diagnosticosFiltrados = diagnosticosFiltrados.filter(d => d.estado === filtroEstado)
  }

  if (filtroEscuela) {
    diagnosticosFiltrados = diagnosticosFiltrados.filter(d => d.datosGenerales.escuelaId === filtroEscuela)
  }

  const handleNuevoDiagnostico = () => {
    setDiagnosticoSeleccionado(null)
    setVista('formulario')
  }

  const handleEditarDiagnostico = (id: string) => {
    setDiagnosticoSeleccionado(id)
    setVista('formulario')
  }

  const handleVerResultados = (id: string) => {
    setDiagnosticoSeleccionado(id)
    setVista('resultados')
  }

  const handleEliminarDiagnostico = async (id: string) => {
    try {
      await eliminarDiagnostico(id)
      setShowDeleteModal(null)
    } catch (error) {
      console.error('Error al eliminar diagnóstico:', error)
    }
  }

  const handleVolver = () => {
    setVista('lista')
    setDiagnosticoSeleccionado(null)
  }

  const renderLista = () => (
    <div className="space-y-6">
      {/* Header y estadísticas */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diagnósticos Educativos</h1>
          <p className="text-gray-600 mt-2">
            Gestión de diagnósticos basados en la Nueva Escuela Mexicana (NEM)
          </p>
        </div>
        <button
          onClick={handleNuevoDiagnostico}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Nuevo Diagnóstico
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
            <BarChart size={24} className="text-gray-400" />
          </div>
        </div>

        {Object.entries(estadisticas.porEstado).map(([estado, cantidad]) => (
          <div key={estado} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{estado}</p>
                <p className="text-2xl font-bold text-gray-900">{cantidad}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${estadoColors[estado as EstadoDiagnostico]}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por escuela, CCT o responsable..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as EstadoDiagnostico | 'TODOS')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="TODOS">Todos los estados</option>
            {Object.values(EstadoDiagnostico).map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>

          <select
            value={filtroEscuela}
            onChange={(e) => setFiltroEscuela(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las escuelas</option>
            {escuelas.map((escuela) => (
              <option key={escuela.id} value={escuela.id}>
                {escuela.nombre} - {escuela.cct}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter size={16} className="mr-2" />
            {diagnosticosFiltrados.length} de {diagnosticos.length} diagnósticos
          </div>
        </div>
      </div>

      {/* Lista de diagnósticos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escuela
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciclo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diagnosticosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <BarChart size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No hay diagnósticos
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {busqueda || filtroEstado !== 'TODOS' || filtroEscuela
                          ? 'No se encontraron diagnósticos con los filtros aplicados.'
                          : 'Comienza creando tu primer diagnóstico educativo.'}
                      </p>
                      {!busqueda && filtroEstado === 'TODOS' && !filtroEscuela && (
                        <button
                          onClick={handleNuevoDiagnostico}
                          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Plus size={20} className="mr-2" />
                          Crear Diagnóstico
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                diagnosticosFiltrados.map((diagnostico) => {
                  // Calcular progreso (dimensiones completadas)
                  let dimensionesCompletadas = 0
                  if (diagnostico.dimensionAprovechamiento) dimensionesCompletadas++
                  if (diagnostico.dimensionPracticasDocentes) dimensionesCompletadas++
                  if (diagnostico.dimensionFormacionDocente) dimensionesCompletadas++
                  if (diagnostico.dimensionPlanesPrograma) dimensionesCompletadas++
                  if (diagnostico.dimensionParticipacionFamilia) dimensionesCompletadas++
                  
                  const progreso = (dimensionesCompletadas / 5) * 100

                  return (
                    <tr key={diagnostico.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <School size={20} className="text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {diagnostico.datosGenerales.nombreEscuela}
                            </div>
                            <div className="text-sm text-gray-500">
                              {diagnostico.datosGenerales.cct}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {diagnostico.datosGenerales.responsable.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {diagnostico.datosGenerales.cicloEscolar}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[diagnostico.estado]}`}>
                          {diagnostico.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${progreso}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {dimensionesCompletadas}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVerResultados(diagnostico.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver resultados"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditarDiagnostico(diagnostico.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(diagnostico.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este diagnóstico? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminarDiagnostico(showDeleteModal)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (vista === 'formulario') {
    return (
      <FormularioDiagnostico
        diagnosticoId={diagnosticoSeleccionado || undefined}
        onCancelar={handleVolver}
      />
    )
  }

  if (vista === 'resultados' && diagnosticoSeleccionado) {
    return (
      <ResultadosDiagnostico
        diagnosticoId={diagnosticoSeleccionado}
        onVolver={handleVolver}
        onEditar={() => {
          setVista('formulario')
        }}
      />
    )
  }

  return renderLista()
}