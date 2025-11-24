import { memo, Suspense, lazy, useState, useEffect, useRef } from 'react'
import LoadingSpinner from './LoadingSpinner'

/**
 * Wrapper para lazy loading de componentes con Intersection Observer
 */
const LazyComponent = memo(({
  importFunc,
  fallback = <LoadingSpinner />,
  threshold = 0.1,
  rootMargin = '50px',
  children,
  className = '',
  ...props
}) => {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [Component, setComponent] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, shouldLoad])

  useEffect(() => {
    if (shouldLoad && !Component) {
      const LazyLoadedComponent = lazy(importFunc)
      setComponent(() => LazyLoadedComponent)
    }
  }, [shouldLoad, Component, importFunc])

  return (
    <div ref={ref} className={className} {...props}>
      {Component ? (
        <Suspense fallback={fallback}>
          <Component {...props}>
            {children}
          </Component>
        </Suspense>
      ) : (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-gray-400 text-sm">Cargando componente...</div>
        </div>
      )}
    </div>
  )
})

LazyComponent.displayName = 'LazyComponent'

/**
 * HOC para hacer cualquier componente lazy
 */
export const withLazyLoading = (importFunc, options = {}) => {
  return memo((props) => (
    <LazyComponent
      importFunc={importFunc}
      {...options}
      {...props}
    />
  ))
}

/**
 * Componente para lazy loading de secciones de página
 */
export const LazySection = memo(({
  children,
  placeholder = null,
  className = '',
  minHeight = '200px',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ minHeight }}
      {...props}
    >
      {isVisible ? children : (
        placeholder || (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-32"></div>
          </div>
        )
      )}
    </div>
  )
})

LazySection.displayName = 'LazySection'

/**
 * Hook para lazy loading manual
 */
export const useLazyLoad = (threshold = 0.1, rootMargin = '50px') => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin])

  return [ref, isVisible]
}

/**
 * Componente para precargar componentes en idle time
 */
export const ComponentPreloader = memo(({ components = [] }) => {
  useEffect(() => {
    // Usar requestIdleCallback si está disponible
    const preloadComponents = () => {
      components.forEach((importFunc, index) => {
        setTimeout(() => {
          importFunc().catch(console.warn)
        }, index * 100) // Espaciar las cargas
      })
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadComponents, { timeout: 5000 })
    } else {
      setTimeout(preloadComponents, 1000)
    }
  }, [components])

  return null
})

ComponentPreloader.displayName = 'ComponentPreloader'

export default LazyComponent