# Design Document

## Overview

Este diseño especifica la arquitectura completa para integrar el modelo de clasificación de lesiones cutáneas con FastAPI. El sistema cargará el modelo TensorFlow/Keras una sola vez al iniciar usando un patrón singleton global, expondrá endpoints REST para inferencia y health check, aplicará preprocesamiento idéntico al entrenamiento usando artifacts JSON, habilitará CORS para permitir llamadas desde el frontend React a través de Traefik, y registrará logs estructurados de cada inferencia.

La integración se basa en el código existente en `backend/fastapi_skin_demo/` pero lo mejora con:
- Manejo robusto de errores y validación
- Logging estructurado con timestamps y métricas
- Health endpoint para monitoreo
- CORS configurado correctamente
- Documentación clara de la API

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Analizar.jsx) │
└────────┬────────┘
         │ HTTP POST /predict
         │ (FormData: file, age, sex, site)
         ▼
┌─────────────────┐
│     Traefik     │ (:80)
│  Reverse Proxy  │
└────────┬────────┘
         │ Routes /predict → backend:8000
         ▼
┌─────────────────────────────────┐
│      FastAPI Application        │
│  ┌───────────────────────────┐  │
│  │  CORS Middleware          │  │
│  └───────────┬───────────────┘  │
│              ▼                   │
│  ┌───────────────────────────┐  │
│  │  Inference Endpoint       │  │
│  │  POST /predict            │  │
│  └───────────┬───────────────┘  │
│              │                   │
│              ▼                   │
│  ┌───────────────────────────┐  │
│  │  Preprocessing Pipeline   │  │
│  │  - Image resize & norm    │  │
│  │  - Metadata encoding      │  │
│  └───────────┬───────────────┘  │
│              │                   │
│              ▼                   │
│  ┌───────────────────────────┐  │
│  │  ML Model (Singleton)     │  │
│  │  - Loaded at startup      │  │
│  │  - TensorFlow/Keras       │  │
│  └───────────┬───────────────┘  │
│              │                   │
│              ▼                   │
│  ┌───────────────────────────┐  │
│  │  Response Formatter       │  │
│  │  - Top-3 predictions      │  │
│  │  - All probabilities      │  │
│  │  - Uncertainty flag       │  │
│  └───────────────────────────┘  │
│                                  │
│  ┌───────────────────────────┐  │
│  │  Health Endpoint          │  │
│  │  GET /api/health          │  │
│  └───────────────────────────┘  │
│                                  │
│  ┌───────────────────────────┐  │
│  │  Logging System           │  │
│  │  - Request logs           │  │
│  │  - Inference metrics      │  │
│  └───────────────────────────┘  │
└──────────────────────────────────┘
```

### Component Interaction Flow

1. **Startup Phase**:
   - FastAPI app initializes
   - Model loader attempts to load .keras files in priority order
   - Preprocessing artifacts JSON is loaded
   - CORS middleware is configured
   - Health endpoint becomes available

2. **Inference Phase**:
   - Frontend sends FormData with image + metadata
   - Request passes through Traefik to FastAPI
   - CORS headers are added
   - Image bytes are extracted and preprocessed
   - Metadata is normalized/encoded using artifacts
   - Model performs inference
   - Results are formatted and returned
   - Logs are written

3. **Monitoring Phase**:
   - Health endpoint is polled
   - Returns model status and readiness

## Components and Interfaces

### 1. Model Loader Module

**Responsibility**: Load ML model and preprocessing artifacts at startup

**Interface**:
```python
def load_model_and_artifacts() -> Tuple[Optional[tf.keras.Model], Optional[Dict]]:
    """
    Loads the ML model and preprocessing artifacts.
    
    Returns:
        Tuple of (model, artifacts) where either can be None if loading fails
    """
```

**Implementation Details**:
- Try loading models in priority order: `best_model_checkpoint.keras`, `model_multimodal_improved.keras`, `model_multimodal.keras`
- Load `preprocess_artifacts.json` with UTF-8 encoding
- Use global variables `_model` and `_artifacts` for singleton pattern
- Log success/failure for each attempt
- Return None for failed loads (graceful degradation)

### 2. Preprocessing Module

**Responsibility**: Transform raw inputs into model-ready tensors

**Interface**:
```python
def preprocess_image_bytes(
    contents: bytes, 
    img_size: Tuple[int, int] = (224, 224)
) -> np.ndarray:
    """
    Preprocesses image bytes for model inference.
    
    Args:
        contents: Raw image bytes
        img_size: Target size (height, width)
    
    Returns:
        Preprocessed image array with EfficientNet normalization
    """

