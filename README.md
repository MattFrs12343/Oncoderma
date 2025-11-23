# Docker App MVP - React + FastAPI + Traefik

Aplicación completa con arquitectura de microservicios usando Docker Compose.

## 🏗️ Arquitectura

```
Cliente → Traefik (Puerto 80) → Frontend (React + Vite + Tailwind)
                               → Backend (FastAPI)
```

- **Frontend**: React con Vite y Tailwind CSS
- **Backend**: FastAPI con Python
- **Proxy Inverso**: Traefik v2.10

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker
- Docker Compose

### Ejecutar la aplicación

```bash
docker compose up --build
```

### Acceder a la aplicación

**A través de Traefik (Proxy Inverso - Producción):**
- **Frontend**: http://localhost/
- **Backend API**: http://localhost/api/palabra
- **Traefik Dashboard**: http://localhost:8080

**Acceso Directo (Desarrollo Local):**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/palabra
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050

## 📁 Estructura del Proyecto

```
.
├── docker-compose.yml
├── .env
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── .dockerignore
└── README.md
```

## 🔧 Funcionalidad

1. El frontend muestra un botón "Obtener Palabra"
2. Al hacer clic, envía una solicitud HTTP al backend a través de Traefik
3. El backend responde con `{"palabra": "hola"}`
4. El frontend muestra la respuesta en pantalla

## 🛠️ Modificar la Palabra

Para cambiar la palabra que devuelve el backend:

1. Edita `backend/main.py`
2. Cambia `"hola"` por la palabra deseada en la línea:
   ```python
   return {"palabra": "hola"}
   ```
3. Reinicia los contenedores:
   ```bash
   docker compose restart backend
   ```

## 🌐 Reglas de Comunicación

**Arquitectura de Puertos:**
- ✅ **Traefik (Puerto 80)**: Proxy inverso - entrada principal para producción
- ✅ **Frontend (Puerto 5173)**: Accesible localmente para desarrollo
- ✅ **Backend (Puerto 8000)**: Accesible localmente para desarrollo
- ✅ **PostgreSQL (Puerto 5432)**: Base de datos
- ✅ **pgAdmin (Puerto 5050)**: Administrador de base de datos
- ✅ **Traefik Dashboard (Puerto 8080)**: Monitoreo y configuración

**Flujo de Comunicación:**
```
Producción:
Cliente → Traefik (puerto 80) → Frontend (interno)
Cliente → Traefik (puerto 80) → Backend (interno)

Desarrollo Local:
Cliente → Frontend directo (puerto 5173)
Cliente → Backend directo (puerto 8000)
```

- ✅ Toda comunicación en producción pasa por Traefik
- ✅ Red interna Docker: `app-network`
- ✅ Frontend y Backend accesibles directamente en localhost para desarrollo

## 🗄️ Base de Datos PostgreSQL

### Credenciales
- **Host**: `localhost:5432` (externo) o `postgres:5432` (interno)
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Base de datos**: `appdb`

### Acceder a pgAdmin
1. Abre http://localhost:5050
2. Login: `admin@admin.com` / `admin123`
3. Registra el servidor PostgreSQL:
   - Host: `postgres`
   - Port: `5432`
   - Username: `admin`
   - Password: `admin123`
   - Database: `appdb`

### Conectar desde terminal
```bash
docker exec -it postgres psql -U admin -d appdb
```

## ⚙️ Configuración de Vite para Desarrollo Local

### Puertos Configurados
- **5173**: Servidor de desarrollo de Vite (hot-reload)
- **4173**: Preview de producción local
- **8000**: Backend FastAPI

### Proxy Configurado
El frontend en `localhost:5173` tiene un proxy configurado que redirige:
- `http://localhost:5173/api/*` → `http://localhost:8000/api/*`

Esto evita problemas de CORS en desarrollo.

### Desarrollo Local (sin Docker)

**1. Instalar dependencias:**
```bash
cd frontend
npm install
```

**2. Iniciar servidor de desarrollo:**
```bash
npm run dev
```

**3. Acceder:**
- Frontend: http://localhost:5173
- El proxy redirigirá `/api/*` al backend en puerto 8000

### Desarrollo con Docker

**Opción 1: Build de producción (actual)**
```bash
docker compose up -d
```
- Frontend servido por Nginx en puerto 5173
- Acceso a través de Traefik en puerto 80

**Opción 2: Modo desarrollo con hot-reload**
```bash
docker compose -f docker-compose.dev.yml up -d
```
- Frontend con Vite dev server
- Hot-reload habilitado
- Cambios en código se reflejan automáticamente

### Configuración de vite.config.js

El archivo está configurado con:
- **Host**: `0.0.0.0` (accesible desde Docker)
- **Port**: `5173`
- **Proxy**: `/api` → `http://localhost:8000`
- **Hot-reload**: Habilitado con polling para Docker
- **CORS**: Habilitado

## 🔍 Verificar Estado

```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f traefik
docker compose logs -f postgres
docker compose logs -f pgadmin

# Ver contenedores en ejecución
docker compose ps

# Ver la red interna
docker network inspect skin_cancer_ocoderma_app-network
```

## 🛑 Detener la Aplicación

```bash
docker compose down
```

## 🧹 Limpiar Todo (incluye volúmenes)

```bash
docker compose down -v
```

## 📝 Notas Técnicas

- El frontend usa un build multi-stage con Nginx para servir archivos estáticos
- El backend incluye CORS configurado para aceptar requests del frontend
- Traefik usa labels de Docker para configuración automática de rutas
- Health checks aseguran que los servicios estén listos antes de recibir tráfico
