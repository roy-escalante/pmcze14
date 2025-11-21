/**
 * 📋 LISTA DE RESPUESTAS
 *
 * Tabla que muestra todas las respuestas capturadas para un tipo de instrumento específico
 *
 * Características:
 * - Vista de tabla con información del respondente
 * - Filtros por rol, grado, completitud
 * - Acciones: Ver detalle, Editar, Eliminar
 * - Botón para agregar nueva respuesta
 */

import { useState } from 'react'
import { ArrowLeft, Plus, Eye, Trash2, Search, Filter, User, GraduationCap, Briefcase } from 'lucide-react'
import { useRespuestasInstrumentos } from '../../stores'
import { FormularioTipo } from '../../types'

interface ListaRespuestasProps {
  diagnosticoId: string
  formularioTipo: FormularioTipo
  onVolver: () => void
  onAgregarRespuesta: () => void
  onEditarRespuesta: (id: string) => void
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

export default function ListaRespuestas({
  diagnosticoId,
  formularioTipo,
  onVolver,
  onAgregarRespuesta,
  onEditarRespuesta
}: ListaRespuestasProps) {
  const {
    obtenerRespuestasPorTipo,
    obtenerEstadisticas,
    eliminarRespuesta
  } = useRespuestasInstrumentos()

  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState<string>('TODOS')
  const [filtroGrado, setFiltroGrado] = useState<string>('TODOS')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  const respuestas = obtenerRespuestasPorTipo(diagnosticoId, formularioTipo)
  const estadisticas = obtenerEstadisticas(diagnosticoId, formularioTipo)

  // Obtener roles y grados únicos para filtros
  const rolesUnicos = Array.from(new Set(respuestas.map(r => r.respondente.rol)))
  const gradosUnicos = Array.from(new Set(respuestas.map(r => r.respondente.grado).filter(Boolean))) as string[]

  // Filtrar respuestas
  let respuestasFiltradas = respuestas

  if (busqueda) {
    respuestasFiltradas = respuestasFiltradas.filter(r =>
      r.respondente.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )
  }

  if (filtroRol !== 'TODOS') {
    respuestasFiltradas = respuestasFiltradas.filter(r => r.respondente.rol === filtroRol)
  }

  if (filtroGrado !== 'TODOS') {
    respuestasFiltradas = respuestasFiltradas.filter(r => r.respondente.grado === filtroGrado)
  }

  const handleEliminarRespuesta = async (id: string) => {
    try {
      await eliminarRespuesta(id)
      setShowDeleteModal(null)
    } catch (error) {
      console.error('Error al eliminar respuesta:', error)
    }
  }

  const getRolIcon = (rol: string) => {
    if (rol.includes('Padre') || rol.includes('Madre') || rol.includes('Tutor')) {
      return <User className="w-4 h-4" />
    }
    if (rol.includes('Alumno') || rol.includes('Alumna')) {
      return <GraduationCap className="w-4 h-4" />
    }
    if (rol.includes('Docente') || rol.includes('Director')) {
      return <Briefcase className="w-4 h-4" />
    }
    return <User className="w-4 h-4" />
  }

  const getCompletitudColor = (porcentaje: number) => {
    if (porcentaje >= 90) return 'text-green-600 bg-green-50'
    if (porcentaje >= 70) return 'text-blue-600 bg-blue-50'
    if (porcentaje >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onVolver}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getTituloInstrumento(formularioTipo)}
                </h1>
                <p className="text-gray-600">
                  Respuestas capturadas para este instrumento
                </p>
              </div>

              <button
                onClick={onAgregarRespuesta}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agregar Respuesta
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Total de Respuestas</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.totalRespuestas}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Completitud Promedio</p>
              <p className="text-3xl font-bold text-blue-600">{estadisticas.completitudPromedio.toFixed(0)}%</p>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600 mb-1">Roles Diferentes</p>
              <p className="text-3xl font-bold text-green-600">{estadisticas.rolesDistintos}</p>
            </div>

            {estadisticas.gradosDistintos && estadisticas.gradosDistintos > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600 mb-1">Grados Diferentes</p>
                <p className="text-3xl font-bold text-purple-600">{estadisticas.gradosDistintos}</p>
              </div>
            )}
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="TODOS">Todos los roles</option>
              {rolesUnicos.map((rol) => (
                <option key={rol} value={rol}>{rol}</option>
              ))}
            </select>

            {gradosUnicos.length > 0 && (
              <select
                value={filtroGrado}
                onChange={(e) => setFiltroGrado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="TODOS">Todos los grados</option>
                {gradosUnicos.map((grado) => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </select>
            )}

            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              {respuestasFiltradas.length} de {respuestas.length} respuestas
            </div>
          </div>
        </div>

        {/* Tabla de respuestas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {respuestasFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay respuestas
              </h3>
              <p className="text-gray-500 mb-4">
                {respuestas.length === 0
                  ? 'Comienza agregando la primera respuesta para este instrumento.'
                  : 'No se encontraron respuestas con los filtros aplicados.'}
              </p>
              {respuestas.length === 0 && (
                <button
                  onClick={onAgregarRespuesta}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Primera Respuesta
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Respondente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    {gradosUnicos.length > 0 && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grado
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completitud
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {respuestasFiltradas.map((respuesta) => (
                    <tr key={respuesta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-gray-400 mr-3">
                            {getRolIcon(respuesta.respondente.rol)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {respuesta.respondente.nombre}
                            </div>
                            {respuesta.respondente.grupo && (
                              <div className="text-xs text-gray-500">
                                Grupo: {respuesta.respondente.grupo}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {respuesta.respondente.rol}
                        </span>
                      </td>
                      {gradosUnicos.length > 0 && (
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">
                            {respuesta.respondente.grado || '-'}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                respuesta.porcentajeCompletitud >= 90
                                  ? 'bg-green-500'
                                  : respuesta.porcentajeCompletitud >= 70
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                              }`}
                              style={{ width: `${respuesta.porcentajeCompletitud}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded ${getCompletitudColor(respuesta.porcentajeCompletitud)}`}>
                            {respuesta.porcentajeCompletitud.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {respuesta.createdAt
                            ? new Date(respuesta.createdAt).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => respuesta.id && onEditarRespuesta(respuesta.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver/Editar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => respuesta.id && setShowDeleteModal(respuesta.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de confirmación para eliminar */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar Eliminación
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar esta respuesta? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleEliminarRespuesta(showDeleteModal)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
