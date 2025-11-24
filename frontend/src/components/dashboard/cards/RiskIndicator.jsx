import { motion } from 'framer-motion'
import RiskBadge, { RiskLevelIndicator } from '../indicators/RiskBadge'
import { RISK_COLORS } from '../../../utils/dashboardConstants'

const RiskIndicator = ({ riskAssessment, animated = true }) => {
  if (!riskAssessment) {
    return null
  }

  const { level, message, timeframe, icon } = riskAssessment
  const colors = RISK_COLORS[level === 'urgente' ? 'high' : level === 'atencion' ? 'medium' : 'low']

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
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.95 } : {}}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden"
    >
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
        <h3 className="text-lg font-bold text-primary">
          Evaluación de Riesgo
        </h3>
        <RiskBadge 
          riskLevel={level === 'urgente' ? 'high' : level === 'atencion' ? 'medium' : 'low'}
          size="medium"
          animated={animated}
        />
      </div>

      {/* Main risk display */}
      <motion.div
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6 relative z-10"
      >
        <div className="flex items-center space-x-4 mb-4">
          <motion.div
            initial={animated ? { scale: 0 } : {}}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.4,
              type: "spring",
              stiffness: 200
            }}
            className="text-4xl"
          >
            {icon}
          </motion.div>
          <div>
            <h4 className="text-xl font-bold capitalize" style={{ color: colors.text }}>
              Nivel: {level}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {message}
            </p>
          </div>
        </div>

        {/* Timeframe */}
        {timeframe && (
          <motion.div
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center space-x-2 text-sm"
            style={{ color: colors.text }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{timeframe}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Action steps */}
      <motion.div
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-10"
      >
        <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Próximos Pasos Recomendados
        </h5>
        
        <div className="space-y-2">
          {actionSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={animated ? { opacity: 0, x: -10 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              className="flex items-start space-x-3 text-sm"
            >
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                style={{ backgroundColor: colors.text }}
              >
                {index + 1}
              </div>
              <span className="text-gray-700 leading-relaxed">{step}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Priority indicator for high risk */}
      {level === 'urgente' && (
        <motion.div
          className="absolute top-4 right-4 w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.text }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Bottom border accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl"
        style={{ backgroundColor: colors.text, opacity: 0.3 }}
      />
    </motion.div>
  )
}

export default RiskIndicator