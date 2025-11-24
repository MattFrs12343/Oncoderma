import { useState, useEffect } from 'react'

const CircularProgressBar = ({ 
  percentage = 0, 
  size = 160, 
  strokeWidth = 12, 
  animated = true,
  showPercentage = true,
  color = 'secondary',
  className = ''
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  
  // Animación del porcentaje optimizada para móvil
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    if (animated && !isMobile) {
      // Animación solo en desktop
      let start = 0
      const end = percentage
      const duration = 1500 // 1.5 segundos (más rápido)
      const increment = end / (duration / 16) // 60fps
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayPercentage(end)
          clearInterval(timer)
        } else {
          setDisplayPercentage(Math.floor(start))
        }
      }, 16)
      
      return () => clearInterval(timer)
    } else {
      // En móvil, mostrar directamente sin animación
      setDisplayPercentage(percentage)
    }
  }, [percentage, animated])

  // Configuración del círculo
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference

  // Colores según el porcentaje
  const getColor = () => {
    if (color !== 'dynamic') {
      const colors = {
        primary: '#0F172A',
        secondary: '#1E3A8A', 
        accent: '#06B6D4',
        green: '#10B981',
        yellow: '#F59E0B',
        red: '#EF4444'
      }
      return colors[color] || colors.secondary
    }

    // Color dinámico basado en el porcentaje
    if (displayPercentage <= 30) return '#10B981' // Verde - Bajo riesgo
    if (displayPercentage <= 60) return '#F59E0B' // Amarillo - Riesgo moderado
    return '#EF4444' // Rojo - Alto riesgo
  }

  // Mensaje según el porcentaje
  const getRiskMessage = () => {
    if (displayPercentage <= 30) return { text: 'Riesgo Bajo', color: 'text-green-600' }
    if (displayPercentage <= 60) return { text: 'Riesgo Moderado', color: 'text-yellow-600' }
    return { text: 'Riesgo Alto', color: 'text-red-600' }
  }

  const riskMessage = getRiskMessage()
  const strokeColor = getColor()

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Círculo de progreso optimizado */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ willChange: 'auto' }}
        >
          {/* Círculo de fondo */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Círculo de progreso */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={animated && typeof window !== 'undefined' && window.innerWidth >= 768 ? "transition-all duration-1000 ease-out" : ""}
            style={{
              filter: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
            }}
          />
        </svg>
        
        {/* Contenido central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <>
              <span 
                className="text-4xl font-bold"
                style={{ color: strokeColor }}
              >
                {displayPercentage}%
              </span>
              <span className={`text-sm font-medium mt-1 ${riskMessage.color}`}>
                {riskMessage.text}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente de progreso lineal para estados de carga
const LinearProgressBar = ({ 
  percentage = 0, 
  animated = true, 
  color = 'secondary',
  height = 8,
  className = ''
}) => {
  const [displayPercentage, setDisplayPercentage] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayPercentage(percentage)
    }
  }, [percentage, animated])

  const colors = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <div className={`w-full ${className}`}>
      <div 
        className="bg-gray-200 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={`h-full ${colors[color] || colors.secondary} transition-all duration-1000 ease-out`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  )
}

// Componente de progreso indeterminado para carga (optimizado)
const LoadingProgressBar = ({ 
  color = 'secondary', 
  size = 'md',
  className = '' 
}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-blue-600',
    accent: 'border-cyan-500'
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div 
        className={`
          ${sizes[size]} 
          border-4 
          ${colors[color] || colors.secondary}
          border-t-transparent 
          rounded-full 
          animate-spin
        `}
        style={isMobile ? {
          animationDuration: '0.8s',
          willChange: 'transform'
        } : {}}
      />
    </div>
  )
}

export default CircularProgressBar
export { LinearProgressBar, LoadingProgressBar }