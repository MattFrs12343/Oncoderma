import { memo, useState } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'
import AnimatedProgressBar from './AnimatedProgressBar'

const LesionComparisonCard = memo(({ 
  lesion, 
  index, 
  isSelected = false, 
  isMainDiagnosis = false,
  onSelect,
  onToggleDetails,
  showDetails = false,
  animatedProbability = 0,
  comparisonMode = false
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getCancerInfo = (isCancer) => {
    if (isCancer === true) return { 
      icon: '⚠️', 
      text: 'Maligna', 
      color: 'red',
      bgClass: 'bg-red-500',
      textClass: 'text-white',
      borderClass: 'border-red-500'
    }
    if (isCancer === 'potential') return { 
      icon: '🟡', 
      text: 'Potencial', 
      color: 'yellow',
      bgClass: 'bg-yellow-500',
      textClass: 'text-white',
      borderClass: 'border-yellow-500'
    }
    return { 
      icon: '✅', 
      text: 'Benigna', 
      color: 'green',
      bgClass: 'bg-green-500',
      textClass: 'text-white',
      borderClass: 'border-green-500'
    }
  }

  const getRiskLevel = () => {
    if (lesion.isCancer === true || lesion.probability > 70) return 'high'
    if (lesion.isCancer === 'potential' || lesion.probability > 40) return 'medium'
    return 'low'
  }

  const getRiskConfig = () => {
    const level = getRiskLevel()
    switch (level) {
      case 'high':
        return {
          bgClass: 'bg-red-50 dark:bg-red-900/20',
          borderClass: 'border-red-200 dark:border-red-700',
          textClass: 'text-red-600 dark:text-red-400'
        }
      case 'medium':
        return {
          bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderClass: 'border-yellow-200 dark:border-yellow-700',
          textClass: 'text-yellow-600 dark:text-yellow-400'
        }
      default:
        return {
          bgClass: 'bg-green-50 dark:bg-green-900/20',
          borderClass: 'border-green-200 dark:border-green-700',
          textClass: 'text-green-600 dark:text-green-400'
        }
    }
  }

  const cancerInfo = getCancerInfo(lesion.isCancer)
  const riskConfig = getRiskConfig()

  const handleCardClick = () => {
    if (onSelect) onSelect(lesion.code)
  }

  const handleDetailsToggle = (e) => {
    e.stopPropagation()
    if (onToggleDetails) onToggleDetails(lesion.code)
  }

  return (
    <div 
      className={`
        metric-card cursor-pointer transition-all duration-300 relative overflow-hidden
        ${isSelected ? 'ring-2 ring-purple-400 dark:ring-purple-500 shadow-lg' : ''}
        ${isMainDiagnosis ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}
        ${isHovered ? 'transform -translate-y-1 shadow-xl' : ''}
        ${comparisonMode ? 'h-full' : ''}
      `}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Barra superior de color */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${cancerInfo.bgClass}`}></div>

      {/* Header de la Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {/* Icono de la lesión */}
          <div className="relative">
            <div className="text-3xl transition-transform duration-300 hover:scale-110">
              {lesion.icon}
            </div>
            {isMainDiagnosis && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse-soft"></div>
            )}
          </div>
          
          {/* Información básica */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-bold text-primary dark:text-white text-sm truncate">
                {lesion.fullName}
              </h4>
              {isMainDiagnosis && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs rounded-full whitespace-nowrap">
                  Principal
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {lesion.description}
            </p>
          </div>
        </div>

        {/* Ranking Badge */}
        {index < 3 && !comparisonMode && (
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md
            ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'}
          `}>
            {index + 1}
          </div>
        )}
      </div>

      {/* Probabilidad Principal */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Probabilidad
          </span>
          <span className="text-2xl font-bold text-primary dark:text-white">
            {Math.round(lesion.probability)}%
          </span>
        </div>
        
        <AnimatedProgressBar
          percentage={animatedProbability}
          color={cancerInfo.color}
          height={8}
          animated={true}
          delay={index * 100}
          showShimmer={true}
        />
      </div>

      {/* Tipo y Código */}
      <div className="flex items-center justify-between mb-4">
        <span className={`
          px-3 py-1 rounded-full text-xs font-bold border
          ${cancerInfo.bgClass} ${cancerInfo.textClass} ${cancerInfo.borderClass}
        `}>
          {cancerInfo.icon} {cancerInfo.text}
        </span>
        
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {lesion.code?.toUpperCase()}
        </span>
      </div>

      {/* Métricas Rápidas */}
      {!showDetails && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
            <div className="text-sm font-bold text-primary dark:text-white">
              {lesion.urgency ? lesion.urgency.charAt(0).toUpperCase() : 'N/A'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Urgencia
            </div>
          </div>
          
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
            <div className="text-sm font-bold text-primary dark:text-white">
              {lesion.characteristics?.length || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Características
            </div>
          </div>
        </div>
      )}

      {/* Información Expandida */}
      {showDetails && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Descripción Detallada */}
          <div className={`p-3 rounded-lg ${riskConfig.bgClass} border ${riskConfig.borderClass}`}>
            <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              DESCRIPCIÓN DETALLADA
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {lesion.detailedDescription || lesion.description}
            </p>
          </div>

          {/* Características */}
          {lesion.characteristics && lesion.characteristics.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                CARACTERÍSTICAS TÍPICAS
              </h5>
              <div className="flex flex-wrap gap-1">
                {lesion.characteristics.slice(0, 6).map((char, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded"
                  >
                    {char}
                  </span>
                ))}
                {lesion.characteristics.length > 6 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
                    +{lesion.characteristics.length - 6} más
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Recomendaciones Principales */}
          {lesion.recommendations && lesion.recommendations.length > 0 && (
            <div>
              <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                RECOMENDACIONES PRINCIPALES
              </h5>
              <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                {lesion.recommendations.slice(0, 3).map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-blue-500 mt-0.5">•</span>
                    <span className="flex-1">{rec}</span>
                  </li>
                ))}
                {lesion.recommendations.length > 3 && (
                  <li className="text-gray-500 dark:text-gray-400 italic">
                    +{lesion.recommendations.length - 3} recomendaciones más...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Nivel de Urgencia */}
          {lesion.urgency && (
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                NIVEL DE URGENCIA:
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                lesion.urgency === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                lesion.urgency === 'priority' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              }`}>
                {lesion.urgency.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer con Acciones */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            getRiskLevel() === 'high' ? 'bg-red-500' :
            getRiskLevel() === 'medium' ? 'bg-yellow-500' :
            'bg-green-500'
          }`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Riesgo {getRiskLevel() === 'high' ? 'Alto' : getRiskLevel() === 'medium' ? 'Medio' : 'Bajo'}
          </span>
        </div>

        <button
          onClick={handleDetailsToggle}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
        >
          {showDetails ? 'Menos detalles' : 'Más detalles'}
        </button>
      </div>

      {/* Efecto de hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
      )}
    </div>
  )
})

LesionComparisonCard.displayName = 'LesionComparisonCard'

export default LesionComparisonCard