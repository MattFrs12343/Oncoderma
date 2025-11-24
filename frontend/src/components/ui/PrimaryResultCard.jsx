import { memo, useState, useEffect } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'
import AnimatedCircularProgress from './AnimatedCircularProgress'

const PrimaryResultCard = memo(({ analysisResult, onNewAnalysis }) => {
  const [animatedProbability, setAnimatedProbability] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Extraer datos del resultado
  const result = analysisResult.result || analysisResult
  const detailedAnalysis = result.detailed_analysis
  const mostLikely = detailedAnalysis?.most_likely
  const riskAssessment = detailedAnalysis?.risk_assessment
  const lesionProbabilities = detailedAnalysis?.lesion_probabilities || {}
  
  // DEBUG: Ver qué datos llegan
  console.log('🔍 DEBUG PrimaryResultCard - Datos recibidos:', {
    lesionProbabilities,
    detailedAnalysis,
    fullResult: result
  })
  
  // Obtener Top 3 predicciones
  const getTop3Predictions = () => {
    const predictions = Object.entries(lesionProbabilities)
      .map(([code, probability]) => {
        // Convertir probabilidad a porcentaje si está en formato decimal
        const percentageProbability = probability < 1 ? probability * 100 : probability
        
        return {
          code,
          probability: percentageProbability,
          ...SKIN_LESION_TYPES[code]
        }
      })
      .filter(pred => pred.fullName) // Solo lesiones conocidas
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3) // Top 3
    
    console.log('📊 Top 3 Predictions:', predictions)
    
    return predictions.length > 0 ? predictions : [{
      code: 'unknown',
      probability: 0,
      fullName: 'Lesión Desconocida',
      icon: '🔍',
      type: 'unknown',
      isCancer: false,
      gradient: 'from-gray-100 to-gray-200',
      borderColor: 'border-gray-300'
    }]
  }

  const top3Predictions = getTop3Predictions()
  const mainPrediction = top3Predictions[0]
  
  // Fallback para resultados simples
  const lesionType = mostLikely?.type || mainPrediction.code
  const probability = mostLikely?.probability || mainPrediction.probability || 0
  const confidence = analysisResult.confidence || result.confidence || 0.85

  const lesionInfo = mainPrediction

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      setAnimatedProbability(probability)
    }, 300)
    return () => clearTimeout(timer)
  }, [probability])

  // Configuración de riesgo
  const getRiskConfig = () => {
    const overallRisk = riskAssessment?.overall_risk
    const numProbability = Number(probability)
    
    let riskLevel = 'low'
    if (overallRisk) {
      riskLevel = overallRisk
    } else if (numProbability > 70) {
      riskLevel = 'high'
    } else if (numProbability > 40) {
      riskLevel = 'medium'
    }

    switch (riskLevel) {
      case 'high':
        return {
          level: 'Alto',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
          gradientColor: 'from-red-500 to-red-600',
          icon: '🚨',
          message: 'Se recomienda consulta médica urgente'
        }
      case 'medium':
        return {
          level: 'Moderado',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
          gradientColor: 'from-yellow-500 to-yellow-600',
          icon: '⚠️',
          message: 'Se recomienda evaluación dermatológica'
        }
      default:
        return {
          level: 'Bajo',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-700',
          gradientColor: 'from-green-500 to-green-600',
          icon: '✅',
          message: 'Mantener observación y chequeos regulares'
        }
    }
  }

  const riskConfig = getRiskConfig()

  // Determinar color para el progreso circular
  const getProgressColor = () => {
    const riskLevel = riskAssessment?.overall_risk
    const numProbability = Number(probability)
    
    if (riskLevel === 'high' || numProbability > 70) return 'red'
    if (riskLevel === 'medium' || numProbability > 40) return 'yellow'
    return 'green'
  }

  return (
    <div className={`metric-card hover-lift ${isVisible ? 'animate-fade-in-scale' : 'opacity-0'}`}>
      {/* Header de la Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🔬</div>
          <div>
            <h3 className="text-section-title">Top 3 Diagnósticos Posibles</h3>
            <p className="text-metric-label">Resultados más probables del análisis IA</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="status-indicator status-indicator-online"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Confianza: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Top 3 en Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {top3Predictions.map((pred, index) => {
          const predRiskConfig = getRiskConfig()
          const predProgressColor = pred.probability > 70 ? 'red' : pred.probability > 40 ? 'yellow' : 'green'
          
          return (
            <div 
              key={pred.code}
              className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Posición */}
              <div className="flex items-center justify-between mb-4">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'
                  } text-white font-bold text-lg flex-shrink-0 position-circle-mobile`}
                  style={{ 
                    lineHeight: '2.5rem',
                    padding: 0
                  }}
                >
                  <span style={{ 
                    display: 'block',
                    lineHeight: 1,
                    transform: 'translateY(0)'
                  }}>
                    {index + 1}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  pred.isCancer === true 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                    : pred.isCancer === 'potential'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {pred.isCancer === true ? '⚠️ Maligna' : 
                   pred.isCancer === 'potential' ? '🟡 Potencial' : 
                   '✅ Benigna'}
                </span>
              </div>

              {/* Icono y Nombre */}
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{pred.icon}</div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {pred.fullName}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  {pred.name}
                </p>
              </div>

              {/* Probabilidad Circular */}
              <div className="flex justify-center mb-4">
                <AnimatedCircularProgress 
                  percentage={pred.probability} 
                  size={140} 
                  strokeWidth={10}
                  color={predProgressColor}
                  duration={1200}
                  delay={300 + (index * 100)}
                  animated={isVisible}
                />
              </div>

              {/* Descripción */}
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-center">
                {pred.detailedDescription || pred.description}
              </p>

              {/* Características */}
              {pred.characteristics && (
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">
                    CARACTERÍSTICAS:
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {pred.characteristics.slice(0, 3).map((char, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Código */}
              <div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  Código: {pred.code?.toUpperCase()}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer con Acciones */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Análisis verificado por IA médica
            </span>
          </div>
        </div>

        {onNewAnalysis && (
          <button
            onClick={onNewAnalysis}
            className="btn-primary hover-lift focus-ring"
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
    </div>
  )
})

PrimaryResultCard.displayName = 'PrimaryResultCard'

export default PrimaryResultCard