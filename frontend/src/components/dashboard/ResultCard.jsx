import { useState, useEffect } from 'react'
import ProgressRing from './ProgressRing'

/**
 * ResultCard - Pure visual component for displaying analysis results
 * Uses only Tailwind CSS classes
 */
const ResultCard = ({ result, animated = true }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 300)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [animated])

  if (!result) {
    return null
  }

  // Map confidence to visual indicator
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50'
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50'
    return 'text-orange-600 bg-orange-50'
  }

  const confidenceClass = getConfidenceColor(result.confidence)

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 relative overflow-hidden transition-all duration-500 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            Resultado Principal
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Diagnóstico más probable según IA médica
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${confidenceClass}`}>
          {Math.round(result.confidence * 100)}% confianza
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center space-x-6 relative z-10">
        {/* Icon */}
        <div className={`text-6xl transition-all duration-600 ${isVisible ? 'scale-100 rotate-0' : 'scale-0 -rotate-180'}`}>
          {result.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {result.simpleName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              {result.description}
            </p>
          </div>

          {/* Progress and percentage */}
          <div className="flex items-center space-x-6">
            <ProgressRing 
              percentage={result.probability}
              size={80}
              riskLevel={result.riskLevel}
              animated={isVisible}
            />
            
            <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Probabilidad</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {result.probability}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                de {result.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <div className={`mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 relative z-10 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Análisis completado</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>IA médica avanzada</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-400">Tipo de lesión</div>
            <div className="font-medium text-gray-600 dark:text-gray-300">{result.type.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Glow effect for high probability results */}
      {result.probability > 80 && (
        <div
          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none animate-pulse"
          style={{ 
            background: `radial-gradient(circle at center, ${
              result.riskLevel === 'high' ? '#EF4444' : 
              result.riskLevel === 'medium' ? '#F59E0B' : '#10B981'
            } 0%, transparent 70%)`,
            animationDuration: '3s'
          }}
        />
      )}
    </div>
  )
}

export default ResultCard
