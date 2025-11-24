# Configuración de CORS para el Backend

## 📋 Resumen

Para que el frontend pueda comunicarse con el backend, necesitas configurar CORS (Cross-Origin Resource Sharing) en tu servidor backend.

## 🐍 Python (Flask/FastAPI)

### Flask

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configuración de CORS
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
            "http://192.168.*.*:3000",  # Red local
            "http://192.168.*.*:3001",
            "https://*.trycloudflare.com"  # Cloudflare
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# O más permisivo para desarrollo:
# CORS(app, origins="*")
```

### FastAPI

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Lista de orígenes permitidos
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://*.trycloudflare.com",
]

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # O ["*"] para permitir todos en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🟢 Node.js (Express)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    /^http:\/\/192\.168\.\d+\.\d+:300[01]$/,  // Red local
    /^https:\/\/.*\.trycloudflare\.com$/  // Cloudflare
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// O más permisivo para desarrollo:
// app.use(cors());
```

## 🔧 Configuración Dinámica (Recomendado)

### Python (FastAPI)

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Obtener orígenes desde variable de entorno
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:5173,https://*.trycloudflare.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Node.js (Express)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Obtener orígenes desde variable de entorno
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://*.trycloudflare.com'
    ];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está en la lista permitida
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const regex = new RegExp(allowed.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

## 🌐 Variables de Entorno para el Backend

Crea un archivo `.env` en tu backend:

```bash
# Desarrollo local
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:3000

# Con Cloudflare
ALLOWED_ORIGINS=http://localhost:3000,https://tu-frontend-tunel.trycloudflare.com

# Producción (más restrictivo)
ALLOWED_ORIGINS=https://tudominio.com
```

## 🧪 Verificar CORS

### Desde el navegador (DevTools Console):

```javascript
fetch('http://localhost:5000/health')
  .then(res => res.json())
  .then(data => console.log('✅ CORS OK:', data))
  .catch(err => console.error('❌ CORS Error:', err));
```

### Desde curl:

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     http://localhost:5000/predict
```

## 🚨 Problemas Comunes

### 1. Error: "No 'Access-Control-Allow-Origin' header"
**Solución**: Asegúrate de que el middleware de CORS esté configurado ANTES de tus rutas.

### 2. Error: "CORS policy: credentials mode is 'include'"
**Solución**: Agrega `allow_credentials=True` en tu configuración de CORS.

### 3. Error en Cloudflare: "Mixed Content"
**Solución**: Asegúrate de que tanto frontend como backend usen HTTPS en Cloudflare.

### 4. Funciona en localhost pero no en red local
**Solución**: Agrega tu IP local a los orígenes permitidos: `http://192.168.1.6:3000`

## 📱 Para Desarrollo Móvil

Si quieres probar desde tu celular en la misma red:

1. Obtén tu IP local: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Agrega tu IP a los orígenes permitidos en el backend:
   ```python
   origins = [
       "http://192.168.1.6:3000",  # Tu IP local
       "http://192.168.1.6:3001",
       # ... otros orígenes
   ]
   ```
3. Inicia el backend con `--host 0.0.0.0` para aceptar conexiones externas

## ✅ Checklist de Configuración

- [ ] CORS configurado en el backend
- [ ] Orígenes permitidos incluyen localhost y Cloudflare
- [ ] Backend acepta métodos POST, GET, OPTIONS
- [ ] Headers permitidos incluyen Content-Type y Authorization
- [ ] Backend corriendo en el puerto correcto (5000 por defecto)
- [ ] Variables de entorno configuradas en el frontend (.env.local)
- [ ] Proxy de Vite configurado correctamente
- [ ] Probado en localhost
- [ ] Probado en Cloudflare (si aplica)
- [ ] Probado en red local/móvil (si aplica)
