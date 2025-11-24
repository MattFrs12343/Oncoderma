# 🌐 Configuración de Cloudflare Tunnel para OncoDerma

## Problema Resuelto

El error "This host is not allowed" ocurre porque Vite bloquea por seguridad el acceso desde dominios externos. Ya se ha configurado `vite.config.js` para permitir el acceso desde Cloudflare.

## ⚠️ Problema Detectado

Tu Cloudflare Tunnel está apuntando al puerto **3001**, pero Vite está corriendo en el puerto **3000**.

```
Cloudflare: http://localhost:3001/  ❌ INCORRECTO
Vite:       http://localhost:3000   ✅ CORRECTO
```

## 🔧 Solución

### Opción 1: Cambiar Cloudflare al Puerto 3000 (Recomendado)

1. **Detén el túnel actual** (Ctrl+C en la ventana de PowerShell)

2. **Inicia el túnel en el puerto correcto:**
   ```powershell
   cd C:\cloud
   .\cloudflared.exe tunnel --url http://localhost:3000
   ```

3. **Copia la nueva URL** que aparecerá (será diferente cada vez)

4. **Reinicia el servidor de Vite:**
   ```bash
   # En la carpeta oncoderma-frontend
   npm run dev
   ```

5. **Accede desde internet** usando la URL de Cloudflare

### Opción 2: Cambiar Vite al Puerto 3001

Si prefieres mantener Cloudflare en el puerto 3001:

1. **Edita `vite.config.js`:**
   ```javascript
   server: {
     port: 3001,  // Cambiar de 3000 a 3001
     // ... resto de la configuración
   }
   ```

2. **Reinicia Vite:**
   ```bash
   npm run dev
   ```

## 📝 Configuración Actual de Vite

El archivo `vite.config.js` ya está configurado para permitir:

```javascript
server: {
  host: '0.0.0.0',
  port: 3000,
  allowedHosts: [
    '.trycloudflare.com',  // Todos los subdominios de Cloudflare
    'ringtones-incomplete-delays-reseller.trycloudflare.com',
    'localhost',
    '192.168.0.16'
  ]
}
```

## 🚀 Pasos Completos para Acceso desde Internet

### 1. Inicia el Servidor de Vite

```bash
cd oncoderma-frontend
npm run dev
```

Deberías ver:
```
VITE v6.0.3  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.0.16:3000/
```

### 2. Inicia Cloudflare Tunnel

En otra ventana de PowerShell:

```powershell
cd C:\cloud
.\cloudflared.exe tunnel --url http://localhost:3000
```

