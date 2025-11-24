import { memo, useState, useRef, useEffect } from 'react'

const MedicalTooltip = memo(({ 
  children, 
  content, 
  title,
  position = 'top', // 'top', 'bottom', 'left', 'right'
  delay = 300,
  maxWidth = '300px',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const timeoutRef = useRef(null)
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      calculatePosition()
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return

    const tooltip = tooltipRef.current
    const trigger = triggerRef.current
    const triggerRect = trigger.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    let newPosition = position

    // Check if tooltip fits in the preferred position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 10) {
          newPosition = 'bottom'
        }
        break
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewport.height - 10) {
          newPosition = 'top'
        }
        break
      case 'left':
        if (triggerRect.left - tooltipRect.width < 10) {
          newPosition = 'right'
        }
        break
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewport.width - 10) {
          newPosition = 'left'
        }
        break
    }

    setActualPosition(newPosition)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50 px-3 py-2 text-sm bg-gray-900 dark:bg-gray-800 text-white rounded-lg shadow-lg border border-gray-700 dark:border-gray-600'
    
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`
    }
  }

  const getArrowClasses = () => {
    const baseArrowClasses = 'absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 border border-gray-700 dark:border-gray-600 transform rotate-45'
    
    switch (actualPosition) {
      case 'top':
        return `${baseArrowClasses} top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0`
      case 'bottom':
        return `${baseArrowClasses} bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-0 border-r-0`
      case 'left':
        return `${baseArrowClasses} left-full top-1/2 -translate-y-1/2 -ml-1 border-l-0 border-b-0`
      case 'right':
        return `${baseArrowClasses} right-full top-1/2 -translate-y-1/2 -mr-1 border-r-0 border-t-0`
      default:
        return `${baseArrowClasses} top-full left-1/2 -translate-x-1/2 -mt-1 border-t-0 border-l-0`
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Element */}
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="cursor-help"
      >
        {children}
      </div>

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={getPositionClasses()}
          style={{ maxWidth }}
        >
          {/* Arrow */}
          <div className={getArrowClasses()}></div>
          
          {/* Content */}
          <div className="relative z-10">
            {title && (
              <div className="font-semibold text-white mb-1 text-xs">
                {title}
              </div>
            )}
            <div className="text-gray-200 leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

MedicalTooltip.displayName = 'MedicalTooltip'

// Componente especializado para términos médicos
export const MedicalTermTooltip = memo(({ term, definition, children, ...props }) => {
  return (
    <MedicalTooltip
      title={term}
      content={definition}
      {...props}
    >
      <span className="border-b border-dotted border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400">
        {children || term}
      </span>
    </MedicalTooltip>
  )
})

MedicalTermTooltip.displayName = 'MedicalTermTooltip'

// Componente para información de riesgo
export const RiskInfoTooltip = memo(({ riskLevel, children, ...props }) => {
  const getRiskInfo = (level) => {
    switch (level) {
      case 'high':
        return {
          title: 'Riesgo Alto',
          content: 'Se recomienda consulta médica urgente. La lesión presenta características que requieren evaluación profesional inmediata.',
          color: 'text-red-600 dark:text-red-400'
        }
      case 'medium':
        return {
          title: 'Riesgo Moderado',
          content: 'Se recomienda evaluación dermatológica. La lesión debe ser monitoreada y evaluada por un especialista.',
          color: 'text-yellow-600 dark:text-yellow-400'
        }
      case 'low':
        return {
          title: 'Riesgo Bajo',
          content: 'Mantener observación regular. Realizar chequeos periódicos y monitorear cambios.',
          color: 'text-green-600 dark:text-green-400'
        }
      default:
        return {
          title: 'Información de Riesgo',
          content: 'Nivel de riesgo no determinado. Consulte con un profesional médico.',
          color: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  const riskInfo = getRiskInfo(riskLevel)

  return (
    <MedicalTooltip
      title={riskInfo.title}
      content={riskInfo.content}
      {...props}
    >
      <span className={`cursor-help ${riskInfo.color}`}>
        {children}
      </span>
    </MedicalTooltip>
  )
})

RiskInfoTooltip.displayName = 'RiskInfoTooltip'

// Componente para información de confianza del modelo
export const ConfidenceTooltip = memo(({ confidence, children, ...props }) => {
  const getConfidenceInfo = (conf) => {
    const percentage = Math.round(conf * 100)
    
    if (percentage >= 90) {
      return {
        title: 'Confianza Muy Alta',
        content: `El modelo tiene una confianza del ${percentage}% en este resultado. Los patrones detectados son muy claros y consistentes.`,
        color: 'text-green-600 dark:text-green-400'
      }
    } else if (percentage >= 75) {
      return {
        title: 'Confianza Alta',
        content: `El modelo tiene una confianza del ${percentage}% en este resultado. Los patrones detectados son claros.`,
        color: 'text-blue-600 dark:text-blue-400'
      }
    } else if (percentage >= 60) {
      return {
        title: 'Confianza Moderada',
        content: `El modelo tiene una confianza del ${percentage}% en este resultado. Se recomienda evaluación adicional.`,
        color: 'text-yellow-600 dark:text-yellow-400'
      }
    } else {
      return {
        title: 'Confianza Baja',
        content: `El modelo tiene una confianza del ${percentage}% en este resultado. Se requiere evaluación médica profesional.`,
        color: 'text-red-600 dark:text-red-400'
      }
    }
  }

  const confidenceInfo = getConfidenceInfo(confidence)

  return (
    <MedicalTooltip
      title={confidenceInfo.title}
      content={confidenceInfo.content}
      {...props}
    >
      <span className={`cursor-help ${confidenceInfo.color}`}>
        {children}
      </span>
    </MedicalTooltip>
  )
})

ConfidenceTooltip.displayName = 'ConfidenceTooltip'

export default MedicalTooltip