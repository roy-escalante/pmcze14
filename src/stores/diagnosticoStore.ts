import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DiagnosticoNEM, EstadoDiagnostico, DimensionNEM, PuntajeDimension, PlantillaDimension } from '../types'

interface DiagnosticoState {
  // Estado principal
  diagnosticos: DiagnosticoNEM[]
  diagnosticoActual: DiagnosticoNEM | null
  plantillas: PlantillaDimension[]
  loading: boolean
  error: string | null

  // Acciones CRUD
  crearDiagnostico: (datos: Partial<DiagnosticoNEM>) => Promise<string>
  obtenerDiagnosticos: () => DiagnosticoNEM[]
  obtenerDiagnostico: (id: string) => DiagnosticoNEM | null
  actualizarDiagnostico: (id: string, datos: Partial<DiagnosticoNEM>) => Promise<boolean>
  eliminarDiagnostico: (id: string) => Promise<void>
  
  // Gestión de estado actual
  seleccionarDiagnostico: (id: string) => void
  limpiarDiagnosticoActual: () => void
  
  // Cálculos y validaciones
  calcularPuntajeDimension: (dimension: any, tipo: DimensionNEM) => PuntajeDimension
  calcularPuntajeGeneral: (puntajes: PuntajeDimension[]) => number
  obtenerNivelPorPuntaje: (porcentaje: number) => 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DEFICIENTE'
  
  // Auto-guardado y persistencia
  autoGuardar: (id: string) => Promise<void>
  exportarDiagnostico: (id: string) => string
  
  // Utilidades
  filtrarPorEstado: (estado: EstadoDiagnostico) => DiagnosticoNEM[]
  filtrarPorEscuela: (escuelaId: string) => DiagnosticoNEM[]
  obtenerEstadisticas: () => {
    total: number
    porEstado: Record<EstadoDiagnostico, number>
    promedioGeneral: number
  }
  
  // Inicialización
  inicializarPlantillas: () => void
}

// Plantillas predefinidas para las 5 dimensiones NEM
const plantillasBase: PlantillaDimension[] = [
  {
    dimension: DimensionNEM.APROVECHAMIENTO_ACADEMICO,
    nombre: 'Aprovechamiento académico y asistencia de los alumnos',
    descripcion: 'Evaluación del rendimiento académico y la asistencia regular de los estudiantes',
    criterios: [
      {
        seccion: 'Indicadores Académicos',
        items: [
          {
            id: 'promedio_general',
            nombre: 'Promedio General',
            descripcion: 'Promedio académico general de la escuela',
            peso: 25
          },
          {
            id: 'eficiencia_terminal',
            nombre: 'Eficiencia Terminal',
            descripcion: 'Porcentaje de alumnos que terminan el ciclo escolar',
            peso: 25
          },
          {
            id: 'indice_reprobacion',
            nombre: 'Índice de Reprobación',
            descripcion: 'Porcentaje de alumnos reprobados',
            peso: 20
          },
          {
            id: 'indice_desercion',
            nombre: 'Índice de Deserción',
            descripcion: 'Porcentaje de alumnos que abandonan sus estudios',
            peso: 20
          }
        ]
      },
      {
        seccion: 'Asistencia de Alumnos',
        items: [
          {
            id: 'promedio_asistencia',
            nombre: 'Promedio de Asistencia',
            descripcion: 'Porcentaje promedio de asistencia diaria',
            peso: 10
          }
        ]
      }
    ]
  },
  {
    dimension: DimensionNEM.PRACTICAS_DOCENTES,
    nombre: 'Prácticas docentes y directivas',
    descripcion: 'Evaluación de las prácticas pedagógicas y de gestión en la escuela',
    criterios: [
      {
        seccion: 'Planeación Didáctica',
        items: [
          {
            id: 'elaboracion_planes',
            nombre: 'Elaboración de Planes',
            descripcion: 'Calidad y completitud de la planeación didáctica',
            peso: 20
          },
          {
            id: 'adecuaciones_nee',
            nombre: 'Adecuaciones para NEE',
            descripcion: 'Adaptaciones para necesidades educativas especiales',
            peso: 15
          },
          {
            id: 'uso_programas_estudio',
            nombre: 'Uso de Programas de Estudio',
            descripcion: 'Implementación correcta de los programas oficiales',
            peso: 20
          }
        ]
      },
      {
        seccion: 'Ambiente de Aprendizaje',
        items: [
          {
            id: 'clima_aula',
            nombre: 'Clima de Aula',
            descripcion: 'Ambiente propicio para el aprendizaje',
            peso: 15
          },
          {
            id: 'inclusion_diversidad',
            nombre: 'Inclusión y Diversidad',
            descripcion: 'Atención a la diversidad cultural y social',
            peso: 15
          },
          {
            id: 'convivencia_pacifica',
            nombre: 'Convivencia Pacífica',
            descripcion: 'Promoción de valores y convivencia armónica',
            peso: 15
          }
        ]
      }
    ]
  }
  // Se pueden agregar más plantillas para las otras dimensiones
]

