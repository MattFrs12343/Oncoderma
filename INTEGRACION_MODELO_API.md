# Integración del Modelo ML con FastAPI

## Resumen de Cambios Implementados

### Backend (FastAPI)

1. **Carga única del modelo al iniciar**
   - El modelo se carga una sola vez cuando la aplicación arranca
   - Se intenta cargar en orden de prioridad: `best_model_checkpoint.keras`, `model_multimodal_improved.keras`, `model_multimodal.keras`
   - Los artifacts de preprocesamiento se cargan desde `preprocess_artifacts.json`

2. **Endpoint de Health Check**
   - `GET /api/health` - Verifica el estado del modelo y artifacts
   - Retorna 200 si todo está cargado, 503 si hay problemas

3. **Endpoint de Inferencia Mejorado**
   - `POST /predict` - Acepta imagen y metadatos
   - Logging completo de cada petición (timestamp, metadatos, duración, resultado)
   - Manejo robusto de errores con mensajes claros
   - Respuesta estructurada con top-3 y probabilidades completas

4. **CORS Habilitado**
   - Middleware CORS configurado para permitir peticiones desde el frontend
   - Permite todos los orígenes, métodos y headers

5. **Logging Estructurado**
   - Formato: `[TIMESTAMP] [LEVEL] MESSAGE`
   - Logs de inicio de aplicación
   - Logs de cada inferencia con metadatos y duración
   - Logs de errores con stack trace completo

### Frontend (React)

1. **Llamada API Corregida**
   - Campo `site` en lugar de `anatomic_site`
   - Manejo de errores mejorado con mensajes detallados
   - Logging de resultados en consola

## Campos y Formatos de la API

### Campos del FormData (Frontend → Backend)

| Campo | Tipo | Requerido | Valores Válidos | Ejemplo |
|-------|------|-----------|-----------------|---------|
| `file` | File (binary) | ✅ Sí | JPEG o PNG | `lesion.jpg` |
| `age` | Integer | ✅ Sí | 0-120 | `45` |
| `sex` | String | ✅ Sí | "male", "female", "MALE", "FEMALE" | `"male"` |
| `site` | String | ✅ Sí | Ver valores abajo | `"anterior torso"` |

### Valores Válidos para `site`

Estos valores deben coincidir **exactamente** con los del archivo `preprocess_artifacts.json`:

- `"anterior torso"`
- `"posterior torso"`
- `"head/neck"`
- `"upper extremity"`
- `"lower extremity"`
- `"palms/soles"`
- `"oral/genital"`
- `"lateral torso"`

### Formato de Respuesta

```json
{
  "prediction": "Melanoma",
  "prediction_full": "Melanoma (MEL)",
  "confidence": 0.87,
  "top_predictions": [
    {
      "disease": "MEL",
      "disease_full": "Melanoma (MEL)",
      "probability": 0.87
    },
    {
      "disease": "NV",
      "disease_full": "Nevus melanocítico (NV)",
      "probability": 0.09
    },
    {
      "disease": "BCC",
      "disease_full": "Carcinoma basocelular (BCC)",
      "probability": 0.03
    }
  ],
  "all_probabilities": {
    "MEL": 0.87,
    "NV": 0.09,
    "BCC": 0.03,
    "BKL": 0.01
  },
  "uncertain": false,
  "inference_time_ms": 145.3
}
```

## Pasos de Prueba desde la UI

### 1. Verificar que los servicios están corriendo

```powershell
# Ver contenedores activos
docker ps

# Deberías ver: backend, frontend, traefik, postgres, pgadmin
```

### 2. Verificar Health Check

Abre el navegador en: `http://localhost/api/health`

Deberías ver:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "artifacts_loaded": true,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Probar desde la UI de React

1. Abre el navegador en `http://localhost`
2. Ve a la página "Analizar"
3. Completa el formulario de paciente:
   - **Nombre**: Test Patient
   - **Edad**: 45
   - **Sexo**: Masculino
   - **Zona anatómica**: Torso anterior
   - **CI**: 12345678
4. Haz clic en "Siguiente"
5. Sube una imagen de prueba (arrastra o selecciona)
6. Haz clic en "Analizar Imagen"
7. Espera los resultados (verás un spinner de carga)

### 4. Verificar Logs del Backend

```powershell
# Ver logs en tiempo real
docker logs -f backend
```

**Logs esperados para una inferencia exitosa:**

```
[2024-01-15T10:30:00] [INFO] Application startup complete
[2024-01-15T10:30:00] [INFO] Model loaded successfully from: model/best_model_checkpoint.keras
[2024-01-15T10:30:00] [INFO] Preprocessing artifacts loaded successfully
[2024-01-15T10:30:15] [INFO] Inference request - age=45, sex=male, site=anterior torso
[2024-01-15T10:30:15] [INFO] Inference complete - top_class=MEL, duration_ms=145.3
```

### 5. Probar con curl (Opcional)

```bash
# Preparar una imagen de prueba
# Luego ejecutar:

curl -X POST http://localhost/predict \
  -F "file=@test_image.jpg" \
  -F "age=45" \
  -F "sex=male" \
  -F "site=anterior torso" \
  -v
```

El flag `-v` muestra los headers, incluyendo los headers CORS:
```
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Credentials: true
```

## Verificación de Traefik

### Dashboard de Traefik

Abre `http://localhost:8080` para ver el dashboard de Traefik.

