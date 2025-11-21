/**
 * Configuración del Formulario 3: Prácticas Docentes
 * Basado en: formularios.md - Instrumento dirigido a Docentes (Prácticas)
 * Dimensión NEM: Prácticas Docentes
 */

import { FormularioConfig, FormularioTipo, TipoPregunta } from '../../types'

export const formularioPracticasDocentes: FormularioConfig = {
  formularioTipo: FormularioTipo.PRACTICAS_DOCENTES,
  version: '1.0',
  titulo: 'Prácticas Docentes',
  descripcion: 'Evalúa planeación, ambientes de aprendizaje, estrategias de enseñanza y evaluación',
  icono: 'BookOpen',

  secciones: [
    // SECCIÓN A: DATOS DEL DOCENTE
    {
      id: 'datos_docente',
      titulo: 'A. Datos del Docente',
      descripcion: 'Información básica del participante',
      preguntas: [
        {
          id: 'doc_demo_1',
          texto: 'Nombre completo',
          tipo: TipoPregunta.TEXTO,
          requerido: true
        },
        {
          id: 'doc_demo_2',
          texto: 'Asignatura(s) que imparte',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Español',
            'Matemáticas',
            'Ciencias (Biología)',
            'Ciencias (Física)',
            'Ciencias (Química)',
            'Historia',
            'Geografía',
            'Formación Cívica y Ética',
            'Inglés',
            'Educación Física',
            'Artes',
            'Tecnología',
            'Otra'
          ],
          requerido: true
        },
        {
          id: 'doc_demo_3',
          texto: 'Grado(s) que atiende',
          tipo: TipoPregunta.MULTISELECT,
          opciones: ['1° Grado', '2° Grado', '3° Grado'],
          requerido: true
        },
        {
          id: 'doc_demo_4',
          texto: 'Años de experiencia docente',
          tipo: TipoPregunta.NUMERO,
          min: 0,
          max: 50,
          requerido: true
        },
        {
          id: 'doc_demo_5',
          texto: 'Nivel académico',
          tipo: TipoPregunta.SELECT,
          opciones: ['Licenciatura', 'Maestría', 'Doctorado'],
          requerido: true
        }
      ]
    },

    // SECCIÓN B: PLANEACIÓN DIDÁCTICA
    {
      id: 'planeacion_didactica',
      titulo: 'B. Planeación Didáctica',
      descripcion: 'Escala Likert 1-5: 1 = Nunca, 2 = Casi nunca, 3 = A veces, 4 = Casi siempre, 5 = Siempre',
      preguntas: [
        {
          id: 'doc_plan_1',
          texto: 'Elaboro planes de clase considerando el programa de estudios vigente',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_plan_2',
          texto: 'Incluyo los aprendizajes esperados en mi planeación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_plan_3',
          texto: 'Diseño actividades diferenciadas según necesidades de los estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_plan_4',
          texto: 'Planifico evaluaciones alineadas con los aprendizajes esperados',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_plan_5',
          texto: 'Reviso y ajusto mi planeación según los resultados obtenidos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_plan_6',
          texto: 'Incorporo el uso de tecnología en mi planeación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_plan_7',
          texto: 'Contemplo actividades para el desarrollo socioemocional',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN C: AMBIENTES DE APRENDIZAJE
    {
      id: 'ambientes_aprendizaje',
      titulo: 'C. Ambientes de Aprendizaje',
      descripcion: 'Clima del aula y organización del espacio (Escala 1-5)',
      preguntas: [
        {
          id: 'doc_amb_1',
          texto: 'Promuevo un ambiente de respeto y confianza',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_2',
          texto: 'Fomento la participación de todos los estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_3',
          texto: 'Establezco normas claras de convivencia',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_4',
          texto: 'Atiendo situaciones de conflicto de manera oportuna',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_5',
          texto: 'Creo espacios para que los estudiantes expresen sus emociones',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_6',
          texto: 'Organizo el mobiliario según las actividades',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_7',
          texto: 'Utilizo materiales didácticos diversos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_8',
          texto: 'Mantengo el aula limpia y ordenada',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_9',
          texto: 'Exhibo trabajos de los estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_amb_10',
          texto: 'Cuento con recursos tecnológicos funcionales',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN D: USO DEL PROGRAMA DE ESTUDIOS
    {
      id: 'uso_programa_estudios',
      titulo: 'D. Uso del Programa de Estudios',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'doc_prog_1',
          texto: 'Conozco los contenidos del programa de mi asignatura',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_prog_2',
          texto: 'Comprendo los propósitos generales de la asignatura',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_prog_3',
          texto: 'Identifico la progresión de aprendizajes por grado',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_prog_4',
          texto: 'Vinculo contenidos con otras asignaturas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_prog_5',
          texto: 'Adapto el programa al contexto de mis estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_prog_6',
          texto: 'Utilizo los libros de texto como recurso complementario',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_prog_7',
          texto: 'Consulto los recursos adicionales sugeridos en el programa',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN E: ESTRATEGIAS DE ENSEÑANZA
    {
      id: 'estrategias_ensenanza',
      titulo: 'E. Estrategias de Enseñanza',
      descripcion: '¿Con qué frecuencia utiliza las siguientes estrategias? (Escala 1-5: Nunca → Siempre)',
      preguntas: [
        {
          id: 'doc_estrat_1',
          texto: 'Aprendizaje Basado en Proyectos (ABP)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_2',
          texto: 'Aprendizaje Basado en Problemas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_3',
          texto: 'Trabajo colaborativo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_4',
          texto: 'Aprendizaje por indagación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_5',
          texto: 'Clase invertida (Flipped Classroom)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_6',
          texto: 'Gamificación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_7',
          texto: 'Aprendizaje situado',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_8',
          texto: 'Debates y discusiones',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_9',
          texto: 'Mapas mentales/conceptuales',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_10',
          texto: 'Estudio de casos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_11',
          texto: 'Experimentos/Prácticas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_estrat_12',
          texto: 'Uso de organizadores gráficos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN F: EVALUACIÓN DEL APRENDIZAJE
    {
      id: 'evaluacion_aprendizaje',
      titulo: 'F. Evaluación del Aprendizaje',
      descripcion: 'Tipos de evaluación y uso de resultados (Escala 1-5)',
      preguntas: [
        {
          id: 'doc_eval_1',
          texto: 'Realizo evaluación diagnóstica al inicio del ciclo/bloque',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_2',
          texto: 'Implemento evaluación formativa durante el proceso',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_3',
          texto: 'Aplico evaluación sumativa al final del periodo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_4',
          texto: 'Utilizo la autoevaluación como herramienta',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_5',
          texto: 'Promuevo la coevaluación entre estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_6',
          texto: 'Doy retroalimentación oportuna y específica',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_7',
          texto: 'Utilizo rúbricas o listas de cotejo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_8',
          texto: 'Analizo los resultados de las evaluaciones',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_9',
          texto: 'Identifico áreas de oportunidad en mi práctica',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_10',
          texto: 'Diseño estrategias de mejora basadas en resultados',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_11',
          texto: 'Comunico los resultados a padres de familia',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_eval_12',
          texto: 'Realizo ajustes en mi enseñanza según resultados',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN G: ATENCIÓN A LA DIVERSIDAD
    {
      id: 'atencion_diversidad',
      titulo: 'G. Atención a la Diversidad',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'doc_div_1',
          texto: 'Identifico las necesidades educativas de mis estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_div_2',
          texto: 'Adapto materiales para estudiantes con dificultades',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_div_3',
          texto: 'Ofrezco actividades de refuerzo y ampliación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_div_4',
          texto: 'Implemento adecuaciones curriculares cuando es necesario',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_div_5',
          texto: 'Colaboro con educación especial (USAER)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_div_6',
          texto: 'Considero estilos de aprendizaje en mi enseñanza',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'doc_div_7',
          texto: 'Promuevo la inclusión de todos los estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN H: USO DE TECNOLOGÍA
    {
      id: 'uso_tecnologia',
      titulo: 'H. Uso de Tecnología',
      descripcion: 'Herramientas digitales y frecuencia de uso',
      preguntas: [
        {
          id: 'doc_tec_1',
          texto: '¿Qué herramientas digitales utiliza?',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Plataformas educativas (Classroom, Teams, etc.)',
            'Videos educativos',
            'Presentaciones interactivas',
            'Simuladores/Laboratorios virtuales',
            'Aplicaciones móviles educativas',
            'Recursos en línea (Khan Academy, etc.)',
            'Herramientas de evaluación en línea',
            'Redes sociales educativas',
            'Ninguna'
          ],
          requerido: true
        },
        {
          id: 'doc_tec_2',
          texto: 'Frecuencia de uso de tecnología en clases',
          tipo: TipoPregunta.SELECT,
          opciones: ['Diario', '3-4 veces por semana', '1-2 veces por semana', 'Nunca'],
          requerido: true
        }
      ]
    },

    // SECCIÓN I: PREGUNTAS ABIERTAS
    {
      id: 'preguntas_abiertas',
      titulo: 'I. Preguntas Abiertas',
      descripcion: 'Su experiencia y necesidades',
      preguntas: [
        {
          id: 'doc_abierta_1',
          texto: 'Describa una estrategia exitosa que haya implementado recientemente',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Comparta su experiencia exitosa...'
        },
        {
          id: 'doc_abierta_2',
          texto: '¿Qué dificultades enfrenta en su práctica docente?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Identifique los principales desafíos...'
        },
        {
          id: 'doc_abierta_3',
          texto: '¿Qué apoyos o recursos necesita para mejorar su enseñanza?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Especifique necesidades de recursos, capacitación, apoyo...'
        }
      ]
    }
  ]
}
