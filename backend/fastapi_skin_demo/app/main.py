
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
import numpy as np
import json
import io
import logging
from datetime import datetime
from PIL import Image
import tensorflow as tf
from .utils.preprocessing import preprocess_image_bytes, encode_metadata
import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%dT%H:%M:%S'
)
logger = logging.getLogger("skin_classifier")

app = FastAPI(title="Skin Classifier API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATHS = [
    "model/best_model_checkpoint.keras",
    "model/model_multimodal_improved.keras",
    "model/model_multimodal.keras"
]

_model = None
_artifacts = None

# Disease name mapping
DISEASE_NAMES = {
    "MEL": "Melanoma",
    "NV": "Nevus melanocítico",
    "BCC": "Carcinoma basocelular",
    "BKL": "Lesión tipo queratosis benigna"
}

def load_model_and_artifacts():
    global _model, _artifacts
    
    # Try loading model
    for p in MODEL_PATHS:
        try:
            _model = tf.keras.models.load_model(p)
            logger.info(f"Model loaded successfully from: {p}")
            break
        except Exception as e:
            logger.warning(f"Failed to load model from {p}: {str(e)}")
    
    if _model is None:
        logger.error("Failed to load model from all paths")
    
    # Try loading artifacts
    try:
        with open("model/preprocess_artifacts.json", "r", encoding="utf-8") as f:
            _artifacts = json.load(f)
        logger.info("Preprocessing artifacts loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load preprocessing artifacts: {str(e)}")
        _artifacts = None

load_model_and_artifacts()
logger.info("Application startup complete")

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    status = "healthy" if (_model is not None and _artifacts is not None) else "degraded"
    status_code = 200 if status == "healthy" else 503
    
    return JSONResponse(
        {
            "status": status,
            "model_loaded": _model is not None,
            "artifacts_loaded": _artifacts is not None,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        },
        status_code=status_code
    )

@app.post("/api/login")
async def login(
    username: str = Form(...),
    password: str = Form(...)
):
    """
    Login endpoint that validates credentials against the database.
    
    Args:
        username: Username
        password: Password (plain text - matches database)
    
    Returns:
        JSON with success status and user info
    """
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import os
    
    try:
        # Get database connection
        database_url = os.getenv("DATABASE_URL", "postgresql://admin:admin123@postgres:5432/appdb")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Query user from database
        cursor.execute(
            "SELECT id, nombre, password FROM usuario WHERE LOWER(nombre) = LOWER(%s)",
            (username,)
        )
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        # Validate credentials
        if user and user['password'] == password:
            logger.info(f"Login successful - user={username}")
            return JSONResponse({
                "success": True,
                "message": "Login exitoso",
                "user": {
                    "id": user['id'],
                    "username": user['nombre']
                }
            })
        else:
            logger.warning(f"Login failed - user={username}")
            return JSONResponse(
                {
                    "success": False,
                    "message": "Usuario o contraseña incorrectos"
                },
                status_code=401
            )
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        return JSONResponse(
            {
                "success": False,
                "message": "Error al conectar con la base de datos"
            },
            status_code=500
        )

@app.get("/api/search-patients")
async def search_patients(ci: str, user_id: int):
    """
    Search patients by CI that belong to a specific user.
    
    Args:
        ci: CI search query (partial or complete)
        user_id: User ID to filter patients
    
    Returns:
        JSON with list of matching CIs
    """
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import os
    
    try:
        # Get database connection
        database_url = os.getenv("DATABASE_URL", "postgresql://admin:admin123@postgres:5432/appdb")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Search patients by CI that have history with this user
        cursor.execute("""
            SELECT DISTINCT p.ci, p.complemento, p.nombre
            FROM paciente p
            JOIN historia_clinica hc ON p.id = hc.paciente_id
            WHERE hc.id_usuario = %s
            AND p.ci LIKE %s
            ORDER BY p.ci
            LIMIT 10
        """, (user_id, f"%{ci}%"))
        
        patients = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Format results with CI and name
        results = []
        for patient in patients:
            ci_full = patient['ci']
            if patient['complemento']:
                ci_full = f"{patient['ci']}-{patient['complemento']}"
            results.append({
                "ci": ci_full,
                "nombre": patient['nombre']
            })
        
        logger.info(f"Patient search - user_id={user_id}, ci={ci}, results={len(results)}")
        
        return JSONResponse({
            "success": True,
            "results": results
        })
        
    except Exception as e:
        logger.error(f"Search patients error: {str(e)}", exc_info=True)
        return JSONResponse(
            {
                "success": False,
                "message": f"Error al buscar pacientes: {str(e)}"
            },
            status_code=500
        )

