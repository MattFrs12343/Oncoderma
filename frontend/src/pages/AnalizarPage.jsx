import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { apiService } from '../services/apiService'
import { imageProcessor } from '../utils/imageProcessor'
import Stepper from '../components/ui/Stepper'
import PatientForm from '../components/ui/PatientForm'
import PatientDataReview from '../components/ui/PatientDataReview'
import ImageUploadZone from '../components/ui/ImageUploadZone'
import HistorySection from '../components/ui/HistorySection'
import Alert from '../components/Alert'

const AnalizarPage = () => {
  const { token } = useAuth()
  const { theme } = useTheme()
  const fileInputRef = useRef(null)
  const resultsRef = useRef(null)
  const step2Ref = useRef(null)

  // Stepper state
  const [currentStep, setCurrentStep] = useState(0)
  const [isCondensed, setIsCondensed] = useState(false)

  const [formData, setFormData] = useState({
    file: null,
    nombre: '',
    age: '',
    sex: '',
    anatom_site_general: '',
    ci: '',
    complemento: '',
    telefono: '',
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [imageMetadata, setImageMetadata] = useState(null)

  // Steps configuration
  const steps = [
    { label: 'Datos del Paciente' },
    { label: 'Revisión y Análisis' },
    { label: 'Resultados' },
  ]

  // Scroll automático a los resultados cuando estén disponibles
  useEffect(() => {
    if (results && resultsRef.current) {
      setTimeout(() => {
        const elementPosition = resultsRef.current.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - 80
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }, 100)
    }
  }, [results])

  // Handle scroll for condensing animation in Step 2
  useEffect(() => {
    if (currentStep !== 1) return

    const handleScroll = () => {
      if (step2Ref.current) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        setIsCondensed(scrollTop > 200)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentStep])

  // Opciones para los selects
  const sexOptions = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
  ]

  const anatomSiteOptions = [
    { value: 'anterior torso', label: 'Torso anterior' },
    { value: 'posterior torso', label: 'Torso posterior' },
    { value: 'head/neck', label: 'Cabeza/Cuello' },
    { value: 'upper extremity', label: 'Extremidad superior' },
    { value: 'lower extremity', label: 'Extremidad inferior' },
    { value: 'palms/soles', label: 'Palmas/Plantas' },
    { value: 'oral/genital', label: 'Oral/Genital' },
  ]

  // Mapeo de clases a nombres legibles y detalles
  const diseaseInfo = {
    'MEL': {
      name: 'Melanoma',
      scientificName: 'Melanoma',
      status: 'Maligno',
      description: 'Tipo de cáncer de piel que se desarrolla en los melanocitos',
      characteristics: ['Asimetría', 'Bordes irregulares', 'Color variado', 'Diámetro > 6mm']
    },
    'NV': {
      name: 'Nevus melanocítico',
      scientificName: 'Melanocytic Nevus',
      status: 'Benigno',
      description: 'Lunar común, generalmente inofensivo',
      characteristics: ['Simétrico', 'Bordes definidos', 'Color uniforme', 'Estable']
    },
    'BCC': {
      name: 'Carcinoma basocelular',
      scientificName: 'Basal Cell Carcinoma',
      status: 'Maligno',
      description: 'Tipo más común de cáncer de piel, crecimiento lento',
      characteristics: ['Lesión perlada', 'Vasos sanguíneos visibles', 'Úlcera central', 'Crecimiento lento']
    },
    'BKL': {
      name: 'Lesión tipo queratosis benigna',
      scientificName: 'Benign Keratosis-like Lesion',
      status: 'Benigno',
      description: 'Crecimiento benigno de la piel, común en adultos',
      characteristics: ['Superficie verrugosa', 'Color marrón', 'Bien delimitada', 'No invasiva']
    },
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar imagen
    const validation = imageProcessor.validateImage(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError('')
    setFormData({ ...formData, file })

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Analizar metadatos
    try {
      const metadata = await imageProcessor.analyzeMetadata(file)
      setImageMetadata(metadata)
    } catch (err) {
      console.error('Error al analizar metadatos:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    // Validación del formulario ya está manejada por HTML5 required
    // Avanzar al Step 2
    setCurrentStep(1)
    setError('')
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnalyze = async () => {
    setError('')
    setResults(null)
    setLoading(true)

    try {
      // Crear FormData para enviar al backend
      const data = new FormData()
      data.append('file', formData.file)
      data.append('age', formData.age)
      data.append('sex', formData.sex)
      data.append('anatom_site_general', formData.anatom_site_general)

      // Enviar a la API
      const response = await apiService.analyzeImage(data, token)

      if (response.success) {
        setResults(response.data)
        // Transición a STIP 3 después de obtener resultados
        setTimeout(() => {
          setCurrentStep(2)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 300)
      } else {
        setError(response.message || 'Error al analizar la imagen')
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Función para probar STIP 3 con datos mock
  const handleTestStep3 = () => {
    // Generar diferentes escenarios de prueba aleatoriamente
    const scenarios = [
      // Escenario 1: Caso benigno claro
      {
        top3: [
          { class: 'NV', prob: 0.78 },
          { class: 'BKL', prob: 0.15 },
          { class: 'MEL', prob: 0.05 }
        ]
      },
      // Escenario 2: Caso con melanoma probable
      {
        top3: [
          { class: 'MEL', prob: 0.65 },
          { class: 'NV', prob: 0.25 },
          { class: 'BCC', prob: 0.08 }
        ]
      },
      // Escenario 3: Caso con carcinoma basocelular
      {
        top3: [
          { class: 'BCC', prob: 0.72 },
          { class: 'BKL', prob: 0.18 },
          { class: 'NV', prob: 0.08 }
        ]
      },
      // Escenario 4: Caso con queratosis benigna
      {
        top3: [
          { class: 'BKL', prob: 0.82 },
          { class: 'NV', prob: 0.12 },
          { class: 'BCC', prob: 0.04 }
        ]
      },
      // Escenario 5: Caso ambiguo (probabilidades similares)
      {
        top3: [
          { class: 'NV', prob: 0.42 },
          { class: 'MEL', prob: 0.38 },
          { class: 'BKL', prob: 0.18 }
        ]
      }
    ]
    
    // Seleccionar un escenario aleatorio
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
    
    setResults(randomScenario)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setFormData({
      file: null,
      nombre: '',
      age: '',
      sex: '',
      anatom_site_general: '',
      ci: '',
      complemento: '',
      telefono: '',
    })
    setPreview(null)
    setResults(null)
    setError('')
    setImageMetadata(null)
    setCurrentStep(0)
    setIsCondensed(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setCurrentStep(0)
    setIsCondensed(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageSelectStep2 = async (file) => {
    // Validar imagen
    const validation = imageProcessor.validateImage(file)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError('')
    setFormData({ ...formData, file })

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Analizar metadatos
    try {
      const metadata = await imageProcessor.analyzeMetadata(file)
      setImageMetadata(metadata)
    } catch (err) {
      console.error('Error al analizar metadatos:', err)
    }
  }

  return (
    <div className={`min-h-screen py-6 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Análisis de Imagen
          </h1>
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentStep === 0
              ? 'Completa los datos del paciente para continuar'
              : 'Revisa los datos y sube la imagen para analizar'}
          </p>
        </div>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Step 1: Patient Form */}
        {currentStep === 0 && (
          <div className="w-full">
            <PatientForm
              formData={formData}
              error={error}
              loading={loading}
              sexOptions={sexOptions}
              anatomSiteOptions={anatomSiteOptions}
              onChange={handleChange}
              onSubmit={handleFormSubmit}
              onReset={handleReset}
              submitButtonText="Siguiente"
            />
          </div>
        )}

        {/* Step 2: Review and Analysis */}
        {currentStep === 1 && (
          <div ref={step2Ref} className="space-y-4 max-w-4xl mx-auto">
            {/* 1. Datos del Paciente */}
            <PatientDataReview
              formData={formData}
              sexOptions={sexOptions}
              anatomSiteOptions={anatomSiteOptions}
            />

            {/* 2. Imagen de la Lesión */}
            <div
              className={`
                rounded-xl p-5 border
                ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-md'}
              `}
            >
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className={`
                    p-2 rounded-lg shadow-sm
                    ${theme === 'dark' 
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-600/20' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                    }
                  `}
                >
                  <svg 
                    className={`
                      w-4 h-4
                      ${theme === 'dark' ? 'text-purple-400' : 'text-white'}
                    `} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Imagen de la Lesión
                </h3>
              </div>
              
              <ImageUploadZone
                onImageSelect={handleImageSelectStep2}
                preview={preview}
                imageMetadata={imageMetadata}
              />

              {error && (
                <Alert type="error" message={error} onClose={() => setError('')} className="mt-4" />
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className={`
                    px-6 py-2.5 rounded-lg border-2 font-semibold transition-all
                    ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !formData.file}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analizando...' : 'Analizar Imagen'}
                </button>
                {/* Botón de prueba para ver STIP 3 */}
                <button
                  onClick={handleTestStep3}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all"
                  title="Ver STIP 3 con datos de prueba"
                >
                  🧪 Test
                </button>
              </div>
            </div>

            {/* 3. Historial de Análisis */}
            <HistorySection />

            {/* Results Section (cuando haya resultados) */}
            {loading && (
              <div
                className={`
                  rounded-xl p-8 border
                  ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-md'}
                `}
              >
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Analizando imagen...
                  </p>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Esto puede tomar unos segundos
                  </p>
                </div>
              </div>
            )}


          </div>
        )}

        {/* STEP 3: Resultados del Análisis */}
        {currentStep === 2 && results && (
          <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
            {/* 1️⃣ HISTORIAL DE ANÁLISIS - PRIMERO */}
            <HistorySection />

            {/* 2️⃣ TOP 3 DIAGNÓSTICOS - VERTICAL CON DONAS ANIMADAS */}
            <div
              className={`
                rounded-xl sm:rounded-2xl p-4 sm:p-6 border
                ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-lg'}
              `}
            >
              {/* Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-6">
                <div className={`p-1.5 sm:p-2 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20' : 'bg-gradient-to-br from-cyan-100 to-blue-100'}`}>
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Top 3 Diagnósticos Posibles
                </h2>
              </div>

              {/* Tarjetas HORIZONTALES en desktop, VERTICALES en mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
                {results.top3.map((result, index) => {
                  const info = diseaseInfo[result.class]
                  const isHighRisk = info.status === 'Maligno'
                  const percentage = (result.prob * 100).toFixed(1)
                  
                  // Colores para cada posición
                  const positionColors = [
                    { 
                      number: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700',
                      donut: isHighRisk ? ['#f97316', '#f59e0b'] : ['#3b82f6', '#06b6d4']
                    },
                    { 
                      number: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700',
                      donut: isHighRisk ? ['#f97316', '#f59e0b'] : ['#a855f7', '#ec4899']
                    },
                    { 
                      number: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
                      donut: isHighRisk ? ['#f97316', '#f59e0b'] : ['#10b981', '#14b8a6']
                    }
                  ]
                  
                  const colors = positionColors[index]
                  // Calcular correctamente el strokeDashoffset para que se llene SOLO hasta el porcentaje
                  const radius = 60
                  const circumference = 2 * Math.PI * radius
                  const strokeDashoffset = circumference - (result.prob * circumference)
                  
                  return (
                    <div
                      key={index}
                      className={`
                        relative p-3 sm:p-4 lg:p-5 rounded-xl border-2 transition-all duration-300
                        ${theme === 'dark' 
                          ? 'bg-[#0f1419] border-gray-700/50 hover:border-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'}
                      `}
                      role="article"
                      aria-label={`Diagnóstico ${index + 1}: ${info.name}`}
                    >
                      {/* Layout VERTICAL centrado */}
                      <div className="flex flex-col items-center text-center">
                        {/* Header: Número y Estado */}
                        <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
                          <div className={`
                            w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-lg sm:text-xl
                            ${colors.number}
                          `}>
                            #{index + 1}
                          </div>
                          
                          <span className={`
                            px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold
                            ${isHighRisk 
                              ? theme === 'dark' ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                              : theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}
                          `}>
                            {info.status}
                          </span>
                        </div>

                        {/* DONA ANIMADA - Optimizada para móvil y desktop */}
                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mb-4 mx-auto">
                          <svg 
                            viewBox="0 0 160 160" 
                            className="w-full h-full transform -rotate-90"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            {/* Círculo de fondo */}
                            <circle
                              cx="80"
                              cy="80"
                              r={radius}
                              stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'}
                              strokeWidth="10"
                              fill="none"
                            />
                            {/* Círculo de progreso animado - SE LLENA SOLO HASTA EL PORCENTAJE */}
                            <circle
                              cx="80"
                              cy="80"
                              r={radius}
                              stroke={`url(#gradient-${index})`}
                              strokeWidth="10"
                              fill="none"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={colors.donut[0]} />
                                <stop offset="100%" stopColor={colors.donut[1]} />
                              </linearGradient>
                            </defs>
                          </svg>
                          {/* Porcentaje en el centro */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-2xl sm:text-3xl lg:text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {percentage}%
                            </span>
                            <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              Probabilidad
                            </span>
                          </div>
                        </div>

                        {/* Nombre */}
                        <h3 className={`text-base sm:text-lg lg:text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {info.name}
                        </h3>
                        
                        {/* Nombre científico */}
                        <p className={`text-[10px] sm:text-xs italic mb-2 sm:mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          {info.scientificName}
                        </p>
                        
                        {/* Descripción - Más compacta */}
                        <p className={`text-[11px] sm:text-xs lg:text-sm mb-2 sm:mb-3 leading-relaxed line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {info.description}
                        </p>
                        
                        {/* Características - Más compactas */}
                        <div className="w-full">
                          <p className={`text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Características:
                          </p>
                          <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
                            {info.characteristics.slice(0, 3).map((char, idx) => (
                              <span
                                key={idx}
                                className={`
                                  px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-medium
                                  ${theme === 'dark' 
                                    ? 'bg-gray-800 text-gray-400 border border-gray-700' 
                                    : 'bg-white text-gray-700 border border-gray-300'}
                                `}
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Código */}
                        <div className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t w-full ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                          <span className={`text-[10px] sm:text-xs font-mono font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Código: {result.class}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Botones de Acción */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="w-full sm:flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  🔄 Realizar Nuevo Análisis
                </button>
                <button
                  onClick={() => window.print()}
                  className={`
                    w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition-all border-2 text-sm sm:text-base
                    ${theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  🖨️ Imprimir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalizarPage
