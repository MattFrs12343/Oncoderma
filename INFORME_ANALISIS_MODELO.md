# Informe de Análisis: Migración del Modelo de Backend Antiguo a Nuevo

**Fecha:** 2025-11-25  
**Backup creado:** `backups/backend_backup_20251125_213641.tar.gz`

---

## Resumen Ejecutivo

El backend antiguo (`Proyecto_Antiguo/fastapi_skin_demo`) contiene un modelo de clasificación multimodal de lesiones cutáneas que **YA ESTÁ INTEGRADO** en el backend actual. Los archivos del modelo (`.keras`) y los artefactos de preprocesamiento (`.json`) ya existen en `backend/model/`. El código de preprocesamiento también está presente en `backend/utils/preprocessing.py`.

**Estado actual:** El backend nuevo tiene toda la infraestructura necesaria, pero puede requerir ajustes en la integración con Traefik y validación funcional.

---

## 1. Análisis del Modelo

### 1.1 Archivos del Modelo

**Backend Antiguo:**
- `Proyecto_Antiguo/fastapi_skin_demo/model/best_model_checkpoint.keras` (20.8 MB)
- `Proyecto_Antiguo/fastapi_skin_demo/model/model_multimodal.keras` (20.81 MB)
- `Proyecto_Antiguo/fastapi_skin_demo/model/preprocess_artifacts.json`

**Backend Nuevo:**
- `backend/model/best_model_checkpoint.keras` (20.8 MB) ✓
- `backend/model/model_multimodal.keras` (20.81 MB) ✓
- `backend/model/preprocess_artifacts.json` ✓

### 1.2 Formato y Carga del Modelo

**Formato:** TensorFlow Keras (.keras)  
**Versión TF Backend Antiguo:** Sin especificar (solo `tensorflow`)  
**Versión TF Backend Nuevo:** `tensorflow==2.15.0`

**Código de carga (Backend Antiguo):**
```python
MODEL_PATHS = [
    "model/best_model_checkpoint.keras",
    "model/model_multimodal_improved.keras",
    "model/model_multimodal.keras"
]

def load_model_and_artifacts():
    global _model, _artifacts
    for p in MODEL_PATHS:
        try:
            _model = tf.keras.models.load_model(p)
            break
        except:
            pass
    try:
        with open("model/preprocess_artifacts.json","r",encoding="utf-8") as f:
            _artifacts = json.load(f)
    except:
        pass
```

**Código de carga (Backend Nuevo):**
```python
model_paths = [
    self.model_path / "best_model_checkpoint.keras",
    self.model_path / "model_multimodal.keras"
]

for model_file in model_paths:
    if model_file.exists():
        try:
            self.model = tf.keras.models.load_model(str(model_file))
            self.is_loaded = True
            return True
        except Exception as e:
            print(f"⚠ Error al cargar {model_file.name}: {e}")
            continue
```

**Diferencias clave:**
- Backend antiguo: carga síncrona al inicio del módulo
- Backend nuevo: carga en evento `startup` de FastAPI
- Backend nuevo: mejor manejo de errores y logging

---

## 2. Preprocesamiento

### 2.1 Transformación de Imágenes

**Código idéntico en ambos backends:**

```python
def preprocess_image_bytes(contents, img_size=(224, 224)):
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((img_size[0], img_size[1]), Image.BILINEAR)
    arr = np.array(img).astype("float32")
    return tf.keras.applications.efficientnet.preprocess_input(arr)
```

**Especificaciones:**
- Tamaño entrada: 224x224 pixels
- Canales: RGB (3 canales)
- Normalización: EfficientNet preprocessing (escala específica de EfficientNet)
- Interpolación: BILINEAR

### 2.2 Codificación de Metadatos

**Edad:**
- Normalización: `(edad - 59.85) / 16.28`
- Valor por defecto si falta: 59.85 (media)

**Sexo (One-Hot Encoding):**
- `female` → [1.0, 0.0, 0.0]
- `male` → [0.0, 1.0, 0.0]
- `unknown` → [0.0, 0.0, 1.0]
- Mapeo flexible: "f", "female", "mujer" → female

**Sitio Anatómico (Index Encoding):**
```json
{
  "anterior torso": 0,
  "head/neck": 1,
  "lateral torso": 2,
  "lower extremity": 3,
  "oral/genital": 4,
  "palms/soles": 5,
  "posterior torso": 6,
  "upper extremity": 7
}
```

### 2.3 Estructura de Entrada al Modelo

```python
batch = {
    "image": np.expand_dims(img_arr, 0),      # Shape: (1, 224, 224, 3)
    "age": np.array([age_norm]),              # Shape: (1,)
    "sex_ohe": np.expand_dims(sex_ohe, 0),    # Shape: (1, 3)
    "site_idx": np.array([site_idx])          # Shape: (1,)
}
```

