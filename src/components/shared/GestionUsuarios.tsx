import React, { useState } from 'react'
import { FormularioRegistro } from './FormularioRegistro'

interface GestionUsuariosProps {
  onVolverDashboard?: () => void
}

type Vista = 'lista' | 'registro'

export const GestionUsuarios: React.FC<GestionUsuariosProps> = ({
  onVolverDashboard
}) => {
  const [vistaActual, setVistaActual] = useState<Vista>('lista')

  const cambiarVista = (vista: Vista) => {
    setVistaActual(vista)
  }

  const handleRegistroExitoso = () => {
    // Cambiar a vista de lista después del registro
    setTimeout(() => {
      setVistaActual('lista')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onVolverDashboard && (
              <button
                onClick={onVolverDashboard}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                title="Volver al Dashboard"
              >
                ← Volver
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-1">
                Administrar usuarios del sistema PMCZE14
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => cambiarVista('lista')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActual === 'lista'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Lista de Usuarios
            </button>
            
            <button
              onClick={() => cambiarVista('registro')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActual === 'registro'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ➕ Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Contenido según la vista */}
      <div className="min-h-96">
        {vistaActual === 'registro' && (
          <FormularioRegistro
            onRegistroExitoso={handleRegistroExitoso}
            onCancelar={() => setVistaActual('lista')}
          />
        )}
        
        {vistaActual === 'lista' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Lista de Usuarios
              </h3>
              <p className="text-gray-600 mb-6">
                La funcionalidad de lista de usuarios se implementará próximamente
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Usuarios de Prueba Disponibles:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>supervisor@ze14.edu.mx</strong> - María Elena González (Supervisor)</p>
                  <p><strong>inspector@ze14.edu.mx</strong> - Carlos Alberto Martínez (Inspector)</p>
                  <p><strong>director1@ze14.edu.mx</strong> - Ana Patricia Rodríguez (Director)</p>
                  <p><strong>director2@ze14.edu.mx</strong> - José Luis Ramírez (Director)</p>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  * Para usar estos usuarios, regístralos con la contraseña deseada usando el panel de registro
                </p>
              </div>

              <button
                onClick={() => setVistaActual('registro')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                ➕ Registrar Primer Usuario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-600 text-lg">ℹ️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Información sobre el Registro
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Los usuarios registrados recibirán un email de confirmación</li>
                <li>La cuenta se activará automáticamente al confirmar el email</li>
                <li>Los roles determinan los permisos dentro del sistema</li>
                <li>Todos los usuarios pertenecen a la Zona Escolar 14</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionUsuarios