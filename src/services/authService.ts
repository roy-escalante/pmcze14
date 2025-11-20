import { supabase } from '../lib/supabase'
import { RolUsuario } from '../types'

export interface SupabaseUser {
  id: string
  email: string
  nombre: string
  apellidos: string
  rol: RolUsuario
  zona_escolar: string
  telefono?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  nombre: string
  apellidos: string
  rol: RolUsuario
  zona_escolar: string
  telefono?: string
}

class SupabaseAuthService {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) {
      throw new Error(this.getErrorMessage(error.message))
    }

    if (data.user) {
      // Actualizar last_login
      await this.updateLastLogin(data.user.id)
      
      // Obtener datos del usuario desde nuestra tabla
      const userData = await this.getUserData(data.user.id)
      return { session: data.session, user: userData }
    }

    throw new Error('Error al iniciar sesión')
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData: RegisterData) {
    // Primero crear el usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nombre: userData.nombre,
          apellidos: userData.apellidos,
          rol: userData.rol
        }
      }
    })

    if (authError) {
      throw new Error(this.getErrorMessage(authError.message))
    }

    if (authData.user) {
      // Crear el perfil del usuario en nuestra tabla
      const { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          email: userData.email,
          nombre: userData.nombre,
          apellidos: userData.apellidos,
          rol: userData.rol,
          zona_escolar: userData.zona_escolar,
          telefono: userData.telefono
        })

      if (profileError) {
        // Si hay error, eliminar el usuario de Auth
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw new Error('Error al crear el perfil del usuario')
      }

      return { user: authData.user }
    }

    throw new Error('Error al registrar usuario')
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error('Error al cerrar sesión')
    }
  }

  /**
   * Obtener sesión actual
   */
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error('Error al obtener sesión')
    }

    if (session?.user) {
      const userData = await this.getUserData(session.user.id)
      return { session, user: userData }
    }

    return { session: null, user: null }
  }

  /**
   * Escuchar cambios en la autenticación
   */
  onAuthStateChange(callback: (session: any, user: SupabaseUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (_, session) => {
      let userData = null
      
      if (session?.user) {
        try {
          userData = await this.getUserData(session.user.id)
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error)
        }
      }
      
      callback(session, userData)
    })
  }

  /**
   * Obtener datos del usuario desde la tabla usuarios
   */
  private async getUserData(userId: string): Promise<SupabaseUser> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error('Usuario no encontrado en la base de datos')
    }

    return data as SupabaseUser
  }

  /**
   * Actualizar last_login
   */
  private async updateLastLogin(userId: string) {
    const { error } = await supabase
      .from('usuarios')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      console.error('Error al actualizar last_login:', error)
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userId: string, updates: Partial<SupabaseUser>) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error('Error al actualizar perfil')
    }

    return data as SupabaseUser
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new Error(this.getErrorMessage(error.message))
    }
  }

  /**
   * Recuperar contraseña
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw new Error(this.getErrorMessage(error.message))
    }
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(user: SupabaseUser | null, rol: RolUsuario): boolean {
    return user?.rol === rol
  }

  /**
   * Verificar si el usuario tiene uno de varios roles
   */
  hasAnyRole(user: SupabaseUser | null, roles: RolUsuario[]): boolean {
    return user ? roles.includes(user.rol) : false
  }

  /**
   * Obtener nombre completo del usuario
   */
  getFullName(user: SupabaseUser | null): string {
    return user ? `${user.nombre} ${user.apellidos}` : ''
  }

  /**
   * Mapear mensajes de error a español
   */
  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Credenciales de acceso incorrectas',
      'Email not confirmed': 'Email no confirmado',
      'User not found': 'Usuario no encontrado',
      'Invalid email': 'Email inválido',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'User already registered': 'El usuario ya está registrado',
      'Email already registered': 'El email ya está registrado',
      'Weak password': 'Contraseña muy débil',
      'Network error': 'Error de conexión'
    }

    return errorMessages[error] || error
  }
}

export const authService = new SupabaseAuthService()