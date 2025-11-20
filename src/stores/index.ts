// Zustand stores for global state management

// Autenticación con Supabase
export * from './supabaseAuthStore'
export { useAuth } from './supabaseAuthStore'

// Stores de datos
export * from './escuelaStore'
export * from './diagnosticoStore'

// Store original (mantener para migración gradual)
export * from './authStore'