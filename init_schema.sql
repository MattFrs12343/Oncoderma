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
    enfermedad_id_1 INT REFERENCES enfermedad(id),
    probabilidad_1 DECIMAL(5,2) NOT NULL,
    enfermedad_id_2 INT REFERENCES enfermedad(id),
    probabilidad_2 DECIMAL(5,2) NOT NULL,
    enfermedad_id_3 INT REFERENCES enfermedad(id),
    probabilidad_3 DECIMAL(5,2) NOT NULL,
    id_usuario INT REFERENCES usuario(id),
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

-- ============================================
-- DATOS DE PRUEBA PARA TESTING
-- ============================================

-- Insertar 10 pacientes de prueba
INSERT INTO paciente (nombre, edad, sexo_id, zona_clinica_id, ci, complemento, telefono) VALUES
    ('Juan Pérez García', 45, 1, 1, '12345678', '1A', '70123456'),
    ('María López Fernández', 32, 2, 2, '23456789', '2B', '71234567'),
    ('Carlos Rodríguez Sánchez', 58, 1, 3, '34567890', NULL, '72345678'),
    ('Ana Martínez Torres', 41, 2, 4, '45678901', '3C', NULL),
    ('Luis González Ramírez', 29, 1, 5, '56789012', NULL, '74567890'),
    ('Elena Díaz Morales', 67, 2, 6, '67890123', '4D', '75678901'),
    ('Pedro Hernández Castro', 52, 1, 7, '78901234', '5E', '76789012'),
    ('Laura Jiménez Ruiz', 38, 2, 8, '89012345', NULL, '77890123'),
    ('Miguel Álvarez Ortiz', 44, 1, 1, '90123456', '6F', '78901234'),
    ('Carmen Romero Navarro', 55, 2, 2, '01234567', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Insertar 8 análisis en historia_clinica con TOP 3 de enfermedades
-- Distribución random entre pacientes, usuarios, zonas y enfermedades
INSERT INTO historia_clinica (paciente_id, zona_clinica_id, edad, enfermedad_id_1, probabilidad_1, enfermedad_id_2, probabilidad_2, enfermedad_id_3, probabilidad_3, id_usuario, fecha) VALUES
    -- Análisis 1: Paciente Juan Pérez
    (1, 1, 45, 2, 89.50, 1, 7.80, 4, 2.70, 1, NOW() - INTERVAL '15 days'),
    
    -- Análisis 2: Paciente María López
    (2, 2, 32, 1, 76.30, 2, 18.20, 3, 5.50, 2, NOW() - INTERVAL '12 days'),
    
    -- Análisis 3: Paciente Carlos Rodríguez
    (3, 3, 58, 3, 82.10, 4, 12.40, 2, 5.50, 3, NOW() - INTERVAL '10 days'),
    
    -- Análisis 4: Paciente Ana Martínez
    (4, 4, 41, 2, 92.10, 1, 6.50, 3, 1.40, 4, NOW() - INTERVAL '8 days'),
    
    -- Análisis 5: Paciente Luis González
    (5, 5, 29, 4, 68.70, 2, 21.30, 1, 10.00, 1, NOW() - INTERVAL '6 days'),
    
    -- Análisis 6: Paciente Elena Díaz (segundo análisis)
    (6, 6, 67, 1, 55.20, 3, 28.90, 2, 15.90, 2, NOW() - INTERVAL '5 days'),
    
    -- Análisis 7: Paciente Pedro Hernández
    (7, 7, 52, 2, 87.40, 4, 9.10, 1, 3.50, 3, NOW() - INTERVAL '3 days'),
    
    -- Análisis 8: Paciente Laura Jiménez
    (8, 8, 38, 3, 71.80, 2, 19.60, 4, 8.60, 4, NOW() - INTERVAL '2 days'),
    
    -- Análisis 9: Paciente Miguel Álvarez (segundo análisis para algunos)
    (9, 1, 44, 4, 94.30, 1, 4.20, 2, 1.50, 1, NOW() - INTERVAL '1 day'),
    
    -- Análisis 10: Paciente Carmen Romero
    (10, 2, 55, 2, 79.60, 3, 13.80, 4, 6.60, 2, NOW())
ON CONFLICT DO NOTHING;