def encode_metadata(
    age_input: Optional[int],
    sex_input: Optional[str],
    site_input: Optional[str],
    artifacts: Dict
) -> Tuple[float, List[float], int]:
    """
    Encodes metadata using preprocessing artifacts.
    
    Args:
        age_input: Patient age in years
        sex_input: Patient sex ("male", "female", or variants)
        site_input: Anatomic site (must match site2idx keys)
        artifacts: Preprocessing artifacts dictionary
    
    Returns:
        Tuple of (age_normalized, sex_one_hot, site_index)
    """
```

**Implementation Details**:
- Image preprocessing:
  - Convert bytes to PIL Image
  - Resize to (224, 224) using BILINEAR interpolation
  - Convert to float32 numpy array
  - Apply `tf.keras.applications.efficientnet.preprocess_input` (scales to [-1, 1])
  
- Age normalization:
  - Formula: `(age - age_mean) / age_std`
  - Use `age_mean` and `age_std` from artifacts
  - Default to `age_mean` if input is invalid
  
- Sex encoding:
  - Map input strings to canonical values: "male", "female", "unknown"
  - Support variants: "m"/"hombre" → "male", "f"/"mujer" → "female"
  - Create one-hot vector using `sex2idx` from artifacts
  - Default to "unknown" if not recognized
  
- Site encoding:
  - Map input to index using `site2idx` from artifacts
  - Default to "other" (index 0) if not found

### 3. Inference Endpoint

**Responsibility**: Accept requests, orchestrate inference, return results

**Interface**:
```python
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    age: int = Form(...),
    sex: str = Form(...),
    site: str = Form(...)
) -> JSONResponse:
    """
    Performs inference on uploaded image with metadata.
    
    Request:
        - file: Image file (JPEG/PNG)
        - age: Patient age (integer)
        - sex: Patient sex (string: "male", "female", etc.)
        - site: Anatomic site (string from site2idx keys)
    
    Response:
        {
            "prediction": "Melanoma",
            "prediction_full": "Melanoma (MEL)",
            "confidence": 0.87,
            "top_predictions": [
                {"disease": "MEL", "disease_full": "Melanoma (MEL)", "probability": 0.87},
                {"disease": "NV", "disease_full": "Nevus melanocítico (NV)", "probability": 0.09},
                {"disease": "BCC", "disease_full": "Carcinoma basocelular (BCC)", "probability": 0.03}
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
    
    Errors:
        - 422: Validation error (missing/invalid fields)
        - 500: Model not loaded or inference error
    """
```

**Implementation Details**:
- Validate model and artifacts are loaded (return 500 if not)
- Read image bytes from UploadFile
- Log request start with timestamp and metadata
- Preprocess image using artifacts img_size
- Encode metadata using artifacts
- Create batch dictionary with keys: "image", "age", "sex_ohe", "site_idx"
- Perform model.predict()
- Calculate inference duration
- Format response with top-3 and all probabilities
- Calculate uncertainty flag: `top1_prob < 0.60 OR (top1_prob - top2_prob) < 0.10`
- Log inference completion with duration and top class
- Return JSON response

### 4. Health Endpoint

**Responsibility**: Report API and model status

**Interface**:
```python
@app.get("/api/health")
async def health() -> JSONResponse:
    """
    Returns health status of the API and ML model.
    
    Response:
        {
            "status": "healthy" | "degraded",
            "model_loaded": true | false,
            "artifacts_loaded": true | false,
            "timestamp": "2024-01-15T10:30:00Z"
        }
    
    Status Codes:
        - 200: Model and artifacts loaded
        - 503: Model or artifacts not loaded
    """
```

**Implementation Details**:
- Check if `_model` is not None
- Check if `_artifacts` is not None
- Return 200 if both loaded, 503 otherwise
- Include ISO timestamp
- Response time should be < 100ms (no heavy computation)

### 5. CORS Configuration

**Responsibility**: Enable cross-origin requests from frontend

**Interface**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Implementation Details**:
- Add CORS middleware to FastAPI app
- Allow all origins (or restrict to frontend URL if known)
- Allow credentials for authenticated requests
- Allow all HTTP methods (GET, POST, OPTIONS)
- Allow all headers (including custom headers)
- Traefik also adds CORS headers via labels in docker-compose.yml

### 6. Logging System

**Responsibility**: Record inference requests and metrics

**Interface**:
```python
import logging
from datetime import datetime

