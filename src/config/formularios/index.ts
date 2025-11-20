/**
 * Índice central de configuraciones de formularios
 * Exporta todas las configuraciones de los 5 instrumentos
 */

import { FormularioConfig, FormularioTipo } from '../../types'
import { formularioAmbienteFamiliar } from './ambiente-familiar'

// Los otros formularios se crearán con estructura similar
// Por ahora exportamos el que tenemos completo y crearemos placeholders

export const FORMULARIOS_CONFIG: Record<FormularioTipo, FormularioConfig> = {
  [FormularioTipo.AMBIENTE_FAMILIAR]: formularioAmbienteFamiliar,
  [FormularioTipo.DESARROLLO_INTEGRAL]: formularioAmbienteFamiliar, // TODO: Crear
  [FormularioTipo.AMBIENTE_APRENDIZAJE]: formularioAmbienteFamiliar, // TODO: Crear
  [FormularioTipo.PRACTICAS_DOCENTES]: formularioAmbienteFamiliar, // TODO: Crear
  [FormularioTipo.FORMACION_DOCENTE]: formularioAmbienteFamiliar, // TODO: Crear
}

/**
 * Obtener configuración de un formulario específico
 */
export function getFormularioConfig(tipo: FormularioTipo): FormularioConfig {
  const config = FORMULARIOS_CONFIG[tipo]
  if (!config) {
    throw new Error(`No se encontró configuración para el formulario: ${tipo}`)
  }
  return config
}

/**
 * Obtener todos los formularios
 */
export function getAllFormularios(): FormularioConfig[] {
  return Object.values(FORMULARIOS_CONFIG)
}

/**
 * Calcular el número total de preguntas de un formulario
 */
export function getTotalPreguntas(config: FormularioConfig): number {
  return config.secciones.reduce((total, seccion) => {
    return total + seccion.preguntas.length
  }, 0)
}

/**
 * Obtener preguntas requeridas de un formulario
 */
export function getPreguntasRequeridas(config: FormularioConfig): number {
  let total = 0
  config.secciones.forEach(seccion => {
    seccion.preguntas.forEach(pregunta => {
      if (pregunta.requerido) total++
    })
  })
  return total
}
