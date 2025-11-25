import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { apiService } from '../services/apiService'
import { imageProcessor } from '../utils/imageProcessor'
import { useAnalysisAnimation } from '../hooks/useAnalysisAnimation'
import Stepper from '../components/ui/Stepper'
import PatientForm from '../components/ui/PatientForm'
import PatientDataReview from '../components/ui/PatientDataReview'
import ImageUploadZone from '../components/ui/ImageUploadZone'
import AnimatedImageUploadBox from '../components/ui/AnimatedImageUploadBox'
import AnimatedResultsSection from '../components/ui/AnimatedResultsSection'
import HistorySection from '../components/ui/HistorySection'
import Alert from '../components/Alert'
import '../components/ui/HistorySection.css' // Importar CSS para la nueva sección

const AnalizarPage = () => {
  const { token } = useAuth()
  const { theme } = useTheme()
  const fileInputRef = useRef(null)
  const resultsRef = useRef(null)
  const step2Ref = useRef(null)

  // Animation hook
  const {
    animationPhase,
    imageBoxVisible,
    resultsVisible,
    historyHeaderRef,
    errorRef,
    startAnalysis,
    completeAnalysis,
    handleError: handleAnimationError,
    reset: resetAnimation,
  } = useAnalysisAnimation()

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

  // Mock data para historial
  const mockHistory = [
    {
      id: 1,
      date: '2024-01-15',
      time: '14:30',
      age: 45,
      sex: 'Femenino',
      location: 'Torso anterior',
      result: 'Nevus (lunar benigno)',
      probability: 89.5,
      status: 'completed',
      top3: [
        { class: 'NV', prob: 0.895 },
        { class: 'BKL', prob: 0.078 },
        { class: 'MEL', prob: 0.027 }
      ]
    },
    {
      id: 2,
      date: '2024-01-10',
      time: '10:15',
      age: 52,
      sex: 'Masculino',
      location: 'Cabeza/Cuello',
      result: 'Queratosis benigna',
      probability: 76.3,
      status: 'completed',
      top3: [
        { class: 'BKL', prob: 0.763 },
        { class: 'NV', prob: 0.182 },
        { class: 'BCC', prob: 0.055 }
      ]
    },
    {
      id: 3,
      date: '2024-01-05',
      time: '16:45',
      age: 38,
      sex: 'Femenino',
      location: 'Extremidad superior',
      result: 'Nevus (lunar benigno)',
      probability: 92.1,
      status: 'completed',
      top3: [
        { class: 'NV', prob: 0.921 },
        { class: 'BKL', prob: 0.065 },
        { class: 'MEL', prob: 0.014 }
      ]
    },
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
    startAnalysis() // Iniciar animación

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
        setCurrentStep(2)
        
        // Completar animación de transición
        setTimeout(() => {
          completeAnalysis()
        }, 100) // Pequeño delay para que el spinner sea visible
      } else {
        setError(response.message || 'Error al analizar la imagen')
        handleAnimationError()
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.')
      handleAnimationError()
    } finally {
      setLoading(false)
    }
  }

  // Función para probar STEP 3 con datos mock
  const handleTestStep3 = () => {
    setLoading(true)
    startAnalysis() // Iniciar animación
    
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
    
    // Simular delay de análisis
    setTimeout(() => {
      setResults(randomScenario)
      setLoading(false)
      setCurrentStep(2)
      
      // Completar animación de transición
      setTimeout(() => {
        completeAnalysis()
      }, 100)
    }, 1500) // Simular 1.5 segundos de análisis
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
    resetAnimation() // Reset animation state
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
            {/* Aria-live region for accessibility */}
            <div 
              role="status" 
              aria-live="polite" 
              aria-atomic="true"
              className="sr-only"
            >
              {animationPhase === 'analyzing' && 'Analizando imagen...'}
              {animationPhase === 'complete' && 'Análisis completado'}
              {animationPhase === 'error' && 'Error en el análisis'}
            </div>

            {/* 1. Datos del Paciente */}
            <PatientDataReview
              formData={formData}
              sexOptions={sexOptions}
              anatomSiteOptions={anatomSiteOptions}
            />

            {/* 2. Imagen de la Lesión - Con animación */}
            <AnimatedImageUploadBox
              isVisible={imageBoxVisible}
              animationPhase={animationPhase}
            >
              <ImageUploadZone
                onImageSelect={handleImageSelectStep2}
                preview={preview}
                imageMetadata={imageMetadata}
                isAnalyzing={loading}
              />

              {error && (
                <Alert 
                  ref={errorRef}
                  type="error" 
                  message={error} 
                  onClose={() => setError('')} 
                  className="mt-4" 
                  tabIndex={-1}
                />
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={loading || animationPhase === 'transitioning'}
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
                  disabled={loading || !formData.file || animationPhase === 'transitioning'}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analizando...' : 'Analizar Imagen'}
                </button>
                {/* Botón de prueba para ver STEP 3 */}
                <button
                  onClick={handleTestStep3}
                  disabled={loading || animationPhase === 'transitioning'}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all disabled:opacity-50"
                  title="Ver STEP 3 con datos de prueba"
                >
                  🧪 Test
                </button>
              </div>
            </AnimatedImageUploadBox>

            {/* 3. Historial de Análisis - Con animación */}
            <AnimatedResultsSection
              isVisible={resultsVisible}
              animationPhase={animationPhase}
              historyHeaderRef={historyHeaderRef}
            >
              <HistorySection />
            </AnimatedResultsSection>

            {/* 4. Nueva Sección: Historial de Análisis Completo */}
            <div className={`history-section-container ${theme === 'light' ? 'light' : ''}`}>
              {/* Header de la nueva sección */}
              <div className={`history-section-header ${theme === 'light' ? 'light' : ''}`} style={{ cursor: 'default' }}>
                <div className="history-header-content">
                  <div className="history-icon-container">
                    <svg className="history-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className={`history-title ${theme === 'light' ? 'light' : ''}`}>
                    Historial de Análisis
                  </h3>
                  <span className={`history-badge ${theme === 'light' ? 'light' : ''}`}>
                    Datos mock
                  </span>
                </div>
              </div>

              {/* Contenido del historial */}
              <div className="history-items-container">
                <div className="history-items-list">
                  {mockHistory.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className={`history-item-card ${theme === 'light' ? 'light' : ''}`}
                    >
                      {/* Layout responsive */}
                      <div className="history-item-layout">
                        {/* Información principal */}
                        <div className="history-item-main">
                          {/* Fecha y hora */}
                          <div className="history-item-date-row">
                            <div className={`history-status-dot ${item.status === 'completed' ? 'completed' : 'pending'}`} />
                            <span className={`history-date-text ${theme === 'light' ? 'light' : ''}`}>
                              {item.date} • {item.time}
                            </span>
                            <span className={`history-probability-mobile ${theme === 'light' ? 'light' : ''}`}>
                              {item.probability}%
                            </span>
                          </div>

                          {/* Diagnóstico principal */}
                          <div className="history-diagnosis-section">
                            <div className="history-diagnosis-row">
                              <p className={`history-diagnosis-name ${theme === 'light' ? 'light' : ''}`}>
                                {item.result}
                              </p>
                              <span className={`history-probability-desktop ${theme === 'light' ? 'light' : ''}`}>
                                {item.probability}%
                              </span>
                            </div>
                          </div>

                          {/* Datos del paciente */}
                          <p className={`history-patient-info ${theme === 'light' ? 'light' : ''}`}>
                            {item.age} años • {item.sex} • {item.location}
                          </p>
                        </div>

                        {/* Top 3 Diagnósticos */}
                        <div className={`history-top3-section ${theme === 'light' ? 'light' : ''}`}>
                          <p className={`history-top3-title ${theme === 'light' ? 'light' : ''}`}>
                            Probabilidades estimadas por la IA (Top 3 diagnósticos)
                          </p>
                          
                          <div className="history-donuts-grid">
                            {item.top3.map((result, index) => {
                              const info = diseaseInfo[result.class]
                              const isHighRisk = info.status === 'Maligno'
                              const percentage = (result.prob * 100).toFixed(1)
                              const colors = isHighRisk ? ['#f97316', '#f59e0b'] : ['#10b981', '#14b8a6']
                              const radius = 15.9155
                              const circumference = 2 * Math.PI * radius
                              const strokeDashoffset = circumference * (1 - result.prob)

                              return (
                                <div key={`${itemIndex}-${index}`} className="mini-donut-container">
                                  {/* Abreviación arriba de la dona */}
                                  <div className={`mini-donut-abbr ${theme === 'light' ? 'light' : ''}`}>
                                    {result.class}
                                  </div>
                                  
                                  <div className={`mini-donut-chart ${index === 0 ? 'primary' : ''} ${isHighRisk ? 'malignant' : 'benign'} ${theme === 'light' ? 'light' : ''}`}>
                                    <svg viewBox="0 0 36 36" className={`mini-donut-svg ${index === 0 ? 'primary' : ''}`}>
                                      <circle cx="18" cy="18" r={radius} stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'} strokeWidth="3" fill="none" />
                                      <circle
                                        cx="18" cy="18" r={radius}
                                        stroke={`url(#gradient-${itemIndex}-${index})`}
                                        strokeWidth="3" fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                      />
                                      <defs>
                                        <linearGradient id={`gradient-${itemIndex}-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                          <stop offset="0%" stopColor={colors[0]} />
                                          <stop offset="100%" stopColor={colors[1]} />
                                        </linearGradient>
                                      </defs>
                                    </svg>
                                    <div className={`mini-donut-percentage ${theme === 'light' ? 'light' : ''}`}>
                                      <span>{percentage}%</span>
                                    </div>
                                  </div>
                                  <p className={`mini-donut-label ${theme === 'light' ? 'light' : ''}`}>
                                    {info.name}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                          
                          <div className="history-legend">
                            <div className="history-legend-item">
                              <div className="history-legend-dot benign"></div>
                              <span className={`history-legend-text ${theme === 'light' ? 'light' : ''}`}>Benigno</span>
                            </div>
                            <div className="history-legend-item">
                              <div className="history-legend-dot malignant"></div>
                              <span className={`history-legend-text ${theme === 'light' ? 'light' : ''}`}>Maligno</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Resultados del Análisis - OPTIMIZADO: Layout compacto sin scroll */}
        {currentStep === 2 && results && (
          <div className="max-w-5xl mx-auto space-y-4 animate-fade-in-up" style={{ maxHeight: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
            {/* HISTORIAL DE ANÁLISIS */}
            <div style={{ flex: 1, minHeight: 0 }}>
              <HistorySection />
            </div>

            {/* Botones de Acción - COMPACTOS */}
            <div
              className={`
                rounded-xl p-3 sm:p-4 border flex-shrink-0
                ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-lg'}
              `}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleReset}
                  className="w-full sm:flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                >
                  🔄 Realizar Nuevo Análisis
                </button>
                <button
                  onClick={() => window.print()}
                  className={`
                    w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold transition-all border-2 text-sm
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
