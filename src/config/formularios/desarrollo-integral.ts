/**
 * Configuración del Formulario 2: Desarrollo Integral
 * Basado en: formularios.md - Instrumento dirigido a Estudiantes
 * Dimensión NEM: Desarrollo Integral
 */

import { FormularioConfig, FormularioTipo, TipoPregunta } from '../../types'

export const formularioDesarrolloIntegral: FormularioConfig = {
  formularioTipo: FormularioTipo.DESARROLLO_INTEGRAL,
  version: '1.0',
  titulo: 'Desarrollo Integral del Estudiante',
  descripcion: 'Evalúa el clima del aula, prácticas de enseñanza, motivación y bienestar estudiantil',
  icono: 'Heart',

  secciones: [
    // SECCIÓN A: DATOS DEL ESTUDIANTE
    {
      id: 'datos_estudiante',
      titulo: 'A. Datos del Estudiante',
      descripcion: 'Información básica del participante',
      preguntas: [
        {
          id: 'est_demo_1',
          texto: 'Grado que cursas',
          tipo: TipoPregunta.SELECT,
          opciones: ['1° Grado', '2° Grado', '3° Grado'],
          requerido: true
        },
        {
          id: 'est_demo_2',
          texto: 'Grupo',
          tipo: TipoPregunta.TEXTO,
          requerido: true,
          placeholder: 'Ej: A, B, C'
        },
        {
          id: 'est_demo_3',
          texto: 'Edad',
          tipo: TipoPregunta.NUMERO,
          min: 11,
          max: 18,
          requerido: true
        },
        {
          id: 'est_demo_4',
          texto: 'Género',
          tipo: TipoPregunta.SELECT,
          opciones: ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'],
          requerido: true
        }
      ]
    },

    // SECCIÓN B: CLIMA DEL AULA
    {
      id: 'clima_aula',
      titulo: 'B. Clima del Aula',
      descripcion: 'Escala Likert 1-5: 1 = Nunca, 2 = Casi nunca, 3 = A veces, 4 = Casi siempre, 5 = Siempre',
      preguntas: [
        {
          id: 'est_clima_1',
          texto: 'Me siento seguro(a) en mi salón de clases',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_2',
          texto: 'Mis compañeros me tratan con respeto',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_3',
          texto: 'Puedo expresar mis ideas sin temor',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_4',
          texto: 'El maestro(a) escucha mis opiniones',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_5',
          texto: 'Me gusta trabajar en equipo con mis compañeros',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_6',
          texto: 'El salón está limpio y ordenado',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_7',
          texto: 'Hay materiales suficientes para trabajar',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_clima_8',
          texto: 'Me siento motivado(a) para aprender',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN C: RELACIÓN CON DOCENTES
    {
      id: 'relacion_docentes',
      titulo: 'C. Relación con Docentes',
      descripcion: 'Escala Likert 1-5: 1 = Nunca, 2 = Casi nunca, 3 = A veces, 4 = Casi siempre, 5 = Siempre',
      preguntas: [
        {
          id: 'est_docentes_1',
          texto: 'Los maestros explican de forma clara',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_docentes_2',
          texto: 'Me ayudan cuando tengo dudas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_docentes_3',
          texto: 'Son justos en sus evaluaciones',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_docentes_4',
          texto: 'Me motivan a mejorar',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_docentes_5',
          texto: 'Utilizan ejemplos interesantes para enseñar',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN D: CONVIVENCIA ESCOLAR
    {
      id: 'convivencia_escolar',
      titulo: 'D. Convivencia Escolar',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'est_conv_1',
          texto: 'En mi escuela se respetan las diferencias',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_conv_2',
          texto: 'Me siento parte de un grupo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_conv_3',
          texto: 'He presenciado situaciones de acoso (bullying)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = Nunca, 5 = Muy frecuente (IMPORTANTE para detectar bullying)'
        },
        {
          id: 'est_conv_4',
          texto: 'Sé a quién acudir si tengo un problema',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_conv_5',
          texto: 'Me gusta asistir a la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN E: PRÁCTICAS DE ENSEÑANZA
    {
      id: 'practicas_ensenanza',
      titulo: 'E. Prácticas de Enseñanza',
      descripcion: '¿Con qué frecuencia tus maestros...? (Escala 1-5: Nunca → Siempre)',
      preguntas: [
        {
          id: 'est_pract_1',
          texto: 'Usan tecnología en las clases',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_pract_2',
          texto: 'Te ponen a trabajar en equipo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_pract_3',
          texto: 'Te dejan investigar por tu cuenta',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_pract_4',
          texto: 'Relacionan lo que aprendes con la vida real',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_pract_5',
          texto: 'Te dan retroalimentación sobre tus trabajos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_pract_6',
          texto: 'Realizan actividades fuera del salón',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_pract_7',
          texto: 'Te permiten elegir cómo hacer tus proyectos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN F: MOTIVACIÓN Y APRENDIZAJE
    {
      id: 'motivacion_aprendizaje',
      titulo: 'F. Motivación y Aprendizaje',
      descripcion: 'Tiempo de estudio y motivadores',
      preguntas: [
        {
          id: 'est_motiv_1',
          texto: '¿Cuánto tiempo dedicas a estudiar en casa cada día?',
          tipo: TipoPregunta.SELECT,
          opciones: ['Menos de 30 minutos', '30-60 minutos', '1-2 horas', 'Más de 2 horas'],
          requerido: true
        },
        {
          id: 'est_motiv_2',
          texto: '¿Qué te motiva a estudiar? (Selecciona 3)',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Aprender cosas nuevas',
            'Sacar buenas calificaciones',
            'Hacer felices a mis padres',
            'Tener un buen futuro',
            'Ser mejor persona',
            'Hacer amigos',
            'Participar en actividades'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN G: DESARROLLO INTEGRAL
    {
      id: 'desarrollo_integral',
      titulo: 'G. Desarrollo Integral',
      descripcion: 'Actividades extraescolares y hábitos saludables',
      preguntas: [
        {
          id: 'est_desarrollo_1',
          texto: '¿Participas en actividades extraescolares?',
          tipo: TipoPregunta.MULTISELECT,
          opciones: ['Deportes', 'Arte/Música', 'Clubes', 'Ninguna'],
          requerido: true
        },
        {
          id: 'est_desarrollo_2',
          texto: '¿Cómo calificarías tu salud en general?',
          tipo: TipoPregunta.SELECT,
          opciones: ['Excelente', 'Buena', 'Regular', 'Mala'],
          requerido: true
        },
        {
          id: 'est_desarrollo_3',
          texto: 'Desayuno antes de ir a la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = Nunca, 5 = Siempre'
        },
        {
          id: 'est_desarrollo_4',
          texto: 'Duermo al menos 8 horas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_desarrollo_5',
          texto: 'Hago ejercicio',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_desarrollo_6',
          texto: 'Leo por placer',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'est_desarrollo_7',
          texto: 'Uso dispositivos electrónicos (teléfono, computadora)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: 'Frecuencia de uso'
        }
      ]
    },

    // SECCIÓN H: PREGUNTAS ABIERTAS
    {
      id: 'preguntas_abiertas',
      titulo: 'H. Preguntas Abiertas',
      descripcion: 'Tu opinión es importante',
      preguntas: [
        {
          id: 'est_abierta_1',
          texto: '¿Qué es lo que más te gusta de tu escuela?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Comparte lo que más disfrutas...'
        },
        {
          id: 'est_abierta_2',
          texto: '¿Qué cambiarías de tu escuela para mejorarla?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Tus ideas son valiosas...'
        },
        {
          id: 'est_abierta_3',
          texto: '¿Cómo te imaginas tu futuro después de la secundaria?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Cuéntanos tus sueños y metas...'
        }
      ]
    }
  ]
}
