-- ====================================
-- PMCZE14 - Esquema de Base de Datos
-- Sistema de Gestión Educativa Zona Escolar 14
-- ====================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- TABLA: usuarios
-- Gestión de usuarios del sistema
-- ====================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('SUPERVISOR', 'INSPECTOR', 'DIRECTOR', 'SUBDIRECTOR', 'DOCENTE')),
    zona_escolar VARCHAR(10) NOT NULL DEFAULT '014',
    telefono VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_zona ON usuarios(zona_escolar);

-- ====================================
-- TABLA: escuelas
-- Información de las escuelas de la zona
-- ====================================
CREATE TABLE IF NOT EXISTS escuelas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    cct VARCHAR(20) UNIQUE NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    turno VARCHAR(20) NOT NULL CHECK (turno IN ('MATUTINO', 'VESPERTINO', 'NOCTURNO', 'JORNADA_AMPLIADA', 'TIEMPO_COMPLETO', 'AMBOS')),
    modalidad VARCHAR(100) NOT NULL,
    director VARCHAR(200) NOT NULL,
    zona_escolar VARCHAR(10) NOT NULL DEFAULT '014',
    region VARCHAR(20) NOT NULL CHECK (region IN ('HUASTECA_CENTRO', 'HUASTECA_NORTE', 'HUASTECA_SUR')),
    direccion JSONB NOT NULL,
    contacto JSONB NOT NULL,
    estadisticas JSONB NOT NULL DEFAULT '{"totalAlumnos": 0, "totalDocentes": 0, "gruposPorGrado": {}}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para escuelas
CREATE INDEX idx_escuelas_cct ON escuelas(cct);
CREATE INDEX idx_escuelas_zona ON escuelas(zona_escolar);
CREATE INDEX idx_escuelas_region ON escuelas(region);
CREATE INDEX idx_escuelas_turno ON escuelas(turno);

-- ====================================
-- TABLA: diagnosticos
-- Diagnósticos educativos NEM
-- ====================================
CREATE TABLE IF NOT EXISTS diagnosticos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escuela_id UUID NOT NULL REFERENCES escuelas(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR' CHECK (estado IN ('BORRADOR', 'EN_CAPTURA', 'COMPLETADO', 'VALIDADO', 'APROBADO')),
    datos_generales JSONB NOT NULL,
    dimension_aprovechamiento JSONB,
    dimension_practicas_docentes JSONB,
    dimension_formacion_docente JSONB,
    dimension_planes_programa JSONB,
    dimension_participacion_familia JSONB,
    puntajes JSONB,
    puntaje_general DECIMAL(5,2),
    nivel_general VARCHAR(20) CHECK (nivel_general IN ('EXCELENTE', 'BUENO', 'REGULAR', 'DEFICIENTE')),
    version VARCHAR(10) NOT NULL DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para diagnosticos
CREATE INDEX idx_diagnosticos_escuela ON diagnosticos(escuela_id);
CREATE INDEX idx_diagnosticos_usuario ON diagnosticos(usuario_id);
CREATE INDEX idx_diagnosticos_estado ON diagnosticos(estado);
CREATE INDEX idx_diagnosticos_ciclo ON diagnosticos((datos_generales->>'cicloEscolar'));

-- ====================================
-- FUNCIONES AUXILIARES
-- ====================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escuelas_updated_at
    BEFORE UPDATE ON escuelas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagnosticos_updated_at
    BEFORE UPDATE ON diagnosticos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- RLS (Row Level Security) POLÍTICAS
-- ====================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE escuelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Los usuarios pueden ver su propio perfil" 
    ON usuarios FOR SELECT 
    USING (auth.uid()::text = id::text);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" 
    ON usuarios FOR UPDATE 
    USING (auth.uid()::text = id::text);

-- Políticas para escuelas (todos los usuarios autenticados pueden ver todas las escuelas de su zona)
CREATE POLICY "Ver escuelas de la zona" 
    ON escuelas FOR SELECT 
    TO authenticated 
    USING (zona_escolar = '014');

CREATE POLICY "Supervisores e inspectores pueden modificar escuelas" 
    ON escuelas FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id::text = auth.uid()::text 
            AND rol IN ('SUPERVISOR', 'INSPECTOR')
        )
    );

