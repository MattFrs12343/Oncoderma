# Comandos de Verificación - Base de Datos

## Cambios Realizados

### ✅ TAREA 1: Estructura de `historia_clinica` actualizada
- Agregadas columnas para TOP 3 enfermedades
- Agregadas columnas para probabilidades

### ✅ TAREA 2: Base de datos poblada
- 10 pacientes de prueba
- 10 análisis en historia_clinica
- Distribución random de enfermedades

### ✅ TAREA 3: Inicialización automática configurada
- Archivo `init_schema.sql` montado en contenedor PostgreSQL
- Script se ejecuta automáticamente en primera inicialización
- Usuarios y datos de prueba se crean sin intervención manual

---

## 🔧 Cómo Resetear la Base de Datos

Si necesitas reiniciar la base de datos desde cero:

```powershell
# 1. Detener y eliminar todos los contenedores y volúmenes
docker-compose down -v

# 2. Iniciar nuevamente (el script init_schema.sql se ejecutará automáticamente)
docker-compose up -d

# 3. Esperar a que PostgreSQL esté listo (unos 10 segundos)
# 4. Verificar que los datos se crearon
docker exec postgres psql -U admin -d appdb -c "SELECT COUNT(*) FROM usuario;"
```

**Resultado esperado:** 4 usuarios

---

## Comandos de Verificación

### 1. Ver estructura de la tabla `historia_clinica`

```sql
\d historia_clinica
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "\d historia_clinica"
```

**Resultado esperado:**
```
Column          | Type                        
----------------+-----------------------------
id              | integer                     
paciente_id     | integer                     
zona_clinica_id | integer                     
edad            | integer                     
enfermedad_id_1 | integer                     
probabilidad_1  | numeric(5,2)                
enfermedad_id_2 | integer                     
probabilidad_2  | numeric(5,2)                
enfermedad_id_3 | integer                     
probabilidad_3  | numeric(5,2)                
id_usuario      | integer                     
fecha           | timestamp without time zone 
```

---

### 2. Ver todos los pacientes creados

```sql
SELECT id, nombre, edad, ci, telefono 
FROM paciente 
ORDER BY id;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT id, nombre, edad, ci, telefono FROM paciente ORDER BY id;"
```

**Resultado esperado:** 10 pacientes

---

### 3. Ver todos los análisis con TOP 3 de enfermedades

```sql
SELECT 
    hc.id,
    p.nombre as paciente,
    e1.enfermedad as enfermedad_1,
    hc.probabilidad_1,
    e2.enfermedad as enfermedad_2,
    hc.probabilidad_2,
    e3.enfermedad as enfermedad_3,
    hc.probabilidad_3,
    u.nombre as usuario,
    hc.fecha
FROM historia_clinica hc
JOIN paciente p ON hc.paciente_id = p.id
JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id
JOIN enfermedad e2 ON hc.enfermedad_id_2 = e2.id
JOIN enfermedad e3 ON hc.enfermedad_id_3 = e3.id
JOIN usuario u ON hc.id_usuario = u.id
ORDER BY hc.fecha DESC;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT hc.id, p.nombre as paciente, e1.enfermedad as enf_1, hc.probabilidad_1 as prob_1, e2.enfermedad as enf_2, hc.probabilidad_2 as prob_2, e3.enfermedad as enf_3, hc.probabilidad_3 as prob_3, u.nombre as usuario FROM historia_clinica hc JOIN paciente p ON hc.paciente_id = p.id JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id JOIN enfermedad e2 ON hc.enfermedad_id_2 = e2.id JOIN enfermedad e3 ON hc.enfermedad_id_3 = e3.id JOIN usuario u ON hc.id_usuario = u.id ORDER BY hc.fecha DESC;"
```

**Resultado esperado:** 10 análisis con 3 enfermedades cada uno

---

### 4. Contar registros por tabla

```sql
SELECT 
    'usuarios' as tabla, COUNT(*) as total FROM usuario
UNION ALL
SELECT 'pacientes', COUNT(*) FROM paciente
UNION ALL
SELECT 'historia_clinica', COUNT(*) FROM historia_clinica
UNION ALL
SELECT 'enfermedades', COUNT(*) FROM enfermedad
UNION ALL
SELECT 'zonas_clinicas', COUNT(*) FROM zona_clinica
UNION ALL
SELECT 'sexos', COUNT(*) FROM sexo;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT 'usuarios' as tabla, COUNT(*) as total FROM usuario UNION ALL SELECT 'pacientes', COUNT(*) FROM paciente UNION ALL SELECT 'historia_clinica', COUNT(*) FROM historia_clinica UNION ALL SELECT 'enfermedades', COUNT(*) FROM enfermedad UNION ALL SELECT 'zonas_clinicas', COUNT(*) FROM zona_clinica UNION ALL SELECT 'sexos', COUNT(*) FROM sexo;"
```

**Resultado esperado:**
```
tabla             | total
------------------+-------
usuarios          |     4
pacientes         |    10
historia_clinica  |    10
enfermedades      |     4
zonas_clinicas    |     8
sexos             |     2
```

---

