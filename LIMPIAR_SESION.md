# Limpiar Sesión del Navegador

## Problema
El navegador te redirige automáticamente al home porque tiene guardada la sesión anterior en `localStorage`.

## Solución Rápida

### Opción 1: Desde la Consola del Navegador (Recomendado)

1. **Abre tu navegador** y ve a `http://localhost`
2. **Abre la consola del desarrollador** (presiona F12)
3. **Ve a la pestaña "Console" (Consola)**
4. **Copia y pega este código:**

```javascript
localStorage.clear();
console.log('✅ Sesión limpiada. Recarga la página (F5)');
```

5. **Presiona Enter**
6. **Recarga la página** (F5 o Ctrl+R)
7. **Ahora deberías ver la página de login**

### Opción 2: Desde las Herramientas de Desarrollador

1. **Abre tu navegador** y ve a `http://localhost`
2. **Abre las herramientas de desarrollador** (F12)
3. **Ve a la pestaña "Application" (Aplicación)**
4. **En el menú izquierdo, expande "Local Storage"**
5. **Haz clic en `http://localhost`**
6. **Verás 3 items:**
   - `isAuthenticated`
   - `username`
   - `userId`
7. **Haz clic derecho en cada uno y selecciona "Delete" (Eliminar)**
8. **Recarga la página** (F5)

### Opción 3: Modo Incógnito

1. **Abre una ventana de incógnito/privada:**
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P
   - Edge: Ctrl+Shift+N
2. **Ve a** `http://localhost/login`
3. **Intenta hacer login**

---

## ¿Por Qué Pasa Esto?

Cuando haces login exitoso, el sistema guarda estos datos en `localStorage`:

```javascript
localStorage.setItem('isAuthenticated', 'true')
localStorage.setItem('username', 'matias')
localStorage.setItem('userId', '1')
```

Estos datos **NO se borran** cuando cierras el navegador. Se quedan guardados hasta que:
- Los borres manualmente
- Hagas logout
- Limpies los datos del navegador

---

## Solución Permanente (Ya Implementada)

He modificado el código para que:

1. **Verifique la autenticación** cada vez que cargas una página protegida
2. **Te redirija al login** si no estás autenticado
3. **Limpie todos los datos** cuando haces logout

Pero para que esto funcione, necesitas:

1. **Limpiar el localStorage actual** (usando una de las opciones de arriba)
2. **Reconstruir el frontend** con los cambios nuevos

---

## Reconstruir el Frontend con los Cambios

```powershell
# 1. Detener el frontend
docker-compose stop frontend

# 2. Reconstruir con los cambios
docker-compose build frontend

# 3. Iniciar el frontend
docker-compose up -d frontend

# 4. Limpiar el localStorage del navegador (ver opciones arriba)

# 5. Ir a http://localhost/login
```

---

## Verificar que Funciona

1. **Limpia el localStorage** (usando una de las opciones de arriba)
2. **Ve a** `http://localhost`
3. **Deberías ser redirigido a** `http://localhost/login`
4. **Ingresa credenciales:**
   - Usuario: `matias`
   - Contraseña: `1234`
5. **Deberías ser redirigido a** `http://localhost/` (home)
6. **Cierra el navegador completamente**
7. **Abre el navegador nuevamente**
8. **Ve a** `http://localhost`
9. **Deberías seguir viendo el home** (porque la sesión persiste)
10. **Haz clic en "Cerrar Sesión"**
11. **Deberías ser redirigido a** `http://localhost/login`

---

## Notas Importantes

- **localStorage persiste entre sesiones del navegador** - Esto es normal y esperado
- **Para cerrar sesión, usa el botón "Cerrar Sesión"** en la interfaz
- **Si quieres forzar el logout, limpia el localStorage** manualmente

---

## Credenciales de Prueba

| Usuario | Contraseña |
|---------|------------|
| matias  | 1234       |
| carlos  | 1234       |
| bianca  | 1234       |
| melissa | 1234       |
