import React, { useState } from 'react'
import { useAuth } from '../../stores'
import { RolUsuario } from '../../types'

interface LoginFormProps {
  onLoginSuccess: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const { login, isLoading, setUsuario } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor complete todos los campos')
      return
    }

    try {
      await login(email, password)
      // Si llegamos aquí, el login fue exitoso
      onLoginSuccess()
    } catch (error) {
      // Manejo de errores del login
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
      setError(errorMessage)
    }
  }

  // Función para simular login de demo
  const handleDemoLogin = () => {
    console.log('🎭 Activando modo demo...')
    
    // Crear usuario ficticio para demo
    const demoUser = {
      id: 'demo-user-123',
      email: 'supervisor@ze14.edu.mx',
      nombre: 'María Elena',
      apellidoPaterno: 'González',
      apellidoMaterno: 'Hernández', 
      rol: RolUsuario.SUPERVISOR,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setUsuario(demoUser)
    onLoginSuccess()
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Acceso al Sistema
        </h2>
        <p className="text-gray-600">
          Ingrese sus credenciales para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="usuario@pmcze14.edu.mx"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        
        {/* Botón de Demo */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o</span>
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          🎭 Entrar en Modo Demo
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">
            🎭 Modo Demo Disponible
          </h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Usa el botón "Entrar en Modo Demo"</strong> para probar el sistema sin registrarte</p>
            <p>• Tendrás acceso como <strong>Supervisor</strong></p>
            <p>• Podrás probar todas las funcionalidades</p>
            <p>• Perfecto para evaluar el sistema</p>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            🔧 Para Login Real:
          </h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>1.</strong> Usa el modo demo para acceder</p>
            <p><strong>2.</strong> Ve a "👥 Gestionar Usuarios"</p>
            <p><strong>3.</strong> Registra tu usuario real</p>
            <p><strong>4.</strong> Confirma el email y regresa aquí</p>
          </div>
        </div>
      </div>
    </div>
  )
}