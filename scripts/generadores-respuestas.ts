/**
 * 🎲 GENERADORES DE RESPUESTAS REALISTAS
 *
 * Genera respuestas de instrumentos con datos aleatorios pero coherentes
 */

// Nombres mexicanos comunes para generar respondentes
const nombresHombres = [
  'Juan', 'José', 'Miguel', 'Luis', 'Carlos', 'Pedro', 'Antonio', 'Jorge', 'Roberto', 'Fernando',
  'Rafael', 'Manuel', 'Alejandro', 'Sergio', 'Ricardo', 'Daniel', 'Eduardo', 'Francisco', 'Javier', 'Arturo'
]

const nombresMujeres = [
  'María', 'Ana', 'Lucía', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Elena', 'Gabriela', 'Sandra',
  'Sofía', 'Isabel', 'Mónica', 'Teresa', 'Claudia', 'Adriana', 'Verónica', 'Beatriz', 'Diana', 'Martha'
]

const apellidos = [
  'García', 'Martínez', 'López', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
  'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Jiménez', 'Ruiz', 'Mendoza', 'Ortiz', 'Vega',
  'Castro', 'Ramos', 'Reyes', 'Romero', 'Silva', 'Vargas', 'Moreno', 'Herrera', 'Medina', 'Guzmán'
]

const asignaturas = [
  'Español', 'Matemáticas', 'Ciencias (Biología)', 'Ciencias (Física)', 'Ciencias (Química)',
  'Historia', 'Geografía', 'Formación Cívica y Ética', 'Inglés', 'Educación Física',
  'Artes', 'Tecnología'
]

// Generar nombre aleatorio
function generarNombreCompleto(genero: 'M' | 'F'): string {
  const nombre = genero === 'M'
    ? nombresHombres[Math.floor(Math.random() * nombresHombres.length)]
    : nombresMujeres[Math.floor(Math.random() * nombresMujeres.length)]

  const apellido1 = apellidos[Math.floor(Math.random() * apellidos.length)]
  const apellido2 = apellidos[Math.floor(Math.random() * apellidos.length)]

  return `${nombre} ${apellido1} ${apellido2}`
}

// Generar respuesta Likert 1-5 con tendencia
function likert(tendencia: 'positiva' | 'neutral' | 'negativa'): number {
  if (tendencia === 'positiva') {
    return Math.random() < 0.7 ? (Math.random() < 0.5 ? 4 : 5) : 3
  } else if (tendencia === 'negativa') {
    return Math.random() < 0.7 ? (Math.random() < 0.5 ? 2 : 1) : 3
  } else {
    return Math.floor(Math.random() * 5) + 1
  }
}

// ====================================
// GENERADOR: AMBIENTE FAMILIAR
// ====================================
export function generarRespuestaAmbienteFamiliar(diagnosticoId: string, grado: string) {
  const genero = Math.random() > 0.5 ? 'F' : 'M'
  const roles = ['Padre', 'Madre', 'Tutor']
  const rol = genero === 'F' && Math.random() > 0.3 ? 'Madre' : (genero === 'M' ? 'Padre' : roles[Math.floor(Math.random() * roles.length)])

  // Tendencia general (70% positivo, 20% neutral, 10% negativo)
  const rand = Math.random()
  const tendencia = rand < 0.7 ? 'positiva' : (rand < 0.9 ? 'neutral' : 'negativa')

  const respuestas: any = {}

  // Sección A: Datos demográficos
  respuestas['af_demo_1'] = { preguntaId: 'af_demo_1', valor: rol, tipo: 'select' }
  respuestas['af_demo_2'] = { preguntaId: 'af_demo_2', valor: grado, tipo: 'select' }
  respuestas['af_demo_3'] = {
    preguntaId: 'af_demo_3',
    valor: ['Sin estudios', 'Primaria completa', 'Secundaria completa', 'Preparatoria/Bachillerato', 'Licenciatura'][Math.floor(Math.random() * 5)],
    tipo: 'select'
  }
  respuestas['af_demo_4'] = {
    preguntaId: 'af_demo_4',
    valor: ['Empleado/a', 'Trabajo independiente', 'Comerciante', 'Hogar'][Math.floor(Math.random() * 4)],
    tipo: 'select'
  }
  respuestas['af_demo_5'] = { preguntaId: 'af_demo_5', valor: Math.floor(Math.random() * 4) + 1, tipo: 'numero' }

  // Sección B: Ambiente del hogar (Likert 1-5)
  for (let i = 1; i <= 10; i++) {
    respuestas[`af_hogar_${i}`] = {
      preguntaId: `af_hogar_${i}`,
      valor: likert(tendencia),
      tipo: 'likert5'
    }
  }

  // Sección C: Apoyo al aprendizaje
  respuestas['af_apoyo_1'] = {
    preguntaId: 'af_apoyo_1',
    valor: ['Diario', '3-4 veces por semana', '1-2 veces por semana'][Math.floor(Math.random() * 3)],
    tipo: 'select'
  }
  respuestas['af_apoyo_2'] = {
    preguntaId: 'af_apoyo_2',
    valor: ['30-60 minutos', '1-2 horas', 'Más de 2 horas'][Math.floor(Math.random() * 3)],
    tipo: 'select'
  }
  respuestas['af_apoyo_3'] = {
    preguntaId: 'af_apoyo_3',
    valor: ['Internet', 'Libros de consulta', 'Espacio de estudio'].filter(() => Math.random() > 0.3),
    tipo: 'multiselect'
  }

  // Sección D: Expectativas
  respuestas['af_expect_1'] = {
    preguntaId: 'af_expect_1',
    valor: ['Preparatoria/Bachillerato', 'Universidad', 'Posgrado (Maestría/Doctorado)'][Math.floor(Math.random() * 3)],
    tipo: 'select'
  }
  respuestas['af_expect_2'] = { preguntaId: 'af_expect_2', valor: likert('positiva'), tipo: 'likert5' }
  respuestas['af_expect_3'] = {
    preguntaId: 'af_expect_3',
    valor: ['Desarrollo de valores', 'Habilidades sociales', 'Pensamiento crítico'].filter(() => Math.random() > 0.4),
    tipo: 'multiselect'
  }

  const totalPreguntas = Object.keys(respuestas).length
  const completitud = (totalPreguntas / 23) * 100

  return {
    diagnostico_id: diagnosticoId,
    formulario_tipo: 'AMBIENTE_FAMILIAR',
    respondente_nombre: generarNombreCompleto(genero),
    respondente_rol: rol,
    respondente_grado: grado,
    respuestas,
    porcentaje_completitud: completitud
  }
}

