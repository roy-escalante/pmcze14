/**
 * Índice central de configuraciones de formularios
 * Exporta todas las configuraciones de los 5 instrumentos
 */

import { FormularioConfig, FormularioTipo } from '../../types'
import { formularioAmbienteFamiliar } from './ambiente-familiar'
import { formularioDesarrolloIntegral } from './desarrollo-integral'
import { formularioAmbienteAprendizaje } from './ambiente-aprendizaje'
import { formularioPracticasDocentes } from './practicas-docentes'
import { formularioFormacionDocente } from './formacion-docente'

/**
 * Configuración de todos los formularios del diagnóstico
 */
export const FORMULARIOS_CONFIG: Record<FormularioTipo, FormularioConfig> = {
  [FormularioTipo.AMBIENTE_FAMILIAR]: formularioAmbienteFamiliar,
  [FormularioTipo.DESARROLLO_INTEGRAL]: formularioDesarrolloIntegral,
  [FormularioTipo.AMBIENTE_APRENDIZAJE]: formularioAmbienteAprendizaje,
  [FormularioTipo.PRACTICAS_DOCENTES]: formularioPracticasDocentes,
  [FormularioTipo.FORMACION_DOCENTE]: formularioFormacionDocente,
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
