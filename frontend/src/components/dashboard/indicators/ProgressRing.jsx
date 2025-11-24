import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getRiskColor } from '../../../utils/dashboardUtils'

const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  color = null,
  animated = true,
  showPercentage = true,
  riskLevel = null
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Determinar color basado en riskLevel o usar el proporcionado
  const ringColor = color || (riskLevel ? getRiskColor(riskLevel) : '#06B6D4')

  useEffect(() => {
    if (animated) {
      // Animación gradual del porcentaje
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setAnimatedPercentage(percentage)
    }
  }, [percentage, animated])

  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            ease: "easeOut",
            delay: animated ? 0.2 : 0
          }}
          className="drop-shadow-sm"
        />
        
        {/* Glow effect for high percentages */}
        {animatedPercentage > 70 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth / 2}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="opacity-30 blur-sm"
          />
        )}
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: animated ? 0.8 : 0,
              type: "spring",
              stiffness: 200
            }}
            className="text-center"
          >
            <div 
              className="font-bold leading-none"
              style={{ 
                fontSize: size > 100 ? '1.5rem' : '1.25rem',
                color: ringColor
              }}
            >
              {Math.round(animatedPercentage)}%
            </div>
            {size > 100 && (
              <div className="text-xs text-gray-500 mt-1">
                probabilidad
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Pulse animation for high risk */}
      {riskLevel === 'high' && animatedPercentage > 0 && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 opacity-30"
          style={{ borderColor: ringColor }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  )
}

export default ProgressRing