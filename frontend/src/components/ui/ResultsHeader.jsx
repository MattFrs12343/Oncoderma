import { memo } from 'react'

const ResultsHeader = memo(({ 
  analysisStatus = 'completed',
  processingTime = 0,
  confidence = 0.85,
  timestamp = new Date(),
  onNewAnalysis
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: '✅',
          text: 'Análisis Completado',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          indicatorColor: 'bg-green-500'
        }
      case 'processing':
        return {
          icon: '⏳',
          text: 'Procesando...',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          indicatorColor: 'bg-yellow-500'
        }
      case 'error':
        return {
          icon: '❌',
          text: 'Error en Análisis',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          indicatorColor: 'bg-red-500'
        }
      default:
        return {
          icon: '📊',
          text: 'Análisis IA',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-700',
          indicatorColor: 'bg-blue-500'
        }
    }
  }

  const statusConfig = getStatusConfig(analysisStatus)
  const confidencePercentage = Math.round(confidence * 100)
  
  const formatTime = (seconds) => {
    if (seconds < 1) return '< 1s'
    if (seconds < 60) return `${seconds.toFixed(1)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`
  }

  const formatTimestamp = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="metric-card animate-fade-in-up">
      {/* Header Principal */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-3 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusConfig.indicatorColor} ${analysisStatus === 'processing' ? 'animate-pulse-soft' : ''}`}></div>
          </div>
          
          <div>
            <h2 className="text-section-title">Resultados del Análisis IA</h2>
            <p className="text-metric-label">Análisis dermatológico con inteligencia artificial</p>
          </div>
        </div>

        {onNewAnalysis && (
          <button
            onClick={onNewAnalysis}
            className="btn-secondary hover-lift focus-ring"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Nuevo Análisis</span>
            </div>
          </button>
        )}
      </div>

      {/* Métricas del Análisis */}
      <div className="metric-grid">
        {/* Estado del Análisis */}
        <div className={`p-4 rounded-xl border-2 ${statusConfig.bgColor} ${statusConfig.borderColor} animate-fade-in-scale animate-delay-100`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-metric-label">Estado</span>
            <span className="text-2xl">{statusConfig.icon}</span>
          </div>
          <div className={`font-semibold ${statusConfig.color}`}>
            {statusConfig.text}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatTimestamp(timestamp)}
          </div>
        </div>

        {/* Tiempo de Procesamiento */}
        <div className="p-4 rounded-xl border-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 animate-fade-in-scale animate-delay-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-metric-label">Tiempo</span>
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 animate-count-up">
            {formatTime(processingTime)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Procesamiento IA
          </div>
        </div>

        {/* Confianza del Modelo */}
        <div className="p-4 rounded-xl border-2 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 animate-fade-in-scale animate-delay-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-metric-label">Confianza</span>
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 animate-count-up">
            {confidencePercentage}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Modelo IA */}
        <div className="p-4 rounded-xl border-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 animate-fade-in-scale animate-delay-400">
          <div className="flex items-center justify-between mb-2">
            <span className="text-metric-label">Modelo IA</span>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            DermaNet v2.1
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Modelo especializado
          </div>
        </div>
      </div>

      {/* Breadcrumb del Proceso */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-metric-label">Proceso Completado</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Análisis médico certificado
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-3">
          {/* Paso 1: Carga */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Imagen Cargada</span>
          </div>

          <div className="flex-1 h-0.5 bg-green-500"></div>

          {/* Paso 2: Procesamiento */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">IA Procesada</span>
          </div>

          <div className="flex-1 h-0.5 bg-green-500"></div>

          {/* Paso 3: Resultados */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Resultados Listos</span>
          </div>
        </div>
      </div>
    </div>
  )
})

ResultsHeader.displayName = 'ResultsHeader'

export default ResultsHeader