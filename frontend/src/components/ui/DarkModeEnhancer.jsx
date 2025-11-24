import { memo, useEffect, useState } from 'react'

const DarkModeEnhancer = memo(({ children, className = '' }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Detectar tema actual
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()

    // Observar cambios de tema
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`${isDark ? 'dark-mode-enhanced' : ''} ${className}`}>
      {children}
    </div>
  )
})

DarkModeEnhancer.displayName = 'DarkModeEnhancer'

// Componente para iconos adaptativos al modo oscuro
export const AdaptiveIcon = memo(({ 
  lightIcon, 
  darkIcon, 
  size = 'w-6 h-6', 
  className = '',
  ...props 
}) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const IconComponent = isDark ? darkIcon : lightIcon

  return (
    <IconComponent 
      className={`${size} ${className} transition-all duration-300`} 
      {...props} 
    />
  )
})

AdaptiveIcon.displayName = 'AdaptiveIcon'

// Componente para gradientes adaptativos
export const AdaptiveGradient = memo(({ 
  lightGradient, 
  darkGradient, 
  className = '',
  children 
}) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const gradientClass = isDark ? darkGradient : lightGradient

  return (
    <div className={`${gradientClass} ${className} transition-all duration-300`}>
      {children}
    </div>
  )
})

AdaptiveGradient.displayName = 'AdaptiveGradient'

// Componente para texto con contraste optimizado
export const OptimizedText = memo(({ 
  children, 
  variant = 'primary', // 'primary', 'secondary', 'tertiary', 'muted'
  className = '',
  ...props 
}) => {
  const getTextClass = (variant) => {
    switch (variant) {
      case 'primary':
        return 'text-gray-900 dark:text-gray-50'
      case 'secondary':
        return 'text-gray-700 dark:text-gray-200'
      case 'tertiary':
        return 'text-gray-600 dark:text-gray-300'
      case 'muted':
        return 'text-gray-500 dark:text-gray-400'
      case 'medical-primary':
        return 'text-gray-900 dark:text-white'
      case 'medical-secondary':
        return 'text-gray-700 dark:text-gray-100'
      case 'medical-accent':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-900 dark:text-gray-50'
    }
  }

  return (
    <span className={`${getTextClass(variant)} ${className}`} {...props}>
      {children}
    </span>
  )
})

OptimizedText.displayName = 'OptimizedText'

// Componente para superficies con elevación adaptativa
export const AdaptiveSurface = memo(({ 
  elevation = 1, // 1-5
  children, 
  className = '',
  interactive = false,
  ...props 
}) => {
  const getElevationClass = (level) => {
    const baseClass = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300'
    
    switch (level) {
      case 1:
        return `${baseClass} shadow-sm dark:shadow-gray-900/20`
      case 2:
        return `${baseClass} shadow-md dark:shadow-gray-900/30`
      case 3:
        return `${baseClass} shadow-lg dark:shadow-gray-900/40`
      case 4:
        return `${baseClass} shadow-xl dark:shadow-gray-900/50`
      case 5:
        return `${baseClass} shadow-2xl dark:shadow-gray-900/60`
      default:
        return `${baseClass} shadow-sm dark:shadow-gray-900/20`
    }
  }

  const interactiveClass = interactive 
    ? 'hover:shadow-lg dark:hover:shadow-gray-900/40 hover:-translate-y-1 cursor-pointer' 
    : ''

  return (
    <div 
      className={`${getElevationClass(elevation)} ${interactiveClass} ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
})

AdaptiveSurface.displayName = 'AdaptiveSurface'

// Componente para bordes adaptativos
export const AdaptiveBorder = memo(({ 
  children, 
  variant = 'default', // 'default', 'accent', 'success', 'warning', 'error'
  className = '',
  ...props 
}) => {
  const getBorderClass = (variant) => {
    switch (variant) {
      case 'accent':
        return 'border-blue-200 dark:border-blue-700'
      case 'success':
        return 'border-green-200 dark:border-green-700'
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-700'
      case 'error':
        return 'border-red-200 dark:border-red-700'
      default:
        return 'border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div className={`border ${getBorderClass(variant)} ${className}`} {...props}>
      {children}
    </div>
  )
})

AdaptiveBorder.displayName = 'AdaptiveBorder'

// Hook para detectar tema actual
export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return { isDark, toggleTheme }
}

// Componente para toggle de tema mejorado
export const EnhancedThemeToggle = memo(({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDark 
          ? 'bg-blue-600 dark:bg-blue-500' 
          : 'bg-gray-300 hover:bg-gray-400'
        }
        ${className}
      `}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle circle */}
      <div
        className={`
          absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 flex items-center justify-center
          ${isDark ? 'translate-x-7' : 'translate-x-0.5'}
        `}
      >
        {/* Icon */}
        <div className="text-xs">
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
        <span className={`transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-70'}`}>
          ☀️
        </span>
        <span className={`transition-opacity duration-300 ${isDark ? 'opacity-70' : 'opacity-0'}`}>
          🌙
        </span>
      </div>
    </button>
  )
})

EnhancedThemeToggle.displayName = 'EnhancedThemeToggle'

export default DarkModeEnhancer