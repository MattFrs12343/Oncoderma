import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * Wrapper animado para la caja de carga de imagen
 * Animación de salida: scale down + fade out + translateY up
 * Animación de entrada (error reversion): scale up + fade in + translateY down
 */
const AnimatedImageUploadBox = ({ 
  children, 
  isVisible, 
  animationPhase,
  onImageSelect,
  preview,
  imageMetadata,
  isAnalyzing 
}) => {
  const { theme } = useTheme()

  // Determinar clases de animación basadas en el estado
  const getAnimationClasses = () => {
    if (animationPhase === 'transitioning' && isVisible) {
      // Animación de salida (mobile usa versión más rápida)
      return 'animate-image-box-exit sm:animate-image-box-exit max-sm:animate-image-box-exit-mobile'
    }
    if (animationPhase === 'error' && !isVisible) {
      // Animación de entrada (reversion)
      return 'animate-image-box-enter sm:animate-image-box-enter max-sm:animate-image-box-enter-mobile'
    }
    return ''
  }

  // No renderizar si no es visible y no está en transición
  if (!isVisible && animationPhase !== 'transitioning') {
    return null
  }

  return (
    <div
      className={`
        rounded-xl p-5 border transition-all
        ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-md'}
        ${getAnimationClasses()}
        ${animationPhase === 'transitioning' ? 'pointer-events-none' : ''}
      `}
      style={{
        willChange: animationPhase === 'transitioning' ? 'transform, opacity' : 'auto'
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div 
          className={`
            p-2 rounded-lg shadow-sm
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-600/20' 
              : 'bg-gradient-to-br from-purple-500 to-pink-600'
            }
          `}
        >
          <svg 
            className={`
              w-4 h-4
              ${theme === 'dark' ? 'text-purple-400' : 'text-white'}
            `} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Imagen de la Lesión
        </h3>
      </div>
      
      {children}
    </div>
  )
}

export default AnimatedImageUploadBox
