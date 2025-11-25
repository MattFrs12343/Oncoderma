import { useTheme } from '../../contexts/ThemeContext'
import { memo, useState, useCallback } from 'react'

const ThemeToggle = memo(({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme()
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = useCallback(() => {
    setIsPressed(true)
    toggleTheme()
    
    requestAnimationFrame(() => {
      setTimeout(() => setIsPressed(false), 100)
    })
  }, [toggleTheme])

  return (
    <button
      onClick={handleClick}
      className={`
        relative p-2 rounded-lg 
        transition-all duration-100
        ${isPressed ? 'scale-95' : 'scale-100'}
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${className}
      `}
      style={{ 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
      aria-label={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
      title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
    >
      {isDark ? (
        <svg 
          className="w-5 h-5 text-yellow-500 transition-transform duration-150" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ transform: isPressed ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
      ) : (
        <svg 
          className="w-5 h-5 text-blue-600 transition-transform duration-150" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ transform: isPressed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      )}
    </button>
  )
})

ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle
