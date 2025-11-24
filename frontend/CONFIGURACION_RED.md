# 🌐 Configuración para Acceso en Red Local

## ⚠️ IMPORTANTE: Configuración del Backend

Para que otros dispositivos puedan usar la aplicación, necesitas configurar la URL del backend.

## 📝 Pasos de Configuración

### 1. Obtener tu IP Local

Abre PowerShell o CMD y ejecuta:
```bash
ipconfig
```

Busca tu **Dirección IPv4** (ejemplo: `192.168.0.16`)

### 2. Configurar el Frontend

Edita el archivo `.env` en la carpeta `oncoderma-frontend`:

```env
VITE_API_BASE_URL=http://TU_IP_LOCAL:8000
```

**Ejemplo:**
```env
VITE_API_BASE_URL=http://192.168.0.16:8000
```

### 3. Reiniciar el Frontend

Después de cambiar el `.env`, reinicia el servidor:

```bash
# Detén el servidor (Ctrl+C)
# Luego vuelve a iniciarlo:
npm run dev
```

## 🚀 URLs de Acceso

Después de configurar:

**Desde cualquier dispositivo en la red:**
- Frontend: `http://192.168.0.16:3001`
- Backend: `http://192.168.0.16:8000`

## 🔍 Verificación

### Verificar que el backend esté accesible:

Desde otro dispositivo, abre el navegador y ve a:
```
http://TU_IP_LOCAL:8000/health
```

Deberías ver:
```json
{"status":"ok"}
```

### Verificar que el frontend esté accesible:

```
http://TU_IP_LOCAL:3001
```

Deberías ver la página de login de OncoDerma.

## 🛡️ Configurar Firewall (Windows)

Si otros dispositivos no pueden conectarse, abre PowerShell como **Administrador** y ejecuta:

```powershell
# Permitir puerto del frontend
netsh advfirewall firewall add rule name="OncoDerma Frontend" dir=in action=allow protocol=TCP localport=3001

# Permitir puerto del backend
netsh advfirewall firewall add rule name="OncoDerma Backend" dir=in action=allow protocol=TCP localport=8000
```

## 📱 Acceso desde Móvil

1. Conecta tu móvil a la **misma red WiFi**
2. Abre el navegador
3. Ingresa: `http://192.168.0.16:3001` (usa tu IP)
4. Inicia sesión con:
   - Usuario: `Matias`
   - Contraseña: `1234`

## 🔧 Solución de Problemas

### Problema: "Error de conexión con el servidor"

**Causa:** El frontend no puede conectarse al backend.

**Solución:**
1. Verifica que el archivo `.env` tenga la IP correcta
2. Reinicia el frontend después de cambiar `.env`
3. Verifica que el backend esté corriendo: `http://TU_IP:8000/health`

### Problema: "Cannot connect to localhost:8000"

**Causa:** El `.env` no está configurado o tiene `localhost` en lugar de la IP.

**Solución:**
1. Edita `.env` y cambia `localhost` por tu IP local
2. Reinicia el frontend

### Problema: La página carga pero no puede subir imágenes

**Causa:** El backend no está accesible desde la red.

**Solución:**
1. Verifica el firewall (ver comandos arriba)
2. Verifica que el backend esté corriendo con `host="0.0.0.0"`
3. Prueba acceder a `http://TU_IP:8000/health` desde el otro dispositivo

## 📋 Checklist Rápido

Antes de que otra persona acceda:

- [ ] Obtuve mi IP local con `ipconfig`
- [ ] Edité el archivo `.env` con mi IP
- [ ] Reinicié el frontend (`npm run dev`)
- [ ] El backend está corriendo (`python main.py`)
- [ ] Configuré el firewall (si es necesario)
- [ ] Probé acceder a `/health` desde otro dispositivo
- [ ] Compartí la URL: `http://MI_IP:3001`

## 🎯 Ejemplo Completo

Si tu IP es `192.168.0.16`:

**Archivo `.env`:**
```env
VITE_API_BASE_URL=http://192.168.0.16:8000
```

**URLs para compartir:**
- Frontend: `http://192.168.0.16:3001`

**Verificación:**
- Health check: `http://192.168.0.16:8000/health`

## ⚙️ Configuración Actual

Tu configuración actual:
- IP Local: `192.168.0.16`
- Frontend: `http://192.168.0.16:3001`
- Backend: `http://192.168.0.16:8000`

## 💡 Tip

Si tu IP cambia (después de reiniciar el router), necesitarás:
1. Obtener la nueva IP con `ipconfig`
2. Actualizar el archivo `.env`
3. Reiniciar el frontend

---

**¿Necesitas ayuda?** Verifica que:
- ✅ El archivo `.env` tenga tu IP (no `localhost`)
- ✅ Hayas reiniciado el frontend después de cambiar `.env`
- ✅ El backend esté corriendo
- ✅ El firewall permita las conexiones
- ✅ Ambos dispositivos estén en la misma red WiFi
