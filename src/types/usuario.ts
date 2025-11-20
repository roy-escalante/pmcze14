/**
 * Tipos de usuario del sistema PMCZE14
 */
export enum RolUsuario {
  SUPERVISOR = 'SUPERVISOR',
  INSPECTOR = 'INSPECTOR',
  DIRECTOR = 'DIRECTOR',
  DOCENTE = 'DOCENTE',
  PADRE = 'PADRE',
  ESTUDIANTE = 'ESTUDIANTE',
}

/**
 * Interfaz base para usuario
 */
export interface Usuario {
  id: string
  nombre: string
  apellidoPaterno: string
  apellidoMaterno?: string
  email: string
  rol: RolUsuario
  activo: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Usuario Supervisor
 */
export interface Supervisor extends Usuario {
  rol: RolUsuario.SUPERVISOR
  zonaEscolar: string
  regionAsignada: 'NORTE' | 'SUR' | 'AMBAS'
}

/**
 * Usuario Inspector
 */
export interface Inspector extends Usuario {
  rol: RolUsuario.INSPECTOR
  regionAsignada: 'NORTE' | 'SUR'
}

/**
 * Usuario Director
 */
export interface Director extends Usuario {
  rol: RolUsuario.DIRECTOR
  escuelaId: string
  cct: string
}

/**
 * Usuario Docente
 */
export interface Docente extends Usuario {
  rol: RolUsuario.DOCENTE
  escuelaId: string
  especialidad?: string
  grado?: number
  grupo?: string
}
