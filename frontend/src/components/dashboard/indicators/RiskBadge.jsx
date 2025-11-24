import { motion } from 'framer-motion'
import { RISK_COLORS } from '../../../utils/dashboardConstants'

const RiskBadge = ({ 
  riskLevel, 
  size = 'medium',
  showIcon = true,
  showLabel = true,
  animated = true,
  className = ''
}) => {
  const riskConfig = {
    low: {
      label: 'Tranquilo',
      icon: '✅',
      description: 'Riesgo bajo - Observación regular'
    },
    medium: {
      label: 'Atención',
      icon: '⚠️',
      description: 'Riesgo moderado - Consulta recomendada'
    },
    high: {
      label: 'Urgente',
      icon: '🚨',
      description: 'Riesgo alto - Consulta prioritaria'
    }
  }

  const sizeConfig = {
    small: {
      container: 'px-2 py-1 text-xs',
      icon: 'text-sm',
      text: 'text-xs font-medium'
    },
    medium: {
      container: 'px-3 py-2 text-sm',
      icon: 'text-base',
      text: 'text-sm font-semibold'
    },
    large: {
      container: 'px-4 py-3 text-base',
      icon: 'text-lg',
      text: 'text-base font-bold'
    }
  }

  const config = riskConfig[riskLevel] || riskConfig.medium
  const colors = RISK_COLORS[riskLevel] || RISK_COLORS.medium
  const sizes = sizeConfig[size]

  const badgeVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 10
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      variants={badgeVariants}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      whileHover="hover"
      className={`inline-flex items-center space-x-2 rounded-full border-2 ${sizes.container} ${className}`}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text
      }}
      title={config.description}
    >
      {showIcon && (
        <motion.span 
          className={sizes.icon}
          variants={riskLevel === 'high' ? pulseVariants : {}}
          animate={riskLevel === 'high' ? "pulse" : ""}
        >
          {config.icon}
        </motion.span>
      )}
      
      {showLabel && (
        <span className={sizes.text}>
          {config.label}
        </span>
      )}
      
      {/* Glow effect for high risk */}
      {riskLevel === 'high' && (
        <motion.div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ backgroundColor: colors.text }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

// Componente especializado para mostrar nivel de riesgo con descripción
export const RiskLevelIndicator = ({ 
  riskLevel, 
  message, 
  timeframe,
  animated = true 
}) => {
  const colors = RISK_COLORS[riskLevel] || RISK_COLORS.medium
  
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-4 rounded-xl border-2"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center space-x-3 mb-3">
        <RiskBadge 
          riskLevel={riskLevel} 
          size="large"
          animated={animated}
        />
      </div>
      
      <p 
        className="text-sm font-medium mb-2"
        style={{ color: colors.text }}
      >
        {message}
      </p>
      
      {timeframe && (
        <div className="flex items-center space-x-2 text-xs opacity-80">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{timeframe}</span>
        </div>
      )}
    </motion.div>
  )
}

export default RiskBadge