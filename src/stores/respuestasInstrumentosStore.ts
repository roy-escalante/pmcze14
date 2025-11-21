/**
 * 🗂️ STORE: Respuestas de Instrumentos (Sistema v2)
 *
 * Maneja el estado de múltiples respuestas por tipo de instrumento
 * Permite agregar, editar, eliminar y consultar respuestas individuales
 */

import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { RespuestaInstrumento, FormularioTipo, EstadisticasInstrumento } from '../types'

interface RespuestasInstrumentosState {
  // Estado
  respuestas: RespuestaInstrumento[]
  cargando: boolean
  error: string | null

  // Acciones CRUD
  cargarRespuestas: (diagnosticoId: string) => Promise<void>
  cargarRespuestasPorTipo: (diagnosticoId: string, tipo: FormularioTipo) => Promise<void>
  agregarRespuesta: (respuesta: Omit<RespuestaInstrumento, 'id' | 'createdAt' | 'updatedAt'>) => Promise<RespuestaInstrumento | null>
  actualizarRespuesta: (id: string, respuesta: Partial<RespuestaInstrumento>) => Promise<boolean>
  eliminarRespuesta: (id: string) => Promise<boolean>

  // Consultas
  obtenerRespuestasPorTipo: (diagnosticoId: string, tipo: FormularioTipo) => RespuestaInstrumento[]
  obtenerEstadisticas: (diagnosticoId: string, tipo: FormularioTipo) => EstadisticasInstrumento | null
  contarRespuestas: (diagnosticoId: string, tipo: FormularioTipo) => number

  // Utilidades
  limpiarRespuestas: () => void
}

