/**
 * 🌱 SEEDER DE BASE DE DATOS - PMCZE14
 *
 * Población de datos de prueba para el sistema completo
 * Incluye: Escuelas, Usuarios, Diagnósticos con datos realistas
 *
 * Uso: npx tsx scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

// ====================================
// 📚 DATOS DE LAS 6 ESCUELAS
// ====================================
const escuelas = [
  // REGIÓN NORTE
  {
    nombre: 'Escuela Secundaria Técnica No. 41',
    cct: '24DST0041K',
    nivel: 'SECUNDARIA_TECNICA',
    turno: 'MATUTINO',
    modalidad: 'TELESECUNDARIA',
    director: 'Prof. Juan Carlos Martínez Hernández',
    zona_escolar: '014',
    region: 'HUASTECA_NORTE',
    direccion: {
      calle: 'Av. Hidalgo s/n',
      colonia: 'Centro',
      municipio: 'Tamazunchale',
      estado: 'San Luis Potosí',
      codigoPostal: '79960'
    },
    contacto: {
      telefono: '483-362-1234',
      email: 'est41@edu.slp.gob.mx',
      director_email: 'jc.martinez@edu.slp.gob.mx'
    },
    estadisticas: {
      totalAlumnos: 287,
      totalDocentes: 18,
      gruposPorGrado: {
        '1': 3,
        '2': 3,
        '3': 2
      }
    }
  },
  {
    nombre: 'Escuela Secundaria Técnica No. 77',
    cct: '24DST0077P',
    nivel: 'SECUNDARIA_TECNICA',
    turno: 'VESPERTINO',
    modalidad: 'TELESECUNDARIA',
    director: 'Profra. María Elena Rodríguez García',
    zona_escolar: '014',
    region: 'HUASTECA_NORTE',
    direccion: {
      calle: 'Camino a Chalahuite km 2',
      colonia: 'Ejido La Esperanza',
      municipio: 'Tamazunchale',
      estado: 'San Luis Potosí',
      codigoPostal: '79961'
    },
    contacto: {
      telefono: '483-362-5678',
      email: 'est77@edu.slp.gob.mx',
      director_email: 'me.rodriguez@edu.slp.gob.mx'
    },
    estadisticas: {
      totalAlumnos: 156,
      totalDocentes: 12,
      gruposPorGrado: {
        '1': 2,
        '2': 2,
        '3': 2
      }
    }
  },
  {
    nombre: 'Escuela Secundaria Técnica No. 81',
    cct: '24DST0081A',
    nivel: 'SECUNDARIA_TECNICA',
    turno: 'MATUTINO',
    modalidad: 'TELESECUNDARIA',
    director: 'Prof. Roberto Flores Méndez',
    zona_escolar: '014',
    region: 'HUASTECA_NORTE',
    direccion: {
      calle: 'Calle Principal s/n',
      colonia: 'Barrio Nuevo',
      municipio: 'Matlapa',
      estado: 'San Luis Potosí',
      codigoPostal: '79970'
    },
    contacto: {
      telefono: '483-365-9012',
      email: 'est81@edu.slp.gob.mx',
      director_email: 'r.flores@edu.slp.gob.mx'
    },
    estadisticas: {
      totalAlumnos: 198,
      totalDocentes: 14,
      gruposPorGrado: {
        '1': 2,
        '2': 3,
        '3': 2
      }
    }
  },
  // REGIÓN SUR
  {
    nombre: 'Escuela Secundaria Técnica No. 4',
    cct: '24DST0004J',
    nivel: 'SECUNDARIA_TECNICA',
    turno: 'MATUTINO',
    modalidad: 'TELESECUNDARIA',
    director: 'Profra. Ana Laura Pérez Sánchez',
    zona_escolar: '014',
    region: 'HUASTECA_SUR',
    direccion: {
      calle: 'Carretera Xilitla-Aquismón km 5',
      colonia: 'La Morena',
      municipio: 'Xilitla',
      estado: 'San Luis Potosí',
      codigoPostal: '79900'
    },
    contacto: {
      telefono: '489-365-1111',
      email: 'est04@edu.slp.gob.mx',
      director_email: 'al.perez@edu.slp.gob.mx'
    },
    estadisticas: {
      totalAlumnos: 342,
      totalDocentes: 22,
      gruposPorGrado: {
        '1': 4,
        '2': 4,
        '3': 3
      }
    }
  },
  {
    nombre: 'Escuela Secundaria Técnica No. 7',
    cct: '24DST0007G',
    nivel: 'SECUNDARIA_TECNICA',
    turno: 'VESPERTINO',
    modalidad: 'TELESECUNDARIA',
    director: 'Prof. Luis Fernando Gómez Torres',
    zona_escolar: '014',
    region: 'HUASTECA_SUR',
    direccion: {
      calle: 'Av. Constitución 123',
      colonia: 'Centro',
      municipio: 'Aquismon',
      estado: 'San Luis Potosí',
      codigoPostal: '79950'
    },
    contacto: {
      telefono: '489-368-2222',
      email: 'est07@edu.slp.gob.mx',
      director_email: 'lf.gomez@edu.slp.gob.mx'
    },
    estadisticas: {
      totalAlumnos: 223,
      totalDocentes: 16,
      gruposPorGrado: {
        '1': 3,
        '2': 3,
        '3': 2
      }
    }
  },
  {
    nombre: 'Escuela Secundaria Técnica No. 82',
    cct: '24DST0082Z',
    nivel: 'SECUNDARIA_TECNICA',
    turno: 'MATUTINO',
    modalidad: 'TELESECUNDARIA',
    director: 'Profra. Gabriela Martínez Ramírez',
    zona_escolar: '014',
    region: 'HUASTECA_SUR',
    direccion: {
      calle: 'Camino Real km 3',
      colonia: 'San Pedro',
      municipio: 'Huehuetlán',
      estado: 'San Luis Potosí',
      codigoPostal: '79980'
    },
    contacto: {
      telefono: '489-370-3333',
      email: 'est82@edu.slp.gob.mx',
      director_email: 'g.martinez@edu.slp.gob.mx'
    },
    estadisticas: {
      totalAlumnos: 178,
      totalDocentes: 13,
      gruposPorGrado: {
        '1': 2,
        '2': 2,
        '3': 2
      }
    }
  }
]

// ====================================
// 👥 DATOS DE USUARIOS
// ====================================
const usuarios = [
  // SUPERVISOR
  {
    email: 'itzcoatl.merino@edu.slp.gob.mx',
    password: 'Supervisor2024!',
    nombre: 'Itzcoatl',
    apellidos: 'Merino González',
    rol: 'SUPERVISOR',
    zona_escolar: '014',
    telefono: '481-123-4567'
  },
  // INSPECTORES
  {
    email: 'inspector.norte@edu.slp.gob.mx',
    password: 'Inspector2024!',
    nombre: 'Miguel Ángel',
    apellidos: 'Hernández López',
    rol: 'INSPECTOR',
    zona_escolar: '014',
    telefono: '481-123-4568'
  },
  {
    email: 'inspector.sur@edu.slp.gob.mx',
    password: 'Inspector2024!',
    nombre: 'Patricia',
    apellidos: 'Ramírez Castillo',
    rol: 'INSPECTOR',
    zona_escolar: '014',
    telefono: '481-123-4569'
  },
  // DIRECTORES (uno por escuela)
  {
    email: 'director.est41@edu.slp.gob.mx',
    password: 'Director2024!',
    nombre: 'Juan Carlos',
    apellidos: 'Martínez Hernández',
    rol: 'DIRECTOR',
    zona_escolar: '014',
    telefono: '483-362-1234'
  },
  {
    email: 'director.est77@edu.slp.gob.mx',
    password: 'Director2024!',
    nombre: 'María Elena',
    apellidos: 'Rodríguez García',
    rol: 'DIRECTOR',
    zona_escolar: '014',
    telefono: '483-362-5678'
  },
  {
    email: 'director.est81@edu.slp.gob.mx',
    password: 'Director2024!',
    nombre: 'Roberto',
    apellidos: 'Flores Méndez',
    rol: 'DIRECTOR',
    zona_escolar: '014',
    telefono: '483-365-9012'
  },
  {
    email: 'director.est04@edu.slp.gob.mx',
    password: 'Director2024!',
    nombre: 'Ana Laura',
    apellidos: 'Pérez Sánchez',
    rol: 'DIRECTOR',
    zona_escolar: '014',
    telefono: '489-365-1111'
  },
  {
    email: 'director.est07@edu.slp.gob.mx',
    password: 'Director2024!',
    nombre: 'Luis Fernando',
    apellidos: 'Gómez Torres',
    rol: 'DIRECTOR',
    zona_escolar: '014',
    telefono: '489-368-2222'
  },
  {
    email: 'director.est82@edu.slp.gob.mx',
    password: 'Director2024!',
    nombre: 'Gabriela',
    apellidos: 'Martínez Ramírez',
    rol: 'DIRECTOR',
    zona_escolar: '014',
    telefono: '489-370-3333'
  },
  // DOCENTES (2-3 por escuela)
  {
    email: 'docente1.est41@edu.slp.gob.mx',
    password: 'Docente2024!',
    nombre: 'Carlos',
    apellidos: 'Sánchez Morales',
    rol: 'DOCENTE',
    zona_escolar: '014',
    telefono: '483-362-1001'
  },
  {
    email: 'docente2.est41@edu.slp.gob.mx',
    password: 'Docente2024!',
    nombre: 'Lucía',
    apellidos: 'González Vega',
    rol: 'DOCENTE',
    zona_escolar: '014',
    telefono: '483-362-1002'
  }
]

// ====================================
// 📊 FUNCIÓN PARA GENERAR DIAGNÓSTICO REALISTA
// ====================================
function generarDiagnosticoRealista(escuelaId: string, usuarioId: string, escuelaNombre: string, cct: string) {
  const ciclo = '2024-2025'
  const fecha = new Date()

  return {
    escuela_id: escuelaId,
    usuario_id: usuarioId,
    estado: 'COMPLETADO',
    datos_generales: {
      escuelaId: escuelaId,
      nombreEscuela: escuelaNombre,
      cct: cct,
      cicloEscolar: ciclo,
      fechaInicio: fecha.toISOString(),
      responsable: {
        nombre: 'Director(a) de la escuela',
        cargo: 'Director',
        email: 'director@escuela.edu.mx'
      },
      participantes: [
        'Director(a) de la escuela',
        'Subdirector Académico',
        'Jefe de Enseñanza - Español',
        'Jefe de Enseñanza - Matemáticas',
        'Coordinador de Tutorías'
      ]
    },
    dimension_aprovechamiento: {
      indicadoresAcademicos: {
        promedioGeneral1ro: Math.random() * 2 + 7, // 7.0 - 9.0
        promedioGeneral2do: Math.random() * 2 + 6.5, // 6.5 - 8.5
        promedioGeneral3ro: Math.random() * 2 + 7.5, // 7.5 - 9.5
        eficienciaTerminal: Math.random() * 10 + 85, // 85% - 95%
        indiceReprobacion: Math.random() * 8 + 5, // 5% - 13%
        indiceDesercion: Math.random() * 3 + 1 // 1% - 4%
      },
      asistenciaAlumnos: {
        promedioAsistencia: Math.random() * 5 + 90, // 90% - 95%
        controlAusentismo: 'Se realizan llamadas telefónicas semanales a padres de familia. Visitas domiciliarias en casos de inasistencias mayores a 3 días consecutivos.'
      },
      ejerciciosIntegradores: {
        documentoPDF: '',
        areas: {
          manejoInformacion: {
            noEvidencia: Math.floor(Math.random() * 15),
            requiereApoyo: Math.floor(Math.random() * 30),
            enProceso: Math.floor(Math.random() * 50),
            alcanzado: Math.floor(Math.random() * 40)
          },
          discriminacionInformacion: {
            noEvidencia: Math.floor(Math.random() * 20),
            requiereApoyo: Math.floor(Math.random() * 35),
            enProceso: Math.floor(Math.random() * 45),
            alcanzado: Math.floor(Math.random() * 35)
          },
          calculoMental: {
            noEvidencia: Math.floor(Math.random() * 18),
            requiereApoyo: Math.floor(Math.random() * 32),
            enProceso: Math.floor(Math.random() * 48),
            alcanzado: Math.floor(Math.random() * 38)
          }
        }
      }
    },
    puntajes: {
      aprovechamiento: Math.random() * 1 + 3.5, // 3.5 - 4.5
      practicasDocentes: Math.random() * 1 + 3.2, // 3.2 - 4.2
      formacionDocente: Math.random() * 1 + 3.8, // 3.8 - 4.8
      planesPrograma: Math.random() * 1 + 3.3, // 3.3 - 4.3
      participacionFamilia: Math.random() * 1 + 3.0 // 3.0 - 4.0
    },
    puntaje_general: Math.random() * 0.8 + 3.5, // 3.5 - 4.3
    nivel_general: Math.random() > 0.3 ? 'BUENO' : 'REGULAR',
    version: '1.0'
  }
}

// ====================================
// 🚀 FUNCIÓN PRINCIPAL DE SEEDING
// ====================================
async function seed() {
  console.log('🌱 Iniciando seeding de base de datos PMCZE14...\n')

  try {
    // 1. INSERTAR ESCUELAS
    console.log('📚 Insertando escuelas...')
    const { data: escuelasInsertadas, error: escuelasError } = await supabase
      .from('escuelas')
      .insert(escuelas)
      .select()

    if (escuelasError) {
      console.error('❌ Error insertando escuelas:', escuelasError)
      throw escuelasError
    }

    console.log(`✅ ${escuelasInsertadas?.length || 0} escuelas insertadas\n`)

    // 2. CREAR USUARIOS EN SUPABASE AUTH
    console.log('👥 Creando usuarios...')
    const usuariosCreados = []

    for (const usuario of usuarios) {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: usuario.email,
        password: usuario.password,
        email_confirm: true
      })

      if (authError) {
        console.warn(`⚠️  Error creando usuario ${usuario.email}:`, authError.message)
        continue
      }

      // Insertar en tabla usuarios
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user?.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          rol: usuario.rol,
          zona_escolar: usuario.zona_escolar,
          telefono: usuario.telefono
        })
        .select()
        .single()

      if (userError) {
        console.warn(`⚠️  Error insertando datos usuario ${usuario.email}:`, userError.message)
        continue
      }

      usuariosCreados.push(userData)
      console.log(`   ✓ ${usuario.email} (${usuario.rol})`)
    }

    console.log(`\n✅ ${usuariosCreados.length} usuarios creados\n`)

    // 3. CREAR DIAGNÓSTICOS
    console.log('📊 Generando diagnósticos...')
    const diagnosticos = []

    // Crear 1-2 diagnósticos por escuela
    for (let i = 0; i < escuelasInsertadas!.length; i++) {
      const escuela = escuelasInsertadas![i]
      const director = usuariosCreados.find(u => u.rol === 'DIRECTOR')

      if (director) {
        // Diagnóstico actual (ciclo 2024-2025)
        diagnosticos.push(
          generarDiagnosticoRealista(
            escuela.id,
            director.id,
            escuela.nombre,
            escuela.cct
          )
        )

        // Solo para algunas escuelas, agregar diagnóstico del ciclo anterior
        if (i % 2 === 0) {
          const diagnosticoAnterior = generarDiagnosticoRealista(
            escuela.id,
            director.id,
            escuela.nombre,
            escuela.cct
          )
          diagnosticoAnterior.datos_generales.cicloEscolar = '2023-2024'
          diagnosticos.push(diagnosticoAnterior)
        }
      }
    }

    const { data: diagnosticosInsertados, error: diagnosticosError } = await supabase
      .from('diagnosticos')
      .insert(diagnosticos)
      .select()

    if (diagnosticosError) {
      console.error('❌ Error insertando diagnósticos:', diagnosticosError)
      throw diagnosticosError
    }

    console.log(`✅ ${diagnosticosInsertados?.length || 0} diagnósticos generados\n`)

    // 4. RESUMEN FINAL
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 SEEDING COMPLETADO EXITOSAMENTE')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📚 Escuelas:      ${escuelasInsertadas?.length || 0}`)
    console.log(`👥 Usuarios:      ${usuariosCreados.length}`)
    console.log(`📊 Diagnósticos:  ${diagnosticosInsertados?.length || 0}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('📝 CREDENCIALES DE ACCESO:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('SUPERVISOR:')
    console.log('  Email:    itzcoatl.merino@edu.slp.gob.mx')
    console.log('  Password: Supervisor2024!')
    console.log('\nDIRECTOR (EST 41):')
    console.log('  Email:    director.est41@edu.slp.gob.mx')
    console.log('  Password: Director2024!')
    console.log('\nDOCENTE:')
    console.log('  Email:    docente1.est41@edu.slp.gob.mx')
    console.log('  Password: Docente2024!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  } catch (error) {
    console.error('💥 Error fatal durante seeding:', error)
    process.exit(1)
  }
}

// Ejecutar seeder
seed()
  .then(() => {
    console.log('✨ Proceso completado. Puedes iniciar sesión con las credenciales mostradas.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error:', error)
    process.exit(1)
  })
