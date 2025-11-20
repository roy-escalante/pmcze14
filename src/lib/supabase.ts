import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables de entorno de Supabase no configuradas')
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos de base de datos (se generarán automáticamente)
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          apellidos: string
          rol: 'SUPERVISOR' | 'INSPECTOR' | 'DIRECTOR' | 'SUBDIRECTOR' | 'DOCENTE'
          zona_escolar: string
          telefono: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          nombre: string
          apellidos: string
          rol: 'SUPERVISOR' | 'INSPECTOR' | 'DIRECTOR' | 'SUBDIRECTOR' | 'DOCENTE'
          zona_escolar: string
          telefono?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          apellidos?: string
          rol?: 'SUPERVISOR' | 'INSPECTOR' | 'DIRECTOR' | 'SUBDIRECTOR' | 'DOCENTE'
          zona_escolar?: string
          telefono?: string | null
          updated_at?: string
          last_login?: string | null
        }
      }
      escuelas: {
        Row: {
          id: string
          nombre: string
          cct: string
          nivel: string
          turno: 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO' | 'JORNADA_AMPLIADA' | 'TIEMPO_COMPLETO' | 'AMBOS'
          modalidad: string
          director: string
          zona_escolar: string
          region: 'HUASTECA_CENTRO' | 'HUASTECA_NORTE' | 'HUASTECA_SUR'
          direccion: {
            calle: string
            colonia: string
            municipio: string
            localidad: string
            codigoPostal: string
          }
          contacto: {
            telefono: string
            email: string
            celular?: string
          }
          estadisticas: {
            totalAlumnos: number
            totalDocentes: number
            gruposPorGrado: Record<string, number>
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          cct: string
          nivel: string
          turno: 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO' | 'JORNADA_AMPLIADA' | 'TIEMPO_COMPLETO' | 'AMBOS'
          modalidad: string
          director: string
          zona_escolar: string
          region: 'HUASTECA_CENTRO' | 'HUASTECA_NORTE' | 'HUASTECA_SUR'
          direccion: {
            calle: string
            colonia: string
            municipio: string
            localidad: string
            codigoPostal: string
          }
          contacto: {
            telefono: string
            email: string
            celular?: string
          }
          estadisticas: {
            totalAlumnos: number
            totalDocentes: number
            gruposPorGrado: Record<string, number>
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          cct?: string
          nivel?: string
          turno?: 'MATUTINO' | 'VESPERTINO' | 'NOCTURNO' | 'JORNADA_AMPLIADA' | 'TIEMPO_COMPLETO' | 'AMBOS'
          modalidad?: string
          director?: string
          zona_escolar?: string
          region?: 'HUASTECA_CENTRO' | 'HUASTECA_NORTE' | 'HUASTECA_SUR'
          direccion?: {
            calle: string
            colonia: string
            municipio: string
            localidad: string
            codigoPostal: string
          }
          contacto?: {
            telefono: string
            email: string
            celular?: string
          }
          estadisticas?: {
            totalAlumnos: number
            totalDocentes: number
            gruposPorGrado: Record<string, number>
          }
          updated_at?: string
        }
      }
      diagnosticos: {
        Row: {
          id: string
          escuela_id: string
          usuario_id: string
          estado: 'BORRADOR' | 'EN_CAPTURA' | 'COMPLETADO' | 'VALIDADO' | 'APROBADO'
          datos_generales: {
            escuelaId: string
            nombreEscuela: string
            cct: string
            cicloEscolar: string
            fechaInicio: string
            fechaFin?: string
            responsable: {
              nombre: string
              cargo: string
              email: string
            }
            participantes: string[]
          }
          dimension_aprovechamiento: any | null
          dimension_practicas_docentes: any | null
          dimension_formacion_docente: any | null
          dimension_planes_programa: any | null
          dimension_participacion_familia: any | null
          puntajes: any | null
          puntaje_general: number | null
          nivel_general: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE' | null
          version: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          escuela_id: string
          usuario_id: string
          estado?: 'BORRADOR' | 'EN_CAPTURA' | 'COMPLETADO' | 'VALIDADO' | 'APROBADO'
          datos_generales: {
            escuelaId: string
            nombreEscuela: string
            cct: string
            cicloEscolar: string
            fechaInicio: string
            fechaFin?: string
            responsable: {
              nombre: string
              cargo: string
              email: string
            }
            participantes: string[]
          }
          dimension_aprovechamiento?: any | null
          dimension_practicas_docentes?: any | null
          dimension_formacion_docente?: any | null
          dimension_planes_programa?: any | null
          dimension_participacion_familia?: any | null
          puntajes?: any | null
          puntaje_general?: number | null
          nivel_general?: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE' | null
          version?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          escuela_id?: string
          usuario_id?: string
          estado?: 'BORRADOR' | 'EN_CAPTURA' | 'COMPLETADO' | 'VALIDADO' | 'APROBADO'
          datos_generales?: {
            escuelaId: string
            nombreEscuela: string
            cct: string
            cicloEscolar: string
            fechaInicio: string
            fechaFin?: string
            responsable: {
              nombre: string
              cargo: string
              email: string
            }
            participantes: string[]
          }
          dimension_aprovechamiento?: any | null
          dimension_practicas_docentes?: any | null
          dimension_formacion_docente?: any | null
          dimension_planes_programa?: any | null
          dimension_participacion_familia?: any | null
          puntajes?: any | null
          puntaje_general?: number | null
          nivel_general?: 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE' | null
          version?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}