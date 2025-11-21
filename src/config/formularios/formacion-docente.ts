/**
 * Configuración del Formulario 4: Formación Docente
 * Basado en: formularios.md - Instrumento dirigido a Docentes (Formación)
 * Dimensión NEM: Formación Docente
 */

import { FormularioConfig, FormularioTipo, TipoPregunta } from '../../types'

export const formularioFormacionDocente: FormularioConfig = {
  formularioTipo: FormularioTipo.FORMACION_DOCENTE,
  version: '1.0',
  titulo: 'Formación Docente',
  descripcion: 'Evalúa desarrollo profesional continuo, colaboración, innovación y necesidades de formación',
  icono: 'GraduationCap',

  secciones: [
    // SECCIÓN A: PERFIL ACADÉMICO Y PROFESIONAL
    {
      id: 'perfil_academico',
      titulo: 'A. Perfil Académico y Profesional',
      descripcion: 'Información sobre formación y trayectoria',
      preguntas: [
        {
          id: 'form_perfil_1',
          texto: 'Formación inicial',
          tipo: TipoPregunta.SELECT,
          opciones: ['Escuela Normal', 'Universidad', 'Otra'],
          requerido: true
        },
        {
          id: 'form_perfil_2',
          texto: 'Especialidad/Licenciatura',
          tipo: TipoPregunta.TEXTO,
          requerido: true,
          placeholder: 'Ej: Licenciatura en Educación Secundaria con especialidad en...'
        },
        {
          id: 'form_perfil_3',
          texto: 'Estudios de posgrado',
          tipo: TipoPregunta.SELECT,
          opciones: ['Ninguno', 'Especialidad', 'Maestría', 'Doctorado'],
          requerido: true
        },
        {
          id: 'form_perfil_4',
          texto: 'Certificaciones adicionales',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Ej: Certificación en TIC, Evaluación, etc.'
        },
        {
          id: 'form_perfil_5',
          texto: 'Años de servicio docente',
          tipo: TipoPregunta.NUMERO,
          min: 0,
          max: 50,
          requerido: true
        },
        {
          id: 'form_perfil_6',
          texto: 'Años en la escuela actual',
          tipo: TipoPregunta.NUMERO,
          min: 0,
          max: 50,
          requerido: true
        }
      ]
    },

    // SECCIÓN B: DESARROLLO PROFESIONAL CONTINUO
    {
      id: 'desarrollo_profesional',
      titulo: 'B. Desarrollo Profesional Continuo',
      descripcion: 'Escala Likert 1-5: 1 = Nunca, 2 = Casi nunca, 3 = A veces, 4 = Casi siempre, 5 = Siempre',
      preguntas: [
        {
          id: 'form_dpc_1',
          texto: 'Participé en cursos de actualización el ciclo pasado',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_dpc_2',
          texto: 'Los cursos tomados fueron relevantes para mi práctica',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_dpc_3',
          texto: 'Apliqué lo aprendido en los cursos en mi aula',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_dpc_4',
          texto: 'Busco de forma autónoma oportunidades de formación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_dpc_5',
          texto: 'Comparto lo aprendido con mis colegas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN C: TEMAS DE FORMACIÓN RECIENTE
    {
      id: 'temas_formacion_reciente',
      titulo: 'C. Temas de Formación Reciente',
      descripcion: 'En el último año, he tomado cursos sobre:',
      preguntas: [
        {
          id: 'form_temas_1',
          texto: 'Temas de cursos/talleres tomados (seleccione todos los que apliquen):',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Programa de estudios NEM',
            'Estrategias didácticas innovadoras',
            'Evaluación formativa',
            'Uso de tecnología educativa',
            'Educación socioemocional',
            'Atención a la diversidad/Inclusión',
            'Gestión del aula',
            'Contenidos disciplinares de mi asignatura',
            'Tutoría y acompañamiento',
            'Ninguno'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN D: AUTOFORMACIÓN
    {
      id: 'autoformacion',
      titulo: 'D. Autoformación',
      descripcion: '¿Con qué frecuencia...? (Escala 1-5: Nunca → Siempre)',
      preguntas: [
        {
          id: 'form_auto_1',
          texto: 'Leo libros o artículos sobre educación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_auto_2',
          texto: 'Consulto recursos educativos en línea',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_auto_3',
          texto: 'Veo videos o tutoriales para mejorar mi práctica',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_auto_4',
          texto: 'Experimento con nuevas estrategias en el aula',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_auto_5',
          texto: 'Reflexiono sobre mi práctica docente',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_auto_6',
          texto: 'Busco retroalimentación de colegas o directivos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN E: COLABORACIÓN PROFESIONAL
    {
      id: 'colaboracion_profesional',
      titulo: 'E. Colaboración Profesional',
      descripcion: 'Trabajo en equipo (Escala 1-5)',
      preguntas: [
        {
          id: 'form_colab_1',
          texto: 'Participo activamente en los Consejos Técnicos Escolares',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_colab_2',
          texto: 'Colaboro con mis colegas en la planeación de actividades',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_colab_3',
          texto: 'Comparto materiales y recursos con otros docentes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_colab_4',
          texto: 'Trabajo de forma coordinada con el personal de apoyo (USAER)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_colab_5',
          texto: 'Participo en proyectos interdisciplinarios',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN F: COMUNIDADES DE APRENDIZAJE
    {
      id: 'comunidades_aprendizaje',
      titulo: 'F. Comunidades de Aprendizaje',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'form_com_1',
          texto: 'Pertenezco a una comunidad de aprendizaje entre docentes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_com_2',
          texto: 'Intercambio experiencias con maestros de otras escuelas',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_com_3',
          texto: 'Participo en redes o grupos de docentes (presenciales o virtuales)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_com_4',
          texto: 'Colaboro en la elaboración de materiales educativos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_com_5',
          texto: 'Participo en observación entre pares',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN G: MENTORÍA
    {
      id: 'mentoria',
      titulo: 'G. Mentoría',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'form_ment_1',
          texto: 'He servido como mentor(a) de docentes novatos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_ment_2',
          texto: 'He recibido mentoría de docentes con más experiencia',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_ment_3',
          texto: 'Apoyo a colegas cuando tienen dudas o dificultades',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_ment_4',
          texto: 'Solicito apoyo de colegas cuando lo necesito',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN H: INNOVACIÓN PEDAGÓGICA
    {
      id: 'innovacion_pedagogica',
      titulo: 'H. Innovación Pedagógica',
      descripcion: 'Uso de tecnologías y estrategias innovadoras (Escala 1-5)',
      preguntas: [
        {
          id: 'form_innov_1',
          texto: 'Utilizo plataformas digitales para gestionar mi clase',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_2',
          texto: 'Implemento recursos multimedia en mis clases',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_3',
          texto: 'Uso aplicaciones educativas específicas de mi asignatura',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_4',
          texto: 'Fomento el uso responsable de tecnología en estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_5',
          texto: 'Me actualizo constantemente en herramientas digitales',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_6',
          texto: 'Implemento estrategias de aprendizaje activo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_7',
          texto: 'Diseño proyectos que vinculan la escuela con la comunidad',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_8',
          texto: 'Promuevo el trabajo interdisciplinario',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_9',
          texto: 'Utilizo metodologías innovadoras (Design Thinking, STEAM, etc.)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_innov_10',
          texto: 'Adapto estrategias según los intereses de los estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN I: INVESTIGACIÓN EDUCATIVA
    {
      id: 'investigacion_educativa',
      titulo: 'I. Investigación Educativa',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'form_invest_1',
          texto: 'Realizo investigación sobre mi práctica docente',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_invest_2',
          texto: 'Documento experiencias exitosas para compartir',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_invest_3',
          texto: 'Leo investigaciones educativas para mejorar mi práctica',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_invest_4',
          texto: 'Participo en estudios o proyectos de investigación educativa',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'form_invest_5',
          texto: 'Aplico resultados de investigaciones en mi aula',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN J: NECESIDADES DE FORMACIÓN
    {
      id: 'necesidades_formacion',
      titulo: 'J. Necesidades de Formación',
      descripcion: 'Temas de interés para desarrollo profesional',
      preguntas: [
        {
          id: 'form_nec_1',
          texto: '¿En qué temas le gustaría recibir formación? (Seleccione los 5 más importantes)',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Estrategias didácticas innovadoras',
            'Evaluación formativa y retroalimentación',
            'Uso de tecnología en el aula',
            'Atención a la diversidad e inclusión',
            'Educación socioemocional',
            'Gestión del aula y disciplina',
            'Actualización en mi disciplina',
            'Diseño de proyectos integradores',
            'Vinculación con padres de familia',
            'Desarrollo de habilidades socioemocionales propias'
          ],
          requerido: true
        },
        {
          id: 'form_nec_2',
          texto: '¿Qué formato de formación prefiere?',
          tipo: TipoPregunta.SELECT,
          opciones: [
            'Cursos presenciales',
            'Cursos en línea (sincrónicos)',
            'Cursos en línea (asincrónicos)',
            'Talleres prácticos',
            'Webinars',
            'Comunidades de práctica',
            'Coaching/Mentoría individual',
            'Observación entre pares'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN K: PREGUNTAS ABIERTAS
    {
      id: 'preguntas_abiertas',
      titulo: 'K. Preguntas Abiertas',
      descripcion: 'Su experiencia y propuestas',
      preguntas: [
        {
          id: 'form_abierta_1',
          texto: 'Describa un aprendizaje significativo de su formación reciente que haya transformado su práctica',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Comparta cómo un curso o experiencia de formación cambió su forma de enseñar...'
        },
        {
          id: 'form_abierta_2',
          texto: '¿Qué obstáculos enfrenta para continuar su desarrollo profesional?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Identifique barreras (tiempo, recursos, acceso, etc.)...'
        },
        {
          id: 'form_abierta_3',
          texto: '¿Qué propuestas tiene para mejorar la formación docente en la zona?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Sugerencias para fortalecer el desarrollo profesional docente...'
        }
      ]
    }
  ]
}
