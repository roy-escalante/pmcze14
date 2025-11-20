import React, { useState } from 'react'
import { authService } from '../../services/authService'

interface TestSupabaseProps {}

export const TestSupabase: React.FC<TestSupabaseProps> = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult('Probando conexión...')
    
    try {
      // Probar conexión básica con Supabase
      const result = await authService.getCurrentSession()
      
      if (result.session || result.user) {
        setTestResult('✅ Conexión exitosa con Supabase')
        console.log('Datos de sesión:', result)
      } else {
        setTestResult('✅ Conexión exitosa - No hay sesión activa')
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      console.error('Error al probar conexión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        🧪 Test Conexión Supabase
      </h3>
      
      <button
        onClick={testConnection}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isLoading ? 'Probando...' : 'Probar Conexión'}
      </button>
      
      {testResult && (
        <div className={`p-3 rounded-lg text-sm ${
          testResult.includes('✅') 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {testResult}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'No configurada'}</p>
        <p><strong>Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
      </div>
    </div>
  )
}

export default TestSupabase