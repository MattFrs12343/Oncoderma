import { memo, useState, useEffect, useRef } from 'react'

const AnimatedProgressBar = memo(({ 
  percentage = 0,
  height = 8,
  color = 'blue',
  showPercentage = false,
  label = '',
  duration = 800,
  delay = 0,
  animated = true,
  showShimmer = true,
  className = ''
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)

  // Colores predefinidos
  const colorConfigs = {
    blue: {
      bg: 'bg-blue-200 dark:bg-blue-900/30',
      fill: 'bg-gradient-to-r from-blue-400 to-blue-600',
      text: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-200 dark:bg-green-900/30',
      fill: 'bg-gradient-to-r from-green-400 to-green-600',
      text: 'text-green-600 dark:text-green-400'
    },
    yellow: {
      bg: 'bg-yellow-200 dark:bg-yellow-900/30',
      fill: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-red-200 dark:bg-red-900/30',
      fill: 'bg-gradient-to-r from-red-400 to-red-600',
      text: 'text-red-600 dark:text-red-400'
    },
    purple: {
      bg: 'bg-purple-200 dark:bg-purple-900/30',
      fill: 'bg-gradient-to-r from-purple-400 to-purple-600',
      text: 'text-purple-600 dark:text-purple-400'
    },
    dynamic: {
      bg: percentage > 70 ? 'bg-red-200 dark:bg-red-900/30' : 
          percentage > 40 ? 'bg-yellow-200 dark:bg-yellow-900/30' : 
          'bg-green-200 dark:bg-green-900/30',
      fill: percentage > 70 ? 'bg-gradient-to-r from-red-400 to-red-600' : 
            percentage > 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
            'bg-gradient-to-r from-green-400 to-green-600',
      text: percentage > 70 ? 'text-red-600 dark:text-red-400' : 
            percentage > 40 ? 'text-yellow-600 dark:text-yellow-400' : 
            'text-green-600 dark:text-green-400'
    }
  }

  const currentColor = colorConfigs[color] || colorConfigs.blue

  // Función de easing
  const easeOutQuart = (t) => {
    return 1 - Math.pow(1 - t, 4)
  }

  // Animación personalizada
  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutQuart(progress)
    
    setAnimatedPercentage(easedProgress * percentage)

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setIsAnimating(false)
    }
  }

  // Iniciar animación
  useEffect(() => {
    if (!animated) {
      setAnimatedPercentage(percentage)
      return
    }

    const timer = setTimeout(() => {
      setIsAnimating(true)
      startTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [percentage, animated, delay])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={`w-full ${className}`}>
      {/* Label y porcentaje */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-sm font-bold ${currentColor.text}`}>
              {Math.round(animatedPercentage)}%
            </span>
          )}
        </div>
      )}

      {/* Barra de progreso */}
      <div 
        className={`w-full ${currentColor.bg} rounded-full overflow-hidden relative`}
        style={{ height: `${height}px` }}
      >
        {/* Barra de progreso principal */}
        <div 
          className={`h-full ${currentColor.fill} rounded-full transition-all duration-300 ease-out relative overflow-hidden`}
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* Efecto shimmer */}
          {showShimmer && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          )}
          
          {/* Punto brillante en el extremo */}
          {isAnimating && animatedPercentage > 0 && (
            <div 
              className="absolute right-0 top-0 w-1 h-full bg-white/50 animate-pulse-soft"
              style={{ 
                boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                borderRadius: '0 4px 4px 0'
              }}
            />
          )}
        </div>

        {/* Efecto de onda durante la animación */}
        {isAnimating && (
          <div 
            className="absolute top-0 h-full bg-white/20 rounded-full transition-all duration-300"
            style={{ 
              width: '20px',
              left: `${Math.max(0, animatedPercentage - 10)}%`,
              animation: 'pulse 0.5s ease-in-out infinite alternate'
            }}
          />
        )}
      </div>

      {/* Indicadores de hitos */}
      {percentage >= 25 && (
        <div className="flex justify-between mt-1 px-1">
          <div className={`w-1 h-1 rounded-full ${animatedPercentage >= 25 ? currentColor.fill.replace('bg-gradient-to-r', 'bg') : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-300`}></div>
          <div className={`w-1 h-1 rounded-full ${animatedPercentage >= 50 ? currentColor.fill.replace('bg-gradient-to-r', 'bg') : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-500`}></div>
          <div className={`w-1 h-1 rounded-full ${animatedPercentage >= 75 ? currentColor.fill.replace('bg-gradient-to-r', 'bg') : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-700`}></div>
          <div className={`w-1 h-1 rounded-full ${animatedPercentage >= 100 ? currentColor.fill.replace('bg-gradient-to-r', 'bg') : 'bg-gray-300 dark:bg-gray-600'} transition-colors duration-900`}></div>
        </div>
      )}
    </div>
  )
})

AnimatedProgressBar.displayName = 'AnimatedProgressBar'

export default AnimatedProgressBar