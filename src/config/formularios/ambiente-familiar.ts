/**
 * Configuración del Formulario 1: Ambiente Familiar
 * Basado en: formularios.md - Instrumento dirigido a Padres de Familia
 * Dimensión NEM: Entorno - Familia
 */

import { FormularioConfig, FormularioTipo, TipoPregunta } from '../../types'

export const formularioAmbienteFamiliar: FormularioConfig = {
  formularioTipo: FormularioTipo.AMBIENTE_FAMILIAR,
  version: '1.0',
  titulo: 'Ambiente Familiar',
  descripcion: 'Evalúa el apoyo familiar al aprendizaje y las condiciones del hogar para el desarrollo educativo',
  icono: 'Home',

  secciones: [
    // SECCIÓN A: DATOS DEMOGRÁFICOS
    {
      id: 'datos_demograficos',
      titulo: 'A. Datos Demográficos',
      descripcion: 'Información básica sobre el participante',
      preguntas: [
        {
          id: 'af_demo_1',
          texto: 'Relación con el estudiante',
          tipo: TipoPregunta.SELECT,
          opciones: ['Padre', 'Madre', 'Tutor/a legal', 'Abuelo/a', 'Otro familiar'],
          requerido: true
        },
        {
          id: 'af_demo_2',
          texto: 'Grado que cursa su hijo(a)',
          tipo: TipoPregunta.SELECT,
          opciones: ['1° Grado', '2° Grado', '3° Grado'],
          requerido: true
        },
        {
          id: 'af_demo_3',
          texto: 'Nivel educativo del padre/madre/tutor',
          tipo: TipoPregunta.SELECT,
          opciones: [
            'Sin estudios',
            'Primaria incompleta',
            'Primaria completa',
            'Secundaria incompleta',
            'Secundaria completa',
            'Preparatoria/Bachillerato',
            'Licenciatura',
            'Posgrado'
          ],
          requerido: true
        },
        {
          id: 'af_demo_4',
          texto: 'Ocupación principal',
          tipo: TipoPregunta.SELECT,
          opciones: [
            'Empleado/a',
            'Trabajo independiente',
            'Comerciante',
            'Agricultor/a',
            'Hogar',
            'Desempleado/a',
            'Otro'
          ],
          requerido: true
        },
        {
          id: 'af_demo_5',
          texto: 'Número de hijos',
          tipo: TipoPregunta.NUMERO,
          min: 1,
          max: 15,
          requerido: true
        }
      ]
    },

    // SECCIÓN B: AMBIENTE DEL HOGAR
    {
      id: 'ambiente_hogar',
      titulo: 'B. Ambiente del Hogar',
      descripcion: 'Escala Likert 1-5: 1 = Nunca, 2 = Casi nunca, 3 = A veces, 4 = Casi siempre, 5 = Siempre',
      preguntas: [
        {
          id: 'af_hogar_1',
          texto: 'Mi hijo(a) tiene un espacio adecuado para estudiar en casa',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: 'Espacio tranquilo, iluminado y con mobiliario básico'
        },
        {
          id: 'af_hogar_2',
          texto: 'Contamos con materiales de apoyo (libros, internet, computadora)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_3',
          texto: 'Superviso las tareas y actividades escolares de mi hijo(a)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_4',
          texto: 'Participo en las reuniones y actividades de la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_5',
          texto: 'Mantengo comunicación constante con los maestros',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_6',
          texto: 'Conozco los logros y dificultades de mi hijo(a) en la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_7',
          texto: 'Establezco horarios para estudio y descanso',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_8',
          texto: 'Fomento la lectura en casa',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_9',
          texto: 'Apoyo las actividades extraescolares de mi hijo(a)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'af_hogar_10',
          texto: 'En casa se promueve el respeto y la comunicación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN C: APOYO AL APRENDIZAJE
    {
      id: 'apoyo_aprendizaje',
      titulo: 'C. Apoyo al Aprendizaje',
      descripcion: 'Frecuencia y tiempo dedicado al estudio',
      preguntas: [
        {
          id: 'af_apoyo_1',
          texto: '¿Con qué frecuencia ayuda con las tareas?',
          tipo: TipoPregunta.SELECT,
          opciones: ['Diario', '3-4 veces por semana', '1-2 veces por semana', 'Nunca'],
          requerido: true
        },
        {
          id: 'af_apoyo_2',
          texto: '¿Cuánto tiempo dedica su hijo(a) al estudio en casa?',
          tipo: TipoPregunta.SELECT,
          opciones: ['Menos de 30 minutos', '30-60 minutos', '1-2 horas', 'Más de 2 horas'],
          requerido: true
        },
        {
          id: 'af_apoyo_3',
          texto: 'Recursos disponibles en casa (seleccione todos los que apliquen)',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Internet',
            'Computadora/Tablet',
            'Libros de consulta',
            'Espacio de estudio',
            'Escritorio propio',
            'Ninguno'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN D: EXPECTATIVAS EDUCATIVAS
    {
      id: 'expectativas_educativas',
      titulo: 'D. Expectativas Educativas',
      descripcion: 'Aspiraciones y valoración de la educación',
      preguntas: [
        {
          id: 'af_expect_1',
          texto: '¿Hasta qué nivel educativo le gustaría que llegara su hijo(a)?',
          tipo: TipoPregunta.SELECT,
          opciones: ['Secundaria', 'Preparatoria/Bachillerato', 'Universidad', 'Posgrado (Maestría/Doctorado)'],
          requerido: true
        },
        {
          id: 'af_expect_2',
          texto: '¿Considera que la escuela está cumpliendo con sus expectativas?',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo'
        },
        {
          id: 'af_expect_3',
          texto: '¿Qué aspectos considera más importantes en la educación? (Seleccione los 3 más importantes)',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Calificaciones altas',
            'Desarrollo de valores',
            'Preparación para el trabajo',
            'Habilidades sociales',
            'Pensamiento crítico',
            'Creatividad'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN E: OBSERVACIONES ADICIONALES
    {
      id: 'observaciones',
      titulo: 'E. Observaciones Adicionales',
      descripcion: 'Comentarios del supervisor sobre el contexto familiar',
      preguntas: [
        {
          id: 'af_obs_1',
          texto: 'Observaciones del supervisor sobre el ambiente familiar',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Anote cualquier observación relevante sobre las condiciones del hogar, apoyo familiar, o situaciones particulares...',
          ayuda: 'Este campo es para uso exclusivo del supervisor'
        }
      ]
    }
  ]
}