export const useRespuestasInstrumentos = create<RespuestasInstrumentosState>((set, get) => ({
  // Estado inicial
  respuestas: [],
  cargando: false,
  error: null,

  // Cargar todas las respuestas de un diagnóstico
  cargarRespuestas: async (diagnosticoId: string) => {
    set({ cargando: true, error: null })

    try {
      const { data, error } = await supabase
        .from('respuestas_instrumentos')
        .select('*')
        .eq('diagnostico_id', diagnosticoId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transformar datos de Supabase a nuestro tipo
      const respuestas: RespuestaInstrumento[] = (data || []).map(row => ({
        id: row.id,
        diagnosticoId: row.diagnostico_id,
        formularioTipo: row.formulario_tipo as FormularioTipo,
        respondente: {
          nombre: row.respondente_nombre,
          rol: row.respondente_rol,
          grado: row.respondente_grado,
          grupo: row.respondente_grupo,
          edad: row.respondente_edad,
          genero: row.respondente_genero,
          asignatura: row.respondente_asignatura,
          anosExperiencia: row.respondente_anos_experiencia,
          observaciones: row.observaciones
        },
        respuestas: row.respuestas,
        porcentajeCompletitud: row.porcentaje_completitud,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }))

      set({ respuestas, cargando: false })
    } catch (error: any) {
      console.error('Error cargando respuestas:', error)
      set({ error: error.message, cargando: false })
    }
  },

  // Cargar respuestas filtradas por tipo
  cargarRespuestasPorTipo: async (diagnosticoId: string, tipo: FormularioTipo) => {
    set({ cargando: true, error: null })

    try {
      const { data, error } = await supabase
        .from('respuestas_instrumentos')
        .select('*')
        .eq('diagnostico_id', diagnosticoId)
        .eq('formulario_tipo', tipo)
        .order('created_at', { ascending: false })

      if (error) throw error

      const respuestas: RespuestaInstrumento[] = (data || []).map(row => ({
        id: row.id,
        diagnosticoId: row.diagnostico_id,
        formularioTipo: row.formulario_tipo as FormularioTipo,
        respondente: {
          nombre: row.respondente_nombre,
          rol: row.respondente_rol,
          grado: row.respondente_grado,
          grupo: row.respondente_grupo,
          edad: row.respondente_edad,
          genero: row.respondente_genero,
          asignatura: row.respondente_asignatura,
          anosExperiencia: row.respondente_anos_experiencia,
          observaciones: row.observaciones
        },
        respuestas: row.respuestas,
        porcentajeCompletitud: row.porcentaje_completitud,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }))

      set({ respuestas, cargando: false })
    } catch (error: any) {
      console.error('Error cargando respuestas por tipo:', error)
      set({ error: error.message, cargando: false })
    }
  },

  // Agregar una nueva respuesta
  agregarRespuesta: async (respuesta) => {
    set({ cargando: true, error: null })

    try {
      const { data, error } = await supabase
        .from('respuestas_instrumentos')
        .insert({
          diagnostico_id: respuesta.diagnosticoId,
          formulario_tipo: respuesta.formularioTipo,
          respondente_nombre: respuesta.respondente.nombre,
          respondente_rol: respuesta.respondente.rol,
          respondente_grado: respuesta.respondente.grado,
          respondente_grupo: respuesta.respondente.grupo,
          respondente_edad: respuesta.respondente.edad,
          respondente_genero: respuesta.respondente.genero,
          respondente_asignatura: respuesta.respondente.asignatura,
          respondente_anos_experiencia: respuesta.respondente.anosExperiencia,
          respuestas: respuesta.respuestas,
          porcentaje_completitud: respuesta.porcentajeCompletitud,
          observaciones: respuesta.respondente.observaciones
        })
        .select()
        .single()

      if (error) throw error

      // Agregar al estado local
      const nuevaRespuesta: RespuestaInstrumento = {
        id: data.id,
        diagnosticoId: data.diagnostico_id,
        formularioTipo: data.formulario_tipo as FormularioTipo,
        respondente: {
          nombre: data.respondente_nombre,
          rol: data.respondente_rol,
          grado: data.respondente_grado,
          grupo: data.respondente_grupo,
          edad: data.respondente_edad,
          genero: data.respondente_genero,
          asignatura: data.respondente_asignatura,
          anosExperiencia: data.respondente_anos_experiencia,
          observaciones: data.observaciones
        },
        respuestas: data.respuestas,
        porcentajeCompletitud: data.porcentaje_completitud,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }

      set(state => ({
        respuestas: [nuevaRespuesta, ...state.respuestas],
        cargando: false
      }))

      return nuevaRespuesta
    } catch (error: any) {
      console.error('Error agregando respuesta:', error)
      set({ error: error.message, cargando: false })
      return null
    }
  },

  // Actualizar una respuesta existente
  actualizarRespuesta: async (id, respuestaActualizada) => {
    set({ cargando: true, error: null })

    try {
      const updateData: any = {}

      if (respuestaActualizada.respondente) {
        updateData.respondente_nombre = respuestaActualizada.respondente.nombre
        updateData.respondente_rol = respuestaActualizada.respondente.rol
        updateData.respondente_grado = respuestaActualizada.respondente.grado
        updateData.respondente_grupo = respuestaActualizada.respondente.grupo
        updateData.respondente_edad = respuestaActualizada.respondente.edad
        updateData.respondente_genero = respuestaActualizada.respondente.genero
        updateData.respondente_asignatura = respuestaActualizada.respondente.asignatura
        updateData.respondente_anos_experiencia = respuestaActualizada.respondente.anosExperiencia
        updateData.observaciones = respuestaActualizada.respondente.observaciones
      }

      if (respuestaActualizada.respuestas) {
        updateData.respuestas = respuestaActualizada.respuestas
      }

      if (respuestaActualizada.porcentajeCompletitud !== undefined) {
        updateData.porcentaje_completitud = respuestaActualizada.porcentajeCompletitud
      }

      const { error } = await supabase
        .from('respuestas_instrumentos')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      // Actualizar estado local
      set(state => ({
        respuestas: state.respuestas.map(r =>
          r.id === id
            ? { ...r, ...respuestaActualizada, updatedAt: new Date() }
            : r
        ),
        cargando: false
      }))

      return true
    } catch (error: any) {
      console.error('Error actualizando respuesta:', error)
      set({ error: error.message, cargando: false })
      return false
    }
  },

  // Eliminar una respuesta
  eliminarRespuesta: async (id) => {
    set({ cargando: true, error: null })

    try {
      const { error } = await supabase
        .from('respuestas_instrumentos')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remover del estado local
      set(state => ({
        respuestas: state.respuestas.filter(r => r.id !== id),
        cargando: false
      }))

      return true
    } catch (error: any) {
      console.error('Error eliminando respuesta:', error)
      set({ error: error.message, cargando: false })
      return false
    }
  },

  // Obtener respuestas filtradas por tipo
  obtenerRespuestasPorTipo: (diagnosticoId, tipo) => {
    return get().respuestas.filter(
      r => r.diagnosticoId === diagnosticoId && r.formularioTipo === tipo
    )
  },

  // Calcular estadísticas de un tipo de instrumento
  obtenerEstadisticas: (diagnosticoId, tipo) => {
    const respuestasFiltradas = get().obtenerRespuestasPorTipo(diagnosticoId, tipo)

    if (respuestasFiltradas.length === 0) return null

    // Calcular completitud promedio
    const completitudPromedio =
      respuestasFiltradas.reduce((sum, r) => sum + r.porcentajeCompletitud, 0) /
      respuestasFiltradas.length

    // Contar roles distintos
    const rolesUnicos = new Set(respuestasFiltradas.map(r => r.respondente.rol))

    // Contar grados distintos
    const gradosUnicos = new Set(
      respuestasFiltradas
        .map(r => r.respondente.grado)
        .filter(Boolean)
    )

    // Distribución por rol
    const porRol: Record<string, number> = {}
    respuestasFiltradas.forEach(r => {
      porRol[r.respondente.rol] = (porRol[r.respondente.rol] || 0) + 1
    })

    // Distribución por grado (si aplica)
    const porGrado: Record<string, number> = {}
    respuestasFiltradas.forEach(r => {
      if (r.respondente.grado) {
        porGrado[r.respondente.grado] = (porGrado[r.respondente.grado] || 0) + 1
      }
    })

    return {
      diagnosticoId,
      formularioTipo: tipo,
      totalRespuestas: respuestasFiltradas.length,
      completitudPromedio,
      rolesDistintos: rolesUnicos.size,
      gradosDistintos: gradosUnicos.size,
      porRol,
      porGrado: Object.keys(porGrado).length > 0 ? porGrado : undefined
    }
  },

  // Contar respuestas de un tipo
  contarRespuestas: (diagnosticoId, tipo) => {
    return get().obtenerRespuestasPorTipo(diagnosticoId, tipo).length
  },

  // Limpiar estado
  limpiarRespuestas: () => {
    set({ respuestas: [], error: null, cargando: false })
  }
}))
