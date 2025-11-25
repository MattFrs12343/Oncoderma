/**
 * RiskIndicator - Pure visual component for displaying risk assessment
 * Uses only Tailwind CSS classes
 */
const RiskIndicator = ({ riskAssessment, animated = true }) => {
  if (!riskAssessment) {
    return null
  }

  const { level, message, timeframe, icon } = riskAssessment

  // Map risk levels to Tailwind colors
  const colorMap = {
    'urgente': {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      accent: 'bg-red-700'
    },
    'atencion': {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      accent: 'bg-orange-800'
    },
    'tranquilo': {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      accent: 'bg-green-700'
    }
  }

  const colors = colorMap[level] || colorMap['tranquilo']

  const getActionSteps = (level) => {
    switch (level) {
      case 'urgente':
        return [
          'Programa cita dermatológica inmediatamente',
          'No retrasar la consulta médica',
          'Prepara historial de cambios en la lesión',
          'Considera buscar segunda opinión si es necesario'
        ]
      case 'atencion':
        return [
          'Programa cita dermatológica en 2-4 semanas',
          'Monitorea cambios en la lesión',
          'Documenta evolución con fotografías',
          'Mantén protección solar estricta'
        ]
      case 'tranquilo':
        return [
          'Continúa con observación regular',
          'Programa chequeo dermatológico de rutina',
          'Mantén autoexamen mensual',
          'Consulta si observas cambios'
        ]
      default:
        return []
    }
  }

  const actionSteps = getActionSteps(level)

  return (
    <div className={`${colors.bg} rounded-xl p-6 shadow-lg border ${colors.border} relative overflow-hidden transition-all duration-500 ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M30,30 L70,30 L70,70 L30,70 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M40,40 L60,40 L60,60 L40,60 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-slate-900">
          Evaluación de Riesgo
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.text} ${colors.bg} border ${colors.border}`}>
          {level.toUpperCase()}
        </span>
      </div>

      {/* Main risk display */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-4xl">
            {icon}
          </div>
          <div>
            <h4 className={`text-xl font-bold capitalize ${colors.text}`}>
              Nivel: {level}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {message}
            </p>
          </div>
        </div>

        {/* Timeframe */}
        {timeframe && (
          <div className={`flex items-center space-x-2 text-sm ${colors.text}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{timeframe}</span>
          </div>
        )}
      </div>

      {/* Action steps */}
      <div className="relative z-10">
        <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Próximos Pasos Recomendados
        </h5>
        
        <div className="space-y-2">
          {actionSteps.map((step, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 text-sm"
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${colors.accent}`}>
                {index + 1}
              </div>
              <span className="text-gray-700 leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority indicator for high risk */}
      {level === 'urgente' && (
        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${colors.accent} animate-pulse`} />
      )}

      {/* Bottom border accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl ${colors.accent} opacity-30`} />
    </div>
  )
}

export default RiskIndicator
