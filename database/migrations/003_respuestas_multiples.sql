-- ====================================
-- MIGRACIÓN 003: Sistema de Respuestas Múltiples
-- Permite múltiples entradas por instrumento
-- ====================================

-- Crear tabla para respuestas de instrumentos
CREATE TABLE IF NOT EXISTS respuestas_instrumentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diagnostico_id UUID NOT NULL REFERENCES diagnosticos(id) ON DELETE CASCADE,

    -- Tipo de instrumento
    formulario_tipo VARCHAR(50) NOT NULL CHECK (formulario_tipo IN (
        'AMBIENTE_FAMILIAR',
        'DESARROLLO_INTEGRAL',
        'AMBIENTE_APRENDIZAJE',
        'PRACTICAS_DOCENTES',
        'FORMACION_DOCENTE'
    )),

    -- Información del respondente
    respondente_nombre VARCHAR(200) NOT NULL,
    respondente_rol VARCHAR(50) NOT NULL CHECK (respondente_rol IN (
        'Padre',
        'Madre',
        'Tutor',
        'Abuelo',
        'Otro familiar',
        'Alumno',
        'Alumna',
        'Docente',
        'Director',
        'Personal administrativo',
        'Observador externo'
    )),

    -- Datos adicionales del respondente (opcionales según tipo)
    respondente_grado VARCHAR(10), -- '1°A', '2°B', '3°C' para alumnos
    respondente_grupo VARCHAR(5), -- 'A', 'B', 'C'
    respondente_edad INTEGER,
    respondente_genero VARCHAR(20),
    respondente_asignatura VARCHAR(100), -- Para docentes
    respondente_anos_experiencia INTEGER, -- Para docentes

    -- Datos del formulario
    respuestas JSONB NOT NULL, -- Las respuestas completas del formulario
    porcentaje_completitud DECIMAL(5,2) DEFAULT 0,

    -- Metadatos
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Índices compuestos para consultas eficientes
    CONSTRAINT respuestas_unique_key UNIQUE (diagnostico_id, formulario_tipo, respondente_nombre, respondente_rol)
);

-- Índices para optimizar consultas
CREATE INDEX idx_respuestas_diagnostico ON respuestas_instrumentos(diagnostico_id);
CREATE INDEX idx_respuestas_tipo ON respuestas_instrumentos(formulario_tipo);
CREATE INDEX idx_respuestas_rol ON respuestas_instrumentos(respondente_rol);
CREATE INDEX idx_respuestas_grado ON respuestas_instrumentos(respondente_grado);
CREATE INDEX idx_respuestas_diagnostico_tipo ON respuestas_instrumentos(diagnostico_id, formulario_tipo);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_respuestas_instrumentos_updated_at
    BEFORE UPDATE ON respuestas_instrumentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE respuestas_instrumentos IS 'Almacena múltiples respuestas de instrumentos por diagnóstico';
COMMENT ON COLUMN respuestas_instrumentos.formulario_tipo IS 'Tipo de instrumento NEM aplicado';
COMMENT ON COLUMN respuestas_instrumentos.respondente_nombre IS 'Nombre completo de quien responde';
COMMENT ON COLUMN respuestas_instrumentos.respondente_rol IS 'Rol del respondente en la comunidad educativa';
COMMENT ON COLUMN respuestas_instrumentos.respuestas IS 'JSON con todas las respuestas del formulario';
COMMENT ON COLUMN respuestas_instrumentos.porcentaje_completitud IS 'Porcentaje de preguntas respondidas (0-100)';

-- Vista para estadísticas rápidas por diagnóstico
CREATE OR REPLACE VIEW vista_estadisticas_instrumentos AS
SELECT
    diagnostico_id,
    formulario_tipo,
    COUNT(*) as total_respuestas,
    AVG(porcentaje_completitud) as completitud_promedio,
    COUNT(DISTINCT respondente_rol) as roles_distintos,
    COUNT(DISTINCT respondente_grado) as grados_distintos
FROM respuestas_instrumentos
GROUP BY diagnostico_id, formulario_tipo;

COMMENT ON VIEW vista_estadisticas_instrumentos IS 'Estadísticas agregadas de instrumentos por diagnóstico';