Verás algo como:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://algo-random-palabras.trycloudflare.com                                            |
+--------------------------------------------------------------------------------------------+
```

### 3. Actualiza allowedHosts (Si la URL Cambió)

Si Cloudflare te dio una URL diferente, actualiza `vite.config.js`:

```javascript
allowedHosts: [
  '.trycloudflare.com',  // Esto permite CUALQUIER subdominio
  'tu-nueva-url.trycloudflare.com',  // Tu URL específica
  'localhost',
  '192.168.0.16'
]
```

### 4. Reinicia Vite

```bash
# Ctrl+C para detener
npm run dev
```

### 5. Accede desde Internet

Abre la URL de Cloudflare en cualquier navegador:
```
https://tu-url.trycloudflare.com
```

## ⚠️ Notas Importantes

### Túneles Temporales

Los túneles de Cloudflare sin cuenta son **temporales**:
- ✅ Perfectos para pruebas rápidas
- ✅ No requieren configuración
- ❌ La URL cambia cada vez que reinicias
- ❌ Sin garantía de uptime
- ❌ Pueden cerrarse en cualquier momento

### Para Producción

Si necesitas un túnel permanente:

1. **Crea una cuenta en Cloudflare**
2. **Instala cloudflared con autenticación:**
   ```powershell
   cloudflared tunnel login
   ```
3. **Crea un túnel nombrado:**
   ```powershell
   cloudflared tunnel create oncoderma
   ```
4. **Configura el túnel:**
   ```yaml
   # config.yml
   tunnel: oncoderma
   credentials-file: C:\Users\Usuario\.cloudflared\<tunnel-id>.json
   
   ingress:
     - hostname: oncoderma.tudominio.com
       service: http://localhost:3000
     - service: http_status:404
   ```

## 🔍 Troubleshooting

### Error: "This host is not allowed"

**Causa:** Vite no reconoce el host de Cloudflare

**Solución:**
1. Verifica que `.trycloudflare.com` esté en `allowedHosts`
2. Reinicia el servidor de Vite
3. Limpia caché del navegador

### Error: "Cannot connect"

**Causa:** Puerto incorrecto

**Solución:**
1. Verifica que Vite esté en el puerto 3000
2. Verifica que Cloudflare apunte a `localhost:3000`
3. Verifica que no haya firewall bloqueando

### Error: "502 Bad Gateway"

**Causa:** Vite no está corriendo

**Solución:**
1. Inicia Vite: `npm run dev`
2. Espera a que diga "ready"
3. Luego inicia Cloudflare

### La URL de Cloudflare no carga

**Causa:** Puede tardar unos segundos en propagarse

**Solución:**
1. Espera 10-30 segundos
2. Refresca la página
3. Verifica que ambos servicios estén corriendo

## 📊 Verificación

### Checklist

- [ ] Vite corriendo en puerto 3000
- [ ] Cloudflare apuntando a localhost:3000
- [ ] allowedHosts configurado en vite.config.js
- [ ] Vite reiniciado después de cambios
- [ ] URL de Cloudflare copiada correctamente
- [ ] Ambos servicios corriendo simultáneamente

### Comandos de Verificación

```powershell
# Ver qué está corriendo en el puerto 3000
netstat -ano | findstr :3000

# Ver qué está corriendo en el puerto 3001
netstat -ano | findstr :3001
```

## 🎯 Configuración Recomendada

### Terminal 1: Vite
```bash
cd oncoderma-frontend
npm run dev
```

### Terminal 2: Cloudflare
```powershell
cd C:\cloud
.\cloudflared.exe tunnel --url http://localhost:3000
```

### Terminal 3: Backend (si lo necesitas)
```bash
cd oncoderma-backend
# Tu comando para iniciar el backend
```

## 🌐 Acceso desde Diferentes Dispositivos

Una vez configurado correctamente:

- **Desde tu PC:** `http://localhost:3000`
- **Desde tu red local:** `http://192.168.0.16:3000`
- **Desde internet:** `https://tu-url.trycloudflare.com`

## 🔒 Seguridad

### Consideraciones

- ⚠️ No expongas datos sensibles en túneles temporales
- ⚠️ Los túneles sin cuenta no tienen garantías de privacidad
- ⚠️ Cloudflare puede inspeccionar el tráfico
- ✅ Usa HTTPS (Cloudflare lo proporciona automáticamente)
- ✅ Mantén las credenciales en variables de entorno

### Variables de Entorno

Asegúrate de que tu `.env` no esté expuesto:

```bash
# .gitignore
.env
.env.local
.env.production
```

## 📱 Prueba en Móvil

Una vez que el túnel esté funcionando:

1. Abre la URL de Cloudflare en tu móvil
2. Verifica que las mejoras de responsividad funcionen
3. Prueba el análisis de imágenes
4. Verifica el modo oscuro

## 🎉 Resultado Esperado

Cuando todo esté configurado correctamente:

```
✅ Vite corriendo en localhost:3000
✅ Cloudflare túnel activo
✅ Acceso desde internet funcionando
✅ Sin errores de "host not allowed"
✅ Aplicación cargando correctamente
```

---

**Última actualización:** ${new Date().toLocaleDateString()}