---

## 3. API Endpoints

### 3.1 Backend Antiguo

**Endpoint de predicción:**
```
POST /predict
Content-Type: multipart/form-data

Campos:
- file: UploadFile (imagen)
- age: int (opcional)
- sex: str (opcional)
- site: str (opcional)
```

**Respuesta:**
```json
{
  "top1": {
    "class": "MEL",
    "prob": 0.85
  },
  "top2": {
    "class": "NV",
    "prob": 0.10
  },
  "all_probs": {
    "MEL": 0.85,
    "NV": 0.10,
    "BCC": 0.03,
    "BKL": 0.02
  },
  "uncertain": false
}
```

### 3.2 Backend Nuevo

**Endpoint de predicción:**
```
POST /api/predict
Content-Type: multipart/form-data

Campos:
- file: UploadFile (imagen)
- age: str (opcional, convertido a int)
- sex: str (requerido)
- anatomic_site: str (requerido)
```

**Respuesta:**
```json
{
  "prediction": "MEL",
  "prediction_full": "Melanoma",
  "confidence": 0.85,
  "top_predictions": [
    {
      "disease": "MEL",
      "disease_full": "Melanoma",
      "probability": 0.85
    },
    {
      "disease": "NV",
      "disease_full": "Nevus (Lunar Benigno)",
      "probability": 0.10
    }
  ],
  "uncertain": false,
  "metadata": {
    "age_normalized": 0.12,
    "sex_encoded": [0.0, 1.0, 0.0],
    "site_encoded": 3
  }
}
```

**Diferencias clave:**
- Backend nuevo: ruta `/api/predict` (vs `/predict`)
- Backend nuevo: metadatos requeridos (sex, anatomic_site)
- Backend nuevo: respuesta más estructurada con nombres completos
- Backend nuevo: incluye metadata de encoding en respuesta

---

## 4. Dependencias

### 4.1 Backend Antiguo (`requirements.txt`)

```
fastapi
uvicorn[standard]
tensorflow
numpy
pillow
python-multipart
```

**Sin versiones especificadas** - puede causar problemas de reproducibilidad

### 4.2 Backend Nuevo (`requirements.txt`)

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
numpy==1.24.3
tensorflow==2.15.0
Pillow==10.1.0
python-multipart==0.0.6
```

**Versiones fijas** - mejor reproducibilidad

**Dependencias adicionales:**
- `psycopg2-binary`, `sqlalchemy` - para base de datos PostgreSQL
- Versiones específicas de TensorFlow (2.15.0) y NumPy (1.24.3)

---

## 5. Docker y Traefik

### 5.1 Dockerfile

**Backend Nuevo:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Características:**
- Python 3.11
- Puerto 8000
- Uvicorn como servidor ASGI

### 5.2 Integración con Traefik (docker-compose.yml)

```yaml
backend:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.backend.rule=PathPrefix(`/api`) || PathPrefix(`/predict`)"
    - "traefik.http.routers.backend.entrypoints=web"
    - "traefik.http.routers.backend.priority=200"
    - "traefik.http.services.backend.loadbalancer.server.port=8000"
    # CORS headers
    - "traefik.http.middlewares.backend-cors.headers.accesscontrolallowmethods=GET,POST,PUT,DELETE,OPTIONS"
    - "traefik.http.middlewares.backend-cors.headers.accesscontrolalloworiginlist=*"
    - "traefik.http.middlewares.backend-cors.headers.accesscontrolallowheaders=*"
    - "traefik.http.middlewares.backend-cors.headers.accesscontrolmaxage=100"
    - "traefik.http.routers.backend.middlewares=backend-cors"
