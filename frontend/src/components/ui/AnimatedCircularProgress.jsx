import { memo, useState, useEffect, useRef } from 'react'

const AnimatedCircularProgress = memo(({ 
  percentage = 0, 
  size = 200, 
  strokeWidth = 12,
  duration = 1000,
  delay = 0,
  color = 'blue',
  showPercentage = true,
  label = 'Probabilidad',
  animated = true
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  // Colores predefinidos
  const colorConfigs = {
    blue: {
      gradient: ['#3b82f6', '#1d4ed8'],
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    green: {
      gradient: ['#10b981', '#059669'],
      glow: 'rgba(16, 185, 129, 0.3)'
    },
    yellow: {
      gradient: ['#f59e0b', '#d97706'],
      glow: 'rgba(245, 158, 11, 0.3)'
    },
    red: {
      gradient: ['#ef4444', '#dc2626'],
      glow: 'rgba(239, 68, 68, 0.3)'
    },
    purple: {
      gradient: ['#8b5cf6', '#7c3aed'],
      glow: 'rgba(139, 92, 246, 0.3)'
    },
    dynamic: {
      gradient: percentage > 70 ? ['#ef4444', '#dc2626'] : 
                percentage > 40 ? ['#f59e0b', '#d97706'] : 
                ['#10b981', '#059669'],
      glow: percentage > 70 ? 'rgba(239, 68, 68, 0.3)' : 
            percentage > 40 ? 'rgba(245, 158, 11, 0.3)' : 
            'rgba(16, 185, 129, 0.3)'
    }
  }

  const currentColor = colorConfigs[color] || colorConfigs.blue

  // Función de easing para animación suave
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3)
  }

  // Animación personalizada
  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easeOutCubic(progress)
    
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

  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`
  const glowId = `glow-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        style={{ filter: `drop-shadow(0 0 8px ${currentColor.glow})` }}
      >
        {/* Definitions */}
        <defs>
          {/* Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={currentColor.gradient[0]} />
            <stop offset="100%" stopColor={currentColor.gradient[1]} />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id={glowId}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          filter={`url(#${glowId})`}
        />

        {/* Animated dots on the progress line */}
        {isAnimating && (
          <circle
            cx={size / 2 + radius * Math.cos((animatedPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
            cy={size / 2 + radius * Math.sin((animatedPercentage / 100) * 2 * Math.PI - Math.PI / 2)}
            r="3"
            fill={currentColor.gradient[1]}
            className="animate-pulse-soft"
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <>
            <div className={`text-4xl font-bold text-primary dark:text-white transition-all duration-300 ${isAnimating ? 'animate-count-up' : ''}`}>
              {Math.round(animatedPercentage)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
              {label}
            </div>
          </>
        )}
      </div>

      {/* Pulse effect during animation */}
      {isAnimating && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ 
            background: `radial-gradient(circle, ${currentColor.glow} 0%, transparent 70%)`,
            width: size,
            height: size
          }}
        />
      )}
    </div>
  )
})

AnimatedCircularProgress.displayName = 'AnimatedCircularProgress'

export default AnimatedCircularProgress