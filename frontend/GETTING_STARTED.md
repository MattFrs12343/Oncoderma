# 🚀 Guía de Inicio Rápido - OncoDerma Frontend

Esta guía te ayudará a poner en marcha el proyecto OncoDerma en tu máquina local.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js) o **yarn**
- **Git** (opcional, para clonar el repositorio)

### Verificar instalación:

```bash
node --version  # Debe mostrar v18.x.x o superior
npm --version   # Debe mostrar 9.x.x o superior
```

## 🔧 Instalación Paso a Paso

### 1. Navegar al directorio del proyecto

```bash
cd oncoderma-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

Este comando instalará todas las dependencias necesarias:
- React y React DOM
- React Router DOM
- Vite
- Tailwind CSS
- Y otras dependencias de desarrollo

**Tiempo estimado**: 2-3 minutos

### 3. Configurar variables de entorno (Opcional)

Si tu backend está en una URL diferente a `http://localhost:8000`, crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
VITE_API_URL=http://localhost:8000
```

**Nota**: Si no creas este archivo, la aplicación usará `http://localhost:8000` por defecto.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Deberías ver algo como:

```
  VITE v6.0.3  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 5. Abrir en el navegador

Abre tu navegador y ve a:

```
http://localhost:3000
```

¡Listo! Deberías ver la página de login de OncoDerma.

## 🔌 Conectar con el Backend

Para que la aplicación funcione completamente, necesitas tener el backend corriendo.

### Opción 1: Backend ya existente

Si ya tienes el backend de FastAPI corriendo en `http://localhost:8000`, no necesitas hacer nada más.

### Opción 2: Iniciar el backend

Si tienes el backend en la carpeta `skin_cancer_api`:

```bash
# En otra terminal
cd skin_cancer_api
python main.py
```

El backend debería iniciar en `http://localhost:8000`.

### Verificar conexión

1. Ve a `http://localhost:3000/login`
2. Intenta iniciar sesión
3. Si ves un error de conexión, verifica que el backend esté corriendo

## 🎨 Credenciales de Prueba

**Nota**: Las credenciales dependen de tu backend. Consulta con el administrador del sistema o revisa la documentación del backend.

Ejemplo de credenciales (si el backend las tiene configuradas):
- **Usuario**: `admin` o `demo`
- **Contraseña**: `password123`

## 📱 Probar la Aplicación

### 1. Login
- Ve a `/login`
- Ingresa tus credenciales
- Haz clic en "Iniciar Sesión"

### 2. Página de Inicio
- Después del login, serás redirigido a la página de inicio
- Explora las secciones: "Cómo funciona" y "Por qué elegir OncoDerma"

### 3. Analizar Imagen
- Ve a `/analizar`
- Sube una imagen de una lesión cutánea (JPEG o PNG)
- Completa los campos: edad, sexo, zona anatómica
- Haz clic en "Analizar Imagen"
- Espera los resultados (aparecerán en el panel derecho)

### 4. FAQ
- Ve a `/faq`
- Haz clic en las preguntas para ver las respuestas

### 5. Contacto
- Ve a `/contacto`
- Completa el formulario
- Haz clic en "Enviar Mensaje"

### 6. Tema Oscuro/Claro
- Haz clic en el icono de sol/luna en la barra de navegación
- El tema cambiará y se guardará tu preferencia

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar en un puerto específico
npm run dev -- --port 3001
```

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

### Linting y Formato (si se configuran)

```bash
# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

## 🐛 Solución de Problemas

### Problema: "Cannot find module"

**Solución**: Reinstala las dependencias

```bash
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Port 3000 is already in use"

**Solución**: Usa otro puerto

```bash
npm run dev -- --port 3001
```

O mata el proceso que está usando el puerto 3000:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Problema: "Failed to fetch" al hacer login

**Solución**: Verifica que el backend esté corriendo

```bash
# Prueba el backend directamente
curl http://localhost:8000/health
```

Si no responde, inicia el backend.

### Problema: CORS errors

**Solución**: Asegúrate de que el backend tenga CORS configurado correctamente.

El backend debe incluir:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problema: Imágenes no se cargan

**Solución**: Verifica que la carpeta `public/img` tenga las imágenes

```bash
ls public/img
```

Deberías ver:
- OncoDerma-Logo.png
- ai-technology.svg
- medical-analysis.svg
- etc.

### Problema: Web Worker no funciona

**Solución**: Verifica que `public/imageWorker.js` exista

```bash
ls public/imageWorker.js
```

Si no existe, cópialo desde `Archivo/dist/imageWorker.js`.

## 📚 Recursos Adicionales

### Documentación

- [README.md](./README.md) - Documentación principal del proyecto
- [RECONSTRUCTION_NOTES.md](./RECONSTRUCTION_NOTES.md) - Notas sobre la reconstrucción

### Tecnologías

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

### Tutoriales

- [React Tutorial](https://react.dev/learn)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/installation)
- [Vite Guide](https://vitejs.dev/guide/)

## 🎯 Próximos Pasos

Una vez que tengas la aplicación corriendo:

1. **Explora el código**: Revisa la estructura de carpetas y componentes
2. **Personaliza**: Modifica colores, textos, imágenes según tus necesidades
3. **Agrega features**: Implementa nuevas funcionalidades
4. **Optimiza**: Mejora el rendimiento y la experiencia de usuario
5. **Despliega**: Sube tu aplicación a producción (Vercel, Netlify, etc.)

## 💡 Tips de Desarrollo

1. **Hot Reload**: Vite recarga automáticamente cuando guardas cambios
2. **React DevTools**: Instala la extensión de React DevTools en tu navegador
3. **Console**: Usa `console.log()` para debugging
4. **Network Tab**: Revisa las peticiones HTTP en las DevTools del navegador
5. **Tailwind IntelliSense**: Instala la extensión de VS Code para autocompletado

## 🤝 Soporte

Si tienes problemas:

1. Revisa la sección de "Solución de Problemas" arriba
2. Consulta la documentación en README.md
3. Revisa los logs en la consola del navegador
4. Verifica que el backend esté corriendo correctamente

## ⚠️ Recordatorio Importante

Este sistema es una herramienta de apoyo con fines académicos y de investigación. **NO reemplaza una evaluación médica profesional.** Siempre consulte a un dermatólogo certificado.

---

**¡Feliz desarrollo! 🎉**

Si todo funciona correctamente, deberías poder:
- ✅ Iniciar sesión
- ✅ Navegar entre páginas
- ✅ Subir y analizar imágenes
- ✅ Ver resultados
- ✅ Cambiar entre tema claro y oscuro
- ✅ Usar la aplicación en móvil y desktop

**¿Listo para comenzar?** Ejecuta `npm run dev` y empieza a explorar! 🚀
