import { memo, lazy, Suspense, useMemo, useCallback, useState, useEffect } from 'react'

// Lazy loading de componentes pesados
export const LazyEnhancedDetailedAnalysis = lazy(() => import('./EnhancedDetailedAnalysis'))
export const LazySmartRecommendationsSystem = lazy(() => import('./SmartRecommendationsSystem'))
export const LazyAnimationSystem = lazy(() => import('./AnimationSystem'))

// Componente de loading optimizado
export const OptimizedLoader = memo(({ size = 'md', message = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin text-blue-500 mb-4`}>
        <svg fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  )
})

OptimizedLoader.displayName = 'OptimizedLoader'

// Hook para optimización de re-renders
export const useOptimizedState = (initialValue) => {
  const [state, setState] = useState(initialValue)
  
  const optimizedSetState = useCallback((newValue) => {
    setState(prevState => {
      // Solo actualizar si el valor realmente cambió
      if (JSON.stringify(prevState) !== JSON.stringify(newValue)) {
        return newValue
      }
      return prevState
    })
  }, [])

  return [state, optimizedSetState]
}

// Hook para debounce de operaciones costosas
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook para intersection observer optimizado
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [element, setElement] = useState(null)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [element, options])

  return [setElement, isIntersecting]
}

// Componente para lazy loading con intersection observer
export const LazyLoadComponent = memo(({ 
  children, 
  fallback = <OptimizedLoader />,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [elementRef, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin
  })
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      setHasLoaded(true)
    }
  }, [isIntersecting, hasLoaded])

  return (
    <div ref={elementRef}>
      {hasLoaded ? children : fallback}
    </div>
  )
})

LazyLoadComponent.displayName = 'LazyLoadComponent'

// Componente optimizado para listas virtualizadas
export const VirtualizedList = memo(({ 
  items = [], 
  renderItem, 
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }))
  }, [items, scrollTop, itemHeight, containerHeight, overscan])

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, top }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
})

VirtualizedList.displayName = 'VirtualizedList'

// Hook para memoización de cálculos costosos
export const useExpensiveCalculation = (data, dependencies = []) => {
  return useMemo(() => {
    // Simular cálculo costoso
    if (!data) return null
    
    // Aquí iría la lógica de cálculo costoso
    return data
  }, [data, ...dependencies])
}

// Componente para manejo de errores optimizado
export const ErrorBoundary = memo(({ children, fallback }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (error) => {
      console.error('Error capturado por ErrorBoundary:', error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleError)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  if (hasError) {
    return fallback || (
      <div className="metric-card text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Algo salió mal
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Ha ocurrido un error inesperado. Por favor, recarga la página.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Recargar Página
        </button>
      </div>
    )
  }

  return children
})

ErrorBoundary.displayName = 'ErrorBoundary'

// Hook para optimización de imágenes
export const useOptimizedImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }
    
    img.onerror = () => {
      setError('Error al cargar la imagen')
      setIsLoading(false)
    }

    // Optimizaciones de carga
    if (options.lazy) {
      img.loading = 'lazy'
    }
    
    img.src = src
  }, [src, options.lazy])

  return { imageSrc, isLoading, error }
}

// Componente para imágenes optimizadas
export const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '',
  lazy = true,
  placeholder,
  ...props 
}) => {
  const { imageSrc, isLoading, error } = useOptimizedImage(src, { lazy })

  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 dark:text-gray-400 text-sm">Error al cargar imagen</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}>
        {placeholder || <div className="w-full h-full bg-gray-300 dark:bg-gray-600"></div>}
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      {...props}
    />
  )
})

OptimizedImage.displayName = 'OptimizedImage'

// Hook para gestión de memoria
export const useMemoryOptimization = () => {
  useEffect(() => {
    const cleanup = () => {
      // Limpiar referencias no utilizadas
      if (window.gc && typeof window.gc === 'function') {
        window.gc()
      }
    }

    // Limpiar cada 30 segundos
    const interval = setInterval(cleanup, 30000)

    return () => {
      clearInterval(interval)
      cleanup()
    }
  }, [])
}

// Componente wrapper para optimización general
export const PerformanceWrapper = memo(({ children, enableMemoryOptimization = true }) => {
  if (enableMemoryOptimization) {
    useMemoryOptimization()
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<OptimizedLoader message="Cargando componentes..." />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
})

PerformanceWrapper.displayName = 'PerformanceWrapper'

export default {
  LazyEnhancedDetailedAnalysis,
  LazySmartRecommendationsSystem,
  LazyAnimationSystem,
  OptimizedLoader,
  useOptimizedState,
  useDebounce,
  useIntersectionObserver,
  LazyLoadComponent,
  VirtualizedList,
  useExpensiveCalculation,
  ErrorBoundary,
  useOptimizedImage,
  OptimizedImage,
  useMemoryOptimization,
  PerformanceWrapper
}