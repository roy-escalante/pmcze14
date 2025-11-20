import React, { useState } from 'react'
import { ListaEscuelas } from './ListaEscuelas'
import { FormularioEscuela } from './FormularioEscuela'
import { Escuela } from '../../types'

type VistaEscuelas = 'lista' | 'formulario'

interface GestionEscuelasProps {
  onVolverDashboard?: () => void
}

export const GestionEscuelas: React.FC<GestionEscuelasProps> = ({ onVolverDashboard }) => {
  const [vista, setVista] = useState<VistaEscuelas>('lista')
  const [escuelaEditando, setEscuelaEditando] = useState<Escuela | null>(null)

  const handleNuevaEscuela = () => {
    setEscuelaEditando(null)
    setVista('formulario')
  }

  const handleEditarEscuela = (escuela: Escuela) => {
    setEscuelaEditando(escuela)
    setVista('formulario')
  }

  const handleVolverALista = () => {
    setEscuelaEditando(null)
    setVista('lista')
  }

  const handleSuccessFormulario = () => {
    setEscuelaEditando(null)
    setVista('lista')
  }

  const handleVolverDashboard = () => {
    if (onVolverDashboard) {
      onVolverDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={handleVolverDashboard}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Dashboard
              </button>
              <span className="text-gray-400">›</span>
              <span className="text-gray-600">Gestión de Escuelas</span>
              {vista === 'formulario' && (
                <>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-600">
                    {escuelaEditando ? 'Editar Escuela' : 'Nueva Escuela'}
                  </span>
                </>
              )}
            </div>
            
            {vista === 'formulario' && (
              <button
                onClick={handleVolverALista}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                ← Volver a la Lista
              </button>
            )}
          </div>
        </nav>

        {/* Contenido principal */}
        {vista === 'lista' ? (
          <ListaEscuelas
            onNuevaEscuela={handleNuevaEscuela}
            onEditarEscuela={handleEditarEscuela}
          />
        ) : (
          <FormularioEscuela
            escuela={escuelaEditando}
            onSuccess={handleSuccessFormulario}
            onCancel={handleVolverALista}
          />
        )}
      </div>
    </div>
  )
}