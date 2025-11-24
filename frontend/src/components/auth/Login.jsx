import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import { validateRequired } from '../../utils/validators'
import AdaptiveLogo from '../ui/AdaptiveLogo'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/home'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Optimizar handleInputChange con useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar errores de forma optimizada
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    if (generalError) {
      setGeneralError('')
    }
  }, [errors, generalError])

  // Validación optimizada y memoizada
  const validateForm = useCallback(() => {
    const newErrors = {}

    // Validar usuario
    const usernameValidation = validateRequired(formData.username, 'Usuario')
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error
    }

    // Validar contraseña
    const passwordValidation = validateRequired(formData.password, 'Contraseña')
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData.username, formData.password])

  // Handler optimizado con feedback inmediato
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    // ✅ FEEDBACK INMEDIATO: Cambiar estado ANTES de cualquier validación
    setLoading(true)
    setGeneralError('')

    // ✅ Usar requestIdleCallback o setTimeout para no bloquear UI
    // requestAnimationFrame es para animaciones, usamos setTimeout(0) para tareas async
    setTimeout(async () => {
      try {
        // Validación rápida
        const isValid = validateForm()
        
        if (!isValid) {
          setLoading(false)
          return
        }

        // Login asíncrono
        const result = await login(formData.username, formData.password)
        
        if (result.success) {
          // Navegación diferida para no bloquear
          const from = location.state?.from?.pathname || '/'
          requestAnimationFrame(() => {
            navigate(from, { replace: true })
          })
        } else {
          setGeneralError(result.message || 'Error de autenticación')
          setLoading(false)
        }
      } catch (error) {
        console.error('Login error:', error)
        setGeneralError('Error de conexión. Inténtalo de nuevo.')
        setLoading(false)
      }
    }, 0)
  }, [formData, validateForm, login, location, navigate])

  // Memoizar si el formulario es válido para deshabilitar botón
  const isFormValid = useMemo(() => {
    return formData.username.trim() !== '' && formData.password.trim() !== ''
  }, [formData.username, formData.password])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-secondary/20 to-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Toggle de tema (optimizado para móvil) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-1.5 sm:p-2 shadow-lg border border-white/30 dark:border-gray-700/50">
          <button
            onClick={toggleTheme}
            className="relative p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:bg-white/20 dark:hover:bg-gray-700/30 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
            title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
          >
            {isDark ? (
              // Icono de sol para modo oscuro
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
              // Icono de luna para modo claro
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 min-h-screen flex">
        {/* Panel izquierdo - Información (solo desktop) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center pl-16 pr-8">
          <div className="max-w-md ml-auto">
            <div className="mb-8">
              <AdaptiveLogo className="h-20 w-auto mb-6" alt="OncoDerma" />
              <h1 className="text-4xl font-bold text-primary mb-4">
                Bienvenido a OncoDerma
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Análisis de piel con inteligencia artificial para la detección temprana de anomalías.
              </p>
            </div>

            {/* Características destacadas */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Análisis Rápido</h3>
                  <p className="text-sm text-gray-600">Resultados en menos de 30 segundos</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">100% Seguro</h3>
                  <p className="text-sm text-gray-600">Tus datos están protegidos</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">IA Avanzada</h3>
                  <p className="text-sm text-gray-600">95% de precisión en análisis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario (optimizado para móvil) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:pl-8 lg:pr-16 py-8 lg:py-12">
          <div className="w-full max-w-md lg:mr-auto">
            {/* Logo y título móvil */}
            <div className="lg:hidden text-center mb-6">
              <AdaptiveLogo className="h-12 w-auto mx-auto mb-3 logo-mobile-login" alt="OncoDerma" />
              <h2 className="text-xl font-bold text-primary">Iniciar Sesión</h2>
            </div>

            {/* Card del formulario */}
            <div className="card p-6 sm:p-8">
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">Iniciar Sesión</h2>
                <p className="text-gray-600 text-sm">Accede a tu cuenta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Campo Usuario */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg 
                        className="h-5 w-5 text-gray-400 dark:text-gray-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                        errors.username 
                          ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-600/10' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                      } focus:outline-none`}
                      placeholder="Ingresa tu usuario"
                      disabled={loading}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center mt-1.5">
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg 
                        className="h-5 w-5 text-gray-400 dark:text-gray-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3.5 text-base rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                        errors.password 
                          ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-600/10' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                      } focus:outline-none`}
                      placeholder="Ingresa tu contraseña"
                      disabled={loading}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 flex items-center mt-1.5">
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Error general */}
                {generalError && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">{generalError}</p>
                    </div>
                  </div>
                )}

                {/* Botón de submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-submit-optimized w-full bg-gradient-to-r from-accent to-secondary text-white font-semibold py-3 sm:py-3.5 px-6 rounded-lg min-h-[48px] ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                      <span className="text-sm sm:text-base">Iniciando sesión...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-sm sm:text-base">Iniciar Sesión</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              {/* Disclaimer */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Esta aplicación es una herramienta de apoyo y no reemplaza el diagnóstico médico profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login