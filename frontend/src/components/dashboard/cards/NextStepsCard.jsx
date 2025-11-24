import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS } from '../../../utils/dashboardConstants'

const NextStepsCard = ({ recommendations, riskLevel, animated = true }) => {
  if (!recommendations) {
    return null
  }

  const { immediate, general, specific } = recommendations

  const getUrgencyConfig = (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return {
          color: '#DC2626',
          bgColor: '#FEF2F2',
          borderColor: '#FECACA',
          icon: '🚨',
          title: 'Acciones Urgentes',
          subtitle: 'Requiere atención médica prioritaria'
        }
      case 'medium':
        return {
          color: '#C2410C',
          bgColor: '#FFFBEB',
          borderColor: '#FED7AA',
          icon: '⚠️',
          title: 'Acciones Recomendadas',
          subtitle: 'Seguimiento médico sugerido'
        }
      case 'low':
        return {
          color: '#166534',
          bgColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          icon: '✅',
          title: 'Cuidados Preventivos',
          subtitle: 'Mantén observación regular'
        }
      default:
        return {
          color: '#1F2937',
          bgColor: '#F9FAFB',
          borderColor: '#E5E7EB',
          icon: '📋',
          title: 'Recomendaciones',
          subtitle: 'Sigue estas indicaciones'
        }
    }
  }

  const urgencyConfig = getUrgencyConfig(riskLevel)

  const ActionSection = ({ title, items, icon, delay = 0 }) => (
    <motion.div
      initial={animated ? { opacity: 0, y: 15 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="mb-6 last:mb-0"
    >
      <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
        <span className="mr-2 text-base">{icon}</span>
        {title}
      </h5>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={animated ? { opacity: 0, x: -10 } : {}}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: delay + 0.1 + index * 0.05 }}
            className="flex items-start space-x-3 text-sm"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{item}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.card}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10,50 Q50,10 90,50 Q50,90 10,50" fill="currentColor"/>
        </svg>
      </div>

      {/* Header */}
      <motion.div
        initial={animated ? { opacity: 0, y: -10 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 relative z-10"
      >
        <div className="flex items-center space-x-3 mb-2">
          <motion.span
            initial={animated ? { scale: 0, rotate: -180 } : {}}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-2xl"
          >
            {urgencyConfig.icon}
          </motion.span>
          <div>
            <h3 className="text-lg font-bold text-primary">
              {urgencyConfig.title}
            </h3>
            <p className="text-sm text-gray-600">
              {urgencyConfig.subtitle}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content sections */}
      <div className="relative z-10">
        {/* Immediate actions */}
        {immediate && immediate.length > 0 && (
          <ActionSection
            title="Acciones Inmediatas"
            items={immediate}
            icon="⚡"
            delay={0.3}
          />
        )}

        {/* Specific recommendations */}
        {specific && specific.length > 0 && (
          <ActionSection
            title="Recomendaciones Específicas"
            items={specific}
            icon="🎯"
            delay={0.5}
          />
        )}

        {/* General care */}
        {general && general.length > 0 && (
          <ActionSection
            title="Cuidados Generales"
            items={general}
            icon="🛡️"
            delay={0.7}
          />
        )}
      </div>

      {/* Call to action */}
      <motion.div
        initial={animated ? { opacity: 0, y: 20 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-6 pt-4 border-t border-gray-100 relative z-10"
      >
        <div 
          className="p-4 rounded-lg border-2"
          style={{
            backgroundColor: urgencyConfig.bgColor,
            borderColor: urgencyConfig.borderColor
          }}
        >
          <div className="flex items-start space-x-3">
            <svg 
              className="w-5 h-5 mt-0.5 flex-shrink-0" 
              style={{ color: urgencyConfig.color }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p 
                className="text-sm font-semibold mb-1"
                style={{ color: urgencyConfig.color }}
              >
                Recordatorio Importante
              </p>
              <p 
                className="text-xs leading-relaxed"
                style={{ color: urgencyConfig.color, opacity: 0.8 }}
              >
                Este análisis es una herramienta de apoyo diagnóstico. 
                Siempre consulta con un dermatólogo certificado para evaluación profesional y diagnóstico definitivo.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress indicator for urgent cases */}
      {riskLevel === 'high' && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </motion.div>
  )
}

export default NextStepsCard