logger = logging.getLogger("skin_classifier")

def log_inference_request(age: int, sex: str, site: str):
    """Logs incoming inference request"""
    
def log_inference_result(top_class: str, duration_ms: float):
    """Logs inference completion"""
    
def log_error(error: Exception):
    """Logs errors with stack trace"""
```

**Implementation Details**:
- Use Python's built-in logging module
- Log level: INFO for requests/results, ERROR for failures
- Log format: `[TIMESTAMP] [LEVEL] [MESSAGE]`
- Inference request log: `Inference request - age={age}, sex={sex}, site={site}`
- Inference result log: `Inference complete - top_class={class}, duration_ms={duration}`
- Error log: Include full stack trace
- Logs go to stdout (captured by Docker)

## Data Models

### Preprocessing Artifacts Structure

```json
{
  "sex2idx": {
    "female": 0,
    "male": 1,
    "unknown": 2
  },
  "site2idx": {
    "anterior torso": 0,
    "head/neck": 1,
    "lateral torso": 2,
    "lower extremity": 3,
    "oral/genital": 4,
    "palms/soles": 5,
    "posterior torso": 6,
    "upper extremity": 7
  },
  "class2idx": {
    "MEL": 0,
    "NV": 1,
    "BCC": 2,
    "BKL": 3
  },
  "idx2class": {
    "0": "MEL",
    "1": "NV",
    "2": "BCC",
    "3": "BKL"
  },
  "img_size": [224, 224],
  "age_mean": 59.8458605664488,
  "age_std": 16.275794073317854
}
```

### Model Input Batch Structure

```python
{
    "image": np.ndarray,      # Shape: (1, 224, 224, 3), dtype: float32, range: [-1, 1]
    "age": np.ndarray,        # Shape: (1,), dtype: float32, normalized
    "sex_ohe": np.ndarray,    # Shape: (1, 3), dtype: float32, one-hot encoded
    "site_idx": np.ndarray    # Shape: (1,), dtype: int32, index value
}
```

### API Request Format (FormData)

```
POST /predict
Content-Type: multipart/form-data

