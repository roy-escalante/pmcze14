import { useState, useEffect } from 'react'
import './App.css'

// Importar stores, hooks y componentes
import { useAuth } from './stores'
import { useSupabaseAuth } from './hooks'
import { LoginForm, Dashboard } from './components/shared'

function App() {
  const { isAuthenticated, isLoading, usuario } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  
  // Hook para inicializar autenticación de Supabase
  useSupabaseAuth()

  // Efecto para verificar autenticación al cargar
  useEffect(() => {
    // Si no está autenticado después de cargar, mostrar opción de login
    if (!isAuthenticated && !isLoading) {
      setTimeout(() => setShowLogin(true), 2000)
    }
  }, [isAuthenticated, isLoading])

  // Si está autenticado, mostrar dashboard
  if (isAuthenticated && usuario) {
    return <Dashboard />
  }

  // Si se solicita login, mostrar formulario
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <LoginForm onLoginSuccess={() => setShowLogin(false)} />
      </div>
    )
  }

  // Pantalla de inicio/presentación
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PMCZE14
          </h1>
          <h2 className="text-xl text-gray-600 mb-4">
            Programa de Mejora Continua
          </h2>
          <p className="text-lg text-blue-700 font-semibold">
            Zona Escolar 14 - Escuelas Secundarias Técnicas
          </p>
          <p className="text-gray-600">
            Huasteca Potosina, San Luis Potosí
          </p>
        </header>

        {/* Status del Sistema */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Estado del Sistema
            </h3>
            
            <div className="space-y-4">
              {/* Configuración Base */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 status-item">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <span className="font-semibold text-green-800">Configuración Base</span>
                </div>
                <span className="text-green-600 font-bold">✓ Completado</span>
              </div>

              {/* Dependencias */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 status-item">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <span className="font-semibold text-green-800">Dependencias Instaladas</span>
                </div>
                <span className="text-green-600 font-bold">✓ Completado</span>
              </div>

              {/* Servidor de Desarrollo */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 status-item">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <span className="font-semibold text-green-800">Servidor de Desarrollo</span>
                </div>
                <span className="text-green-600 font-bold">✓ Funcionando</span>
              </div>

              {/* Autenticación */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 status-item">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  <span className="font-semibold text-green-800">Sistema de Autenticación</span>
                </div>
                <span className="text-green-600 font-bold">✓ Implementado</span>
              </div>

              {/* Próximos Módulos */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200 status-item">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
                  <span className="font-semibold text-yellow-800">Módulos Principales</span>
                </div>
                <span className="text-yellow-600 font-bold">⚡ Siguiente Fase</span>
              </div>
            </div>

            {/* Botón de acceso */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Acceder al Sistema
              </button>
            </div>
          </div>

          {/* Información de las Escuelas */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Escuelas de la Zona 14
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Región Norte */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-xl font-bold text-blue-800 mb-4">
                  Región Norte
                </h4>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center escuela-item">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    EST 41
                  </li>
                  <li className="flex items-center escuela-item">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    EST 77
                  </li>
                  <li className="flex items-center escuela-item">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    EST 81
                  </li>
                </ul>
              </div>

              {/* Región Sur */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-xl font-bold text-green-800 mb-4">
                  Región Sur
                </h4>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-center escuela-item">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    EST 4
                  </li>
                  <li className="flex items-center escuela-item">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    EST 7
                  </li>
                  <li className="flex items-center escuela-item">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    EST 82
                  </li>
                </ul>
              </div>
            </div>

            {/* Información Técnica */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2">Stack Tecnológico:</h5>
              <div className="text-sm text-gray-600 space-x-4">
                <span>React 18</span>
                <span>•</span>
                <span>TypeScript</span>
                <span>•</span>
                <span>Tailwind CSS 3.4</span>
                <span>•</span>
                <span>Vite 5</span>
                <span>•</span>
                <span>Zustand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