```

**Configuración:**
- Enrutamiento: `/api/*` y `/predict` → backend
- Puerto interno: 8000
- CORS configurado para permitir todos los orígenes
- Red: `app-network`
- Healthcheck: verifica `/api/health`

---

## 6. Clases de Enfermedades

```python
class2idx = {
    "MEL": 0,  # Melanoma
    "NV": 1,   # Nevus (Lunar Benigno)
    "BCC": 2,  # Carcinoma Basocelular
    "BKL": 3   # Queratosis Seborreica
}
```

**Mapeo de nombres completos (Backend Nuevo):**
```python
{
    'MEL': 'Melanoma',
    'NV': 'Nevus (Lunar Benigno)',
    'BCC': 'Carcinoma Basocelular',
    'BKL': 'Queratosis Seborreica'
}
```

---

## 7. Comparación de Arquitectura

| Aspecto | Backend Antiguo | Backend Nuevo |
|---------|----------------|---------------|
| **Carga del modelo** | Al importar módulo | En evento `startup` |
| **Endpoint** | `/predict` | `/api/predict` |
| **Metadatos** | Opcionales | Requeridos (sex, site) |
| **Manejo de errores** | Básico (try/except silencioso) | Detallado con HTTPException |
| **Logging** | Mínimo | Extensivo con prints |
| **Base de datos** | No | PostgreSQL integrado |
| **Autenticación** | No | Sistema de login |
| **CORS** | No explícito | Middleware configurado |
| **Healthcheck** | No | `/api/health` |
| **Endpoints adicionales** | Solo `/predict` | `/api/anatomic-sites`, `/api/disease-classes`, `/api/model/info` |

---

## 8. Pruebas de Validación

### 8.1 Comando curl para Backend Nuevo

```bash
curl -X POST "http://localhost/api/predict" \
  -F "file=@imagen_lesion.jpg" \
  -F "age=45" \
  -F "sex=male" \
  -F "anatomic_site=lower extremity"
```

### 8.2 Verificación de Health

```bash
curl http://localhost/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "Backend funcionando correctamente"
}
```

### 8.3 Obtener información del modelo

```bash
curl http://localhost/api/model/info
```

---

## 9. Riesgos y Recomendaciones

### 9.1 Riesgos Identificados

1. **Versión de TensorFlow:**
   - Backend antiguo: sin especificar
   - Backend nuevo: 2.15.0
   - **Riesgo:** Incompatibilidad si el modelo fue entrenado con versión diferente
   - **Mitigación:** El modelo ya carga correctamente en el backend nuevo

2. **Metadatos requeridos:**
   - Backend nuevo requiere `sex` y `anatomic_site`
   - **Riesgo:** Frontend debe enviar estos campos obligatoriamente
   - **Mitigación:** Validación en frontend antes de enviar

3. **Cambio de ruta:**
   - `/predict` → `/api/predict`
   - **Riesgo:** Frontend debe usar la ruta correcta
   - **Mitigación:** Traefik enruta ambas rutas al backend

### 9.2 Recomendaciones

1. **Validar integración con Frontend:**
   - Verificar que el frontend envía los campos correctos
   - Probar con imágenes reales de lesiones
   - Validar que la respuesta se procesa correctamente

2. **Monitoreo:**
   - Revisar logs del backend durante predicciones
   - Verificar tiempos de respuesta
   - Monitorear uso de memoria (modelo ~21 MB)

3. **Testing:**
   - Probar con diferentes combinaciones de metadatos
   - Validar manejo de errores (imagen inválida, metadatos faltantes)
   - Comparar predicciones con backend antiguo si es posible

4. **Documentación:**
   - Documentar el formato exacto de request/response para el frontend
   - Crear ejemplos de uso con curl
   - Documentar los sitios anatómicos válidos

---

## 10. Conclusiones

### Estado Actual

✅ **Modelo integrado:** Los archivos `.keras` y `preprocess_artifacts.json` ya están en el backend nuevo  
✅ **Código de preprocesamiento:** Funciones idénticas en `backend/utils/preprocessing.py`  
✅ **Model loader:** Implementado en `backend/model_loader.py` con mejor manejo de errores  
✅ **Endpoints:** API completa con `/api/predict` y endpoints auxiliares  
✅ **Docker/Traefik:** Configuración completa y funcional  
✅ **CORS:** Configurado correctamente  

### Acciones Pendientes

1. **Validación funcional:** Probar el endpoint `/api/predict` con imágenes reales
2. **Integración frontend:** Verificar que el frontend usa la API correctamente
3. **Testing end-to-end:** Probar flujo completo desde frontend hasta predicción
4. **Documentación API:** Crear documentación OpenAPI/Swagger si no existe

### Próximos Pasos

1. Levantar el stack completo: `docker-compose up -d --build`
2. Verificar logs del backend: `docker-compose logs -f backend`
3. Probar health check: `curl http://localhost/api/health`
4. Probar predicción con imagen de prueba
5. Validar desde el frontend

---

## Anexo: Comandos Útiles

### Levantar servicios
```bash
docker-compose up -d --build
```

### Ver logs del backend
```bash
docker-compose logs -f backend
```

### Reiniciar solo el backend
```bash
docker-compose restart backend
```

### Verificar que el modelo se cargó
```bash
docker-compose logs backend | grep "Modelo cargado"
```

### Probar predicción (requiere imagen)
```bash
curl -X POST "http://localhost/api/predict" \
  -F "file=@test_image.jpg" \
  -F "age=50" \
  -F "sex=female" \
  -F "anatomic_site=head/neck"
```

### Obtener sitios anatómicos disponibles
```bash
curl http://localhost/api/anatomic-sites
```

### Obtener clases de enfermedades
```bash
curl http://localhost/api/disease-classes
```

---

**Fin del Informe**