Fields:
- file: <binary image data> (JPEG/PNG)
- age: <integer> (e.g., 45)
- sex: <string> (e.g., "male", "female", "MALE", "FEMALE")
- site: <string> (e.g., "anterior torso", "head/neck", "upper extremity")
```

### API Response Format

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

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable criteria, several properties can be consolidated:
- Properties 2.2, 2.3, 2.4 can be combined into a single field validation property
- Properties 3.3, 3.4, 3.5 are all metadata encoding properties that can be tested together
- Properties 4.1, 4.2, 4.3 are all about response structure and can be verified together
- Properties 7.1, 7.2, 7.3, 7.4 are all logging properties that can be tested together

This reduces redundancy while maintaining comprehensive coverage.

### Correctness Properties

Property 1: Model priority loading
*For any* set of available model files, the system should attempt to load them in the defined priority order and successfully load the first available model
**Validates: Requirements 1.3**

Property 2: Graceful degradation on load failure
*For any* load failure scenario (missing files, corrupted files), the system should continue running without crashing and log the error
**Validates: Requirements 1.4**

Property 3: Model reuse during inference
*For any* sequence of inference requests, the system should use the pre-loaded model without reloading from disk
**Validates: Requirements 1.5**

Property 4: FormData field validation
*For any* POST request to /predict, the system should validate that fields "file", "age", "sex", and "site" are present and have correct types, returning 422 for invalid requests
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

Property 5: Image preprocessing consistency
*For any* input image of any size, the preprocessing should resize it to the exact dimensions from artifacts and apply EfficientNet normalization resulting in values in range [-1, 1]
**Validates: Requirements 3.1, 3.2**

Property 6: Metadata encoding correctness
*For any* valid metadata values (age, sex, site), the encoding should apply the correct transformations: age normalization using artifacts mean/std, sex one-hot encoding using sex2idx, and site index mapping using site2idx
**Validates: Requirements 3.3, 3.4, 3.5**

Property 7: Default value fallback
*For any* invalid or missing metadata values, the system should use default values from preprocessing artifacts without failing
**Validates: Requirements 3.6**

Property 8: Response structure completeness
*For any* successful inference, the response should contain: top prediction with class and probability, top-3 predictions ordered by descending probability, all class probabilities as a dictionary, uncertainty flag, and HTTP status 200
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

Property 9: Uncertainty flag calculation
*For any* inference result, the uncertainty flag should be true if and only if top1_probability < 0.60 OR (top1_probability - top2_probability) < 0.10
**Validates: Requirements 4.4**

Property 10: Health endpoint response structure
*For any* health check request, the response should include model_loaded status, artifacts_loaded status, and timestamp fields
**Validates: Requirements 5.3, 5.4**

Property 11: CORS headers presence
*For any* POST request to /predict, the response should include Access-Control-Allow-Origin header
**Validates: Requirements 6.3**

Property 12: OPTIONS request handling
*For any* OPTIONS preflight request, the system should respond with appropriate CORS headers including allowed methods and headers
**Validates: Requirements 6.2**

Property 13: Inference logging completeness
*For any* inference request, the logs should contain: ISO timestamp, metadata values (age, sex, site), inference duration in milliseconds, and top predicted class
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

Property 14: Error logging with stack trace
*For any* error during inference, the system should log the error message and full stack trace
**Validates: Requirements 7.5**

## Error Handling

### Model Loading Errors

**Scenario**: Model files are missing or corrupted

**Handling**:
- Try each model path in priority order
- Log each failed attempt with specific error message
- Continue to next model path
- If all fail, set `_model = None` and continue running
- Health endpoint will report degraded status
- Inference endpoint will return 500 with clear error message

### Preprocessing Errors

**Scenario**: Invalid image format or corrupted image data

**Handling**:
- Catch PIL Image.open() exceptions
- Return 400 Bad Request with error message
- Log the error with request metadata

**Scenario**: Invalid metadata values

**Handling**:
- Use default values from artifacts
- Log warning about using defaults
- Continue with inference

### Inference Errors

**Scenario**: Model prediction fails

**Handling**:
- Catch TensorFlow exceptions
- Return 500 Internal Server Error
- Log full stack trace
- Include error message in response

### Validation Errors

**Scenario**: Missing required fields in request

**Handling**:
- FastAPI automatically returns 422 Unprocessable Entity
- Response includes field names and validation errors
- No custom handling needed (FastAPI built-in)

## Testing Strategy

### Unit Testing

**Framework**: pytest

**Test Coverage**:

1. **Model Loading Tests**:
   - Test successful model loading
   - Test loading with missing files
   - Test loading with corrupted files
   - Test artifacts loading

2. **Preprocessing Tests**:
   - Test image resizing with various input sizes
   - Test EfficientNet normalization output range
   - Test age normalization formula
   - Test sex encoding with all valid values
   - Test site encoding with all valid values
   - Test default value fallback

3. **Endpoint Tests**:
   - Test /predict with valid inputs
   - Test /predict with missing fields
   - Test /predict with invalid field types
   - Test /api/health when model loaded
   - Test /api/health when model not loaded

4. **Response Format Tests**:
   - Test top-3 ordering
   - Test all probabilities present
   - Test uncertainty flag calculation
   - Test JSON structure

5. **CORS Tests**:
   - Test CORS headers in responses
   - Test OPTIONS preflight handling

6. **Logging Tests**:
   - Test inference logs contain required fields
   - Test error logs contain stack traces
   - Test timestamp format

### Property-Based Testing

**Framework**: Hypothesis (Python PBT library)

**Configuration**: Minimum 100 iterations per property test

**Property Tests**:

1. **Property 3: Model reuse** (Requirements 1.5)
   - Generate: Random sequence of inference requests
   - Test: Model is not reloaded from disk
   - Tag: `# Feature: ml-model-fastapi-integration, Property 3: Model reuse during inference`

2. **Property 5: Image preprocessing** (Requirements 3.1, 3.2)
   - Generate: Random images of various sizes and formats
   - Test: Output shape is (224, 224, 3) and values in [-1, 1]
   - Tag: `# Feature: ml-model-fastapi-integration, Property 5: Image preprocessing consistency`

3. **Property 6: Metadata encoding** (Requirements 3.3, 3.4, 3.5)
   - Generate: Random age, sex, site values
   - Test: Encoding formulas are correct
   - Tag: `# Feature: ml-model-fastapi-integration, Property 6: Metadata encoding correctness`

