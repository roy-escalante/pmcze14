/**
 * Tipos relacionados con las escuelas de la Zona Escolar 14
 */

export enum Region {
  NORTE = 'NORTE',
  SUR = 'SUR',
}

/**
 * Información de una Escuela Secundaria Técnica
 */
export interface Escuela {
  id: string
  cct: string // Clave de Centro de Trabajo
  nombre: string
  numeroEST: number // 4, 7, 41, 77, 81, 82
  region: Region
  direccion: {
    calle: string
    colonia: string
    municipio: string
    localidad: string
    codigoPostal: string
  }
  contacto: {
    telefono?: string
    email?: string
  }
  directorId?: string
  matriculaTotal: number
  numeroDocentes: number
  turno: 'MATUTINO' | 'VESPERTINO' | 'AMBOS'
  activa: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Catálogo de las 6 escuelas de la Zona Escolar 14
 */
export const ESCUELAS_ZE14: Pick<Escuela, 'numeroEST' | 'region'>[] = [
  { numeroEST: 41, region: Region.NORTE },
  { numeroEST: 77, region: Region.NORTE },
  { numeroEST: 81, region: Region.NORTE },
  { numeroEST: 4, region: Region.SUR },
  { numeroEST: 7, region: Region.SUR },
  { numeroEST: 82, region: Region.SUR },
]
