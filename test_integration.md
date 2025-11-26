# Guía de Prueba - Integración Login y Base de Datos

## Objetivo
Verificar que el sistema guarda correctamente los análisis asociados al usuario que inició sesión.

## Pasos para Probar

### 1. Acceder a la Aplicación
Abre tu navegador y ve a: `http://localhost`

### 2. Iniciar Sesión
Usa cualquiera de estos usuarios de prueba:
- **Usuario**: matias | **Contraseña**: 1234
- **Usuario**: carlos | **Contraseña**: 1234
- **Usuario**: bianca | **Contraseña**: 1234
- **Usuario**: melissa | **Contraseña**: 1234

### 3. Realizar un Análisis
1. Ve a la página "Analizar"
2. Completa el formulario con datos de prueba:
   - **Nombre**: Juan Pérez
   - **Edad**: 45
   - **Sexo**: Masculino
   - **CI**: 12345678
   - **Complemento**: 1A (opcional)
   - **Teléfono**: 70123456 (opcional)
   - **Zona anatómica**: Torso anterior

3. Click en "Siguiente"
4. Sube una imagen de prueba
5. Click en "Analizar Imagen"
6. Espera los resultados

### 4. Verificar en la Base de Datos

#### Opción A: Usando pgAdmin (http://localhost:5050)
1. Conéctate al servidor PostgreSQL:
   - **Host**: postgres
   - **Port**: 5432
   - **Database**: appdb
   - **User**: admin
   - **Password**: admin123

2. Ejecuta esta consulta:
```sql
SELECT 
    hc.id as historia_id,
    hc.fecha,
    u.nombre as usuario_analista,
    p.nombre as paciente,
    p.ci,
    p.edad,
    zc.zona as zona_clinica,
    e.enfermedad,
    e.detalle
FROM historia_clinica hc
JOIN usuario u ON hc.id_usuario = u.id
JOIN paciente p ON hc.paciente_id = p.id
LEFT JOIN zona_clinica zc ON hc.zona_clinica_id = zc.id
LEFT JOIN enfermedad e ON hc.enfermedad_id = e.id
ORDER BY hc.fecha DESC
LIMIT 10;
```

#### Opción B: Usando Docker CLI
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT hc.id, hc.fecha, u.nombre as usuario, p.nombre as paciente, e.enfermedad FROM historia_clinica hc JOIN usuario u ON hc.id_usuario = u.id JOIN paciente p ON hc.paciente_id = p.id JOIN enfermedad e ON hc.enfermedad_id = e.id ORDER BY hc.fecha DESC LIMIT 5;"
```

### 5. Verificar Resultados Esperados

Deberías ver:
- ✅ Un nuevo registro en `historia_clinica`
- ✅ El campo `id_usuario` debe contener el ID del usuario con el que iniciaste sesión
- ✅ El campo `paciente_id` debe apuntar al paciente creado/actualizado
- ✅ El campo `enfermedad_id` debe contener la enfermedad detectada
- ✅ La fecha debe ser la actual

### 6. Probar con Diferentes Usuarios

1. Cierra sesión
2. Inicia sesión con otro usuario (ej: carlos)
3. Realiza otro análisis
4. Verifica que el nuevo registro tenga el `id_usuario` de carlos

## Consultas Útiles

### Ver todos los análisis por usuario
```sql
SELECT 
    u.nombre as usuario,
    COUNT(*) as total_analisis
FROM historia_clinica hc
JOIN usuario u ON hc.id_usuario = u.id
GROUP BY u.nombre
ORDER BY total_analisis DESC;
```

### Ver análisis de un usuario específico
```sql
SELECT 
    hc.fecha,
    p.nombre as paciente,
    e.enfermedad
FROM historia_clinica hc
JOIN usuario u ON hc.id_usuario = u.id
JOIN paciente p ON hc.paciente_id = p.id
JOIN enfermedad e ON hc.enfermedad_id = e.id
WHERE u.nombre = 'matias'
ORDER BY hc.fecha DESC;
```

### Ver pacientes únicos analizados
```sql
SELECT DISTINCT
    p.nombre,
    p.ci,
    p.edad,
    COUNT(hc.id) as num_analisis
FROM paciente p
JOIN historia_clinica hc ON p.id = hc.paciente_id
GROUP BY p.id, p.nombre, p.ci, p.edad
ORDER BY num_analisis DESC;
```

## Troubleshooting

### Problema: No se guarda el análisis
**Solución**: Verifica que:
1. Hayas iniciado sesión correctamente
2. El `userId` esté en localStorage (F12 → Application → Local Storage)
3. Los logs del backend no muestren errores: `docker logs backend --tail 50`

### Problema: Error 500 al guardar
**Solución**: 
1. Verifica los logs: `docker logs backend --tail 50`
2. Verifica que la base de datos esté corriendo: `docker ps`
3. Verifica la conexión a la BD: `docker exec postgres pg_isready -U admin -d appdb`

### Problema: id_usuario es NULL
**Solución**:
1. Verifica que el login esté guardando el userId en localStorage
2. Abre la consola del navegador (F12) y verifica: `localStorage.getItem('userId')`
3. Si es null, vuelve a iniciar sesión

## Logs para Debugging

### Ver logs del backend
```powershell
docker logs backend --tail 100 -f
```

### Ver logs del frontend
```powershell
docker logs frontend --tail 100 -f
```

### Ver logs de PostgreSQL
```powershell
docker logs postgres --tail 100 -f
```

## Estado Esperado del Sistema

Después de realizar varios análisis con diferentes usuarios, deberías poder:
- ✅ Ver qué usuario realizó cada análisis
- ✅ Filtrar análisis por usuario
- ✅ Generar reportes de actividad por usuario
- ✅ Auditar quién analizó a cada paciente