// ====================================
// GENERADOR: DESARROLLO INTEGRAL (Estudiantes)
// ====================================
export function generarRespuestaDesarrolloIntegral(diagnosticoId: string, grado: string, grupo: string) {
  const genero = Math.random() > 0.5 ? 'Femenino' : 'Masculino'
  const rol = genero === 'Femenino' ? 'Alumna' : 'Alumno'
  const edad = grado === '1° Grado' ? 12 : (grado === '2° Grado' ? 13 : 14)

  const tendencia = Math.random() < 0.6 ? 'positiva' : 'neutral'

  const respuestas: any = {}

  // Sección A: Datos del estudiante
  respuestas['est_demo_1'] = { preguntaId: 'est_demo_1', valor: grado, tipo: 'select' }
  respuestas['est_demo_2'] = { preguntaId: 'est_demo_2', valor: grupo, tipo: 'texto' }
  respuestas['est_demo_3'] = { preguntaId: 'est_demo_3', valor: edad, tipo: 'numero' }
  respuestas['est_demo_4'] = { preguntaId: 'est_demo_4', valor: genero, tipo: 'select' }

  // Sección B: Clima del aula (8 preguntas Likert)
  for (let i = 1; i <= 8; i++) {
    respuestas[`est_clima_${i}`] = { preguntaId: `est_clima_${i}`, valor: likert(tendencia), tipo: 'likert5' }
  }

  // Sección C: Relación con docentes (5 preguntas)
  for (let i = 1; i <= 5; i++) {
    respuestas[`est_docentes_${i}`] = { preguntaId: `est_docentes_${i}`, valor: likert(tendencia), tipo: 'likert5' }
  }

  // Sección D: Convivencia escolar (5 preguntas)
  for (let i = 1; i <= 5; i++) {
    respuestas[`est_conv_${i}`] = { preguntaId: `est_conv_${i}`, valor: likert(i === 3 ? 'negativa' : tendencia), tipo: 'likert5' }
  }

  // Sección E: Prácticas de enseñanza (7 preguntas)
  for (let i = 1; i <= 7; i++) {
    respuestas[`est_pract_${i}`] = { preguntaId: `est_pract_${i}`, valor: likert('neutral'), tipo: 'likert5' }
  }

  const completitud = 85 + Math.random() * 15

  return {
    diagnostico_id: diagnosticoId,
    formulario_tipo: 'DESARROLLO_INTEGRAL',
    respondente_nombre: generarNombreCompleto(genero === 'Masculino' ? 'M' : 'F'),
    respondente_rol: rol,
    respondente_grado: grado,
    respondente_grupo: grupo,
    respondente_edad: edad,
    respondente_genero: genero,
    respuestas,
    porcentaje_completitud: completitud
  }
}