-- Políticas para diagnósticos
CREATE POLICY "Ver diagnósticos propios y de la zona" 
    ON diagnosticos FOR SELECT 
    TO authenticated 
    USING (
        usuario_id::text = auth.uid()::text 
        OR EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id::text = auth.uid()::text 
            AND rol IN ('SUPERVISOR', 'INSPECTOR')
        )
    );

CREATE POLICY "Crear diagnósticos propios" 
    ON diagnosticos FOR INSERT 
    TO authenticated 
    WITH CHECK (usuario_id::text = auth.uid()::text);

CREATE POLICY "Actualizar diagnósticos propios" 
    ON diagnosticos FOR UPDATE 
    TO authenticated 
    USING (
        usuario_id::text = auth.uid()::text 
        OR EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id::text = auth.uid()::text 
            AND rol IN ('SUPERVISOR', 'INSPECTOR')
        )
    );

-- ====================================
-- DATOS DE PRUEBA
-- ====================================

-- Insertar usuarios de prueba (las contraseñas se manejan por Supabase Auth)
INSERT INTO usuarios (id, email, nombre, apellidos, rol, zona_escolar, telefono) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'supervisor@ze14.edu.mx', 'María Elena', 'González Hernández', 'SUPERVISOR', '014', '4811234567'),
('550e8400-e29b-41d4-a716-446655440002', 'inspector@ze14.edu.mx', 'Carlos Alberto', 'Martínez López', 'INSPECTOR', '014', '4811234568'),
('550e8400-e29b-41d4-a716-446655440003', 'director1@ze14.edu.mx', 'Ana Patricia', 'Rodríguez Vega', 'DIRECTOR', '014', '4811234569'),
('550e8400-e29b-41d4-a716-446655440004', 'director2@ze14.edu.mx', 'José Luis', 'Ramírez Santos', 'DIRECTOR', '014', '4811234570')
ON CONFLICT (email) DO NOTHING;

