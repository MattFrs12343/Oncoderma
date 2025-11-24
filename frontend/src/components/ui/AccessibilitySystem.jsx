import { memo, useState, useEffect, useRef, createContext, useContext } from 'react'

// Contexto de accesibilidad
const AccessibilityContext = createContext({
  announcements: [],
  announce: () => {},
  focusManagement: true,
  highContrast: false,
  reducedMotion: false
})

// Provider de accesibilidad
export const AccessibilityProvider = memo(({ children }) => {
  const [announcements, setAnnouncements] = useState([])
  const [focusManagement, setFocusManagement] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Detectar preferencias del sistema
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    setReducedMotion(prefersReducedMotion)
    setHighContrast(prefersHighContrast)
  }, [])

  const announce = (message, priority = 'polite') => {
    const id = Date.now()
    const announcement = { id, message, priority, timestamp: new Date() }
    
    setAnnouncements(prev => [...prev, announcement])
    
    // Limpiar anuncio después de 5 segundos
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    }, 5000)
  }

  const value = {
    announcements,
    announce,
    focusManagement,
    setFocusManagement,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <LiveRegion announcements={announcements} />
    </AccessibilityContext.Provider>
  )
})

AccessibilityProvider.displayName = 'AccessibilityProvider'

// Hook para usar accesibilidad
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// Componente para región en vivo (screen readers)
const LiveRegion = memo(({ announcements }) => {
  return (
    <>
      {/* Región polite para anuncios normales */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements
          .filter(a => a.priority === 'polite')
          .slice(-1)
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))
        }
      </div>
      
      {/* Región assertive para anuncios urgentes */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements
          .filter(a => a.priority === 'assertive')
          .slice(-1)
          .map(a => (
            <div key={a.id}>{a.message}</div>
          ))
        }
      </div>
    </>
  )
})

LiveRegion.displayName = 'LiveRegion'

// Componente para manejo de foco
export const FocusManager = memo(({ children, restoreFocus = true, autoFocus = false }) => {
  const containerRef = useRef(null)
  const previousFocusRef = useRef(null)
  const { focusManagement } = useAccessibility()

  useEffect(() => {
    if (!focusManagement) return

    // Guardar elemento con foco actual
    previousFocusRef.current = document.activeElement

    if (autoFocus && containerRef.current) {
      // Enfocar primer elemento focusable
      const focusableElement = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElement) {
        focusableElement.focus()
      }
    }

    return () => {
      // Restaurar foco al desmontar
      if (restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [autoFocus, restoreFocus, focusManagement])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
})

FocusManager.displayName = 'FocusManager'

// Hook para navegación por teclado
export const useKeyboardNavigation = (items = [], onSelect) => {
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev - 1 + items.length) % items.length)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0 && items[activeIndex]) {
          onSelect?.(items[activeIndex], activeIndex)
        }
        break
      case 'Escape':
        setActiveIndex(-1)
        break
    }
  }

  return { activeIndex, setActiveIndex, handleKeyDown }
}

// Componente para botones accesibles
export const AccessibleButton = memo(({ 
  children, 
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) => {
  const { announce } = useAccessibility()
  const buttonRef = useRef(null)

  const handleClick = (e) => {
    if (disabled) return
    
    onClick?.(e)
    
    // Anunciar acción si es necesario
    if (ariaLabel) {
      announce(`${ariaLabel} activado`, 'polite')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white'
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 focus:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:bg-green-700 text-white'
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm min-h-[36px]'
      case 'md': return 'px-4 py-2 text-base min-h-[44px]'
      case 'lg': return 'px-6 py-3 text-lg min-h-[48px]'
      default: return 'px-4 py-2 text-base min-h-[44px]'
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`
        ${getVariantClass()} ${getSizeClass()}
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
})

AccessibleButton.displayName = 'AccessibleButton'

// Componente para inputs accesibles
export const AccessibleInput = memo(({ 
  label,
  error,
  hint,
  required = false,
  type = 'text',
  className = '',
  ...props 
}) => {
  const inputId = useRef(`input-${Math.random().toString(36).substr(2, 9)}`)
  const errorId = useRef(`error-${inputId.current}`)
  const hintId = useRef(`hint-${inputId.current}`)

  const getAriaDescribedBy = () => {
    const ids = []
    if (hint) ids.push(hintId.current)
    if (error) ids.push(errorId.current)
    return ids.length > 0 ? ids.join(' ') : undefined
  }

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId.current}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="requerido">*</span>}
        </label>
      )}
      
      {hint && (
        <p id={hintId.current} className="text-sm text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      )}
      
      <input
        id={inputId.current}
        type={type}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={getAriaDescribedBy()}
        className={`
          w-full px-3 py-2 border rounded-lg transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          }
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p id={errorId.current} className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

AccessibleInput.displayName = 'AccessibleInput'

// Componente para modales accesibles
export const AccessibleModal = memo(({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  className = ''
}) => {
  const modalRef = useRef(null)
  const { announce } = useAccessibility()

  useEffect(() => {
    if (isOpen) {
      announce(`Modal ${title} abierto`, 'polite')
      
      // Trap focus dentro del modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements?.length > 0) {
        focusableElements[0].focus()
      }
    }
  }, [isOpen, title, announce])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose?.()
    }
    
    // Trap focus
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements?.length > 0) {
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          onKeyDown={handleKeyDown}
          className={`
            relative bg-white dark:bg-gray-800 rounded-lg shadow-xl
            max-w-${size} w-full ${className}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <AccessibleButton
              onClick={onClose}
              variant="secondary"
              size="sm"
              ariaLabel="Cerrar modal"
              className="p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AccessibleButton>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
})

AccessibleModal.displayName = 'AccessibleModal'

// Componente para skip links
export const SkipLinks = memo(({ links = [] }) => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="
            absolute top-0 left-0 z-50 p-2 bg-blue-600 text-white
            focus:relative focus:z-auto
          "
        >
          {link.text}
        </a>
      ))}
    </div>
  )
})

SkipLinks.displayName = 'SkipLinks'

// Componente para indicadores de carga accesibles
export const AccessibleLoader = memo(({ 
  message = 'Cargando...', 
  size = 'md',
  className = '' 
}) => {
  const { announce } = useAccessibility()

  useEffect(() => {
    announce(message, 'polite')
  }, [message, announce])

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-label={message}
      className={`flex items-center justify-center ${className}`}
    >
      <svg 
        className={`animate-spin ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-blue-600`}
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="sr-only">{message}</span>
    </div>
  )
})

AccessibleLoader.displayName = 'AccessibleLoader'

export default {
  AccessibilityProvider,
  useAccessibility,
  FocusManager,
  useKeyboardNavigation,
  AccessibleButton,
  AccessibleInput,
  AccessibleModal,
  SkipLinks,
  AccessibleLoader
}