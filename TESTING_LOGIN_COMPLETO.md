# 🧪 Testing Completo del Sistema de Login

## Fecha: 2025-11-26

---

## 📋 INSTRUCCIONES PARA EL TESTING

### Paso 1: Limpiar Sesión Anterior

**IMPORTANTE:** Antes de empezar, debes limpiar cualquier sesión guardada en tu navegador.

#### Opción A: Usar la Herramienta de Diagnóstico (RECOMENDADO)

1. Abre tu navegador
2. Ve a: `http://localhost/test-login.html`
3. Haz clic en el botón **"🗑️ Limpiar Sesión"**
4. Verás el mensaje: "localStorage limpiado"

#### Opción B: Desde la Consola del Navegador

1. Abre tu navegador y ve a `http://localhost`
2. Presiona **F12**
3. Ve a la pestaña **"Console"**
4. Escribe: `localStorage.clear()`
5. Presiona **Enter**
6. Recarga la página (**F5**)

---

### Paso 2: Probar el Login con la Herramienta de Diagnóstico

1. **Ve a:** `http://localhost/test-login.html`
2. **Verás:**
   - Un formulario con usuario y contraseña pre-llenados
   - Un log en tiempo real de lo que está pasando
3. **Haz clic en:** "🚀 Probar Login"
4. **Observa el log:**
   - Debe mostrar "📡 Enviando petición a /api/login..."
   - Debe mostrar "📊 Status: 200 OK"
   - Debe mostrar "✅ LOGIN EXITOSO"
5. **Si ves errores:**
   - Copia TODO el contenido del log
   - Pégamelo para que pueda diagnosticar

---

### Paso 3: Probar el Login Real en la Aplicación

1. **Ve a:** `http://localhost/login`
2. **Ingresa:**
   - Usuario: `matias`
   - Contraseña: `1234`
3. **Haz clic en:** "Iniciar Sesión"
4. **Resultado esperado:**
   - Deberías ver "Iniciando sesión..." brevemente
   - Deberías ser redirigido a `http://localhost/` (home)
   - Deberías ver "Hola, matias" en la barra de navegación

---

### Paso 4: Verificar Protección de Rutas

1. **Haz clic en "Cerrar Sesión"**
2. **Resultado esperado:**
   - Deberías ser redirigido a `http://localhost/login`
3. **Intenta ir directamente a:** `http://localhost/`
4. **Resultado esperado:**
   - Deberías ser redirigido automáticamente a `http://localhost/login`

---

### Paso 5: Probar Persistencia de Sesión

1. **Haz login** con matias/1234
2. **Cierra completamente el navegador**
3. **Abre el navegador nuevamente**
4. **Ve a:** `http://localhost/`
5. **Resultado esperado:**
   - Deberías ver el home directamente (sesión activa)
   - Deberías ver "Hola, matias" en la barra de navegación
   - **ESTO ES NORMAL** - La sesión persiste hasta que hagas logout

---

### Paso 6: Probar con Diferentes Usuarios

Prueba hacer login con cada uno de estos usuarios:

| Usuario | Contraseña | Resultado Esperado |
|---------|------------|-------------------|
| matias  | 1234       | ✅ Login exitoso   |
| carlos  | 1234       | ✅ Login exitoso   |
| bianca  | 1234       | ✅ Login exitoso   |
| melissa | 1234       | ✅ Login exitoso   |
| matias  | wrong      | ❌ Error: Usuario o contraseña incorrectos |
| noexiste| 1234       | ❌ Error: Usuario o contraseña incorrectos |

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Problema 1: "Usuario o contraseña incorrectos" (pero las credenciales son correctas)

**Posibles causas:**

1. **El proxy de nginx no está funcionando**
   - Verifica: `docker exec frontend cat /etc/nginx/conf.d/default.conf`
   - Debe contener: `location /api/` con `proxy_pass http://backend:8000;`

2. **El backend no está corriendo**
   - Verifica: `docker ps | findstr backend`
   - Debe mostrar: `backend` con status `Up`

3. **La base de datos no tiene usuarios**
   - Verifica: `docker exec postgres psql -U admin -d appdb -c "SELECT * FROM usuario;"`
   - Debe mostrar: 4 usuarios (matias, carlos, bianca, melissa)

