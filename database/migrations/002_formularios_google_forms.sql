-- ====================================
-- MIGRACIÓN 002: Soporte para Formularios de Google Forms
-- Fecha: 2025-11-20
-- Descripción: Agregar tablas para captura de respuestas de los 5 instrumentos basados en Google Forms
-- ====================================

-- ====================================
-- TABLA: respuestas_formularios
-- Almacena las respuestas individuales de cada pregunta de los 5 formularios
-- ====================================
CREATE TABLE IF NOT EXISTS respuestas_formularios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,

  -- Identificación del formulario y pregunta
  formulario_tipo VARCHAR(50) NOT NULL CHECK (formulario_tipo IN (
    'ambiente_familiar',
    'desarrollo_integral',
    'ambiente_aprendizaje',
    'practicas_docentes',
    'formacion_docente'
  )),
  seccion VARCHAR(100), -- Ej: 'datos_demograficos', 'ambiente_hogar', 'bienestar_socioemocional'
  pregunta_id VARCHAR(100) NOT NULL, -- Ej: 'af_hogar_1', 'di_bienestar_3'
  pregunta_texto TEXT NOT NULL, -- Texto completo de la pregunta

  -- Tipo y respuesta
  tipo_respuesta VARCHAR(20) NOT NULL CHECK (tipo_respuesta IN (
    'likert5',      -- Escala 1-5
    'likert4',      -- Escala 1-4
    'texto',        -- Texto libre
    'numero',       -- Numérico
    'select',       -- Selección única
    'multiselect',  -- Selección múltiple
    'boolean',      -- Sí/No
    'fecha'         -- Fecha
  )),

  -- Valores de respuesta (solo uno debe estar lleno según tipo_respuesta)
  respuesta_numerica INTEGER, -- Para Likert, número, boolean (0/1)
  respuesta_texto TEXT, -- Para texto, select, multiselect, fecha

  -- Observaciones adicionales del supervisor
  observaciones TEXT,

  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: al menos una respuesta debe existir
  CONSTRAINT chk_respuesta CHECK (
    respuesta_numerica IS NOT NULL OR respuesta_texto IS NOT NULL
  )
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_respuestas_diagnostico ON respuestas_formularios(diagnostico_id);
CREATE INDEX idx_respuestas_formulario ON respuestas_formularios(formulario_tipo);
CREATE INDEX idx_respuestas_pregunta ON respuestas_formularios(pregunta_id);
CREATE INDEX idx_respuestas_seccion ON respuestas_formularios(seccion);

-- ====================================
-- TABLA: indicadores_calculados
-- Almacena indicadores agregados calculados a partir de las respuestas
-- ====================================
CREATE TABLE IF NOT EXISTS indicadores_calculados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,

  -- Identificación del indicador
  dimension VARCHAR(50) NOT NULL, -- Ej: 'ambiente_familiar', 'desarrollo_integral'
  criterio VARCHAR(100) NOT NULL, -- Ej: 'apoyo_academico', 'involucramiento', 'bienestar_socioemocional'

  -- Valores calculados
  valor_numerico DECIMAL(5,2), -- Promedio calculado (ej: 3.45 en escala Likert)
  nivel_desempeno VARCHAR(20) CHECK (nivel_desempeno IN ('EXCELENTE', 'BUENO', 'REGULAR', 'DEFICIENTE')),

  -- Metadatos del cálculo
  calculado_desde JSONB, -- Array de pregunta_ids que generaron este indicador
  metadatos JSONB DEFAULT '{}'::jsonb, -- Desviación estándar, correlaciones, etc.

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: un indicador por dimensión/criterio/diagnóstico
  CONSTRAINT uq_indicador UNIQUE (diagnostico_id, dimension, criterio)
);

-- Índices
CREATE INDEX idx_indicadores_diagnostico ON indicadores_calculados(diagnostico_id);
CREATE INDEX idx_indicadores_dimension ON indicadores_calculados(dimension);
CREATE INDEX idx_indicadores_criterio ON indicadores_calculados(criterio);

