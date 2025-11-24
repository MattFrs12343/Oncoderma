import { memo, useState } from 'react'

const UrgencyBasedRecommendations = memo(({ 
  recommendations = [], 
  onActionClick,
  showTimeline = false,
  compactMode = false 
}) => {
  const [completedActions, setCompletedActions] = useState(new Set())

  // Agrupar recomendaciones por urgencia
  const groupByUrgency = () => {
    const groups = {
      urgent: [],
      priority: [],
      high: [],
      routine: []
    }

    recommendations.forEach(rec => {
      const urgency = rec.urgency || 'routine'
      if (groups[urgency]) {
        groups[urgency].push(rec)
      } else {
        groups.routine.push(rec)
      }
    })

    return groups
  }

  const urgencyGroups = groupByUrgency()

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return {
          title: 'Acción Inmediata Requerida',
          subtitle: 'Requiere atención en 24-48 horas',
          color: 'red',
          bgClass: 'bg-red-50 dark:bg-red-900/20',
          borderClass: 'border-red-300 dark:border-red-700',
          textClass: 'text-red-700 dark:text-red-300',
          headerBg: 'bg-red-500',
          icon: '🚨',
          priority: 1
        }
      case 'priority':
        return {
          title: 'Alta Prioridad',
          subtitle: 'Requiere atención en 1-2 semanas',
          color: 'orange',
          bgClass: 'bg-orange-50 dark:bg-orange-900/20',
          borderClass: 'border-orange-300 dark:border-orange-700',
          textClass: 'text-orange-700 dark:text-orange-300',
          headerBg: 'bg-orange-500',
          icon: '⚠️',
          priority: 2
        }
      case 'high':
        return {
          title: 'Prioridad Media',
          subtitle: 'Requiere atención en las próximas semanas',
          color: 'yellow',
          bgClass: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderClass: 'border-yellow-300 dark:border-yellow-700',
          textClass: 'text-yellow-700 dark:text-yellow-300',
          headerBg: 'bg-yellow-500',
          icon: '⏰',
          priority: 3
        }
      default:
        return {
          title: 'Rutina y Prevención',
          subtitle: 'Cuidados continuos y preventivos',
          color: 'blue',
          bgClass: 'bg-blue-50 dark:bg-blue-900/20',
          borderClass: 'border-blue-300 dark:border-blue-700',
          textClass: 'text-blue-700 dark:text-blue-300',
          headerBg: 'bg-blue-500',
          icon: '💡',
          priority: 4
        }
    }
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

  const UrgencySection = ({ urgency, recommendations: recs, index }) => {
    if (recs.length === 0) return null

    const config = getUrgencyConfig(urgency)

    return (
      <div 
        className={`metric-card border-2 ${config.borderClass} ${config.bgClass} animate-fade-in-up`}
        style={{ animationDelay: `${index * 0.2}s` }}
      >
        {/* Header de la sección */}
        <div className={`-m-6 mb-6 p-4 ${config.headerBg} text-white rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{config.title}</h3>
                <p className="text-sm opacity-90">{config.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{recs.length}</div>
              <div className="text-xs opacity-90">
                {recs.length === 1 ? 'Recomendación' : 'Recomendaciones'}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de recomendaciones */}
        <div className="space-y-4">
          {recs.map((rec, recIndex) => (
            <RecommendationItem 
              key={rec.id}
              recommendation={rec}
              urgencyConfig={config}
              isCompleted={completedActions.has(rec.id)}
              onToggleCompleted={() => toggleCompleted(rec.id)}
              onActionClick={onActionClick}
              compactMode={compactMode}
              index={recIndex}
            />
          ))}
        </div>

        {/* Timeline para urgencias altas */}
        {showTimeline && (urgency === 'urgent' || urgency === 'priority') && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <TimelineView recommendations={recs} urgency={urgency} />
          </div>
        )}
      </div>
    )
  }

  const RecommendationItem = ({ 
    recommendation, 
    urgencyConfig, 
    isCompleted, 
    onToggleCompleted, 
    onActionClick,
    compactMode,
    index 
  }) => {
    return (
      <div 
        className={`
          p-4 rounded-lg border transition-all duration-300
          ${isCompleted 
            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-md'
          }
        `}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          {recommendation.actionable && (
            <button
              onClick={onToggleCompleted}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 mt-0.5
                ${isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : `border-gray-300 dark:border-gray-600 hover:border-${urgencyConfig.color}-400`
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
          <div className="text-xl">{recommendation.icon}</div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h4 className={`font-semibold ${isCompleted ? 'line-through' : ''} text-primary dark:text-white`}>
                {recommendation.title}
              </h4>
              {recommendation.timeframe && (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2
                  ${urgencyConfig.bgClass} ${urgencyConfig.textClass}
                `}>
                  {recommendation.timeframe}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {recommendation.description}
            </p>

            {!compactMode && recommendation.details && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 leading-relaxed">
                {recommendation.details}
              </p>
            )}

            {/* Acciones */}
            {recommendation.actionable && !isCompleted && (
              <div className="flex flex-wrap gap-2">
                {getActionButtons(recommendation, onActionClick, urgencyConfig)}
              </div>
            )}

            {/* Información adicional */}
            {recommendation.category && (
              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{getCategoryIcon(recommendation.category)}</span>
                  <span className="capitalize">{recommendation.category}</span>
                </div>
                {recommendation.urgency && (
                  <div className="flex items-center space-x-1">
                    <span>📊</span>
                    <span>Prioridad: {recommendation.urgency}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const TimelineView = ({ recommendations, urgency }) => {
    const getTimelineSteps = () => {
      if (urgency === 'urgent') {
        return [
          { time: 'Ahora', action: 'Revisar recomendaciones', status: 'completed' },
          { time: '24h', action: 'Contactar dermatólogo', status: 'pending' },
          { time: '48h', action: 'Cita programada', status: 'pending' },
          { time: '1 semana', action: 'Seguimiento', status: 'future' }
        ]
      } else {
        return [
          { time: 'Ahora', action: 'Revisar recomendaciones', status: 'completed' },
          { time: '1 semana', action: 'Programar cita', status: 'pending' },
          { time: '2 semanas', action: 'Consulta médica', status: 'pending' },
          { time: '1 mes', action: 'Seguimiento', status: 'future' }
        ]
      }
    }

    const steps = getTimelineSteps()

    return (
      <div>
        <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          📅 Cronograma Recomendado
        </h5>
        <div className="relative">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4 last:mb-0">
              {/* Indicador de estado */}
              <div className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${step.status === 'completed' ? 'bg-green-500 border-green-500' :
                  step.status === 'pending' ? 'bg-yellow-500 border-yellow-500' :
                  'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600'
                }
              `}>
                {step.status === 'completed' && (
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="absolute left-2 w-0.5 h-8 bg-gray-300 dark:bg-gray-600" style={{ top: `${(index + 1) * 32}px` }}></div>
              )}

              {/* Contenido */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {step.action}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {step.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getActionButtons = (recommendation, onActionClick, urgencyConfig) => {
    const buttons = []

    if (recommendation.id.includes('consultation') || recommendation.id.includes('urgent')) {
      buttons.push(
        <button
          key="schedule"
          onClick={() => onActionClick?.('schedule', recommendation)}
          className={`btn-primary text-xs py-2 px-3`}
        >
          📞 Buscar Especialista
        </button>
      )
    }

    if (recommendation.id.includes('photo') || recommendation.id.includes('document')) {
      buttons.push(
        <button
          key="photo"
          onClick={() => onActionClick?.('photo', recommendation)}
          className={`btn-secondary text-xs py-2 px-3`}
        >
          📸 Tomar Foto
        </button>
      )
    }

    if (recommendation.id.includes('diary') || recommendation.id.includes('symptom')) {
      buttons.push(
        <button
          key="diary"
          onClick={() => onActionClick?.('diary', recommendation)}
          className={`btn-secondary text-xs py-2 px-3`}
        >
          📝 Abrir Diario
        </button>
      )
    }

    return buttons
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

  // Ordenar grupos por prioridad
  const sortedUrgencies = Object.keys(urgencyGroups)
    .filter(urgency => urgencyGroups[urgency].length > 0)
    .sort((a, b) => getUrgencyConfig(a).priority - getUrgencyConfig(b).priority)

  return (
    <div className="space-y-6">
      {sortedUrgencies.map((urgency, index) => (
        <UrgencySection
          key={urgency}
          urgency={urgency}
          recommendations={urgencyGroups[urgency]}
          index={index}
        />
      ))}

      {sortedUrgencies.length === 0 && (
        <div className="metric-card text-center py-8">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No hay recomendaciones disponibles
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Las recomendaciones se generarán automáticamente basadas en tu análisis.
          </p>
        </div>
      )}
    </div>
  )
})

UrgencyBasedRecommendations.displayName = 'UrgencyBasedRecommendations'

export default UrgencyBasedRecommendations