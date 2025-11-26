"""
Script de prueba para la API del modelo de predicción de cáncer de piel
"""
import requests
import json

BASE_URL = "http://localhost"

def test_model_info():
    """Probar endpoint de información del modelo"""
    print("\n=== Información del Modelo ===")
    response = requests.get(f"{BASE_URL}/api/model/info")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_anatomic_sites():
    """Probar endpoint de sitios anatómicos"""
    print("\n=== Sitios Anatómicos Disponibles ===")
    response = requests.get(f"{BASE_URL}/api/anatomic-sites")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_disease_classes():
    """Probar endpoint de clases de enfermedades"""
    print("\n=== Clases de Enfermedades ===")
    response = requests.get(f"{BASE_URL}/api/disease-classes")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

def test_prediction():
    """Probar endpoint de predicción"""
    print("\n=== Predicción de Lesión Cutánea ===")
    
    # Caso 1: Paciente mayor con lesión en cabeza/cuello
    data1 = {
        "age": 70,
        "sex": "male",
        "anatomic_site": "head/neck"
    }
    print(f"\nCaso 1: {data1}")
    response = requests.post(f"{BASE_URL}/api/predict", json=data1)
    result = response.json()
    print(f"Predicción: {result['prediction_full']}")
    print(f"Confianza: {result['confidence']:.2%}")
    print("Top 3 predicciones:")
    for pred in result['top_predictions'][:3]:
        print(f"  - {pred['disease_full']}: {pred['probability']:.2%}")
    
    # Caso 2: Paciente joven con lesión en extremidad
    data2 = {
        "age": 30,
        "sex": "female",
        "anatomic_site": "lower extremity"
    }
    print(f"\nCaso 2: {data2}")
    response = requests.post(f"{BASE_URL}/api/predict", json=data2)
    result = response.json()
    print(f"Predicción: {result['prediction_full']}")
    print(f"Confianza: {result['confidence']:.2%}")
    print("Top 3 predicciones:")
    for pred in result['top_predictions'][:3]:
        print(f"  - {pred['disease_full']}: {pred['probability']:.2%}")

if __name__ == "__main__":
    print("=" * 60)
    print("PRUEBA DE API - MODELO DE PREDICCIÓN DE CÁNCER DE PIEL")
    print("=" * 60)
    
    try:
        test_model_info()
        test_anatomic_sites()
        test_disease_classes()
        test_prediction()
        
        print("\n" + "=" * 60)
        print("✓ Todas las pruebas completadas exitosamente")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error en las pruebas: {e}")