-- ====================================
-- TABLA: configuracion_formularios
-- Configuración de preguntas para cada formulario (JSON)
-- ====================================
CREATE TABLE IF NOT EXISTS configuracion_formularios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  formulario_tipo VARCHAR(50) NOT NULL UNIQUE,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',

  -- Configuración completa del formulario en JSON
  configuracion JSONB NOT NULL,
  -- Estructura ejemplo:
  -- {
  --   "titulo": "Ambiente Familiar",
  --   "descripcion": "Evalúa el apoyo familiar...",
  --   "secciones": [
  --     {
  --       "id": "datos_demograficos",
  --       "titulo": "A. Datos Demográficos",
  --       "preguntas": [
  --         {
  --           "id": "af_demo_1",
  --           "texto": "Relación con el estudiante",
  --           "tipo": "select",
  --           "opciones": ["Padre", "Madre", "Tutor", "Otro"],
  --           "requerido": true
  --         }
  --       ]
  --     }
  --   ]
  -- }

  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- FUNCIÓN: Calcular nivel de desempeño basado en valor numérico
-- ====================================
CREATE OR REPLACE FUNCTION calcular_nivel_desempeno(valor DECIMAL)
RETURNS VARCHAR(20) AS $$
BEGIN
  -- Para escala Likert 1-5
  IF valor >= 4.5 THEN RETURN 'EXCELENTE';
  ELSIF valor >= 3.5 THEN RETURN 'BUENO';
  ELSIF valor >= 2.5 THEN RETURN 'REGULAR';
  ELSE RETURN 'DEFICIENTE';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ====================================
-- FUNCIÓN: Calcular indicadores por dimensión
-- ====================================
CREATE OR REPLACE FUNCTION calcular_indicadores_dimension(
  p_diagnostico_id UUID,
  p_dimension VARCHAR(50)
) RETURNS void AS $$
DECLARE
  v_promedio DECIMAL(5,2);
  v_nivel VARCHAR(20);
  v_preguntas_ids JSONB;
BEGIN
  -- Calcular promedio de todas las respuestas Likert de la dimensión
  SELECT
    AVG(respuesta_numerica)::DECIMAL(5,2),
    jsonb_agg(DISTINCT pregunta_id)
  INTO v_promedio, v_preguntas_ids
  FROM respuestas_formularios
  WHERE diagnostico_id = p_diagnostico_id
    AND formulario_tipo = p_dimension
    AND tipo_respuesta IN ('likert5', 'likert4')
    AND respuesta_numerica IS NOT NULL;

  -- Calcular nivel
  v_nivel := calcular_nivel_desempeno(v_promedio);

  -- Insertar o actualizar indicador
  INSERT INTO indicadores_calculados (
    diagnostico_id,
    dimension,
    criterio,
    valor_numerico,
    nivel_desempeno,
    calculado_desde
  )
  VALUES (
    p_diagnostico_id,
    p_dimension,
    'promedio_general',
    v_promedio,
    v_nivel,
    v_preguntas_ids
  )
  ON CONFLICT (diagnostico_id, dimension, criterio)
  DO UPDATE SET
    valor_numerico = EXCLUDED.valor_numerico,
    nivel_desempeno = EXCLUDED.nivel_desempeno,
    calculado_desde = EXCLUDED.calculado_desde,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- TRIGGER: Actualizar timestamp en respuestas_formularios
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_respuestas_formularios_updated_at
BEFORE UPDATE ON respuestas_formularios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_indicadores_calculados_updated_at
BEFORE UPDATE ON indicadores_calculados
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_formularios_updated_at
BEFORE UPDATE ON configuracion_formularios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- COMENTARIOS
-- ====================================
COMMENT ON TABLE respuestas_formularios IS 'Almacena las respuestas individuales de cada pregunta de los 5 instrumentos de Google Forms';
COMMENT ON TABLE indicadores_calculados IS 'Indicadores agregados calculados a partir de las respuestas (promedios, niveles, etc.)';
COMMENT ON TABLE configuracion_formularios IS 'Configuración JSON de preguntas para cada formulario';
COMMENT ON FUNCTION calcular_indicadores_dimension IS 'Calcula indicadores agregados para una dimensión específica de un diagnóstico';