### 5. Ver distribución de enfermedades (TOP 1)

```sql
SELECT 
    e.enfermedad,
    COUNT(*) as cantidad,
    ROUND(AVG(hc.probabilidad_1), 2) as prob_promedio
FROM historia_clinica hc
JOIN enfermedad e ON hc.enfermedad_id_1 = e.id
GROUP BY e.enfermedad
ORDER BY cantidad DESC;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT e.enfermedad, COUNT(*) as cantidad, ROUND(AVG(hc.probabilidad_1), 2) as prob_promedio FROM historia_clinica hc JOIN enfermedad e ON hc.enfermedad_id_1 = e.id GROUP BY e.enfermedad ORDER BY cantidad DESC;"
```

---

### 6. Ver análisis por usuario

```sql
SELECT 
    u.nombre as usuario,
    COUNT(*) as total_analisis
FROM historia_clinica hc
JOIN usuario u ON hc.id_usuario = u.id
GROUP BY u.nombre
ORDER BY total_analisis DESC;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT u.nombre as usuario, COUNT(*) as total_analisis FROM historia_clinica hc JOIN usuario u ON hc.id_usuario = u.id GROUP BY u.nombre ORDER BY total_analisis DESC;"
```

---

### 7. Ver análisis por zona clínica

```sql
SELECT 
    zc.zona,
    COUNT(*) as total_analisis
FROM historia_clinica hc
JOIN zona_clinica zc ON hc.zona_clinica_id = zc.id
GROUP BY zc.zona
ORDER BY total_analisis DESC;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT zc.zona, COUNT(*) as total_analisis FROM historia_clinica hc JOIN zona_clinica zc ON hc.zona_clinica_id = zc.id GROUP BY zc.zona ORDER BY total_analisis DESC;"
```

---

### 8. Ver detalle completo de un análisis específico

```sql
SELECT 
    hc.id as analisis_id,
    hc.fecha,
    p.nombre as paciente,
    p.edad,
    p.ci,
    s.sexo,
    zc.zona as zona_clinica,
    e1.enfermedad as enfermedad_principal,
    e1.detalle as detalle_principal,
    hc.probabilidad_1,
    e2.enfermedad as enfermedad_secundaria,
    hc.probabilidad_2,
    e3.enfermedad as enfermedad_terciaria,
    hc.probabilidad_3,
    u.nombre as analista
FROM historia_clinica hc
JOIN paciente p ON hc.paciente_id = p.id
JOIN sexo s ON p.sexo_id = s.id
JOIN zona_clinica zc ON hc.zona_clinica_id = zc.id
JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id
JOIN enfermedad e2 ON hc.enfermedad_id_2 = e2.id
JOIN enfermedad e3 ON hc.enfermedad_id_3 = e3.id
JOIN usuario u ON hc.id_usuario = u.id
WHERE hc.id = 1;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT hc.id, p.nombre as paciente, e1.enfermedad as enf_1, hc.probabilidad_1, e2.enfermedad as enf_2, hc.probabilidad_2, e3.enfermedad as enf_3, hc.probabilidad_3 FROM historia_clinica hc JOIN paciente p ON hc.paciente_id = p.id JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id JOIN enfermedad e2 ON hc.enfermedad_id_2 = e2.id JOIN enfermedad e3 ON hc.enfermedad_id_3 = e3.id WHERE hc.id = 1;"
```

---

### 9. Verificar que las probabilidades suman ~100%

```sql
SELECT 
    id,
    probabilidad_1 + probabilidad_2 + probabilidad_3 as suma_probabilidades
FROM historia_clinica
ORDER BY id;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT id, probabilidad_1 + probabilidad_2 + probabilidad_3 as suma_probabilidades FROM historia_clinica ORDER BY id;"
```

**Resultado esperado:** Todas las sumas deben estar cerca de 100.00

---

### 10. Ver últimos 5 análisis realizados

```sql
SELECT 
    hc.fecha,
    p.nombre as paciente,
    e1.enfermedad as diagnostico,
    hc.probabilidad_1 as confianza,
    u.nombre as usuario
FROM historia_clinica hc
JOIN paciente p ON hc.paciente_id = p.id
JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id
JOIN usuario u ON hc.id_usuario = u.id
ORDER BY hc.fecha DESC
LIMIT 5;
```

**Ejecutar en Docker:**
```powershell
docker exec postgres psql -U admin -d appdb -c "SELECT hc.fecha, p.nombre as paciente, e1.enfermedad as diagnostico, hc.probabilidad_1 as confianza, u.nombre as usuario FROM historia_clinica hc JOIN paciente p ON hc.paciente_id = p.id JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id JOIN usuario u ON hc.id_usuario = u.id ORDER BY hc.fecha DESC LIMIT 5;"
```

---

## Resumen de Cambios

### Estructura Anterior:
```sql
historia_clinica (
  enfermedad_id INT  -- Solo 1 enfermedad
)
```

### Estructura Nueva:
```sql
historia_clinica (
  enfermedad_id_1 INT,
  probabilidad_1 DECIMAL(5,2),
  enfermedad_id_2 INT,
  probabilidad_2 DECIMAL(5,2),
  enfermedad_id_3 INT,
  probabilidad_3 DECIMAL(5,2)
)
```

