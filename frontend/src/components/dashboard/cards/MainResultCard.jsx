import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProgressRing from '../indicators/ProgressRing'
import ConfidenceIndicator from '../indicators/ConfidenceIndicator'
import { ANIMATION_VARIANTS } from '../../../utils/dashboardConstants'

const MainResultCard = ({ result, animated = true }) => {
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

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.card}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-primary mb-1">
            Resultado Principal
          </h3>
          <p className="text-sm text-gray-600">
            Diagnóstico más probable según IA médica
          </p>
        </div>
        <ConfidenceIndicator 
          confidence={result.confidence}
          size="small"
          animated={isVisible}
        />
      </div>

      {/* Main content */}
      <div className="flex items-center space-x-6 relative z-10">
        {/* Icon */}
        <motion.div
          initial={animated ? { scale: 0, rotate: -180 } : {}}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
          className="text-6xl"
        >
          {result.icon}
        </motion.div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            initial={animated ? { opacity: 0, y: 20 } : {}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="text-2xl font-bold text-primary mb-2">
              {result.simpleName}
            </h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {result.description}
            </p>
          </motion.div>

          {/* Progress and percentage */}
          <div className="flex items-center space-x-6">
            <ProgressRing 
              percentage={result.probability}
              size={80}
              riskLevel={result.riskLevel}
              animated={isVisible}
            />
            
            <motion.div
              initial={animated ? { opacity: 0, x: 20 } : {}}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="text-sm text-gray-500 mb-1">Probabilidad</div>
              <div className="text-3xl font-bold text-primary">
                {result.probability}%
              </div>
              <div className="text-xs text-gray-400 mt-1">
                de {result.name}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Additional info */}
      <motion.div
        initial={animated ? { opacity: 0, y: 10 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 pt-4 border-t border-gray-100 relative z-10"
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Análisis completado</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>IA médica avanzada</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-400">Tipo de lesión</div>
            <div className="font-medium text-gray-600">{result.type.toUpperCase()}</div>
          </div>
        </div>
      </motion.div>

      {/* Glow effect for high probability results */}
      {result.probability > 80 && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at center, ${
              result.riskLevel === 'high' ? '#EF4444' : 
              result.riskLevel === 'medium' ? '#F59E0B' : '#10B981'
            } 0%, transparent 70%)`
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

export default MainResultCard