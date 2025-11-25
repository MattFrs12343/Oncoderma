import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

const Login = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Credenciales estáticas
  const STATIC_USERNAME = 'Matias'
  const STATIC_PASSWORD = '1234'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simular delay de autenticación
    setTimeout(() => {
      if (formData.username === STATIC_USERNAME && formData.password === STATIC_PASSWORD) {
        // Login exitoso
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('username', formData.username)
        navigate('/')
      } else {
        setError('Usuario o contraseña incorrectos')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative ${
      theme === 'dark' ? 'bg-slate-900' : 'bg-gray-100'
    }`}>
      {/* Botón de tema */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-xl transition-all ${
          theme === 'dark' 
            ? 'bg-slate-800 border border-gray-700 hover:bg-slate-700' 
            : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
        }`}
        aria-label="Cambiar tema"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:items-start">
        {/* Lado izquierdo - Información */}
        <div className="hidden lg:block px-8">
          <div className="flex flex-col items-center mb-12">
            <img 
              src={theme === 'light' ? '/img/OncoDerma-Logo.png' : '/img/DarckLogoOscuro.png'} 
              alt="OncoDerma" 
              className="h-20 w-auto"
            />
          </div>

          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Bienvenido a OncoDerma
          </h1>
          <p className={`text-base mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Análisis de piel con inteligencia artificial para la detección temprana de anomalías.
          </p>

          <div className="space-y-5">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Análisis Rápido
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Resultados en menos de 30 segundos
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  100% Seguro
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Tus datos están protegidos
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  IA Avanzada
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  95% de precisión en análisis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Formulario */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Logo para móvil */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <img 
              src={theme === 'light' ? '/img/OncoDerma-Logo.png' : '/img/DarckLogoOscuro.png'} 
              alt="OncoDerma" 
              className="h-16 w-auto mb-4"
            />
            <h1 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Bienvenido a OncoDerma
            </h1>
          </div>

          <div className={`rounded-xl p-8 border ${
            theme === 'dark' ? 'bg-slate-800/50 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Iniciar Sesión
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    placeholder="Usuario"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>


          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
