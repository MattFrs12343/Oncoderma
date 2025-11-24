# 🌐 Acceso desde la Red Local

Este documento explica cómo acceder a OncoDerma desde otros dispositivos en tu red local.

## 📋 Configuración Actual

El proyecto está configurado para exponerse en la red local:

- **Frontend (Vite)**: `host: '0.0.0.0'` - Accesible desde cualquier dispositivo
- **Backend (FastAPI)**: `host: '0.0.0.0'` - Accesible desde cualquier dispositivo
- **CORS**: Configurado para aceptar peticiones desde cualquier origen

## 🚀 Cómo Acceder desde Otros Dispositivos

### 1. Obtener tu IP Local

**En Windows:**
```bash
ipconfig
```
Busca la línea que dice "Dirección IPv4" (ejemplo: `192.168.1.100`)

**En Linux/Mac:**
```bash
ifconfig
# o
ip addr show
```

### 2. Iniciar los Servicios

**Backend:**
```bash
cd skin_cancer_api
python main.py
```
El backend estará disponible en: `http://0.0.0.0:8000`

**Frontend:**
```bash
cd oncoderma-frontend
npm run dev
```
Vite mostrará algo como:
```
➜  Local:   http://localhost:3000/
➜  Network: http://192.168.1.100:3000/
```

### 3. Acceder desde Otro Dispositivo

Desde cualquier dispositivo en la misma red WiFi:

**Opción 1: Usar la IP mostrada por Vite**
```
http://192.168.1.100:3000
```

**Opción 2: Usar tu IP local + puerto**
```
http://TU_IP_LOCAL:3000
```

Ejemplo: `http://192.168.1.100:3000`

## 📱 Acceso desde Móvil

1. Asegúrate de que tu móvil esté conectado a la **misma red WiFi**
2. Abre el navegador en tu móvil
3. Ingresa la URL: `http://TU_IP_LOCAL:3000`
4. ¡Listo! Deberías ver la aplicación

## 🔐 Credenciales

- **Usuario**: `Matias`
- **Contraseña**: `1234`

## 🛠️ Solución de Problemas

### No puedo acceder desde otro dispositivo

1. **Verifica el Firewall:**
   - Windows: Permite los puertos 3000 y 8000 en el Firewall
   - Ejecuta como administrador:
   ```bash
   netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=3000
   netsh advfirewall firewall add rule name="FastAPI Backend" dir=in action=allow protocol=TCP localport=8000
   ```

2. **Verifica que ambos servicios estén corriendo:**
   - Backend: `http://localhost:8000/health` debe responder
   - Frontend: `http://localhost:3000` debe cargar

3. **Verifica la red:**
   - Ambos dispositivos deben estar en la misma red WiFi
   - No uses VPN en ninguno de los dispositivos

4. **Verifica la IP:**
   - Usa `ipconfig` para confirmar tu IP actual
   - La IP puede cambiar si reinicias el router

### Error de CORS

Si ves errores de CORS en la consola:
- El backend ya está configurado con `allow_origins=["*"]`
- Reinicia el backend si hiciste cambios

### El frontend carga pero no se conecta al backend

Verifica que el frontend esté apuntando a la IP correcta:
- Por defecto usa `http://localhost:8000`
- Si accedes desde otro dispositivo, el backend debe estar en la misma máquina que corre el servidor

## 🔄 Configuración Avanzada

### Cambiar el Puerto del Frontend

Edita `vite.config.js`:
```javascript
server: {
  host: '0.0.0.0',
  port: 3001, // Cambia aquí
  open: true
}
```

### Cambiar el Puerto del Backend

Edita `skin_cancer_api/main.py`:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

## 📊 Verificación Rápida

Ejecuta estos comandos para verificar que todo está funcionando:

```bash
# Verificar backend
curl http://localhost:8000/health

# Verificar frontend (desde otro dispositivo)
curl http://TU_IP_LOCAL:3000
```

## 🎯 Ejemplo Completo

Si tu IP es `192.168.1.100`:

1. **Desde la máquina host:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

2. **Desde otro dispositivo en la red:**
   - Frontend: `http://192.168.1.100:3000`
   - Backend: `http://192.168.1.100:8000` (si necesitas acceder directamente)

## ⚠️ Notas de Seguridad

- Esta configuración es para **desarrollo local** únicamente
- NO expongas estos servicios a Internet sin configurar seguridad adecuada
- En producción, configura CORS con dominios específicos
- Usa HTTPS en producción

---

**¿Necesitas ayuda?** Verifica que:
- ✅ Ambos servicios estén corriendo
- ✅ Estés en la misma red WiFi
- ✅ El firewall permita las conexiones
- ✅ Uses la IP correcta