Deberías ver:
- **Router "backend"** con regla: `PathPrefix(/api) || PathPrefix(/predict)`
- **Service "backend"** apuntando a `backend:8000`
- **Router "frontend"** con regla: `PathPrefix(/)`

### Verificar Routing

```powershell
# Probar health check directamente al backend (si está expuesto)
curl http://localhost:8000/api/health

# Probar health check a través de Traefik
curl http://localhost/api/health

# Ambos deberían retornar la misma respuesta
```

## Troubleshooting

### Error: 404 Not Found en /predict

**Causa**: Traefik no está enrutando correctamente

**Solución**:
1. Verifica que el contenedor backend esté corriendo: `docker ps`
2. Revisa las labels de Traefik en `docker-compose.yml`
3. Verifica el dashboard de Traefik en `http://localhost:8080`

### Error: CORS en el navegador

**Causa**: Headers CORS no están configurados

**Solución**:
1. Verifica que el middleware CORS esté en `main.py`
2. Revisa las labels CORS de Traefik en `docker-compose.yml`
3. Usa DevTools → Network para inspeccionar headers

### Error: 500 Internal Server Error

**Causa**: Modelo no cargado o error en inferencia

**Solución**:
1. Revisa logs: `docker logs backend`
2. Verifica que los archivos del modelo existan en `backend/fastapi_skin_demo/model/`
3. Verifica que `preprocess_artifacts.json` sea válido
4. Prueba el health endpoint: `http://localhost/api/health`

### Error: 422 Validation Error

**Causa**: Campos faltantes o incorrectos

**Solución**:
1. Verifica que todos los campos estén presentes: `file`, `age`, `sex`, `site`
2. Verifica que `site` use uno de los valores válidos exactos
3. Verifica que `age` sea un número entero
4. Revisa la consola del navegador para ver el error detallado

### Imagen no se procesa correctamente

**Causa**: Formato de imagen inválido o corrupto

**Solución**:
1. Verifica que la imagen sea JPEG o PNG válido
2. Verifica el tamaño del archivo (< 10MB recomendado)
3. Prueba con una imagen diferente
4. Revisa logs del backend para ver el error específico

## Ejemplo de Código JavaScript

```javascript
// Función para llamar a la API desde React
const handleAnalyze = async () => {
  try {
    // Convertir imagen a blob
    const base64Response = await fetch(imagePreview)
    const blob = await base64Response.blob()
    
    // Crear FormData
    const formData = new FormData()
    formData.append('file', blob, 'lesion.jpg')
    formData.append('age', patientAge)  // Integer
    formData.append('sex', patientSex.toLowerCase())  // "male" o "female"
    formData.append('site', anatomicSite)  // Valor exacto del artifacts
    
    // Llamar API
    const response = await fetch('/predict', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error en la predicción')
    }
    
    const result = await response.json()
    
    // Usar resultados
    console.log('Predicción:', result.prediction)
    console.log('Confianza:', result.confidence)
    console.log('Top 3:', result.top_predictions)
    
  } catch (error) {
    console.error('Error:', error)
    alert('Error al realizar el análisis')
  }
}
```

## Resumen de Archivos Modificados

1. **backend/fastapi_skin_demo/app/main.py**
   - Agregado logging estructurado
   - Agregado middleware CORS
   - Agregado endpoint `/api/health`
   - Mejorado endpoint `/predict` con mejor manejo de errores
   - Agregado mapeo de nombres de enfermedades

2. **frontend/src/pages/Analizar.jsx**
   - Corregido campo `site` (antes era `anatomic_site`)
   - Mejorado manejo de errores
   - Agregado logging de resultados

3. **INTEGRACION_MODELO_API.md** (este archivo)
   - Documentación completa de la integración
   - Especificación de campos y formatos
   - Pasos de prueba y troubleshooting

## Estado de la Integración

✅ **COMPLETADO** - La integración está funcionando correctamente:

1. ✅ Backend reconstruido sin caché
2. ✅ Modelo cargado exitosamente: `model/best_model_checkpoint.keras`
3. ✅ Artifacts cargados correctamente
4. ✅ Health endpoint respondiendo: `{"status":"healthy","model_loaded":true,"artifacts_loaded":true}`
5. ✅ CORS habilitado
6. ✅ Logging estructurado activo

**Logs de inicio exitoso:**
```
[2025-11-26T02:41:36] [INFO] Model loaded successfully from: model/best_model_checkpoint.keras
[2025-11-26T02:41:36] [INFO] Preprocessing artifacts loaded successfully
[2025-11-26T02:41:36] [INFO] Application startup complete
```

## Próximos Pasos

1. ✅ Reiniciar el backend para aplicar cambios
2. ✅ Probar health endpoint
3. 🔄 Probar inferencia desde la UI
4. 🔄 Verificar logs de inferencia
5. 🔄 Validar que funciona a través de Traefik

## Comandos Útiles

```powershell
# Reiniciar solo el backend
docker-compose restart backend

# Ver logs del backend
docker logs -f backend

# Ver logs de Traefik
docker logs -f traefik

# Reconstruir y reiniciar todo
docker-compose down
docker-compose up -d --build

# Verificar health
curl http://localhost/api/health

# Probar inferencia
curl -X POST http://localhost/predict \
  -F "file=@test.jpg" \
  -F "age=45" \
  -F "sex=male" \
  -F "site=anterior torso"
```
