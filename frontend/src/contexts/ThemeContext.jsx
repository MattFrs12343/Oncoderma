import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  // IMPORTANTE: El tema ya está aplicado en el HTML por el script inline
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      // Leer del atributo data-theme que ya está aplicado
      const currentTheme = document.documentElement.getAttribute('data-theme')
      if (currentTheme) {
        return currentTheme
      }
      const savedTheme = localStorage.getItem('oncoderma-theme')
      if (savedTheme) {
        return savedTheme
      }
      // Detect system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Use ref for transient state to prevent unnecessary re-renders
  const isTransitioningRef = useRef(false)
  const isInitialMount = useRef(true)

  // Async localStorage persistence to avoid blocking UI thread
  const persistTheme = useCallback((newTheme) => {
    queueMicrotask(() => {
      try {
        localStorage.setItem('oncoderma-theme', newTheme)
      } catch (error) {
        console.warn('Failed to persist theme:', error)
      }
    })
  }, [])

  // Optimized DOM update - instant change
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement
    
    // Apply theme immediately without waiting for animation frame
    root.setAttribute('data-theme', newTheme)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newTheme === 'dark' ? '#0c1220' : '#f1f5f9'
      )
    }
    
    // Reset transition lock after a short delay
    requestAnimationFrame(() => {
      isTransitioningRef.current = false
    })
    
    // Persist theme asynchronously
    persistTheme(newTheme)
  }, [persistTheme])

  // Apply theme when it changes (skip on initial mount to avoid flash)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // En el primer mount, solo persistir si es necesario
      persistTheme(theme)
      return
    }
    applyTheme(theme)
  }, [theme, applyTheme, persistTheme])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only auto-change if no saved preference
      const savedTheme = localStorage.getItem('oncoderma-theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])



  // Immediate toggle without debounce for instant response
  const toggleTheme = useCallback(() => {
    // Prevent clicks during transition
    if (isTransitioningRef.current) return
    
    isTransitioningRef.current = true
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }, [])

  const setLightTheme = useCallback(() => {
    if (theme !== 'light' && !isTransitioningRef.current) {
      isTransitioningRef.current = true
      setTheme('light')
    }
  }, [theme])
  
  const setDarkTheme = useCallback(() => {
    if (theme !== 'dark' && !isTransitioningRef.current) {
      isTransitioningRef.current = true
      setTheme('dark')
    }
  }, [theme])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isTransitioning: isTransitioningRef.current
  }), [theme, toggleTheme, setLightTheme, setDarkTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
