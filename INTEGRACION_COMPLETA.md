# Integración Completa Frontend-Backend

## ✅ Estado del Sistema

### Servicios Activos (a través de Traefik en puerto 80)

1. **Frontend** (React + Vite)
   - URL: `http://localhost/`
   - Servido por Nginx
   - Enrutado por Traefik con prioridad 1

2. **Backend** (FastAPI)
   - URL: `http://localhost/api/*`
   - Endpoints disponibles:
     - `GET /api/health` - Health check
     - `POST /api/predict` - Predicción de lesión cutánea
     - `GET /api/anatomic-sites` - Sitios anatómicos disponibles
     - `GET /api/disease-classes` - Clases de enfermedades
     - `GET /api/model/info` - Información del modelo
   - Enrutado por Traefik con prioridad 200 (mayor prioridad)

3. **Traefik** (Reverse Proxy)
   - Dashboard: `http://localhost:8080`
   - Maneja todo el enrutamiento en puerto 80

4. **PostgreSQL**
   - Puerto: 5432
   - Base de datos: appdb

5. **pgAdmin**
   - URL: `http://localhost:5050`

## 🔄 Flujo de Integración

### Cuando el usuario hace un análisis:

1. **Frontend** (`/analizar`)
   - Usuario completa formulario con datos del paciente
   - Usuario sube imagen de la lesión
   - Click en "Analizar Imagen"

2. **Petición al Backend**
   ```javascript
   POST /api/predict
   {
     "age": 65,
     "sex": "male",
     "anatomic_site": "head/neck"
   }
   ```

3. **Backend procesa**
   - Recibe datos del paciente
   - Preprocesa metadatos (edad, sexo, sitio)
   - Ejecuta modelo de predicción
   - Devuelve resultados

4. **Respuesta del Backend**
   ```json
   {
     "prediction": "NV",
     "prediction_full": "Nevus (Lunar Benigno)",
     "confidence": 0.63,
     "top_predictions": [
       {
         "disease": "NV",
         "disease_full": "Nevus (Lunar Benigno)",
         "probability": 0.63
       },
       {
         "disease": "BCC",
         "disease_full": "Carcinoma Basocelular",
         "probability": 0.15
       },
       {
         "disease": "BKL",
         "disease_full": "Queratosis Seborreica",
         "probability": 0.15
       }
     ],
     "metadata": {...},
     "note": "Predicción simulada - requiere imagen para predicción real"
   }
   ```

5. **Frontend muestra resultados**
   - Agrega análisis al historial con fecha/hora actual
   - Resalta el nuevo análisis con color especial
   - Muestra badge "NUEVO" con animación
   - Navega al paso 3 (Resultados)

## 🎨 Características Visuales

### Historial de Análisis
- ✅ Fecha y hora automática
- ✅ Resaltado visual del análisis más reciente
- ✅ Badge "NUEVO" con animación pulse
- ✅ Gradiente cyan/blue para destacar
- ✅ Gráficos de dona para top 3 predicciones
- ✅ Contador de análisis totales

### Colores de Resaltado
- **Tema Oscuro**: Gradiente cyan-900/blue-900 con borde cyan-500
- **Tema Claro**: Gradiente cyan-50/blue-50 con borde cyan-400

## 🧪 Pruebas

### Probar Backend directamente
```bash
# Health check
curl http://localhost/api/health

# Predicción
curl -X POST http://localhost/api/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 65, "sex": "male", "anatomic_site": "head/neck"}'

# Info del modelo
curl http://localhost/api/model/info
```

### Probar Frontend
1. Abrir navegador en `http://localhost/`
2. Ir a "Analizar"
3. Completar formulario
4. Subir imagen
5. Click en "Analizar Imagen"
6. Ver resultados en historial

## 📊 Modelo de Predicción

### Estado Actual
- ✅ Artefactos de preprocesamiento cargados
- ✅ Sistema de predicción en modo simulación
- ⚠️ Modelo de deep learning pendiente (requiere archivo .pkl)

### Clases de Enfermedades
1. **MEL** - Melanoma (Maligno)
2. **NV** - Nevus / Lunar Benigno (Benigno)
3. **BCC** - Carcinoma Basocelular (Maligno)
4. **BKL** - Queratosis Seborreica (Benigno)

### Sitios Anatómicos
- Torso anterior
- Torso posterior
- Cabeza/Cuello
- Extremidad superior
- Extremidad inferior
- Palmas/Plantas
- Oral/Genital

## 🔧 Configuración de Traefik

### Enrutamiento
```yaml
Backend:
  - Rule: PathPrefix(`/api`) || PathPrefix(`/predict`)
  - Priority: 200
  - Port: 8000

Frontend:
  - Rule: PathPrefix(`/`)
  - Priority: 1
  - Port: 80
```

### CORS
- Configurado en backend con middleware
- Permite todos los orígenes (*)
- Métodos: GET, POST, PUT, DELETE, OPTIONS

## 📝 Notas Importantes

1. **Datos Mock**: El historial inicial contiene 3 análisis de ejemplo
2. **Predicción Simulada**: El modelo actual usa estadísticas generales basadas en edad y sitio
3. **Imagen**: Por ahora la imagen no se procesa, solo se usa para UI
4. **Persistencia**: Los análisis se pierden al recargar la página (no hay base de datos aún)

## 🚀 Próximos Pasos

1. Integrar modelo de deep learning completo (.pkl)
2. Procesar imágenes de lesiones
3. Guardar análisis en base de datos PostgreSQL
4. Implementar autenticación de usuarios
5. Agregar exportación de reportes PDF
