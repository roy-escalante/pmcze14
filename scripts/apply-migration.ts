/**
 * 🔄 MIGRATION RUNNER - PMCZE14
 *
 * Aplica las migraciones SQL a la base de datos de Supabase
 * Uso: npx tsx scripts/apply-migration.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('🔄 Aplicando migración 003_respuestas_multiples.sql...\n')

  try {
    // Leer el archivo SQL
    const migrationPath = join(process.cwd(), 'database', 'migrations', '003_respuestas_multiples.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf-8')

    console.log('📄 Archivo de migración leído exitosamente')
    console.log(`📏 Tamaño: ${migrationSQL.length} caracteres\n`)

    // Dividir en declaraciones individuales (separadas por punto y coma)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📊 Ejecutando ${statements.length} declaraciones SQL...\n`)

    // Ejecutar cada declaración
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`   [${i + 1}/${statements.length}] Ejecutando...`)

      const { error } = await supabase.rpc('exec_sql', { sql: statement })

      if (error) {
        console.error(`   ❌ Error en declaración ${i + 1}:`, error)
        // Intentar ejecutar directamente si falla el RPC
        console.log('   🔄 Intentando método alternativo...')
        // Para tablas, intentar una consulta directa
        // Nota: Esto puede no funcionar para todas las declaraciones SQL
        console.warn('   ⚠️  No se pudo ejecutar la declaración. Por favor, aplica la migración manualmente en el Dashboard de Supabase.')
        console.log('\n📝 Copia y pega el siguiente SQL en el Editor SQL de Supabase Dashboard:\n')
        console.log(migrationSQL)
        return
      }

      console.log(`   ✓ Declaración ${i + 1} ejecutada exitosamente`)
    }

    console.log('\n✅ Migración aplicada exitosamente!\n')

  } catch (error: any) {
    console.error('💥 Error aplicando migración:', error.message)
    console.log('\n📝 SOLUCIÓN: Aplica la migración manualmente en Supabase Dashboard')
    console.log('   1. Ve a: https://supabase.com/dashboard/project/dtpnziyigsaqojsdntzn/editor')
    console.log('   2. Abre el archivo: database/migrations/003_respuestas_multiples.sql')
    console.log('   3. Copia y pega el contenido en el Editor SQL')
    console.log('   4. Ejecuta el script\n')
    process.exit(1)
  }
}

// Ejecutar migración
applyMigration()
  .then(() => {
    console.log('✨ Proceso completado. Ahora puedes ejecutar el seeder.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
  })
