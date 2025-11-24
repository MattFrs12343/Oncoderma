-- ============================================
-- SCHEMA DE BASE DE DATOS - ONCODERMA
-- ============================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tabla de sexo
CREATE TABLE IF NOT EXISTS sexo (
    id SERIAL PRIMARY KEY,
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F'))
);

-- Tabla de zona clínica
CREATE TABLE IF NOT EXISTS zona_clinica (
    id SERIAL PRIMARY KEY,
    zona VARCHAR(50) NOT NULL,
    detalle TEXT
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS paciente (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    sexo_id INT REFERENCES sexo(id),
    zona_clinica_id INT REFERENCES zona_clinica(id),
    ci VARCHAR(20) NOT NULL,
    complemento VARCHAR(10),
    telefono VARCHAR(20)
);

-- Tabla de enfermedades
CREATE TABLE IF NOT EXISTS enfermedad (
    id SERIAL PRIMARY KEY,
    enfermedad VARCHAR(50) NOT NULL,
    detalle TEXT
);

-- Tabla de historial clínico
CREATE TABLE IF NOT EXISTS historia_clinica (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES paciente(id),
    zona_clinica_id INT REFERENCES zona_clinica(id),
    edad INT NOT NULL,
    enfermedad_id INT REFERENCES enfermedad(id),
    fecha TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar usuarios de prueba
INSERT INTO usuario (nombre, password) VALUES
    ('matias', '1234'),
    ('carlos', '1234'),
    ('bianca', '1234'),
    ('melissa', '1234')
ON CONFLICT DO NOTHING;

-- Insertar sexos
INSERT INTO sexo (sexo) VALUES ('M'), ('F')
ON CONFLICT DO NOTHING;

-- Insertar zonas clínicas
INSERT INTO zona_clinica (zona, detalle) VALUES
    ('Cabeza/Cuello', 'Región de cabeza y cuello'),
    ('Torso Anterior', 'Parte frontal del torso'),
    ('Torso Posterior', 'Parte posterior del torso'),
    ('Torso Lateral', 'Parte lateral del torso'),
    ('Extremidad Superior', 'Brazos y manos'),
    ('Extremidad Inferior', 'Piernas y pies'),
    ('Palmas/Plantas', 'Palmas de manos y plantas de pies'),
    ('Oral/Genital', 'Región oral y genital')
ON CONFLICT DO NOTHING;

-- Insertar enfermedades relacionadas con cáncer de piel
INSERT INTO enfermedad (enfermedad, detalle) VALUES
    ('NV', 'Nevus melanocítico - Lunar benigno común'),
    ('BKL', 'Lesión queratósica benigna - Lesión cutánea benigna'),
    ('BCC', 'Carcinoma basocelular - Tipo más común de cáncer de piel'),
    ('MEL', 'Melanoma - Tipo más grave de cáncer de piel')
ON CONFLICT DO NOTHING;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_paciente_ci ON paciente(ci);
CREATE INDEX IF NOT EXISTS idx_historia_paciente ON historia_clinica(paciente_id);
CREATE INDEX IF NOT EXISTS idx_historia_fecha ON historia_clinica(fecha);
