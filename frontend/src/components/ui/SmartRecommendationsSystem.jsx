import { memo, useState, useEffect } from 'react'
import { SKIN_LESION_TYPES } from '../../utils/constants'
import { MedicalTermTooltip, RiskInfoTooltip } from './MedicalTooltip'

const SmartRecommendationsSystem = memo(({ analysisResult, onScheduleAppointment, onSaveReport }) => {
  const [activeTab, setActiveTab] = useState('immediate')
  const [expandedRecommendations, setExpandedRecommendations] = useState(new Set())
  const [completedActions, setCompletedActions] = useState(new Set())

  const result = analysisResult.result || analysisResult
  const detailedAnalysis = result.detailed_analysis
  const mostLikely = detailedAnalysis?.most_likely
  const riskAssessment = detailedAnalysis?.risk_assessment

  // Generar recomendaciones inteligentes basadas en el análisis
  const generateSmartRecommendations = () => {
    const lesionType = mostLikely?.type || 'unknown'
    const lesionInfo = SKIN_LESION_TYPES[lesionType]
    const overallRisk = riskAssessment?.overall_risk || 'low'
    const cancerProbability = riskAssessment?.cancer_probability || 0

    const recommendations = {
      immediate: [],
      followUp: [],
      general: [],
      preventive: []
    }

    // Recomendaciones inmediatas basadas en riesgo
    if (overallRisk === 'high' || cancerProbability > 70) {
      recommendations.immediate.push({
        id: 'urgent_consultation',
        title: 'Consulta Dermatológica Urgente',
        description: 'Programa una cita con un dermatólogo en las próximas 24-48 horas',
        icon: '🚨',
        urgency: 'urgent',
        timeframe: '24-48 horas',
        actionable: true,
        category: 'medical',
        details: 'Los resultados del análisis sugieren características que requieren evaluación médica inmediata. No esperes para buscar atención profesional.'
      })

      recommendations.immediate.push({
        id: 'document_changes',
        title: 'Documentar Cambios Recientes',
        description: 'Registra cualquier cambio en tamaño, color o forma de la lesión',
        icon: '📸',
        urgency: 'high',
        timeframe: 'Inmediato',
        actionable: true,
        category: 'monitoring',
        details: 'Toma fotografías de alta calidad de la lesión desde diferentes ángulos. Anota la fecha y cualquier síntoma asociado.'
      })
    } else {
      recommendations.immediate.push({
        id: 'routine_monitoring',
        title: 'Monitoreo Regular',
        description: 'Observa la lesión mensualmente y programa chequeos anuales',
        icon: '👁️',
        urgency: 'routine',
        timeframe: 'Mensual',
        actionable: true,
        category: 'monitoring',
        details: 'Realiza autoexámenes mensuales siguiendo la regla ABCDE. Programa chequeos dermatológicos anuales de rutina.'
      })
    }

    // Recomendaciones específicas del tipo de lesión
    if (lesionInfo?.recommendations) {
      lesionInfo.recommendations.forEach((rec, index) => {
        recommendations.followUp.push({
          id: `lesion_specific_${index}`,
          title: `Cuidado Específico para ${lesionInfo.fullName}`,
          description: rec,
          icon: lesionInfo.icon,
          urgency: lesionInfo.urgency || 'routine',
          timeframe: 'Continuo',
          actionable: false,
          category: 'specific',
          details: `Recomendación específica basada en las características típicas de ${lesionInfo.fullName}.`
        })
      })
    }

    // Recomendaciones de seguimiento
    recommendations.followUp.push({
      id: 'photo_tracking',
      title: 'Seguimiento Fotográfico',
      description: 'Toma fotografías mensuales para monitorear cambios',
      icon: '📱',
      urgency: 'routine',
      timeframe: 'Mensual',
      actionable: true,
      category: 'monitoring',
      details: 'Usa la misma iluminación y ángulo cada mes. Guarda las fotos con fecha para comparar cambios a lo largo del tiempo.'
    })

    recommendations.followUp.push({
      id: 'symptom_diary',
      title: 'Diario de Síntomas',
      description: 'Registra cualquier picazón, dolor o cambios en la lesión',
      icon: '📝',
      urgency: 'routine',
      timeframe: 'Diario',
      actionable: true,
      category: 'monitoring',
      details: 'Anota síntomas como picazón, dolor, sangrado o cambios en la textura. Esta información es valiosa para el dermatólogo.'
    })

    // Recomendaciones generales
    recommendations.general.push({
      id: 'sun_protection',
      title: 'Protección Solar Diaria',
      description: 'Usa protector solar SPF 30+ todos los días',
      icon: '☀️',
      urgency: 'routine',
      timeframe: 'Diario',
      actionable: true,
      category: 'prevention',
      details: 'Aplica protector solar 30 minutos antes de la exposición. Reaplica cada 2 horas y después de nadar o sudar.'
    })

    recommendations.general.push({
      id: 'avoid_peak_hours',
      title: 'Evitar Horas Pico de Sol',
      description: 'Limita la exposición solar entre 10 AM y 4 PM',
      icon: '🌅',
      urgency: 'routine',
      timeframe: 'Diario',
      actionable: true,
      category: 'prevention',
      details: 'Los rayos UV son más intensos durante estas horas. Busca sombra o usa ropa protectora cuando sea necesario estar al aire libre.'
    })

    recommendations.general.push({
      id: 'self_examination',
      title: 'Autoexamen Mensual',
      description: 'Realiza un examen completo de la piel mensualmente',
      icon: '🔍',
      urgency: 'routine',
      timeframe: 'Mensual',
      actionable: true,
      category: 'monitoring',
      details: 'Examina toda la piel, incluyendo áreas difíciles de ver. Usa un espejo o pide ayuda a un familiar para revisar la espalda.'
    })

    // Recomendaciones preventivas
    recommendations.preventive.push({
      id: 'healthy_lifestyle',
      title: 'Estilo de Vida Saludable',
      description: 'Mantén una dieta equilibrada y ejercicio regular',
      icon: '🥗',
      urgency: 'routine',
      timeframe: 'Continuo',
      actionable: true,
      category: 'lifestyle',
      details: 'Una dieta rica en antioxidantes y ejercicio regular pueden ayudar a mantener la salud de la piel y el sistema inmunológico.'
    })

    recommendations.preventive.push({
      id: 'regular_checkups',
      title: 'Chequeos Dermatológicos Regulares',
      description: 'Programa revisiones anuales con un dermatólogo',
      icon: '🏥',
      urgency: 'routine',
      timeframe: 'Anual',
      actionable: true,
      category: 'medical',
      details: 'Los chequeos regulares permiten la detección temprana de problemas. La frecuencia puede variar según tu historial y factores de riesgo.'
    })

    return recommendations
  }

  const recommendations = generateSmartRecommendations()

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return {
          color: 'red',
          bgClass: 'bg-red-50 dark:bg-red-900/20',
          borderClass: 'border-red-200 dark:border-red-700',
          textClass: 'text-red-600 dark:text-red-400',
          badgeClass: 'bg-red-500 text-white',
          icon: '🚨'
        }
      case 'priority':
        return {
          color: 'yellow',
          bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderClass: 'border-yellow-200 dark:border-yellow-700',
          textClass: 'text-yellow-600 dark:text-yellow-400',
          badgeClass: 'bg-yellow-500 text-white',
          icon: '⚠️'
        }
      case 'high':
        return {
          color: 'orange',
          bgClass: 'bg-orange-50 dark:bg-orange-900/20',
          borderClass: 'border-orange-200 dark:border-orange-700',
          textClass: 'text-orange-600 dark:text-orange-400',
          badgeClass: 'bg-orange-500 text-white',
          icon: '⏰'
        }
      default:
        return {
          color: 'blue',
          bgClass: 'bg-blue-50 dark:bg-blue-900/20',
          borderClass: 'border-blue-200 dark:border-blue-700',
          textClass: 'text-blue-600 dark:text-blue-400',
          badgeClass: 'bg-blue-500 text-white',
          icon: '💡'
        }
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medical': return '🏥'
      case 'monitoring': return '👁️'
      case 'prevention': return '🛡️'
      case 'lifestyle': return '🌱'
      case 'specific': return '🎯'
      default: return '💡'
    }
  }

  const toggleRecommendation = (id) => {
    const newExpanded = new Set(expandedRecommendations)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRecommendations(newExpanded)
  }

  const toggleCompleted = (id) => {
    const newCompleted = new Set(completedActions)
    if (newCompleted.has(id)) {
      newCompleted.delete(id)
    } else {
      newCompleted.add(id)
    }
    setCompletedActions(newCompleted)
  }

  const RecommendationCard = ({ recommendation, index }) => {
    const urgencyConfig = getUrgencyConfig(recommendation.urgency)
    const isExpanded = expandedRecommendations.has(recommendation.id)
    const isCompleted = completedActions.has(recommendation.id)

    return (
      <div 
        className={`
          metric-card transition-all duration-300 hover-lift
          ${isCompleted ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : ''}
          ${urgencyConfig.bgClass} border-2 ${urgencyConfig.borderClass}
        `}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Checkbox para acciones */}
            {recommendation.actionable && (
              <button
                onClick={() => toggleCompleted(recommendation.id)}
                className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                  }
                `}
              >
                {isCompleted && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}

            {/* Icono */}
            <div className="text-2xl">{recommendation.icon}</div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className={`font-bold ${isCompleted ? 'line-through' : ''} text-primary dark:text-white`}>
                  {recommendation.title}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${urgencyConfig.badgeClass}`}>
                  {recommendation.urgency.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {recommendation.description}
              </p>

              <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>⏱️</span>
                  <span>{recommendation.timeframe}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{getCategoryIcon(recommendation.category)}</span>
                  <span className="capitalize">{recommendation.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de expandir */}
          <button
            onClick={() => toggleRecommendation(recommendation.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${urgencyConfig.textClass} hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Contenido expandido */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in-up">
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Detalles:
                </h5>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {recommendation.details}
                </p>
              </div>

              {/* Acciones específicas */}
              {recommendation.actionable && (
                <div className="flex flex-wrap gap-2">
                  {recommendation.id === 'urgent_consultation' && (
                    <button
                      onClick={onScheduleAppointment}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      📞 Buscar Dermatólogo
                    </button>
                  )}
                  {recommendation.id === 'schedule_consultation' && (
                    <button
                      onClick={onScheduleAppointment}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      📅 Programar Cita
                    </button>
                  )}
                  {(recommendation.id === 'document_changes' || recommendation.id === 'photo_tracking') && (
                    <button
                      onClick={() => {/* Implementar funcionalidad de cámara */}}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      📸 Tomar Foto
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const TabButton = ({ id, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${activeTab === id 
          ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow-sm' 
          : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {count > 0 && (
        <span className={`
          px-2 py-1 rounded-full text-xs font-bold
          ${activeTab === id 
            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
        `}>
          {count}
        </span>
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="metric-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-section-title flex items-center">
              <span className="mr-3 text-2xl">💡</span>
              Recomendaciones Personalizadas
            </h3>
            <p className="text-metric-label">
              Basadas en tu análisis y mejores prácticas médicas
            </p>
          </div>

          {onSaveReport && (
            <button
              onClick={onSaveReport}
              className="btn-secondary"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Guardar Reporte</span>
              </div>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabButton 
            id="immediate" 
            label="Inmediatas" 
            icon="🚨" 
            count={recommendations.immediate.length} 
          />
          <TabButton 
            id="followUp" 
            label="Seguimiento" 
            icon="📋" 
            count={recommendations.followUp.length} 
          />
          <TabButton 
            id="general" 
            label="Generales" 
            icon="🛡️" 
            count={recommendations.general.length} 
          />
          <TabButton 
            id="preventive" 
            label="Preventivas" 
            icon="🌱" 
            count={recommendations.preventive.length} 
          />
        </div>
      </div>

      {/* Contenido de las tabs */}
      <div className="space-y-4 animate-fade-in-up">
        {recommendations[activeTab]?.map((recommendation, index) => (
          <RecommendationCard 
            key={recommendation.id} 
            recommendation={recommendation} 
            index={index}
          />
        ))}

        {recommendations[activeTab]?.length === 0 && (
          <div className="metric-card text-center py-8">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No hay recomendaciones en esta categoría
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Las recomendaciones se generan automáticamente basadas en tu análisis.
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer médico */}
      <div className="metric-card">
        <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="text-amber-600 dark:text-amber-400 text-xl">⚕️</div>
          <div>
            <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
              Importante - Disclaimer Médico
            </h5>
            <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
              Estas recomendaciones son sugerencias generales basadas en el análisis de IA y no constituyen 
              consejo médico profesional. Siempre consulta con un dermatólogo certificado para evaluación 
              y diagnóstico definitivo. En caso de emergencia médica, busca atención inmediata.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

SmartRecommendationsSystem.displayName = 'SmartRecommendationsSystem'

export default SmartRecommendationsSystem