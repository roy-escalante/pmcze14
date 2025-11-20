import { useEffect } from 'react'
import { useAuth } from '../stores'
import { authService } from '../services/authService'

/**
 * Hook para inicializar la autenticación con Supabase
 * Se debe usar en el componente raíz de la aplicación
 */
export function useSupabaseAuth() {
  const { setUsuario, setSession, setLoading, getCurrentSession } = useAuth()

  useEffect(() => {
    let mounted = true
    console.log('🔄 Inicializando hook useSupabaseAuth...')

    // Inicializar sesión actual
    const initializeAuth = async () => {
      try {
        console.log('📡 Obteniendo sesión actual...')
        await getCurrentSession()
        console.log('✅ Sesión inicializada correctamente')
      } catch (error) {
        console.error('❌ Error al inicializar autenticación:', error)
      }
    }

    // Configurar listener de cambios de autenticación
    console.log('👂 Configurando listener de cambios de autenticación...')
    const { data: { subscription } } = authService.onAuthStateChange(
      async (session, user) => {
        if (mounted) {
          console.log('🔄 Cambio de estado auth:', { 
            hasSession: !!session, 
            hasUser: !!user, 
            email: user?.email 
          })
          
          setSession(session)
          setUsuario(user ? {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            apellidoPaterno: user.apellidos.split(' ')[0] || '',
            apellidoMaterno: user.apellidos.split(' ')[1] || '',
            rol: user.rol,
            activo: true,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at)
          } : null)
          setLoading(false)
        }
      }
    )

    initializeAuth()

    return () => {
      mounted = false
      console.log('🧹 Limpiando hook useSupabaseAuth')
      subscription?.unsubscribe()
    }
  }, [setUsuario, setSession, setLoading, getCurrentSession])
}

export default useSupabaseAuth