4. **Property 7: Default fallback** (Requirements 3.6)
   - Generate: Random invalid metadata values
   - Test: Defaults are used without errors
   - Tag: `# Feature: ml-model-fastapi-integration, Property 7: Default value fallback`

5. **Property 8: Response structure** (Requirements 4.1, 4.2, 4.3, 4.4, 4.5)
   - Generate: Random valid inference requests
   - Test: Response contains all required fields
   - Tag: `# Feature: ml-model-fastapi-integration, Property 8: Response structure completeness`

6. **Property 9: Uncertainty calculation** (Requirements 4.4)
   - Generate: Random probability distributions
   - Test: Uncertainty flag matches formula
   - Tag: `# Feature: ml-model-fastapi-integration, Property 9: Uncertainty flag calculation`

7. **Property 11: CORS headers** (Requirements 6.3)
   - Generate: Random POST requests
   - Test: CORS headers present in all responses
   - Tag: `# Feature: ml-model-fastapi-integration, Property 11: CORS headers presence`

8. **Property 13: Logging completeness** (Requirements 7.1, 7.2, 7.3, 7.4)
   - Generate: Random inference requests
   - Test: Logs contain all required fields
   - Tag: `# Feature: ml-model-fastapi-integration, Property 13: Inference logging completeness`

### Integration Testing

**Test Scenarios**:

1. **End-to-End Inference**:
   - Start FastAPI app
   - Send real image + metadata via HTTP
   - Verify response structure
   - Check logs

2. **Traefik Routing**:
   - Send request to Traefik (port 80)
   - Verify it reaches backend
   - Verify CORS headers pass through

3. **Frontend Integration**:
   - Test FormData construction in React
   - Test API call from Analizar.jsx
   - Verify response parsing

### Manual Testing

**Test Cases**:

1. **UI Testing**:
   - Fill patient form in Analizar page
   - Upload test image
   - Click "Analizar Imagen"
   - Verify results display correctly

2. **Log Verification**:
   - Check Docker logs: `docker logs backend`
   - Verify inference logs appear
   - Verify log format is correct

3. **Health Check**:
   - Visit http://localhost/api/health
   - Verify status is "healthy"
   - Verify model_loaded is true

## API Documentation for Frontend Integration

### FormData Field Specification

The frontend must send a POST request to `/predict` with the following FormData fields:

| Field Name | Type | Required | Valid Values | Example |
|------------|------|----------|--------------|---------|
| `file` | File (binary) | Yes | JPEG or PNG image | `lesion.jpg` |
| `age` | Integer | Yes | 0-120 | `45` |
| `sex` | String | Yes | "male", "female", "MALE", "FEMALE", "m", "f", "hombre", "mujer" | `"male"` |
| `site` | String | Yes | See site values below | `"anterior torso"` |

**Valid Site Values** (must match exactly):
- `"anterior torso"`
- `"posterior torso"`
- `"head/neck"`
- `"upper extremity"`
- `"lower extremity"`
- `"palms/soles"`
- `"oral/genital"`
- `"lateral torso"`

### Example React/JavaScript Code

```javascript
// In Analizar.jsx
const handleAnalyze = async () => {
  setAnalyzing(true)
  
  try {
    // Convert base64 preview to blob
    const base64Response = await fetch(preview)
    const blob = await base64Response.blob()
    
    // Create FormData
    const formData = new FormData()
    formData.append('file', blob, 'lesion.jpg')
    formData.append('age', formData.age)  // Integer
    formData.append('sex', formData.sex.toLowerCase())  // String: "male" or "female"
    formData.append('site', formData.anatom_site_general)  // String: exact site value
    
    // Call API through Traefik
    const response = await fetch('/predict', {
      method: 'POST',
      body: formData
      // No need to set Content-Type - browser sets it automatically with boundary
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    // Use result.prediction, result.top_predictions, etc.
    console.log('Top prediction:', result.prediction)
    console.log('Confidence:', result.confidence)
    console.log('Top 3:', result.top_predictions)
    
  } catch (error) {
    console.error('Inference error:', error)
    alert('Error al realizar el análisis')
  } finally {
    setAnalyzing(false)
  }
}
```

### Example curl Command

```bash
curl -X POST http://localhost/predict \
  -F "file=@test_image.jpg" \
  -F "age=45" \
  -F "sex=male" \
  -F "site=anterior torso"
```

