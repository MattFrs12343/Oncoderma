from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
import os

app = FastAPI()

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:admin123@postgres:5432/appdb")

def get_db_connection():
    """Obtener conexión a la base de datos"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error conectando a la base de datos: {e}")
        raise HTTPException(status_code=500, detail="Error de conexión a la base de datos")

@app.get("/api/palabra")
async def get_palabra():
    """Obtener una enfermedad aleatoria de la base de datos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT nombre_enfermedad FROM enfermedades ORDER BY RANDOM() LIMIT 1")
        resultado = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if resultado:
            return {"palabra": resultado['nombre_enfermedad']}
        else:
            return {"palabra": "No hay enfermedades en la base de datos"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar palabra: {str(e)}")

@app.get("/api/enfermedades")
async def get_enfermedades():
    """Obtener todas las enfermedades de la base de datos"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM enfermedades ORDER BY id")
        enfermedades = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return {"enfermedades": enfermedades}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al consultar enfermedades: {str(e)}")

@app.post("/api/enfermedades")
async def create_enfermedad(nombre_enfermedad: str):
    """Crear una nueva enfermedad"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(
            "INSERT INTO enfermedades (nombre_enfermedad) VALUES (%s) RETURNING *",
            (nombre_enfermedad,)
        )
        nueva_enfermedad = cursor.fetchone()
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"enfermedad": nueva_enfermedad}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear enfermedad: {str(e)}")
