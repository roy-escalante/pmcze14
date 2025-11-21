/**
 * 🔍 DATABASE CHECKER - PMCZE14
 *
 * Verifica el estado de la base de datos y las tablas necesarias
 * Uso: npx tsx scripts/check-database.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Verificando estado de la base de datos...\n')

  try {
    // 1. Verificar tabla escuelas
    console.log('📚 Verificando tabla "escuelas"...')
    const { data: escuelas, error: escuelasError } = await supabase
      .from('escuelas')
      .select('count')
      .limit(1)

    if (escuelasError) {
      console.log('   ❌ Tabla "escuelas" no existe o no es accesible')
      console.log(`   Error: ${escuelasError.message}`)
    } else {
      console.log('   ✅ Tabla "escuelas" existe y es accesible')
    }

    // 2. Verificar tabla usuarios
    console.log('\n👥 Verificando tabla "usuarios"...')
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1)

    if (usuariosError) {
      console.log('   ❌ Tabla "usuarios" no existe o no es accesible')
      console.log(`   Error: ${usuariosError.message}`)
    } else {
      console.log('   ✅ Tabla "usuarios" existe y es accesible')
    }

    // 3. Verificar tabla diagnosticos
    console.log('\n📊 Verificando tabla "diagnosticos"...')
    const { data: diagnosticos, error: diagnosticosError } = await supabase
      .from('diagnosticos')
      .select('count')
      .limit(1)

    if (diagnosticosError) {
      console.log('   ❌ Tabla "diagnosticos" no existe o no es accesible')
      console.log(`   Error: ${diagnosticosError.message}`)
    } else {
      console.log('   ✅ Tabla "diagnosticos" existe y es accesible')
    }

    // 4. Verificar tabla respuestas_instrumentos (NUEVA - v2)
    console.log('\n📝 Verificando tabla "respuestas_instrumentos" (v2)...')
    const { data: respuestas, error: respuestasError } = await supabase
      .from('respuestas_instrumentos')
      .select('count')
      .limit(1)

    if (respuestasError) {
      console.log('   ❌ Tabla "respuestas_instrumentos" NO EXISTE')
      console.log(`   Error: ${respuestasError.message}`)
      console.log('\n   🚨 ACCIÓN REQUERIDA:')
      console.log('   La tabla respuestas_instrumentos necesita ser creada.')
      console.log('   Por favor, aplica la migración 003_respuestas_multiples.sql:')
      console.log('\n   Opción 1 - Supabase Dashboard:')
      console.log('   1. Ve a: https://supabase.com/dashboard/project/dtpnziyigsaqojsdntzn/editor')
      console.log('   2. Copia el contenido de: database/migrations/003_respuestas_multiples.sql')
      console.log('   3. Pégalo en el Editor SQL y ejecútalo')
      console.log('\n   Opción 2 - Usar supabase CLI:')
      console.log('   supabase db push\n')
      return false
    } else {
      console.log('   ✅ Tabla "respuestas_instrumentos" existe y es accesible')
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ TODAS LAS TABLAS ESTÁN LISTAS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 Puedes ejecutar el seeder ahora:')
    console.log('   npm run seed\n')
    return true

  } catch (error: any) {
    console.error('💥 Error verificando base de datos:', error.message)
    return false
  }
}

// Ejecutar verificación
checkDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
  })
