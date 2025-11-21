import React, { useState } from 'react'
import { useAuth } from '../../stores'
import { RolUsuario } from '../../types'
import { GestionEscuelas } from './GestionEscuelas'
import { GestionUsuarios } from './GestionUsuarios'
import { GestionDiagnosticos } from '../diagnostico'
import { DashboardAnalisis } from '../analisis'

type VistaDashboard = 'inicio' | 'escuelas' | 'usuarios' | 'diagnostico' | 'analisis' | 'planeacion' | 'seguimiento'

export const Dashboard: React.FC = () => {
  const { usuario, logout, getFullName, isRole } = useAuth()
  const [vistaActual, setVistaActual] = useState<VistaDashboard>('inicio')

  const getRoleDisplayName = (rol: RolUsuario) => {
    const roleNames = {
      [RolUsuario.SUPERVISOR]: 'Supervisor',
      [RolUsuario.INSPECTOR]: 'Inspector',
      [RolUsuario.DIRECTOR]: 'Director',
      [RolUsuario.DOCENTE]: 'Docente',
      [RolUsuario.PADRE]: 'Padre de Familia',
      [RolUsuario.ESTUDIANTE]: 'Estudiante'
    }
    return roleNames[rol] || 'Usuario'
  }

  const handleLogout = () => {
    logout()
  }

  const navegarA = (vista: VistaDashboard) => {
    setVistaActual(vista)
  }

  // Si no estamos en el inicio, mostrar la vista correspondiente
  if (vistaActual === 'escuelas') {
    return <GestionEscuelas onVolverDashboard={() => setVistaActual('inicio')} />
  }
  
  if (vistaActual === 'usuarios') {
    return <GestionUsuarios onVolverDashboard={() => setVistaActual('inicio')} />
  }
  
  if (vistaActual === 'diagnostico') {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setVistaActual('inicio')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Volver al Dashboard
          </button>
        </div>
        <GestionDiagnosticos />
      </div>
    )
  }

  if (vistaActual === 'analisis') {
    return <DashboardAnalisis onVolverDashboard={() => setVistaActual('inicio')} />
  }

  // Vista principal del dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header con información del usuario */}
        <header className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                PMCZE14 - Dashboard
              </h1>
              <p className="text-gray-600">
                Programa de Mejora Continua - Zona Escolar 14
              </p>
            </div>
            
            <div className="text-right">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-1">
                  {getFullName()}
                </h3>
                <p className="text-blue-600 text-sm mb-3">
                  {usuario && getRoleDisplayName(usuario.rol)}
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido principal basado en el rol */}
        <main className="grid gap-8">
          {/* Panel de acceso rápido */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Acceso Rápido
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Módulo Diagnóstico */}
              <button
                onClick={() => navegarA('diagnostico')}
                className="bg-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-blue-100"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Diagnóstico
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Gestión del diagnóstico escolar
                  </p>
                </div>
              </button>

              {/* Módulo Análisis */}
              <button
                onClick={() => navegarA('analisis')}
                className="bg-green-50 rounded-lg p-6 border border-green-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-green-100"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">📈</span>
                  </div>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Análisis
                  </h3>
                  <p className="text-green-600 text-sm">
                    Estadísticas y comparativos
                  </p>
                </div>
              </button>

              {/* Módulo Planeación */}
              <button
                onClick={() => navegarA('planeacion')}
                className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-yellow-100"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">📋</span>
                  </div>
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Planeación
                  </h3>
                  <p className="text-yellow-600 text-sm">
                    Objetivos y metas
                  </p>
                </div>
              </button>

              {/* Módulo Seguimiento */}
              <button
                onClick={() => navegarA('seguimiento')}
                className="bg-purple-50 rounded-lg p-6 border border-purple-200 hover:shadow-md transition-shadow cursor-pointer hover:bg-purple-100"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-purple-800 mb-2">
                    Seguimiento
                  </h3>
                  <p className="text-purple-600 text-sm">
                    Monitoreo y evidencias
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Información específica del rol */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Panel de {usuario && getRoleDisplayName(usuario.rol)}
            </h2>
            
            {isRole(RolUsuario.SUPERVISOR) && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Vista General de Zona
                  </h3>
                  <p className="text-blue-600 text-sm mb-3">
                    Acceso completo a las 6 escuelas de la zona
                  </p>
                  <ul className="mt-3 text-sm text-blue-700 mb-4">
                    <li>• Región Norte: EST 41, 77, 81</li>
                    <li>• Región Sur: EST 4, 7, 82</li>
                  </ul>
                  <button
                    onClick={() => navegarA('escuelas')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors w-full"
                  >
                    🏫 Gestionar Escuelas
                  </button>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Administración de Sistema
                  </h3>
                  <p className="text-green-600 text-sm mb-3">
                    Gestión de usuarios y permisos
                  </p>
                  <ul className="text-sm text-green-700 space-y-1 mb-4">
                    <li>• Registrar nuevos usuarios</li>
                    <li>• Gestionar roles y permisos</li>
                    <li>• Validar diagnósticos</li>
                    <li>• Generar reportes de zona</li>
                  </ul>
                  <button
                    onClick={() => navegarA('usuarios')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors w-full"
                  >
                    👥 Gestionar Usuarios
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Estado del desarrollo */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Estado del Desarrollo
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">✅</div>
                <p className="text-sm text-gray-600">Autenticación</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">🚧</div>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400 mb-2">⏳</div>
                <p className="text-sm text-gray-600">Módulos</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400 mb-2">⏳</div>
                <p className="text-sm text-gray-600">Backend</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}