@app.get("/api/patient-history/{ci}")
async def get_patient_history(ci: str):
    """
    Get patient history by CI number.
    
    Args:
        ci: Patient CI number
    
    Returns:
        JSON with patient info and analysis history with TOP 3 diseases
    """
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import os
    
    try:
        # Get database connection
        database_url = os.getenv("DATABASE_URL", "postgresql://admin:admin123@postgres:5432/appdb")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get patient info
        cursor.execute("""
            SELECT p.id, p.nombre, p.edad, p.ci, p.complemento, p.telefono,
                   s.sexo
            FROM paciente p
            LEFT JOIN sexo s ON p.sexo_id = s.id
            WHERE p.ci = %s
        """, (ci,))
        patient = cursor.fetchone()
        
        if not patient:
            cursor.close()
            conn.close()
            return JSONResponse({
                "success": True,
                "patient": None,
                "history": [],
                "message": "Este paciente no tiene historial previo"
            })
        
        # Get patient history with TOP 3 diseases
        cursor.execute("""
            SELECT 
                hc.id,
                hc.fecha,
                hc.edad,
                zc.zona as zona_clinica,
                e1.enfermedad as enfermedad_1,
                e1.detalle as detalle_1,
                hc.probabilidad_1,
                e2.enfermedad as enfermedad_2,
                e2.detalle as detalle_2,
                hc.probabilidad_2,
                e3.enfermedad as enfermedad_3,
                e3.detalle as detalle_3,
                hc.probabilidad_3,
                u.nombre as usuario
            FROM historia_clinica hc
            JOIN zona_clinica zc ON hc.zona_clinica_id = zc.id
            JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id
            JOIN enfermedad e2 ON hc.enfermedad_id_2 = e2.id
            JOIN enfermedad e3 ON hc.enfermedad_id_3 = e3.id
            JOIN usuario u ON hc.id_usuario = u.id
            WHERE hc.paciente_id = %s
            ORDER BY hc.fecha DESC
        """, (patient['id'],))
        
        history_records = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        # Format history
        history = []
        for record in history_records:
            history.append({
                "id": record['id'],
                "fecha": record['fecha'].strftime('%Y-%m-%d'),
                "hora": record['fecha'].strftime('%H:%M'),
                "edad": record['edad'],
                "zona_clinica": record['zona_clinica'],
                "usuario": record['usuario'],
                "top3": [
                    {
                        "enfermedad": record['enfermedad_1'],
                        "nombre": record['detalle_1'].split(' - ')[0] if ' - ' in record['detalle_1'] else record['detalle_1'],
                        "probabilidad": float(record['probabilidad_1']),  # Ya está en formato 0-100
                        "status": "Maligno" if record['enfermedad_1'] in ['MEL', 'BCC'] else "Benigno"
                    },
                    {
                        "enfermedad": record['enfermedad_2'],
                        "nombre": record['detalle_2'].split(' - ')[0] if ' - ' in record['detalle_2'] else record['detalle_2'],
                        "probabilidad": float(record['probabilidad_2']),  # Ya está en formato 0-100
                        "status": "Maligno" if record['enfermedad_2'] in ['MEL', 'BCC'] else "Benigno"
                    },
                    {
                        "enfermedad": record['enfermedad_3'],
                        "nombre": record['detalle_3'].split(' - ')[0] if ' - ' in record['detalle_3'] else record['detalle_3'],
                        "probabilidad": float(record['probabilidad_3']),  # Ya está en formato 0-100
                        "status": "Maligno" if record['enfermedad_3'] in ['MEL', 'BCC'] else "Benigno"
                    }
                ]
            })
        
        logger.info(f"Patient history retrieved - ci={ci}, records={len(history)}")
        
        return JSONResponse({
            "success": True,
            "patient": {
                "id": patient['id'],
                "nombre": patient['nombre'],
                "edad": patient['edad'],
                "ci": patient['ci'],
                "complemento": patient['complemento'],
                "telefono": patient['telefono'],
                "sexo": patient['sexo']
            },
            "history": history,
            "message": f"Se encontraron {len(history)} análisis previos" if history else "Este paciente no tiene historial previo"
        })
        
    except Exception as e:
        logger.error(f"Get patient history error: {str(e)}", exc_info=True)
        return JSONResponse(
            {
                "success": False,
                "message": f"Error al obtener historial: {str(e)}"
            },
            status_code=500
        )

