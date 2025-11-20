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
  apellidos: supabaseUser.apellidos,
  rol: supabaseUser.rol,
  zonaEscolar: supabaseUser.zona_escolar,
  telefono: supabaseUser.telefono || '',
  fechaCreacion: new Date(supabaseUser.created_at),
  ultimoAcceso: supabaseUser.last_login ? new Date(supabaseUser.last_login) : undefined
})

// Store de autenticación con persistencia local
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, _get) => ({
      // Estado inicial
      usuario: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          // Simulación de autenticación (reemplazar con API real)
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Usuario de prueba para desarrollo
          if (email === 'supervisor@pmcze14.edu.mx' && password === 'demo123') {
            const usuarioDemo: Usuario = {
              id: '1',
              nombre: 'José Luis',
              apellidoPaterno: 'García',
              apellidoMaterno: 'Hernández',
              email: 'supervisor@pmcze14.edu.mx',
              rol: RolUsuario.SUPERVISOR,
              activo: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            set({ 
              usuario: usuarioDemo, 
              isAuthenticated: true, 
              isLoading: false 
            })
            
            return true
          }
          
          // Login fallido
          set({ isLoading: false })
          return false
          
        } catch (error) {
          set({ isLoading: false })
          console.error('Error en login:', error)
          return false
        }
      },

      logout: () => {
        set({
          usuario: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      setUsuario: (usuario: Usuario) => {
        set({ usuario, isAuthenticated: true })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'pmcze14-auth', // Nombre para localStorage
      partialize: (state) => ({
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

// Hook personalizado para facilitar el uso
export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    // Estado
    usuario: store.usuario,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    
    // Acciones
    login: store.login,
    logout: store.logout,
    setUsuario: store.setUsuario,
    
    // Utilidades
    isRole: (rol: RolUsuario) => store.usuario?.rol === rol,
    canAccess: (roles: RolUsuario[]) => 
      store.usuario ? roles.includes(store.usuario.rol) : false,
    getFullName: () => 
      store.usuario 
        ? `${store.usuario.nombre} ${store.usuario.apellidoPaterno} ${store.usuario.apellidoMaterno || ''}`.trim()
        : ''
  }
}