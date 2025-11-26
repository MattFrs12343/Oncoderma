# Requirements Document

## Introduction

Este documento especifica los requisitos para la integración completa del modelo de clasificación de lesiones cutáneas con FastAPI. El sistema debe cargar el modelo una sola vez al iniciar, exponer endpoints de inferencia y health check, aplicar el preprocesamiento correcto, habilitar CORS para el frontend React, registrar logs de inferencia, y documentar los formatos de datos esperados para la integración frontend-backend.

## Glossary

- **FastAPI Application**: La aplicación web basada en FastAPI que expone los endpoints de la API
- **ML Model**: El modelo de TensorFlow/Keras entrenado para clasificar lesiones cutáneas (archivos .keras)
- **Preprocessing Artifacts**: Archivo JSON que contiene los parámetros de normalización y codificación (preprocess_artifacts.json)
- **Inference Endpoint**: Endpoint POST que acepta imagen y metadatos y devuelve predicciones
- **Health Endpoint**: Endpoint GET que verifica el estado de la API y el modelo cargado
- **CORS**: Cross-Origin Resource Sharing, mecanismo para permitir peticiones desde el frontend
- **FormData**: Formato de datos multipart/form-data usado para enviar archivos e información desde el frontend
- **Top-3 Predictions**: Las tres clases con mayor probabilidad de predicción
- **Traefik**: Reverse proxy que enruta el tráfico entre frontend y backend

## Requirements

### Requirement 1

**User Story:** Como desarrollador del sistema, quiero que el modelo ML se cargue una sola vez al iniciar la aplicación, para que las inferencias sean rápidas y no se consuma memoria innecesariamente.

#### Acceptance Criteria

1. WHEN the FastAPI application starts THEN the system SHALL load the ML model from disk into memory
2. WHEN the FastAPI application starts THEN the system SHALL load the preprocessing artifacts JSON file into memory
3. WHEN multiple model files exist THEN the system SHALL attempt to load them in priority order until one succeeds
4. WHEN the model or artifacts fail to load THEN the system SHALL log the error and continue running with degraded functionality
5. WHEN an inference request arrives THEN the system SHALL use the pre-loaded model without reloading from disk

### Requirement 2

**User Story:** Como desarrollador frontend, quiero un endpoint de inferencia que acepte exactamente los campos que el modelo requiere, para que pueda enviar los datos correctamente desde React.

#### Acceptance Criteria

1. WHEN a POST request is sent to the inference endpoint with an image file THEN the system SHALL accept the file in multipart/form-data format
2. WHEN a POST request includes age metadata THEN the system SHALL accept it as an integer field named "age"
3. WHEN a POST request includes sex metadata THEN the system SHALL accept it as a string field named "sex" with values matching the preprocessing artifacts
4. WHEN a POST request includes anatomic site metadata THEN the system SHALL accept it as a string field named "site" with values matching the preprocessing artifacts
5. WHEN required fields are missing THEN the system SHALL return a 422 validation error with clear field names

### Requirement 3

**User Story:** Como científico de datos, quiero que el preprocesamiento de inferencia sea idéntico al del entrenamiento, para que las predicciones sean precisas y consistentes.

#### Acceptance Criteria

1. WHEN an image is received THEN the system SHALL resize it to the exact dimensions specified in preprocessing artifacts
2. WHEN an image is received THEN the system SHALL apply EfficientNet preprocessing (scaling to [-1, 1])
3. WHEN age metadata is received THEN the system SHALL normalize it using the mean and std from preprocessing artifacts
4. WHEN sex metadata is received THEN the system SHALL encode it as one-hot vector using the sex2idx mapping from artifacts
5. WHEN site metadata is received THEN the system SHALL encode it as an index using the site2idx mapping from artifacts
6. WHEN metadata values are invalid or missing THEN the system SHALL use default values from preprocessing artifacts

### Requirement 4

**User Story:** Como desarrollador frontend, quiero que el endpoint de inferencia devuelva predicciones estructuradas con top-3 y probabilidades completas, para que pueda mostrar resultados detallados al usuario.

