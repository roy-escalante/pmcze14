/**
 * Configuración del Formulario 5: Ambiente de Aprendizaje (Contexto Externo)
 * Basado en: formularios.md - Instrumento de Contexto Externo/Comunidad
 * Dimensión NEM: Entorno - Contexto Externo
 */

import { FormularioConfig, FormularioTipo, TipoPregunta } from '../../types'

export const formularioAmbienteAprendizaje: FormularioConfig = {
  formularioTipo: FormularioTipo.AMBIENTE_APRENDIZAJE,
  version: '1.0',
  titulo: 'Ambiente de Aprendizaje y Contexto Escolar',
  descripcion: 'Evalúa el contexto comunitario, infraestructura y relación escuela-comunidad',
  icono: 'School',

  secciones: [
    // SECCIÓN A: CARACTERÍSTICAS DE LA COMUNIDAD
    {
      id: 'caracteristicas_comunidad',
      titulo: 'A. Características de la Comunidad',
      descripcion: 'Información básica del contexto',
      preguntas: [
        {
          id: 'ctx_caract_1',
          texto: 'Nombre de la localidad',
          tipo: TipoPregunta.TEXTO,
          requerido: true
        },
        {
          id: 'ctx_caract_2',
          texto: 'Tipo de comunidad',
          tipo: TipoPregunta.SELECT,
          opciones: ['Urbana', 'Rural', 'Indígena'],
          requerido: true
        },
        {
          id: 'ctx_caract_3',
          texto: 'Población aproximada',
          tipo: TipoPregunta.NUMERO,
          min: 0,
          requerido: true,
          placeholder: 'Número de habitantes'
        }
      ]
    },

    // SECCIÓN B: INFRAESTRUCTURA Y SERVICIOS
    {
      id: 'infraestructura_servicios',
      titulo: 'B. Infraestructura y Servicios',
      descripcion: 'Servicios disponibles en la comunidad',
      preguntas: [
        {
          id: 'ctx_infra_1',
          texto: 'La comunidad cuenta con (seleccione todos los que apliquen):',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Agua potable',
            'Electricidad',
            'Drenaje',
            'Pavimentación',
            'Transporte público',
            'Internet/Conectividad',
            'Centro de salud',
            'Biblioteca pública',
            'Espacios deportivos',
            'Casa de cultura'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN C: CONTEXTO SOCIOECONÓMICO
    {
      id: 'contexto_socioeconomico',
      titulo: 'C. Contexto Socioeconómico',
      descripcion: 'Escala Likert 1-5: 1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo',
      preguntas: [
        {
          id: 'ctx_socio_1',
          texto: 'La mayoría de las familias tienen empleos estables',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_socio_2',
          texto: 'Los estudiantes tienen acceso a servicios básicos en sus hogares',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_socio_3',
          texto: 'Las familias pueden cubrir las necesidades educativas de sus hijos',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_socio_4',
          texto: 'Existe apoyo de programas sociales (becas, apoyos alimentarios)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_socio_5',
          texto: 'La comunidad participa activamente en la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN D: CONTEXTO CULTURAL
    {
      id: 'contexto_cultural',
      titulo: 'D. Contexto Cultural',
      descripcion: 'Lenguas, tradiciones y diversidad cultural',
      preguntas: [
        {
          id: 'ctx_cult_1',
          texto: 'Lengua(s) que se habla(n) en la comunidad:',
          tipo: TipoPregunta.MULTISELECT,
          opciones: ['Español', 'Náhuatl', 'Téenek (Huasteco)', 'Otra'],
          requerido: true
        },
        {
          id: 'ctx_cult_2',
          texto: '¿Qué porcentaje de la población es indígena?',
          tipo: TipoPregunta.SELECT,
          opciones: ['0-25%', '26-50%', '51-75%', '76-100%'],
          requerido: true
        },
        {
          id: 'ctx_cult_3',
          texto: '¿Se celebran festividades o tradiciones locales?',
          tipo: TipoPregunta.BOOLEAN,
          requerido: true
        },
        {
          id: 'ctx_cult_4',
          texto: 'Si sí, ¿cuáles festividades?',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Describa las principales festividades o tradiciones...'
        },
        {
          id: 'ctx_cult_5',
          texto: '¿La escuela incorpora elementos culturales locales?',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN E: SEGURIDAD Y BIENESTAR
    {
      id: 'seguridad_bienestar',
      titulo: 'E. Seguridad y Bienestar',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'ctx_seg_1',
          texto: 'La comunidad es segura para los estudiantes',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_seg_2',
          texto: 'Existen problemas de violencia o delincuencia',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = Nunca, 5 = Muy frecuentes (escala invertida)'
        },
        {
          id: 'ctx_seg_3',
          texto: 'Los estudiantes pueden trasladarse seguros a la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_seg_4',
          texto: 'Hay incidencia de adicciones en la comunidad',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = Ninguna, 5 = Muy alta (escala invertida)'
        },
        {
          id: 'ctx_seg_5',
          texto: 'Existen riesgos naturales (inundaciones, deslaves, etc.)',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = Ninguno, 5 = Muy frecuentes (escala invertida)'
        }
      ]
    },

    // SECCIÓN F: RELACIÓN ESCUELA-COMUNIDAD
    {
      id: 'relacion_escuela_comunidad',
      titulo: 'F. Relación Escuela-Comunidad',
      descripcion: 'Escala Likert 1-5',
      preguntas: [
        {
          id: 'ctx_rel_1',
          texto: 'La comunidad valora la educación',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_rel_2',
          texto: 'Los padres participan en actividades escolares',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_rel_3',
          texto: 'Existen organizaciones comunitarias que apoyan la escuela',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_rel_4',
          texto: 'La escuela abre sus espacios para actividades comunitarias',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_rel_5',
          texto: 'Hay colaboración entre la escuela y autoridades locales',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        },
        {
          id: 'ctx_rel_6',
          texto: 'La escuela responde a las necesidades de la comunidad',
          tipo: TipoPregunta.LIKERT5,
          requerido: true
        }
      ]
    },

    // SECCIÓN G: RECURSOS COMUNITARIOS
    {
      id: 'recursos_comunitarios',
      titulo: 'G. Recursos Comunitarios',
      descripcion: 'Recursos educativos disponibles',
      preguntas: [
        {
          id: 'ctx_rec_1',
          texto: '¿Qué recursos educativos ofrece la comunidad?',
          tipo: TipoPregunta.MULTISELECT,
          opciones: [
            'Biblioteca municipal',
            'Casa de cultura',
            'Museos o centros históricos',
            'Espacios naturales educativos',
            'Talleres comunitarios',
            'Expertos locales (artesanos, agricultores, etc.)',
            'Organizaciones civiles',
            'Ninguno'
          ],
          requerido: true
        }
      ]
    },

    // SECCIÓN H: PROBLEMÁTICAS IDENTIFICADAS
    {
      id: 'problematicas',
      titulo: 'H. Problemáticas Identificadas',
      descripcion: 'Principales desafíos de la comunidad',
      preguntas: [
        {
          id: 'ctx_prob_1',
          texto: 'Pobreza/Desempleo',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = No es un problema, 5 = Problema muy grave'
        },
        {
          id: 'ctx_prob_2',
          texto: 'Migración',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = No es un problema, 5 = Problema muy grave'
        },
        {
          id: 'ctx_prob_3',
          texto: 'Violencia/Inseguridad',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = No es un problema, 5 = Problema muy grave'
        },
        {
          id: 'ctx_prob_4',
          texto: 'Adicciones',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = No es un problema, 5 = Problema muy grave'
        },
        {
          id: 'ctx_prob_5',
          texto: 'Deserción escolar',
          tipo: TipoPregunta.LIKERT5,
          requerido: true,
          ayuda: '1 = No es un problema, 5 = Problema muy grave'
        }
      ]
    },

    // SECCIÓN I: OPORTUNIDADES Y FORTALEZAS
    {
      id: 'oportunidades_fortalezas',
      titulo: 'I. Oportunidades y Fortalezas',
      descripcion: 'Recursos y aspectos positivos de la comunidad',
      preguntas: [
        {
          id: 'ctx_oport_1',
          texto: 'Principales fortalezas de la comunidad',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Describa los aspectos positivos y recursos valiosos de la comunidad...'
        },
        {
          id: 'ctx_oport_2',
          texto: 'Recursos o personas que podrían contribuir a mejorar la educación',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Identifique actores clave, expertos locales u organizaciones...'
        },
        {
          id: 'ctx_oport_3',
          texto: 'Proyectos comunitarios exitosos que involucran a la escuela',
          tipo: TipoPregunta.TEXTO,
          requerido: false,
          placeholder: 'Describa buenas prácticas o proyectos exitosos...'
        }
      ]
    }
  ]
}
