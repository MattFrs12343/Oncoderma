import { useState, useCallback, useRef } from 'react'

/**
 * Hook para gestionar el estado de las animaciones de análisis
 * Estados: idle -> analyzing -> transitioning -> complete | error
 */
export const useAnalysisAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState('idle')
  const [imageBoxVisible, setImageBoxVisible] = useState(true)
  const [resultsVisible, setResultsVisible] = useState(false)
  const historyHeaderRef = useRef(null)
  const errorRef = useRef(null)

  const startAnalysis = useCallback(() => {
    setAnimationPhase('analyzing')
  }, [])

  const completeAnalysis = useCallback(() => {
    setAnimationPhase('transitioning')
    
    // Después de 300ms (duración de la animación de salida de la imagen)
    setTimeout(() => {
      setImageBoxVisible(false)
      setResultsVisible(true)
      setAnimationPhase('complete')
      
      // Mover foco al header del historial después de que la animación complete
      setTimeout(() => {
        if (historyHeaderRef.current) {
          historyHeaderRef.current.focus()
        }
      }, 450) // Esperar a que termine la animación de entrada
    }, 300)
  }, [])

  const handleError = useCallback(() => {
    setAnimationPhase('error')
    
    // Revertir animación
    setTimeout(() => {
      setResultsVisible(false)
      setImageBoxVisible(true)
      setAnimationPhase('idle')
      
      // Mover foco al mensaje de error
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.focus()
        }
      }, 350)
    }, 100)
  }, [])

  const reset = useCallback(() => {
    setAnimationPhase('idle')
    setImageBoxVisible(true)
    setResultsVisible(false)
  }, [])

  return {
    animationPhase,
    imageBoxVisible,
    resultsVisible,
    historyHeaderRef,
    errorRef,
    startAnalysis,
    completeAnalysis,
    handleError,
    reset,
  }
}
