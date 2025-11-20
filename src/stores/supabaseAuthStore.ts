import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Usuario, RolUsuario } from '../types'
import { authService, SupabaseUser } from '../services/authService'

interface AuthState {
  usuario: Usuario | null
  session: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: {
    email: string
    password: string
    nombre: string
    apellidos: string
    rol: RolUsuario
    zona_escolar: string
    telefono?: string
  }) => Promise<void>
  getCurrentSession: () => Promise<void>
  updateProfile: (updates: Partial<Usuario>) => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setUsuario: (usuario: Usuario | null) => void
  setSession: (session: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Métodos auxiliares
  getFullName: () => string
  isRole: (rol: RolUsuario) => boolean
  hasAnyRole: (roles: RolUsuario[]) => boolean
}

type AuthStore = AuthState & AuthActions

// Función para convertir SupabaseUser a Usuario
const mapSupabaseUserToUsuario = (supabaseUser: SupabaseUser): Usuario => ({
  id: supabaseUser.id,
  email: supabaseUser.email,
  nombre: supabaseUser.nombre,
  apellidoPaterno: supabaseUser.apellidos.split(' ')[0] || '',
  apellidoMaterno: supabaseUser.apellidos.split(' ')[1] || '',
  rol: supabaseUser.rol,
  activo: true,
  createdAt: new Date(supabaseUser.created_at),
  updatedAt: new Date(supabaseUser.updated_at)
})

// Store de autenticación con Supabase
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      usuario: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Acciones principales
      login: async (email: string, password: string) => {
        console.log('🔐 Iniciando login para:', email)
        set({ isLoading: true, error: null })
        
        try {
          const { session, user } = await authService.login({ email, password })
          console.log('✅ Login exitoso:', { email: user.email, rol: user.rol })
          
          const mappedUser = mapSupabaseUserToUsuario(user)
          console.log('👤 Usuario mapeado:', mappedUser)
          
          set({ 
            usuario: mappedUser,
            session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          console.log('✅ Estado actualizado correctamente')
        } catch (error) {
          console.error('❌ Error en login:', error)
          const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
          set({ 
            isLoading: false, 
            error: errorMessage,
            isAuthenticated: false,
            usuario: null,
            session: null
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        
        try {
          await authService.logout()
          set({ 
            usuario: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          await authService.register(userData)
          set({ isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario'
          set({ 
            isLoading: false, 
            error: errorMessage
          })
          throw error
        }
      },

      getCurrentSession: async () => {
        set({ isLoading: true })
        
        try {
          const { session, user } = await authService.getCurrentSession()
          
          if (session && user) {
            const mappedUser = mapSupabaseUserToUsuario(user)
            set({ 
              usuario: mappedUser,
              session,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({ 
              usuario: null,
              session: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (error) {
          console.error('Error al obtener sesión:', error)
          set({ 
            usuario: null,
            session: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      updateProfile: async (updates) => {
        const { usuario } = get()
        if (!usuario) throw new Error('Usuario no autenticado')

        set({ isLoading: true, error: null })
        
        try {
          const updatedUser = await authService.updateProfile(usuario.id, {
            nombre: updates.nombre,
            apellidos: `${updates.apellidoPaterno || ''} ${updates.apellidoMaterno || ''}`.trim()
          })
          
          const mappedUser = mapSupabaseUserToUsuario(updatedUser)
          set({ 
            usuario: mappedUser,
            isLoading: false
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil'
          set({ 
            isLoading: false, 
            error: errorMessage
          })
          throw error
        }
      },

      changePassword: async (newPassword) => {
        set({ isLoading: true, error: null })
        
        try {
          await authService.changePassword(newPassword)
          set({ isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cambiar contraseña'
          set({ 
            isLoading: false, 
            error: errorMessage
          })
          throw error
        }
      },

      resetPassword: async (email) => {
        set({ isLoading: true, error: null })
        
        try {
          await authService.resetPassword(email)
          set({ isLoading: false })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al enviar email de recuperación'
          set({ 
            isLoading: false, 
            error: errorMessage
          })
          throw error
        }
      },

      // Métodos auxiliares
      setUsuario: (usuario) => set({ usuario, isAuthenticated: !!usuario }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      getFullName: () => {
        const { usuario } = get()
        return authService.getFullName(usuario as any)
      },

      isRole: (rol) => {
        const { usuario } = get()
        return authService.hasRole(usuario as any, rol)
      },

      hasAnyRole: (roles) => {
        const { usuario } = get()
        return authService.hasAnyRole(usuario as any, roles)
      }
    }),
    {
      name: 'auth-store',
      version: 3,
      partialize: (state) => ({
        // Solo persistir datos básicos, la sesión se maneja por Supabase
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Hook compatible con la interfaz anterior
export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    usuario: store.usuario,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: store.logout,
    register: store.register,
    getCurrentSession: store.getCurrentSession,
    updateProfile: store.updateProfile,
    changePassword: store.changePassword,
    resetPassword: store.resetPassword,
    getFullName: store.getFullName,
    isRole: store.isRole,
    hasAnyRole: store.hasAnyRole,
    clearError: store.clearError,
    // Métodos internos para el hook de inicialización
    setUsuario: store.setUsuario,
    setSession: store.setSession,
    setLoading: store.setLoading,
    setError: store.setError
  }
}