import React, { useState } from 'react'
import { useEscuelas } from '../../stores'
import { Region, Escuela } from '../../types'

interface ListaEscuelasProps {
  onEditarEscuela: (escuela: Escuela) => void
  onNuevaEscuela: () => void
}

export const ListaEscuelas: React.FC<ListaEscuelasProps> = ({
  onEditarEscuela,
  onNuevaEscuela
}) => {
  const {
    escuelasFiltradas,
    filtroRegion,
    setFiltroRegion,
    eliminarEscuela,
    isLoading,
    totalEscuelas,
    escuelasActivas,
    escuelasInactivas,
    inicializarDemo
  } = useEscuelas()

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<string | null>(null)

  // Inicializar datos demo si no hay escuelas
  React.useEffect(() => {
    if (totalEscuelas === 0) {
      inicializarDemo()
    }
  }, [totalEscuelas, inicializarDemo])

  const handleEliminarEscuela = async (id: string) => {
    const success = await eliminarEscuela(id)
    if (success) {
      setMostrarConfirmacion(null)
    } else {
      alert('Error al eliminar la escuela. Intente nuevamente.')
    }
  }

  const getColorRegion = (region: Region) => {
    return region === Region.NORTE 
      ? 'bg-blue-50 text-blue-800 border-blue-200'
      : 'bg-green-50 text-green-800 border-green-200'
  }

  const getColorEstado = (activa: boolean) => {
    return activa
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Gestión de Escuelas
            </h2>
            <p className="text-gray-600">
              Administre las {totalEscuelas} escuelas de la Zona Escolar 14
            </p>
          </div>
          
          <button
            onClick={onNuevaEscuela}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            ➕ Nueva Escuela
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{totalEscuelas}</div>
            <div className="text-sm text-blue-800">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">{escuelasActivas}</div>
            <div className="text-sm text-green-800">Activas</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-red-600">{escuelasInactivas}</div>
            <div className="text-sm text-red-800">Inactivas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">
              {escuelasFiltradas.reduce((sum, e) => sum + e.matriculaTotal, 0)}
            </div>
            <div className="text-sm text-yellow-800">Estudiantes</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filtrar por región:</span>
            <select
              value={filtroRegion}
              onChange={(e) => setFiltroRegion(e.target.value as Region | 'TODAS')}
              className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODAS">Todas las regiones</option>
              <option value={Region.NORTE}>Región Norte</option>
              <option value={Region.SUR}>Región Sur</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600">
            Mostrando {escuelasFiltradas.length} de {totalEscuelas} escuelas
          </div>
        </div>
      </div>

      {/* Lista de escuelas */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando escuelas...</p>
          </div>
        ) : escuelasFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-5xl mb-4">🏫</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No hay escuelas registradas
            </h3>
            <p className="text-gray-600 mb-4">
              {filtroRegion === 'TODAS' 
                ? 'Comience agregando la primera escuela'
                : `No hay escuelas en la región ${filtroRegion}`
              }
            </p>
            {filtroRegion === 'TODAS' && (
              <button
                onClick={onNuevaEscuela}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                ➕ Agregar Primera Escuela
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {escuelasFiltradas.map((escuela) => (
              <div
                key={escuela.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Información principal */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {escuela.nombre}
                      </h3>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getColorRegion(escuela.region)}`}>
                        {escuela.region === Region.NORTE ? 'Norte' : 'Sur'}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorEstado(escuela.activa)}`}>
                        {escuela.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">CCT:</span> {escuela.cct}
                      </div>
                      <div>
                        <span className="font-medium">EST:</span> {escuela.numeroEST}
                      </div>
                      <div>
                        <span className="font-medium">Matrícula:</span> {escuela.matriculaTotal}
                      </div>
                      <div>
                        <span className="font-medium">Docentes:</span> {escuela.numeroDocentes}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Ubicación:</span> {escuela.direccion.municipio}, {escuela.direccion.localidad}
                      </div>
                      <div>
                        <span className="font-medium">Turno:</span> {escuela.turno}
                      </div>
                      {escuela.contacto.telefono && (
                        <div>
                          <span className="font-medium">Tel:</span> {escuela.contacto.telefono}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditarEscuela(escuela)}
                      className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      ✏️ Editar
                    </button>
                    
                    <button
                      onClick={() => setMostrarConfirmacion(escuela.id)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-100 focus:ring-2 focus:ring-red-500 transition-colors"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirmar Eliminación
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Está seguro de que desea eliminar esta escuela? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMostrarConfirmacion(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={() => handleEliminarEscuela(mostrarConfirmacion)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}