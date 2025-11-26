# Integración Login con Base de Datos - Resumen de Cambios

## Fecha: 2025-11-26

## Cambios Realizados

### 1. Base de Datos (init_schema.sql)
✅ **Agregada columna `id_usuario` a la tabla `historia_clinica`**
- Tipo: `INT`
- Llave foránea: `REFERENCES usuario(id)`
- Propósito: Registrar qué usuario realizó cada análisis

```sql
CREATE TABLE IF NOT EXISTS historia_clinica (
    id SERIAL PRIMARY KEY,
    paciente_id INT REFERENCES paciente(id),
    zona_clinica_id INT REFERENCES zona_clinica(id),
    edad INT NOT NULL,
    enfermedad_id INT REFERENCES enfermedad(id),
    id_usuario INT REFERENCES usuario(id),  -- ✅ NUEVO
    fecha TIMESTAMP DEFAULT NOW()
);
```

### 2. Backend (backend/fastapi_skin_demo/app/main.py)

#### ✅ Eliminado endpoint duplicado `/api/login`
- Se eliminó la segunda definición del endpoint que causaba conflictos

#### ✅ Nuevo endpoint `/api/save-analysis`
Guarda los resultados del análisis en la base de datos con los siguientes datos:

**Parámetros:**
- `paciente_nombre`: Nombre del paciente
- `paciente_edad`: Edad del paciente
- `paciente_sexo`: Sexo (M/F)
- `paciente_ci`: Cédula de identidad
- `paciente_complemento`: Complemento de CI (opcional)
- `paciente_telefono`: Teléfono (opcional)
- `zona_clinica`: Zona anatómica analizada
- `enfermedad_codigo`: Código de enfermedad detectada (MEL, NV, BCC, BKL)
- `id_usuario`: ID del usuario que realizó el análisis ⭐

**Funcionalidad:**
1. Busca o crea el paciente por CI
2. Actualiza datos del paciente si ya existe
3. Inserta registro en `historia_clinica` con el `id_usuario`
4. Retorna IDs de paciente e historia clínica creados

### 3. Frontend (frontend/src/pages/Analizar.jsx)

#### ✅ Actualizada función `handleAnalyze`
Ahora después de obtener la predicción del modelo:

1. Obtiene el `userId` desde `localStorage`
2. Llama al endpoint `/api/save-analysis` con todos los datos
3. Guarda el análisis en la base de datos asociado al usuario

```javascript
// Obtener el ID del usuario desde localStorage
const userId = localStorage.getItem('userId')

// Guardar el análisis en la base de datos
if (userId) {
  const saveFormData = new FormData()
  saveFormData.append('paciente_nombre', formData.nombre)
  saveFormData.append('paciente_edad', formData.age)
  saveFormData.append('paciente_sexo', formData.sex)
  saveFormData.append('paciente_ci', formData.ci)
  saveFormData.append('paciente_complemento', formData.complemento || '')
  saveFormData.append('paciente_telefono', formData.telefono || '')
  saveFormData.append('zona_clinica', formData.anatom_site_general)
  saveFormData.append('enfermedad_codigo', predictionData.top_predictions[0].disease)
  saveFormData.append('id_usuario', userId)  // ⭐ ID del usuario
  
  await fetch('/api/save-analysis', {
    method: 'POST',
    body: saveFormData
  })
}
```

## Diagrama de Relaciones Actualizado

```
+--------------------+
|      USUARIO       |
+--------------------+
| id (PK)            |
| nombre             |
| password           |
+--------------------+
        ^
        |
        | (FK id_usuario)
        |
+-----------------------------+
|     HISTORIA_CLINICA        |
+-----------------------------+
| id (PK)                     |
| paciente_id (FK)            |
| zona_clinica_id (FK)        |
| edad                        |
| enfermedad_id (FK)          |
| id_usuario (FK) ⭐ NUEVO    |
| fecha                       |
+-----------------------------+
```

## Flujo Completo

1. **Login**: Usuario inicia sesión → `userId` se guarda en `localStorage`
2. **Análisis**: Usuario completa formulario y sube imagen
3. **Predicción**: Backend procesa imagen con modelo ML
4. **Guardado**: Sistema guarda análisis en BD con `id_usuario`
5. **Trazabilidad**: Cada análisis queda registrado con el usuario que lo realizó

## Verificación

Para verificar que todo funciona:

1. Inicia sesión con un usuario (ej: matias/1234)
2. Realiza un análisis completo
3. Consulta la base de datos:

```sql
SELECT 
    hc.id,
    hc.fecha,
    u.nombre as usuario,
    p.nombre as paciente,
    e.enfermedad
FROM historia_clinica hc
JOIN usuario u ON hc.id_usuario = u.id
JOIN paciente p ON hc.paciente_id = p.id
JOIN enfermedad e ON hc.enfermedad_id = e.id
ORDER BY hc.fecha DESC;
```

## Próximos Pasos Sugeridos

1. ✅ Implementar hash de contraseñas (bcrypt)
2. ✅ Agregar tokens JWT para sesiones más seguras
3. ✅ Crear endpoint para consultar historial por usuario
4. ✅ Agregar validación de permisos por usuario
5. ✅ Implementar logs de auditoría

## Notas Técnicas

- La tabla `historia_clinica` ahora tiene constraint de FK a `usuario`
- Si se elimina un usuario, se debe decidir qué hacer con sus análisis (CASCADE o RESTRICT)
- El `id_usuario` es opcional en la BD (puede ser NULL) para mantener compatibilidad