export const useDiagnostico = create<DiagnosticoState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      diagnosticos: [],
      diagnosticoActual: null,
      plantillas: [],
      loading: false,
      error: null,

      // Inicialización de plantillas
      inicializarPlantillas: () => {
        set({ plantillas: plantillasBase })
      },

      // Crear nuevo diagnóstico
      crearDiagnostico: async (datos) => {
        set({ loading: true, error: null })
        try {
          const nuevoDiagnostico: DiagnosticoNEM = {
            id: `diag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            estado: EstadoDiagnostico.BORRADOR,
            version: '1.0',
            createdAt: new Date(),
            updatedAt: new Date(),
            ...datos
          } as DiagnosticoNEM

          set(state => ({
            diagnosticos: [...state.diagnosticos, nuevoDiagnostico],
            diagnosticoActual: nuevoDiagnostico,
            loading: false
          }))

          return nuevoDiagnostico.id
        } catch (error) {
          set({ error: 'Error al crear el diagnóstico', loading: false })
          throw error
        }
      },

      // Obtener todos los diagnósticos
      obtenerDiagnosticos: () => {
        return get().diagnosticos
      },

      // Obtener diagnóstico por ID
      obtenerDiagnostico: (id) => {
        return get().diagnosticos.find(d => d.id === id) || null
      },

      // Actualizar diagnóstico
      actualizarDiagnostico: async (id, datos) => {
        set({ loading: true, error: null })
        try {
          // Actualizar en memoria local
          set(state => ({
            diagnosticos: state.diagnosticos.map(d => 
              d.id === id 
                ? { ...d, ...datos, updatedAt: new Date() }
                : d
            ),
            diagnosticoActual: state.diagnosticoActual?.id === id
              ? { ...state.diagnosticoActual, ...datos, updatedAt: new Date() }
              : state.diagnosticoActual,
            loading: false
          }))
          
          console.log(`Diagnóstico ${id} actualizado exitosamente en memoria local`)
          
          // TODO: Aquí se debe agregar la persistencia a Supabase cuando esté implementada
          // await supabase.from('diagnosticos').update(datos).eq('id', id)
          
          return true // Indicar éxito
        } catch (error) {
          console.error('Error al actualizar diagnóstico:', error)
          set({ error: 'Error al actualizar el diagnóstico', loading: false })
          return false // Indicar fallo
        }
      },

      // Eliminar diagnóstico
      eliminarDiagnostico: async (id) => {
        set({ loading: true, error: null })
        try {
          set(state => ({
            diagnosticos: state.diagnosticos.filter(d => d.id !== id),
            diagnosticoActual: state.diagnosticoActual?.id === id ? null : state.diagnosticoActual,
            loading: false
          }))
        } catch (error) {
          set({ error: 'Error al eliminar el diagnóstico', loading: false })
          throw error
        }
      },

      // Seleccionar diagnóstico actual
      seleccionarDiagnostico: (id) => {
        const diagnostico = get().obtenerDiagnostico(id)
        set({ diagnosticoActual: diagnostico })
      },

      // Limpiar diagnóstico actual
      limpiarDiagnosticoActual: () => {
        set({ diagnosticoActual: null })
      },

      // Calcular puntaje de una dimensión
      calcularPuntajeDimension: (dimension, tipo) => {
        const { obtenerNivelPorPuntaje } = get()
        
        let totalPuntaje = 0
        let totalItems = 0
        const fortalezas: string[] = []
        const areasOportunidad: string[] = []

        // Función recursiva para procesar criterios
        const procesarCriterios = (obj: any) => {
          Object.values(obj).forEach((criterio: any) => {
            if (criterio && typeof criterio === 'object') {
              if ('valoracion' in criterio) {
                totalPuntaje += criterio.valoracion
                totalItems++
                
                if (criterio.valoracion >= 3) {
                  fortalezas.push(criterio.nombre)
                } else {
                  areasOportunidad.push(criterio.nombre)
                }
              } else {
                procesarCriterios(criterio)
              }
            }
          })
        }

        procesarCriterios(dimension)

        const puntajeMaximo = totalItems * 4
        const porcentaje = totalItems > 0 ? (totalPuntaje / puntajeMaximo) * 100 : 0

        return {
          dimension: tipo,
          puntajeObtenido: totalPuntaje,
          puntajeMaximo,
          porcentaje: Math.round(porcentaje * 100) / 100,
          nivel: obtenerNivelPorPuntaje(porcentaje),
          fortalezas,
          areasOportunidad
        }
      },

      // Calcular puntaje general
      calcularPuntajeGeneral: (puntajes) => {
        if (puntajes.length === 0) return 0
        const promedio = puntajes.reduce((suma, p) => suma + p.porcentaje, 0) / puntajes.length
        return Math.round(promedio * 100) / 100
      },

      // Obtener nivel por puntaje
      obtenerNivelPorPuntaje: (porcentaje) => {
        if (porcentaje >= 90) return 'EXCELENTE'
        if (porcentaje >= 75) return 'BUENO'
        if (porcentaje >= 60) return 'REGULAR'
        return 'DEFICIENTE'
      },

      // Auto-guardado
      autoGuardar: async (id) => {
        const { diagnosticoActual, actualizarDiagnostico } = get()
        if (diagnosticoActual && diagnosticoActual.id === id) {
          await actualizarDiagnostico(id, diagnosticoActual)
        }
      },

      // Exportar diagnóstico
      exportarDiagnostico: (id) => {
        const diagnostico = get().obtenerDiagnostico(id)
        if (!diagnostico) return ''
        return JSON.stringify(diagnostico, null, 2)
      },

      // Filtros
      filtrarPorEstado: (estado) => {
        return get().diagnosticos.filter(d => d.estado === estado)
      },

      filtrarPorEscuela: (escuelaId) => {
        return get().diagnosticos.filter(d => d.datosGenerales.escuelaId === escuelaId)
      },

      // Estadísticas
      obtenerEstadisticas: () => {
        const { diagnosticos } = get()
        
        const porEstado = diagnosticos.reduce((acc, d) => {
          acc[d.estado] = (acc[d.estado] || 0) + 1
          return acc
        }, {} as Record<EstadoDiagnostico, number>)

        // Asegurar que todos los estados estén representados
        Object.values(EstadoDiagnostico).forEach(estado => {
          if (!(estado in porEstado)) {
            porEstado[estado] = 0
          }
        })

        const diagnosticosCompletos = diagnosticos.filter(d => d.puntajeGeneral !== undefined)
        const promedioGeneral = diagnosticosCompletos.length > 0
          ? diagnosticosCompletos.reduce((suma, d) => suma + (d.puntajeGeneral || 0), 0) / diagnosticosCompletos.length
          : 0

        return {
          total: diagnosticos.length,
          porEstado,
          promedioGeneral: Math.round(promedioGeneral * 100) / 100
        }
      }
    }),
    {
      name: 'diagnostico-store',
      version: 1
    }
  )
)

// Hook personalizado para inicialización
export const useInicializarDiagnostico = () => {
  const { inicializarPlantillas, plantillas } = useDiagnostico()
  
  React.useEffect(() => {
    if (plantillas.length === 0) {
      inicializarPlantillas()
    }
  }, [inicializarPlantillas, plantillas.length])
}

export default useDiagnostico