### Expected Response Format

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

### Error Responses

**422 Validation Error** (missing/invalid fields):
```json
{
  "detail": [
    {
      "loc": ["body", "age"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**500 Internal Server Error** (model not loaded or inference failed):
```json
{
  "error": "Modelo no cargado o error en inferencia",
  "detail": "Model is not loaded"
}
```

## Testing and Validation Guide

### Step 1: Verify Backend is Running

```bash
# Check Docker containers
docker ps

# Should see: backend, frontend, traefik, postgres, pgadmin

# Check backend logs
docker logs backend

# Should see: "Application startup complete" and model loading messages
```

### Step 2: Test Health Endpoint

```bash
# Direct to backend (if exposed)
curl http://localhost:8000/api/health

# Through Traefik
curl http://localhost/api/health

# Expected response:
# {
#   "status": "healthy",
#   "model_loaded": true,
#   "artifacts_loaded": true,
#   "timestamp": "2024-01-15T10:30:00Z"
# }
```

### Step 3: Test Inference Endpoint with curl

```bash
# Prepare a test image (JPEG or PNG)
# Then run:

curl -X POST http://localhost/predict \
  -F "file=@test_lesion.jpg" \
  -F "age=45" \
  -F "sex=male" \
  -F "site=anterior torso" \
  -v

# The -v flag shows headers including CORS headers
# Look for: Access-Control-Allow-Origin: *
```

### Step 4: Test from React UI

1. Open browser to `http://localhost`
2. Navigate to "Analizar" page
3. Fill in patient form:
   - Nombre: "Test Patient"
   - Edad: 45
   - Sexo: Masculino
   - Zona anatómica: Torso anterior
   - CI: 12345678
4. Click "Siguiente"
5. Upload a test image (drag & drop or click to select)
6. Click "Analizar Imagen"
7. Wait for results (should see loading spinner)
8. Verify results display with:
   - Top prediction
   - Confidence percentage
   - Top 3 predictions
   - All probabilities

### Step 5: Verify Logs

```bash
# Watch backend logs in real-time
docker logs -f backend

# Expected log entries for successful inference:
# [2024-01-15T10:30:00] [INFO] Inference request - age=45, sex=male, site=anterior torso
# [2024-01-15T10:30:00] [INFO] Inference complete - top_class=MEL, duration_ms=145.3
```

### Step 6: Verify Traefik Routing

```bash
# Check Traefik dashboard
# Open browser to http://localhost:8080

# Look for:
# - Router "backend" with rule PathPrefix(`/api`) || PathPrefix(`/predict`)
# - Service "backend" pointing to backend:8000
# - Router "frontend" with rule PathPrefix(`/`)
```

### Troubleshooting Common Issues

**Issue**: 404 Not Found on /predict

**Solution**: 
- Check Traefik labels in docker-compose.yml
- Verify backend container is running: `docker ps`
- Check Traefik dashboard for routing rules

**Issue**: CORS error in browser console

**Solution**:
- Verify CORS middleware is configured in FastAPI
- Check Traefik CORS labels in docker-compose.yml
- Use browser DevTools Network tab to inspect headers

**Issue**: 500 Internal Server Error

**Solution**:
- Check backend logs: `docker logs backend`
- Verify model files exist in backend/fastapi_skin_demo/model/
- Verify preprocessing artifacts JSON is valid
- Check if model loaded successfully at startup

**Issue**: 422 Validation Error

**Solution**:
- Verify all required fields are present: file, age, sex, site
- Check field names match exactly (case-sensitive for some)
- Verify site value matches one of the valid values
- Check age is an integer, not a string

**Issue**: Image not preprocessing correctly

**Solution**:
- Verify image is valid JPEG or PNG
- Check image file size (< 10MB recommended)
- Verify PIL can open the image
- Check preprocessing artifacts img_size is [224, 224]

### Expected Log Output Example

```
[2024-01-15T10:30:00.123] [INFO] Application startup complete
[2024-01-15T10:30:00.124] [INFO] Model loaded successfully from: model/best_model_checkpoint.keras
[2024-01-15T10:30:00.125] [INFO] Preprocessing artifacts loaded successfully
[2024-01-15T10:30:15.456] [INFO] Inference request - age=45, sex=male, site=anterior torso
[2024-01-15T10:30:15.601] [INFO] Inference complete - top_class=MEL, duration_ms=145.3
```