// ====================================
// GENERADOR: PRÁCTICAS DOCENTES
// ====================================
export function generarRespuestaPracticasDocentes(diagnosticoId: string, nombreDocente: string) {
  const genero = Math.random() > 0.5 ? 'M' : 'F'
  const asignatura = asignaturas[Math.floor(Math.random() * asignaturas.length)]
  const experiencia = Math.floor(Math.random() * 25) + 3

  const tendencia = experiencia > 10 ? 'positiva' : 'neutral'

  const respuestas: any = {}

  // Sección A: Datos del docente
  respuestas['doc_demo_1'] = { preguntaId: 'doc_demo_1', valor: nombreDocente, tipo: 'texto' }
  respuestas['doc_demo_2'] = { preguntaId: 'doc_demo_2', valor: [asignatura], tipo: 'multiselect' }
  respuestas['doc_demo_3'] = {
    preguntaId: 'doc_demo_3',
    valor: [['1° Grado', '2° Grado', '3° Grado'][Math.floor(Math.random() * 3)]],
    tipo: 'multiselect'
  }
  respuestas['doc_demo_4'] = { preguntaId: 'doc_demo_4', valor: experiencia, tipo: 'numero' }
  respuestas['doc_demo_5'] = {
    preguntaId: 'doc_demo_5',
    valor: experiencia > 15 ? 'Maestría' : 'Licenciatura',
    tipo: 'select'
  }

  // Sección B: Planeación didáctica (7 preguntas)
  for (let i = 1; i <= 7; i++) {
    respuestas[`doc_plan_${i}`] = { preguntaId: `doc_plan_${i}`, valor: likert(tendencia), tipo: 'likert5' }
  }

  // Sección C: Ambientes de aprendizaje (10 preguntas)
  for (let i = 1; i <= 10; i++) {
    respuestas[`doc_amb_${i}`] = { preguntaId: `doc_amb_${i}`, valor: likert(tendencia), tipo: 'likert5' }
  }

  // Sección D: Uso del programa (7 preguntas)
  for (let i = 1; i <= 7; i++) {
    respuestas[`doc_prog_${i}`] = { preguntaId: `doc_prog_${i}`, valor: likert(tendencia), tipo: 'likert5' }
  }

  // Sección E: Estrategias de enseñanza (12 preguntas)
  for (let i = 1; i <= 12; i++) {
    respuestas[`doc_estrat_${i}`] = { preguntaId: `doc_estrat_${i}`, valor: likert('neutral'), tipo: 'likert5' }
  }

  // Sección F: Evaluación (12 preguntas)
  for (let i = 1; i <= 12; i++) {
    respuestas[`doc_eval_${i}`] = { preguntaId: `doc_eval_${i}`, valor: likert(tendencia), tipo: 'likert5' }
  }

  const completitud = 90 + Math.random() * 10

  return {
    diagnostico_id: diagnosticoId,
    formulario_tipo: 'PRACTICAS_DOCENTES',
    respondente_nombre: nombreDocente,
    respondente_rol: 'Docente',
    respondente_asignatura: asignatura,
    respondente_anos_experiencia: experiencia,
    respuestas,
    porcentaje_completitud: completitud
  }
}

// ====================================
// GENERADOR: FORMACIÓN DOCENTE
// ====================================
export function generarRespuestaFormacionDocente(diagnosticoId: string, nombreDocente: string, experiencia: number) {
  const tendencia = experiencia > 10 ? 'positiva' : 'neutral'

  const respuestas: any = {}

  // Simular secciones del formulario de formación docente
  // (Simplificado para el seeder)

  for (let i = 1; i <= 30; i++) {
    respuestas[`form_${i}`] = {
      preguntaId: `form_${i}`,
      valor: likert(tendencia),
      tipo: 'likert5'
    }
  }

  const completitud = 85 + Math.random() * 15

  return {
    diagnostico_id: diagnosticoId,
    formulario_tipo: 'FORMACION_DOCENTE',
    respondente_nombre: nombreDocente,
    respondente_rol: 'Docente',
    respondente_anos_experiencia: experiencia,
    respuestas,
    porcentaje_completitud: completitud
  }
}

// ====================================
// GENERADOR: AMBIENTE APRENDIZAJE
// ====================================
export function generarRespuestaAmbienteAprendizaje(diagnosticoId: string, observadorNumero: number) {
  const respuestas: any = {}

  // Simular respuestas de contexto externo
  for (let i = 1; i <= 25; i++) {
    respuestas[`ctx_${i}`] = {
      preguntaId: `ctx_${i}`,
      valor: likert('neutral'),
      tipo: 'likert5'
    }
  }

  const completitud = 80 + Math.random() * 20

  return {
    diagnostico_id: diagnosticoId,
    formulario_tipo: 'AMBIENTE_APRENDIZAJE',
    respondente_nombre: `Observador ${observadorNumero} - Director`,
    respondente_rol: 'Director',
    respuestas,
    porcentaje_completitud: completitud
  }
}
