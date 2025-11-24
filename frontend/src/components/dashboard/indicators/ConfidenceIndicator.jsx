import { useState } from 'react'
import { motion } from 'framer-motion'

const ConfidenceIndicator = ({ 
  confidence, 
  size = 'medium',
  showTooltip = true,
  animated = true 
}) => {
  const [showDetails, setShowDetails] = useState(false)
  
  // Convertir confidence a porcentaje si está en decimal
  const confidencePercent = confidence > 1 ? confidence : Math.round(confidence * 100)
  
  // Determinar nivel de confianza
  const getConfidenceLevel = (percent) => {
    if (percent >= 90) return 'high'
    if (percent >= 75) return 'medium'
    return 'low'
  }
  
  const confidenceLevel = getConfidenceLevel(confidencePercent)
  
  const levelConfig = {
    high: {
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      icon: '🎯',
      label: 'Alta confianza',
      description: 'El modelo tiene alta certeza en este resultado'
    },
    medium: {
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      icon: '📊',
      label: 'Confianza moderada',
      description: 'El modelo tiene confianza moderada en este resultado'
    },
    low: {
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      icon: '⚠️',
      label: 'Confianza limitada',
      description: 'Se recomienda análisis adicional o segunda opinión'
    }
  }
  
  const sizeConfig = {
    small: {
      container: 'px-2 py-1',
      text: 'text-xs',
      icon: 'text-sm'
    },
    medium: {
      container: 'px-3 py-2',
      text: 'text-sm',
      icon: 'text-base'
    },
    large: {
      container: 'px-4 py-3',
      text: 'text-base',
      icon: 'text-lg'
    }
  }
  
  const config = levelConfig[confidenceLevel]
  const sizes = sizeConfig[size]
  
  return (
    <div className="relative">
      <motion.div
        initial={animated ? { opacity: 0, scale: 0.9 } : {}}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`inline-flex items-center space-x-2 rounded-lg border ${sizes.container} cursor-pointer`}
        style={{
          backgroundColor: config.bgColor,
          borderColor: config.borderColor,
          color: config.color
        }}
        onClick={() => setShowDetails(!showDetails)}
        onMouseEnter={() => showTooltip && setShowDetails(true)}
        onMouseLeave={() => showTooltip && setShowDetails(false)}
      >
        <span className={sizes.icon}>{config.icon}</span>
        <span className={`${sizes.text} font-semibold`}>
          {confidencePercent}%
        </span>
        
        {/* Progress bar */}
        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: config.color }}
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </motion.div>
      
      {/* Tooltip/Details */}
      {showDetails && showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
        >
          <div 
            className="px-3 py-2 rounded-lg shadow-lg border text-xs max-w-xs"
            style={{
              backgroundColor: config.bgColor,
              borderColor: config.borderColor,
              color: config.color
            }}
          >
            <div className="font-semibold mb-1">{config.label}</div>
            <div className="opacity-90">{config.description}</div>
            
            {/* Arrow */}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b"
              style={{
                backgroundColor: config.bgColor,
                borderColor: config.borderColor
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Componente extendido con más detalles
export const DetailedConfidenceIndicator = ({ 
  confidence, 
  analysisType = 'IA médica',
  modelVersion = 'v2.1',
  animated = true 
}) => {
  const confidencePercent = confidence > 1 ? confidence : Math.round(confidence * 100)
  
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700">
          Confianza del Análisis
        </h4>
        <ConfidenceIndicator 
          confidence={confidence} 
          size="small"
          showTooltip={false}
          animated={animated}
        />
      </div>
      
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Tipo de análisis:</span>
          <span className="font-medium">{analysisType}</span>
        </div>
        <div className="flex justify-between">
          <span>Versión del modelo:</span>
          <span className="font-medium">{modelVersion}</span>
        </div>
        <div className="flex justify-between">
          <span>Nivel de certeza:</span>
          <span className="font-medium">{confidencePercent}%</span>
        </div>
      </div>
      
      {/* Barra de progreso detallada */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default ConfidenceIndicator