@app.post("/api/save-analysis")
async def save_analysis(
    paciente_nombre: str = Form(...),
    paciente_edad: int = Form(...),
    paciente_sexo: str = Form(...),
    paciente_ci: str = Form(...),
    paciente_complemento: str = Form(None),
    paciente_telefono: str = Form(None),
    zona_clinica: str = Form(...),
    enfermedad_codigo_1: str = Form(...),
    probabilidad_1: float = Form(...),
    enfermedad_codigo_2: str = Form(...),
    probabilidad_2: float = Form(...),
    enfermedad_codigo_3: str = Form(...),
    probabilidad_3: float = Form(...),
    id_usuario: int = Form(...)
):
    """
    Save analysis results to database with TOP 3 diseases.
    
    Args:
        paciente_nombre: Patient name
        paciente_edad: Patient age
        paciente_sexo: Patient sex (M/F)
        paciente_ci: Patient CI
        paciente_complemento: CI complement (optional)
        paciente_telefono: Patient phone (optional)
        zona_clinica: Clinical zone
        enfermedad_codigo_1: Disease code 1 (MEL, NV, BCC, BKL)
        probabilidad_1: Probability 1 (0-100)
        enfermedad_codigo_2: Disease code 2
        probabilidad_2: Probability 2 (0-100)
        enfermedad_codigo_3: Disease code 3
        probabilidad_3: Probability 3 (0-100)
        id_usuario: User ID who performed the analysis
    
    Returns:
        JSON with success status and updated patient history
    """
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import os
    
    try:
        # Get database connection
        database_url = os.getenv("DATABASE_URL", "postgresql://admin:admin123@postgres:5432/appdb")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Map zona_clinica from English to Spanish
        zona_map = {
            'anterior torso': 'Torso Anterior',
            'posterior torso': 'Torso Posterior',
            'head/neck': 'Cabeza/Cuello',
            'upper extremity': 'Extremidad Superior',
            'lower extremity': 'Extremidad Inferior',
            'palms/soles': 'Palmas/Plantas',
            'oral/genital': 'Oral/Genital',
            'lateral torso': 'Torso Lateral'
        }
        zona_nombre = zona_map.get(zona_clinica.lower(), zona_clinica)
        
        # Map sex to database format
        sexo_char = 'M' if paciente_sexo.upper() in ['M', 'MALE', 'MASCULINO'] else 'F'
        
        # Get sexo_id
        cursor.execute("SELECT id FROM sexo WHERE sexo = %s", (sexo_char,))
        sexo_result = cursor.fetchone()
        sexo_id = sexo_result['id'] if sexo_result else None
        
        # Get zona_clinica_id
        cursor.execute("SELECT id FROM zona_clinica WHERE zona = %s", (zona_nombre,))
        zona_result = cursor.fetchone()
        zona_clinica_id = zona_result['id'] if zona_result else None
        
        # Get enfermedad IDs for TOP 3
        cursor.execute("SELECT id FROM enfermedad WHERE enfermedad = %s", (enfermedad_codigo_1,))
        enfermedad_result_1 = cursor.fetchone()
        enfermedad_id_1 = enfermedad_result_1['id'] if enfermedad_result_1 else None
        
        cursor.execute("SELECT id FROM enfermedad WHERE enfermedad = %s", (enfermedad_codigo_2,))
        enfermedad_result_2 = cursor.fetchone()
        enfermedad_id_2 = enfermedad_result_2['id'] if enfermedad_result_2 else None
        
        cursor.execute("SELECT id FROM enfermedad WHERE enfermedad = %s", (enfermedad_codigo_3,))
        enfermedad_result_3 = cursor.fetchone()
        enfermedad_id_3 = enfermedad_result_3['id'] if enfermedad_result_3 else None
        
        # Check if patient exists by CI
        cursor.execute("SELECT id FROM paciente WHERE ci = %s", (paciente_ci,))
        paciente_result = cursor.fetchone()
        
        if paciente_result:
            # Update existing patient
            paciente_id = paciente_result['id']
            cursor.execute("""
                UPDATE paciente 
                SET nombre = %s, edad = %s, sexo_id = %s, zona_clinica_id = %s,
                    complemento = %s, telefono = %s
                WHERE id = %s
            """, (paciente_nombre, paciente_edad, sexo_id, zona_clinica_id,
                  paciente_complemento, paciente_telefono, paciente_id))
        else:
            # Insert new patient
            cursor.execute("""
                INSERT INTO paciente (nombre, edad, sexo_id, zona_clinica_id, ci, complemento, telefono)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (paciente_nombre, paciente_edad, sexo_id, zona_clinica_id,
                  paciente_ci, paciente_complemento, paciente_telefono))
            paciente_id = cursor.fetchone()['id']
        
        # Insert historia_clinica record with TOP 3
        cursor.execute("""
            INSERT INTO historia_clinica (
                paciente_id, zona_clinica_id, edad, 
                enfermedad_id_1, probabilidad_1,
                enfermedad_id_2, probabilidad_2,
                enfermedad_id_3, probabilidad_3,
                id_usuario
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (paciente_id, zona_clinica_id, paciente_edad, 
              enfermedad_id_1, probabilidad_1,
              enfermedad_id_2, probabilidad_2,
              enfermedad_id_3, probabilidad_3,
              id_usuario))
        historia_id = cursor.fetchone()['id']
        
        # Get updated patient history
        cursor.execute("""
            SELECT 
                hc.id,
                hc.fecha,
                hc.edad,
                zc.zona as zona_clinica,
                e1.enfermedad as enfermedad_1,
                e1.detalle as detalle_1,
                hc.probabilidad_1,
                e2.enfermedad as enfermedad_2,
                e2.detalle as detalle_2,
                hc.probabilidad_2,
                e3.enfermedad as enfermedad_3,
                e3.detalle as detalle_3,
                hc.probabilidad_3,
                u.nombre as usuario
            FROM historia_clinica hc
            JOIN zona_clinica zc ON hc.zona_clinica_id = zc.id
            JOIN enfermedad e1 ON hc.enfermedad_id_1 = e1.id
            JOIN enfermedad e2 ON hc.enfermedad_id_2 = e2.id
            JOIN enfermedad e3 ON hc.enfermedad_id_3 = e3.id
            JOIN usuario u ON hc.id_usuario = u.id
            WHERE hc.paciente_id = %s
            ORDER BY hc.fecha DESC
        """, (paciente_id,))
        
        history_records = cursor.fetchall()
        
        conn.commit()
        cursor.close()
        conn.close()
        
        # Format history
        history = []
        for record in history_records:
            history.append({
                "id": record['id'],
                "fecha": record['fecha'].strftime('%Y-%m-%d'),
                "hora": record['fecha'].strftime('%H:%M'),
                "edad": record['edad'],
                "zona_clinica": record['zona_clinica'],
                "usuario": record['usuario'],
                "top3": [
                    {
                        "enfermedad": record['enfermedad_1'],
                        "nombre": record['detalle_1'].split(' - ')[0] if ' - ' in record['detalle_1'] else record['detalle_1'],
                        "probabilidad": float(record['probabilidad_1']),  # Ya está en formato 0-100
                        "status": "Maligno" if record['enfermedad_1'] in ['MEL', 'BCC'] else "Benigno"
                    },
                    {
                        "enfermedad": record['enfermedad_2'],
                        "nombre": record['detalle_2'].split(' - ')[0] if ' - ' in record['detalle_2'] else record['detalle_2'],
                        "probabilidad": float(record['probabilidad_2']),  # Ya está en formato 0-100
                        "status": "Maligno" if record['enfermedad_2'] in ['MEL', 'BCC'] else "Benigno"
                    },
                    {
                        "enfermedad": record['enfermedad_3'],
                        "nombre": record['detalle_3'].split(' - ')[0] if ' - ' in record['detalle_3'] else record['detalle_3'],
                        "probabilidad": float(record['probabilidad_3']),  # Ya está en formato 0-100
                        "status": "Maligno" if record['enfermedad_3'] in ['MEL', 'BCC'] else "Benigno"
                    }
                ]
            })
        
        logger.info(f"Analysis saved - paciente_id={paciente_id}, historia_id={historia_id}, user_id={id_usuario}")
        
        return JSONResponse({
            "success": True,
            "message": "Análisis guardado exitosamente",
            "data": {
                "paciente_id": paciente_id,
                "historia_clinica_id": historia_id
            },
            "history": history
        })
        
    except Exception as e:
        logger.error(f"Save analysis error: {str(e)}", exc_info=True)
        if 'conn' in locals():
            conn.rollback()
        return JSONResponse(
            {
                "success": False,
                "message": f"Error al guardar el análisis: {str(e)}"
            },
            status_code=500
        )

@app.get("/", response_class=HTMLResponse)
async def home():
    try:
        with open("frontend/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(f.read())
    except:
        return "<h3>Frontend no disponible</h3>"

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    age: int = Form(...),
    sex: str = Form(...),
    site: str = Form(...)
):
    """
    Performs inference on uploaded image with metadata.
    
    Args:
        file: Image file (JPEG/PNG)
        age: Patient age (integer)
        sex: Patient sex (string: "male", "female", etc.)
        site: Anatomic site (string from site2idx keys)
    
    Returns:
        JSON with prediction results
    """
    start_time = time.time()
    
    # Log request
    logger.info(f"Inference request - age={age}, sex={sex}, site={site}")
    
    # Check if model and artifacts are loaded
    if _model is None or _artifacts is None:
        logger.error("Model or artifacts not loaded")
        raise HTTPException(
            status_code=500,
            detail="Model or preprocessing artifacts not loaded"
        )
    
    try:
        # Read and preprocess image
        contents = await file.read()
        img_arr = preprocess_image_bytes(contents, tuple(_artifacts.get("img_size", [224, 224])))
        
        # Encode metadata
        age_norm, sex_ohe, site_idx = encode_metadata(age, sex, site, _artifacts)
        
        # Create batch
        batch = {
            "image": np.expand_dims(img_arr, 0),
            "age": np.array([age_norm]),
            "sex_ohe": np.expand_dims(np.array(sex_ohe), 0),
            "site_idx": np.array([site_idx])
        }
        
        # Perform inference
        preds = _model.predict(batch, verbose=0)[0]
        
        # Get top predictions
        order = np.argsort(preds)[::-1]
        idx2class = _artifacts.get("idx2class", {})
        
        # Build top-3 predictions
        top_predictions = []
        for i in range(min(3, len(order))):
            idx = order[i]
            disease_code = idx2class.get(str(idx), str(idx))
            disease_name = DISEASE_NAMES.get(disease_code, disease_code)
            top_predictions.append({
                "disease": disease_code,
                "disease_full": f"{disease_name} ({disease_code})",
                "probability": float(preds[idx])
            })
        
        # Build all probabilities
        all_probabilities = {
            idx2class.get(str(i), str(i)): float(preds[i])
            for i in range(len(preds))
        }
        
        # Calculate uncertainty
        top1_prob = float(preds[order[0]])
        top2_prob = float(preds[order[1]]) if len(order) > 1 else 0.0
        uncertain = (top1_prob < 0.60) or ((top1_prob - top2_prob) < 0.10)
        
        # Calculate inference time
        inference_time_ms = (time.time() - start_time) * 1000
        
        # Log result
        top_class = idx2class.get(str(order[0]), str(order[0]))
        logger.info(f"Inference complete - top_class={top_class}, duration_ms={inference_time_ms:.1f}")
        
        # Build response
        response = {
            "prediction": DISEASE_NAMES.get(top_predictions[0]["disease"], top_predictions[0]["disease"]),
            "prediction_full": top_predictions[0]["disease_full"],
            "confidence": top1_prob,
            "top_predictions": top_predictions,
            "all_probabilities": all_probabilities,
            "uncertain": uncertain,
            "inference_time_ms": round(inference_time_ms, 1)
        }
        
        return JSONResponse(response)
        
    except Exception as e:
        logger.error(f"Inference error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(e)}"
        )