### Datos Poblados:
- ✅ 4 usuarios (existentes)
- ✅ 2 sexos (existentes)
- ✅ 8 zonas clínicas (existentes)
- ✅ 4 enfermedades (existentes)
- ✅ **10 pacientes nuevos**
- ✅ **10 análisis nuevos con TOP 3**

---

## Acceso Rápido a pgAdmin

Si prefieres usar interfaz gráfica:

1. Abre: http://localhost:5050
2. Conecta al servidor:
   - Host: `postgres`
   - Port: `5432`
   - Database: `appdb`
   - User: `admin`
   - Password: `admin123`

3. Navega a: Servers → OncoDerma-Local → Databases → appdb → Schemas → public → Tables


---

## 📝 Notas Importantes

### Inicialización Automática

El archivo `init_schema.sql` está configurado para ejecutarse automáticamente cuando:
- ✅ Se crea el contenedor de PostgreSQL por primera vez
- ✅ Se eliminan los volúmenes y se recrea el contenedor

El script **NO** se ejecuta cuando:
- ❌ Se reinicia el contenedor sin eliminar volúmenes
- ❌ Ya existe un volumen con datos

### Verificar que el Script se Ejecutó

```powershell
# Ver logs de PostgreSQL para confirmar ejecución
docker logs postgres 2>&1 | Select-String -Pattern "init_schema"

# Resultado esperado:
# /usr/local/bin/docker-entrypoint.sh: running /docker-entrypoint-initdb.d/init_schema.sql
```

### Verificar que el Archivo está Montado

```powershell
# Listar archivos en el directorio de inicialización
docker exec postgres ls -la /docker-entrypoint-initdb.d/

# Resultado esperado:
# -rwxrwxrwx    1 root     root          5971 Nov 26 19:47 init_schema.sql
```

### Credenciales de Usuarios

Después de la inicialización, estos usuarios están disponibles:

| Usuario | Contraseña | ID |
|---------|------------|-----|
| matias  | 1234       | 1   |
| carlos  | 1234       | 2   |
| bianca  | 1234       | 3   |
| melissa | 1234       | 4   |

### Probar Login desde PowerShell

```powershell
# Probar login con usuario válido
$body = @{username='matias'; password='1234'}
Invoke-WebRequest -Uri "http://localhost/api/login" -Method POST -Body $body

# Resultado esperado:
# {"success":true,"message":"Login exitoso","user":{"id":1,"username":"matias"}}

# Probar login con credenciales inválidas
$body = @{username='matias'; password='wrong'}
try {
    Invoke-WebRequest -Uri "http://localhost/api/login" -Method POST -Body $body
} catch {
    $_.Exception.Response.StatusCode.value__
    $_ | Select-Object -ExpandProperty ErrorDetails | Select-Object -ExpandProperty Message
}

# Resultado esperado:
# 401
# {"success":false,"message":"Usuario o contraseña incorrectos"}
```

---

## 🐛 Troubleshooting

### Problema: Los usuarios no existen después de iniciar los contenedores

**Solución:**
1. Verificar que el archivo `init_schema.sql` existe en la raíz del proyecto
2. Verificar que el volumen está montado correctamente en `docker-compose.yml`:
   ```yaml
   volumes:
     - postgres_data:/var/lib/postgresql/data
     - ./init_schema.sql:/docker-entrypoint-initdb.d/init_schema.sql
   ```
3. Eliminar volúmenes y recrear: `docker-compose down -v && docker-compose up -d`

### Problema: El login no funciona

**Solución:**
1. Verificar que el backend está corriendo: `docker ps`
2. Verificar logs del backend: `docker logs backend`
3. Verificar que los usuarios existen: `docker exec postgres psql -U admin -d appdb -c "SELECT * FROM usuario;"`
4. Probar el endpoint directamente desde PowerShell (ver comandos arriba)

### Problema: "relation usuario does not exist"

**Solución:**
El script de inicialización no se ejecutó. Eliminar volúmenes y recrear:
```powershell
docker-compose down -v
docker-compose up -d
```

### Problema: Datos de prueba no aparecen

**Solución:**
Verificar que el script se ejecutó completamente:
```powershell
# Contar registros en todas las tablas
docker exec postgres psql -U admin -d appdb -c "SELECT 'usuarios' as tabla, COUNT(*) as total FROM usuario UNION ALL SELECT 'pacientes', COUNT(*) FROM paciente UNION ALL SELECT 'historia_clinica', COUNT(*) FROM historia_clinica UNION ALL SELECT 'enfermedades', COUNT(*) FROM enfermedad UNION ALL SELECT 'zonas_clinicas', COUNT(*) FROM zona_clinica UNION ALL SELECT 'sexos', COUNT(*) FROM sexo;"
```

**Resultado esperado:**
```
      tabla       | total 
------------------+-------
 usuarios         |     4
 pacientes        |    10
 historia_clinica |    10
 enfermedades     |     4
 zonas_clinicas   |     8
 sexos            |     2
```
