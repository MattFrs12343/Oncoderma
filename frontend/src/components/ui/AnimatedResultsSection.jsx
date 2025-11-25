import React from 'react'

/**
 * Wrapper animado para la sección de resultados
 * Animación de entrada: slide up + fade in + shadow
 * Animación de salida (error reversion): slide down + fade out
 */
const AnimatedResultsSection = ({ 
  children, 
  isVisible, 
  animationPhase,
  historyHeaderRef 
}) => {
  // Determinar clases de animación basadas en el estado
  const getAnimationClasses = () => {
    if (animationPhase === 'transitioning' && isVisible) {
      // Animación de entrada con delay (mobile usa versión más rápida)
      return 'animate-results-enter sm:animate-results-enter max-sm:animate-results-enter-mobile'
    }
    if (animationPhase === 'error' && isVisible) {
      // Animación de salida (reversion)
      return 'animate-results-exit sm:animate-results-exit max-sm:animate-results-exit-mobile'
    }
    return ''
  }

  // No renderizar si no es visible
  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`
        ${getAnimationClasses()}
        ${animationPhase === 'transitioning' ? 'pointer-events-none' : ''}
      `}
      style={{
        willChange: animationPhase === 'transitioning' ? 'transform, opacity' : 'auto'
      }}
    >
      {/* Clonar children y pasar ref al HistorySection */}
      {React.cloneElement(children, { historyHeaderRef })}
    </div>
  )
}

export default AnimatedResultsSection
