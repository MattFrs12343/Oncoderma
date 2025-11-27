# Requirements Document

## Introduction

El sistema OncoDerma tiene un problema de inicialización de la base de datos. El archivo `init_schema.sql` que contiene el esquema de la base de datos y los datos iniciales (usuarios, enfermedades, zonas clínicas, etc.) no se está ejecutando automáticamente cuando se crea el contenedor de PostgreSQL. Esto causa que los usuarios no puedan iniciar sesión porque la tabla `usuario` está vacía o no existe.

## Glossary

- **PostgreSQL**: Sistema de gestión de base de datos relacional utilizado por OncoDerma
- **Docker Compose**: Herramienta para definir y ejecutar aplicaciones Docker multi-contenedor
- **init_schema.sql**: Archivo SQL que contiene el esquema de la base de datos y datos iniciales
- **Volume Mount**: Mecanismo de Docker para montar archivos del host en el contenedor
- **docker-entrypoint-initdb.d**: Directorio especial de PostgreSQL donde se ejecutan automáticamente scripts de inicialización

## Requirements

### Requirement 1

**User Story:** Como administrador del sistema, quiero que el esquema de la base de datos se inicialice automáticamente cuando se crea el contenedor de PostgreSQL, para que los usuarios puedan iniciar sesión sin configuración manual.

#### Acceptance Criteria

1. WHEN el contenedor de PostgreSQL se crea por primera vez THEN el sistema SHALL ejecutar automáticamente el archivo init_schema.sql
2. WHEN el archivo init_schema.sql se ejecuta THEN el sistema SHALL crear todas las tablas necesarias (usuario, paciente, historia_clinica, enfermedad, zona_clinica, sexo)
3. WHEN el archivo init_schema.sql se ejecuta THEN el sistema SHALL insertar los datos iniciales de usuarios (matias, carlos, bianca, melissa)
4. WHEN el archivo init_schema.sql se ejecuta THEN el sistema SHALL insertar los datos de referencia (enfermedades, zonas clínicas, sexos)
5. WHEN el contenedor de PostgreSQL ya existe THEN el sistema SHALL NOT ejecutar nuevamente el archivo init_schema.sql

### Requirement 2

**User Story:** Como desarrollador, quiero que el archivo init_schema.sql esté correctamente montado en el contenedor de PostgreSQL, para que PostgreSQL pueda ejecutarlo durante la inicialización.

#### Acceptance Criteria

1. WHEN se configura docker-compose.yml THEN el sistema SHALL montar el archivo init_schema.sql en /docker-entrypoint-initdb.d/
2. WHEN se inicia el contenedor de PostgreSQL THEN el sistema SHALL tener acceso de lectura al archivo init_schema.sql
3. WHEN se verifica la configuración THEN el volumen SHALL estar correctamente definido en la sección de volumes del servicio postgres

### Requirement 3

**User Story:** Como usuario del sistema, quiero poder iniciar sesión con las credenciales predefinidas (matias/1234, carlos/1234, etc.), para acceder a la aplicación sin problemas.

#### Acceptance Criteria

1. WHEN un usuario intenta iniciar sesión con credenciales válidas THEN el sistema SHALL autenticar exitosamente al usuario
2. WHEN un usuario intenta iniciar sesión con credenciales inválidas THEN el sistema SHALL rechazar el intento y mostrar un mensaje de error
3. WHEN se consulta la tabla usuario THEN el sistema SHALL retornar al menos 4 usuarios (matias, carlos, bianca, melissa)
4. WHEN se verifica la contraseña THEN el sistema SHALL comparar la contraseña en texto plano con la almacenada en la base de datos

### Requirement 4

**User Story:** Como administrador del sistema, quiero poder reiniciar la base de datos desde cero cuando sea necesario, para poder probar la inicialización o corregir datos corruptos.

#### Acceptance Criteria

1. WHEN se elimina el volumen de PostgreSQL THEN el sistema SHALL permitir la eliminación sin errores
2. WHEN se recrea el contenedor de PostgreSQL después de eliminar el volumen THEN el sistema SHALL ejecutar nuevamente el archivo init_schema.sql
3. WHEN se verifica la base de datos después de la reinicialización THEN el sistema SHALL contener todos los datos iniciales correctamente
