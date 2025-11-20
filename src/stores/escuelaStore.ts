import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Escuela, Region, ESCUELAS_ZE14 } from '../types'

interface EscuelaState {
  escuelas: Escuela[]
  escuelaSeleccionada: Escuela | null
  isLoading: boolean
  filtroRegion: Region | 'TODAS'
}

interface EscuelaActions {
  // CRUD Operations
  crearEscuela: (escuela: Omit<Escuela, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>
  actualizarEscuela: (id: string, escuela: Partial<Escuela>) => Promise<boolean>
  eliminarEscuela: (id: string) => Promise<boolean>
  obtenerEscuela: (id: string) => Escuela | undefined
  
  // UI State Management
  setEscuelaSeleccionada: (escuela: Escuela | null) => void
  setFiltroRegion: (region: Region | 'TODAS') => void
  setLoading: (loading: boolean) => void
  
  // Utility functions
  obtenerEscuelasPorRegion: (region: Region) => Escuela[]
  obtenerEscuelasFiltradas: () => Escuela[]
  inicializarEscuelasDemo: () => void
  validarCCT: (cct: string, escuelaId?: string) => boolean
}

type EscuelaStore = EscuelaState & EscuelaActions

// Datos demo para desarrollo (reemplazar con API real más adelante)
const crearEscuelasDemo = (): Escuela[] => {
  return ESCUELAS_ZE14.map((escuela) => ({
    id: `escuela-${escuela.numeroEST}`,
    cct: `14DTV${String(escuela.numeroEST).padStart(4, '0')}K`, // Formato CCT real
    nombre: `Escuela Secundaria Técnica ${escuela.numeroEST}`,
    numeroEST: escuela.numeroEST,
    region: escuela.region,
    direccion: {
      calle: `Calle Principal ${escuela.numeroEST}`,
      colonia: 'Centro',
      municipio: escuela.region === Region.NORTE ? 'Tamazunchale' : 'Ciudad Valles',
      localidad: `Localidad EST ${escuela.numeroEST}`,
      codigoPostal: escuela.region === Region.NORTE ? '79960' : '79000'
    },
    contacto: {
      telefono: `481-${escuela.numeroEST}-0000`,
      email: `est${escuela.numeroEST}@pmcze14.edu.mx`
    },
    directorId: undefined,
    matriculaTotal: 180 + (escuela.numeroEST * 10), // Matrícula simulada
    numeroDocentes: 12 + Math.floor(escuela.numeroEST / 10),
    turno: 'MATUTINO' as const,
    activa: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }))
}

// Store principal de escuelas
export const useEscuelaStore = create<EscuelaStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      escuelas: [],
      escuelaSeleccionada: null,
      isLoading: false,
      filtroRegion: 'TODAS',

      // CRUD Operations
      crearEscuela: async (nuevaEscuela) => {
        set({ isLoading: true })
        
        try {
          // Simular delay de API
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const escuela: Escuela = {
            ...nuevaEscuela,
            id: `escuela-${Date.now()}`, // ID temporal (reemplazar con backend)
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          set(state => ({
            escuelas: [...state.escuelas, escuela],
            isLoading: false
          }))
          
          return true
        } catch (error) {
          console.error('Error al crear escuela:', error)
          set({ isLoading: false })
          return false
        }
      },

      actualizarEscuela: async (id, escuelaActualizada) => {
        set({ isLoading: true })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300))
          
          set(state => ({
            escuelas: state.escuelas.map(escuela =>
              escuela.id === id
                ? { ...escuela, ...escuelaActualizada, updatedAt: new Date() }
                : escuela
            ),
            isLoading: false,
            escuelaSeleccionada: state.escuelaSeleccionada?.id === id
              ? { ...state.escuelaSeleccionada, ...escuelaActualizada, updatedAt: new Date() }
              : state.escuelaSeleccionada
          }))
          
          return true
        } catch (error) {
          console.error('Error al actualizar escuela:', error)
          set({ isLoading: false })
          return false
        }
      },

      eliminarEscuela: async (id) => {
        set({ isLoading: true })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 300))
          
          set(state => ({
            escuelas: state.escuelas.filter(escuela => escuela.id !== id),
            isLoading: false,
            escuelaSeleccionada: state.escuelaSeleccionada?.id === id ? null : state.escuelaSeleccionada
          }))
          
          return true
        } catch (error) {
          console.error('Error al eliminar escuela:', error)
          set({ isLoading: false })
          return false
        }
      },

      obtenerEscuela: (id) => {
        return get().escuelas.find(escuela => escuela.id === id)
      },

      // UI State Management
      setEscuelaSeleccionada: (escuela) => {
        set({ escuelaSeleccionada: escuela })
      },

      setFiltroRegion: (region) => {
        set({ filtroRegion: region })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      // Utility functions
      obtenerEscuelasPorRegion: (region) => {
        return get().escuelas.filter(escuela => escuela.region === region)
      },

      obtenerEscuelasFiltradas: () => {
        const { escuelas, filtroRegion } = get()
        
        if (filtroRegion === 'TODAS') {
          return escuelas
        }
        
        return escuelas.filter(escuela => escuela.region === filtroRegion)
      },

      inicializarEscuelasDemo: () => {
        const escuelasDemo = crearEscuelasDemo()
        set({ escuelas: escuelasDemo })
      },

      validarCCT: (cct, escuelaId) => {
        const { escuelas } = get()
        
        // Validar formato CCT (14DTV####K)
        const formatoCCT = /^14DTV\d{4}K$/
        if (!formatoCCT.test(cct)) {
          return false
        }
        
        // Validar unicidad
        const cctExiste = escuelas.some(escuela => 
          escuela.cct === cct && escuela.id !== escuelaId
        )
        
        return !cctExiste
      }
    }),
    {
      name: 'pmcze14-escuelas',
      partialize: (state) => ({
        escuelas: state.escuelas,
        filtroRegion: state.filtroRegion
      })
    }
  )
)

// Hook personalizado para usar el store de escuelas
export const useEscuelas = () => {
  const store = useEscuelaStore()
  
  return {
    // Estado
    escuelas: store.escuelas,
    escuelaSeleccionada: store.escuelaSeleccionada,
    isLoading: store.isLoading,
    filtroRegion: store.filtroRegion,
    
    // Acciones
    crearEscuela: store.crearEscuela,
    actualizarEscuela: store.actualizarEscuela,
    eliminarEscuela: store.eliminarEscuela,
    obtenerEscuela: store.obtenerEscuela,
    
    // UI
    setEscuelaSeleccionada: store.setEscuelaSeleccionada,
    setFiltroRegion: store.setFiltroRegion,
    
    // Utilidades
    escuelasFiltradas: store.obtenerEscuelasFiltradas(),
    escuelasNorte: store.obtenerEscuelasPorRegion(Region.NORTE),
    escuelasSur: store.obtenerEscuelasPorRegion(Region.SUR),
    inicializarDemo: store.inicializarEscuelasDemo,
    validarCCT: store.validarCCT,
    
    // Estadísticas
    totalEscuelas: store.escuelas.length,
    escuelasActivas: store.escuelas.filter(e => e.activa).length,
    escuelasInactivas: store.escuelas.filter(e => !e.activa).length
  }
}