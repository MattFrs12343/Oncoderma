import { useState } from 'react'

function App() {
  const [palabra, setPalabra] = useState('')
  const [enfermedades, setEnfermedades] = useState([])
  const [loading, setLoading] = useState(false)

  const obtenerPalabra = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/palabra')
      const data = await response.json()
      setPalabra(data.palabra)
    } catch (error) {
      console.error('Error al obtener la palabra:', error)
      setPalabra('Error al conectar con el backend')
    } finally {
      setLoading(false)
    }
  }

  const obtenerEnfermedades = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/enfermedades')
      const data = await response.json()
      setEnfermedades(data.enfermedades)
    } catch (error) {
      console.error('Error al obtener enfermedades:', error)
      setEnfermedades([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sistema de Enfermedades
        </h1>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={obtenerPalabra}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Cargando...' : 'Obtener Palabra'}
            </button>

            <button
              onClick={obtenerEnfermedades}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Cargando...' : 'Ver Enfermedades'}
            </button>
          </div>

          {palabra && (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300">
              <p className="text-sm text-gray-600 mb-2">Respuesta del backend:</p>
              <p className="text-4xl font-bold text-gray-800 text-center">
                {palabra}
              </p>
            </div>
          )}

          {enfermedades.length > 0 && (
            <div className="mt-6 p-6 bg-white rounded-lg border-2 border-blue-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Enfermedades en la Base de Datos
              </h2>
              <div className="space-y-2">
                {enfermedades.map((enfermedad) => (
                  <div
                    key={enfermedad.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                  >
                    <span className="font-semibold text-blue-600">#{enfermedad.id}</span>
                    <span className="ml-3 text-gray-800">{enfermedad.nombre_enfermedad}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 text-center">
                Total: {enfermedades.length} enfermedad(es)
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Frontend: React + Vite + Tailwind</p>
          <p>Backend: FastAPI + PostgreSQL</p>
          <p>Proxy: Traefik</p>
        </div>
      </div>
    </div>
  )
}

export default App
