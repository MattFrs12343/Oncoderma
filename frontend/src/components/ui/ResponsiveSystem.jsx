import { memo, useState, useEffect, useRef } from 'react'

// Hook para detectar tamaño de pantalla
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  const [breakpoint, setBreakpoint] = useState('lg')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setScreenSize({ width, height })
      
      // Determinar breakpoint
      if (width < 480) {
        setBreakpoint('xs')
      } else if (width < 768) {
        setBreakpoint('sm')
      } else if (width < 1024) {
        setBreakpoint('md')
      } else if (width < 1280) {
        setBreakpoint('lg')
      } else {
        setBreakpoint('xl')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    ...screenSize,
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl'
  }
}

// Componente para layouts responsivos
export const ResponsiveGrid = memo(({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = ''
}) => {
  const { breakpoint } = useResponsive()
  
  const getCurrentCols = () => {
    return cols[breakpoint] || cols.lg || 4
  }

  const getGridClass = () => {
    const currentCols = getCurrentCols()
    return `grid grid-cols-${currentCols} gap-${gap}`
  }

  return (
    <div className={`${getGridClass()} ${className}`}>
      {children}
    </div>
  )
})

ResponsiveGrid.displayName = 'ResponsiveGrid'

// Componente para contenedores adaptativos
export const ResponsiveContainer = memo(({ 
  children, 
  maxWidth = 'lg', // 'sm', 'md', 'lg', 'xl', '2xl'
  padding = true,
  className = ''
}) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm'
      case 'md': return 'max-w-md'
      case 'lg': return 'max-w-4xl'
      case 'xl': return 'max-w-6xl'
      case '2xl': return 'max-w-7xl'
      default: return 'max-w-4xl'
    }
  }

  const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : ''

  return (
    <div className={`mx-auto ${getMaxWidthClass()} ${paddingClass} ${className}`}>
      {children}
    </div>
  )
})

ResponsiveContainer.displayName = 'ResponsiveContainer'

// Componente para navegación móvil
export const MobileNavigation = memo(({ 
  items = [], 
  activeItem,
  onItemClick,
  className = ''
}) => {
  const { isMobile } = useResponsive()

  if (!isMobile) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 ${className}`}>
      <div className="flex items-center justify-around py-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onItemClick?.(item)}
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200
              ${activeItem === item.id 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
})

MobileNavigation.displayName = 'MobileNavigation'

// Componente para gestos táctiles
export const TouchGesture = memo(({ 
  children, 
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = ''
}) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const isVerticalSwipe = Math.abs(deltaY) > Math.abs(deltaX)

    if (isHorizontalSwipe && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }

    if (isVerticalSwipe && Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        onSwipeUp?.()
      } else {
        onSwipeDown?.()
      }
    }
  }

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
})

TouchGesture.displayName = 'TouchGesture'

// Componente para texto responsivo
export const ResponsiveText = memo(({ 
  children, 
  size = { xs: 'text-sm', sm: 'text-base', md: 'text-lg', lg: 'text-xl' },
  className = ''
}) => {
  const { breakpoint } = useResponsive()
  
  const getCurrentSize = () => {
    return size[breakpoint] || size.lg || 'text-base'
  }

  return (
    <span className={`${getCurrentSize()} ${className}`}>
      {children}
    </span>
  )
})

ResponsiveText.displayName = 'ResponsiveText'

// Componente para imágenes responsivas
export const ResponsiveImage = memo(({ 
  src, 
  alt, 
  sizes = { xs: 'w-full', sm: 'w-1/2', md: 'w-1/3', lg: 'w-1/4' },
  className = '',
  ...props 
}) => {
  const { breakpoint } = useResponsive()
  
  const getCurrentSize = () => {
    return sizes[breakpoint] || sizes.lg || 'w-full'
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${getCurrentSize()} ${className}`} 
      {...props}
    />
  )
})

ResponsiveImage.displayName = 'ResponsiveImage'

// Hook para detección de orientación
export const useOrientation = () => {
  const [orientation, setOrientation] = useState('portrait')

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    handleOrientationChange()
    window.addEventListener('resize', handleOrientationChange)
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  return orientation
}

// Componente para modales responsivos
export const ResponsiveModal = memo(({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  className = ''
}) => {
  const { isMobile } = useResponsive()
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const getSizeClass = () => {
    if (isMobile) return 'w-full h-full'
    
    switch (size) {
      case 'sm': return 'max-w-md'
      case 'md': return 'max-w-lg'
      case 'lg': return 'max-w-2xl'
      case 'xl': return 'max-w-4xl'
      case 'full': return 'w-full h-full'
      default: return 'max-w-lg'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className={`
            relative bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all
            ${getSizeClass()} ${isMobile ? 'rounded-none' : 'rounded-lg'} ${className}
          `}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
})

ResponsiveModal.displayName = 'ResponsiveModal'

// Componente para botones táctiles optimizados
export const TouchOptimizedButton = memo(({ 
  children, 
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const { isMobile } = useResponsive()

  const getSizeClass = () => {
    const mobileAdjustment = isMobile ? 'min-h-[44px] min-w-[44px]' : ''
    
    switch (size) {
      case 'sm':
        return `px-3 py-2 text-sm ${mobileAdjustment}`
      case 'md':
        return `px-4 py-2 text-base ${mobileAdjustment}`
      case 'lg':
        return `px-6 py-3 text-lg ${mobileAdjustment}`
      default:
        return `px-4 py-2 text-base ${mobileAdjustment}`
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
      case 'outline':
        return 'border border-gray-300 hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <button
      className={`
        ${getSizeClass()} ${getVariantClass()}
        rounded-lg font-medium transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        active:scale-95 touch-manipulation
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
})

TouchOptimizedButton.displayName = 'TouchOptimizedButton'

export default {
  ResponsiveGrid,
  ResponsiveContainer,
  MobileNavigation,
  TouchGesture,
  ResponsiveText,
  ResponsiveImage,
  ResponsiveModal,
  TouchOptimizedButton,
  useResponsive,
  useOrientation
}