-- Insertar escuelas de prueba (6 Escuelas Secundarias Técnicas - Zona 14)
-- Región Sur: EST 4, 7, 82
-- Región Norte: EST 41, 77, 81
INSERT INTO escuelas (id, nombre, cct, nivel, turno, modalidad, director, zona_escolar, region, direccion, contacto, estadisticas) VALUES
-- REGIÓN SUR
(
    '660e8400-e29b-41d4-a716-446655440001',
    'Escuela Secundaria Técnica No. 4',
    '24EST0004D',
    'Secundaria Técnica',
    'MATUTINO',
    'Presencial',
    'Director EST 4',
    '014',
    'HUASTECA_SUR',
    '{"calle": "Calle Principal", "colonia": "Centro", "municipio": "Tamazunchale", "localidad": "Tamazunchale", "codigoPostal": "79960"}',
    '{"telefono": "4891234001", "email": "est4@escuelas.slp.gob.mx", "celular": "4891234001"}',
    '{"totalAlumnos": 280, "totalDocentes": 15, "gruposPorGrado": {"1": 3, "2": 3, "3": 3}}'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    'Escuela Secundaria Técnica No. 7',
    '24EST0007A',
    'Secundaria Técnica',
    'MATUTINO',
    'Presencial',
    'Director EST 7',
    '014',
    'HUASTECA_SUR',
    '{"calle": "Av. Juárez", "colonia": "Centro", "municipio": "Tamazunchale", "localidad": "Tamazunchale", "codigoPostal": "79960"}',
    '{"telefono": "4891234002", "email": "est7@escuelas.slp.gob.mx", "celular": "4891234002"}',
    '{"totalAlumnos": 250, "totalDocentes": 14, "gruposPorGrado": {"1": 3, "2": 3, "3": 2}}'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    'Escuela Secundaria Técnica No. 82',
    '24EST0082D',
    'Secundaria Técnica',
    'VESPERTINO',
    'Presencial',
    'Director EST 82',
    '014',
    'HUASTECA_SUR',
    '{"calle": "Calle Hidalgo", "colonia": "Benito Juárez", "municipio": "Tamazunchale", "localidad": "Tamazunchale", "codigoPostal": "79960"}',
    '{"telefono": "4891234003", "email": "est82@escuelas.slp.gob.mx", "celular": "4891234003"}',
    '{"totalAlumnos": 210, "totalDocentes": 12, "gruposPorGrado": {"1": 2, "2": 2, "3": 2}}'
),
-- REGIÓN NORTE
(
    '660e8400-e29b-41d4-a716-446655440004',
    'Escuela Secundaria Técnica No. 41',
    '24EST0041C',
    'Secundaria Técnica',
    'MATUTINO',
    'Presencial',
    'Director EST 41',
    '014',
    'HUASTECA_NORTE',
    '{"calle": "Av. Principal", "colonia": "Centro", "municipio": "Ciudad Valles", "localidad": "Ciudad Valles", "codigoPostal": "79000"}',
    '{"telefono": "4811234004", "email": "est41@escuelas.slp.gob.mx", "celular": "4811234004"}',
    '{"totalAlumnos": 350, "totalDocentes": 20, "gruposPorGrado": {"1": 4, "2": 4, "3": 4}}'
),
(
    '660e8400-e29b-41d4-a716-446655440005',
    'Escuela Secundaria Técnica No. 77',
    '24EST0077B',
    'Secundaria Técnica',
    'MATUTINO',
    'Presencial',
    'Director EST 77',
    '014',
    'HUASTECA_NORTE',
    '{"calle": "Calle Morelos", "colonia": "Centro", "municipio": "Tamuín", "localidad": "Tamuín", "codigoPostal": "79100"}',
    '{"telefono": "4811234005", "email": "est77@escuelas.slp.gob.mx", "celular": "4811234005"}',
    '{"totalAlumnos": 300, "totalDocentes": 17, "gruposPorGrado": {"1": 3, "2": 3, "3": 3}}'
),
(
    '660e8400-e29b-41d4-a716-446655440006',
    'Escuela Secundaria Técnica No. 81',
    '24EST0081E',
    'Secundaria Técnica',
    'MATUTINO',
    'Presencial',
    'Ana Patricia Rodríguez Vega',
    '014',
    'HUASTECA_NORTE',
    '{"calle": "Av. Juárez No. 123", "colonia": "Centro", "municipio": "Ciudad Valles", "localidad": "Ciudad Valles", "codigoPostal": "79000"}',
    '{"telefono": "4811234569", "email": "est81@escuelas.slp.gob.mx", "celular": "4811234569"}',
    '{"totalAlumnos": 320, "totalDocentes": 18, "gruposPorGrado": {"1": 4, "2": 4, "3": 4}}'
)
ON CONFLICT (cct) DO NOTHING;

-- ====================================
-- VISTAS ÚTILES
-- ====================================

-- Vista para estadísticas de zona
CREATE OR REPLACE VIEW vista_estadisticas_zona AS
SELECT 
    COUNT(e.id) as total_escuelas,
    SUM((e.estadisticas->>'totalAlumnos')::int) as total_alumnos,
    SUM((e.estadisticas->>'totalDocentes')::int) as total_docentes,
    COUNT(d.id) as total_diagnosticos,
    COUNT(CASE WHEN d.estado = 'COMPLETADO' THEN 1 END) as diagnosticos_completados,
    ROUND(
        COUNT(CASE WHEN d.estado = 'COMPLETADO' THEN 1 END)::decimal / 
        NULLIF(COUNT(d.id), 0) * 100, 2
    ) as porcentaje_completados
FROM escuelas e
LEFT JOIN diagnosticos d ON e.id = d.escuela_id
WHERE e.zona_escolar = '014';

-- ====================================
-- COMENTARIOS FINALES
-- ====================================

-- Para usar este esquema:
-- 1. Crea un proyecto en Supabase
-- 2. Ve a SQL Editor
-- 3. Ejecuta este script completo
-- 4. Configura las variables de entorno en tu aplicación
-- 5. Los usuarios se registrarán automáticamente vía Supabase Auth

COMMENT ON TABLE usuarios IS 'Usuarios del sistema con roles específicos';
COMMENT ON TABLE escuelas IS 'Catálogo de escuelas de la zona escolar 014';
COMMENT ON TABLE diagnosticos IS 'Diagnósticos educativos basados en NEM';
COMMENT ON VIEW vista_estadisticas_zona IS 'Vista con estadísticas generales de la zona';