#### Acceptance Criteria

1. WHEN inference completes successfully THEN the system SHALL return the top prediction with class name and probability
2. WHEN inference completes successfully THEN the system SHALL return the top-3 predictions ordered by probability descending
3. WHEN inference completes successfully THEN the system SHALL return all class probabilities as a dictionary mapping class names to probabilities
4. WHEN inference completes successfully THEN the system SHALL include an uncertainty flag based on confidence thresholds
5. WHEN inference completes successfully THEN the system SHALL return results as JSON with HTTP status 200

### Requirement 5

**User Story:** Como ingeniero DevOps, quiero un endpoint de health check, para que pueda monitorear el estado de la API y el modelo en producción.

#### Acceptance Criteria

1. WHEN a GET request is sent to the health endpoint THEN the system SHALL return HTTP status 200 if the model is loaded
2. WHEN a GET request is sent to the health endpoint THEN the system SHALL return HTTP status 503 if the model is not loaded
3. WHEN a GET request is sent to the health endpoint THEN the system SHALL include model status in the response body
4. WHEN a GET request is sent to the health endpoint THEN the system SHALL include preprocessing artifacts status in the response body
5. WHEN a GET request is sent to the health endpoint THEN the system SHALL respond within 100ms

### Requirement 6

**User Story:** Como desarrollador frontend, quiero que CORS esté habilitado correctamente, para que el frontend React pueda llamar a la API sin errores de origen cruzado.

#### Acceptance Criteria

1. WHEN the FastAPI application starts THEN the system SHALL configure CORS middleware to allow requests from the frontend origin
2. WHEN a preflight OPTIONS request arrives THEN the system SHALL respond with appropriate CORS headers
3. WHEN a POST request arrives from the frontend THEN the system SHALL include Access-Control-Allow-Origin header in the response
4. WHEN CORS is configured THEN the system SHALL allow credentials if needed by the frontend
5. WHEN CORS is configured THEN the system SHALL allow all necessary HTTP methods (GET, POST, OPTIONS)

### Requirement 7

**User Story:** Como administrador del sistema, quiero logs mínimos por cada petición de inferencia, para que pueda auditar el uso y diagnosticar problemas.

#### Acceptance Criteria

1. WHEN an inference request starts THEN the system SHALL log the timestamp in ISO format
2. WHEN an inference request includes metadata THEN the system SHALL log the age, sex, and site values
3. WHEN inference completes THEN the system SHALL log the total inference duration in milliseconds
4. WHEN inference completes THEN the system SHALL log the top predicted class label
5. WHEN an error occurs during inference THEN the system SHALL log the error message and stack trace

### Requirement 8

**User Story:** Como desarrollador frontend, quiero documentación clara de los campos y formatos esperados por la API, para que pueda implementar el FormData correctamente en React.

#### Acceptance Criteria

1. WHEN the integration is complete THEN the system SHALL provide a document listing all required FormData field names
2. WHEN the integration is complete THEN the system SHALL provide a document listing all accepted values for categorical fields
3. WHEN the integration is complete THEN the system SHALL provide example curl commands for testing the API
4. WHEN the integration is complete THEN the system SHALL provide example JavaScript/React code for calling the API
5. WHEN the integration is complete THEN the system SHALL document the expected response format with example JSON

### Requirement 9

**User Story:** Como tester del sistema, quiero pasos claros para validar la integración desde la UI, para que pueda verificar que todo funciona correctamente end-to-end.

#### Acceptance Criteria

1. WHEN the integration is complete THEN the system SHALL provide step-by-step instructions for testing from the React UI
2. WHEN the integration is complete THEN the system SHALL provide instructions for verifying requests pass through Traefik
3. WHEN the integration is complete THEN the system SHALL provide instructions for checking backend logs
4. WHEN the integration is complete THEN the system SHALL provide expected log output examples for successful inference
5. WHEN the integration is complete THEN the system SHALL provide troubleshooting steps for common errors