**Solución:**
```powershell
# Reconstruir todo desde cero
docker-compose down -v
docker-compose up -d

# Esperar 10 segundos
Start-Sleep -Seconds 10

# Verificar que todo está corriendo
docker-compose ps
```

---

### Problema 2: Te redirige automáticamente al home sin pedir login

**Causa:** Tienes una sesión activa guardada en localStorage

**Solución:**
1. Ve a `http://localhost/test-login.html`
2. Haz clic en "🗑️ Limpiar Sesión"
3. O usa la consola: `localStorage.clear()`

---

### Problema 3: Después de hacer logout, no puedes volver a hacer login

**Posibles causas:**

1. **El localStorage no se limpió correctamente**
   - Abre la consola (F12)
   - Escribe: `console.log(localStorage)`
   - Si ves `isAuthenticated`, `username`, o `userId`, el logout no funcionó

2. **El navegador tiene caché**
   - Presiona Ctrl+Shift+R para recargar sin caché
   - O usa modo incógnito

**Solución:**
```javascript
// En la consola del navegador:
localStorage.clear();
location.reload();
```

---

### Problema 4: La página se queda en blanco o cargando infinitamente

**Causa:** El frontend no se construyó correctamente

**Solución:**
```powershell
# Reconstruir el frontend
docker-compose stop frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

---

## 📊 LOGS PARA DIAGNÓSTICO

### Ver logs del backend en tiempo real:
```powershell
docker logs backend --follow
```

### Ver logs del frontend:
```powershell
docker logs frontend --tail 50
```

### Ver logs de Traefik:
```powershell
docker logs traefik --tail 50
```

### Probar el endpoint directamente:
```powershell
$body = @{username='matias'; password='1234'}
Invoke-WebRequest -Uri "http://localhost/api/login" -Method POST -Body $body
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Marca cada item después de probarlo:

- [ ] Limpiaste el localStorage antes de empezar
- [ ] Probaste el login en `http://localhost/test-login.html`
- [ ] El login de diagnóstico funcionó correctamente
- [ ] Probaste el login en `http://localhost/login`
- [ ] El login real funcionó correctamente
- [ ] Te redirigió al home después del login
- [ ] Ves tu nombre de usuario en la barra de navegación
- [ ] Hiciste clic en "Cerrar Sesión"
- [ ] Te redirigió al login después del logout
- [ ] Intentaste ir a `http://localhost/` sin estar autenticado
- [ ] Te redirigió automáticamente al login
- [ ] Hiciste login nuevamente
- [ ] Cerraste y abriste el navegador
- [ ] La sesión persistió correctamente
- [ ] Probaste con al menos 2 usuarios diferentes
- [ ] Probaste con credenciales incorrectas
- [ ] Viste el mensaje de error correcto

---

## 🎯 RESULTADO ESPERADO FINAL

Después de completar todos los pasos, deberías poder:

1. ✅ Hacer login con cualquiera de los 4 usuarios
2. ✅ Ver tu nombre en la barra de navegación
3. ✅ Navegar por todas las páginas (Home, Analizar, FAQ, Contacto)
4. ✅ Hacer logout y ser redirigido al login
5. ✅ Intentar acceder a páginas protegidas sin login y ser redirigido
6. ✅ La sesión persiste entre reinicios del navegador
7. ✅ Ver mensajes de error claros cuando las credenciales son incorrectas

---

## 📞 SI ALGO NO FUNCIONA

Si después de seguir todos estos pasos algo no funciona:

1. **Usa la herramienta de diagnóstico:** `http://localhost/test-login.html`
2. **Copia TODO el log** que aparece en la herramienta
3. **Abre la consola del navegador** (F12) y copia cualquier error
4. **Ejecuta estos comandos** y copia la salida:
   ```powershell
   docker-compose ps
   docker logs backend --tail 20
   docker logs frontend --tail 20
   docker exec postgres psql -U admin -d appdb -c "SELECT * FROM usuario;"
   ```
5. **Pégame toda esta información** para que pueda ayudarte

---

**Autor:** Kiro AI Assistant  
**Fecha:** 2025-11-26  
**Versión:** 2.0 - Testing Completo
