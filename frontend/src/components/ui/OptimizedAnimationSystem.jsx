import { memo, useState, useEffect, useRef } from 'react'

// Hook optimizado para animaciones de entrada - sin Intersection Observer para resultados
export const useOptimizedEntranceAnimation = (delay = 0, autoTrigger = true) => {
  const [isVisible, setIsVisible] = useState(autoTrigger)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    if (autoTrigger && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasAnimated(true)
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [delay, hasAnimated, autoTrigger])

  return { elementRef, isVisible, hasAnimated }
}

// Componente optimizado para animaciones de entrada - especial para resultados
export const OptimizedEntranceAnimation = memo(({ 
  children, 
  type = 'fadeInUp',
  delay = 0,
  duration = 400, // Más rápido que el original
  className = '',
  autoTrigger = true, // Nuevo prop para controlar si se activa automáticamente
  ...props
}) => {
  const { elementRef, isVisible } = useOptimizedEntranceAnimation(delay, autoTrigger)

  const getAnimationClass = () => {
    const baseClass = `transition-all ease-out`
    const durationClass = duration <= 200 ? 'duration-200' : 
                         duration <= 300 ? 'duration-300' : 
                         duration <= 500 ? 'duration-500' : 'duration-700'
    
    if (!isVisible) {
      switch (type) {
        case 'fadeInUp':
          return `${baseClass} ${durationClass} opacity-0 translate-y-4`
        case 'fadeInScale':
          return `${baseClass} ${durationClass} opacity-0 scale-98`
        case 'slideInRight':
          return `${baseClass} ${durationClass} opacity-0 translate-x-4`
        case 'fadeIn':
          return `${baseClass} ${durationClass} opacity-0`
        case 'slideInLeft':
          return `${baseClass} ${durationClass} opacity-0 -translate-x-4`
        case 'fadeInDown':
          return `${baseClass} ${durationClass} opacity-0 -translate-y-4`
        default:
          return `${baseClass} ${durationClass} opacity-0 translate-y-4`
      }
    } else {
      return `${baseClass} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`
    }
  }

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`} {...props}>
      {children}
    </div>
  )
})

OptimizedEntranceAnimation.displayName = 'OptimizedEntranceAnimation'

// Componente para resultados que aparecen inmediatamente
export const ResultsAnimation = memo(({ 
  children, 
  delay = 0,
  className = ''
}) => {
  return (
    <OptimizedEntranceAnimation
      type="fadeInUp"
      delay={delay}
      duration={300}
      autoTrigger={true}
      className={className}
    >
      {children}
    </OptimizedEntranceAnimation>
  )
})

ResultsAnimation.displayName = 'ResultsAnimation'

// Componente para animaciones escalonadas optimizadas
export const OptimizedStaggeredAnimation = memo(({ 
  children, 
  staggerDelay = 50, // Más rápido
  type = 'fadeInUp',
  className = '',
  autoTrigger = true
}) => {
  return (
    <div className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <OptimizedEntranceAnimation
              key={index}
              type={type}
              delay={index * staggerDelay}
              duration={300}
              autoTrigger={autoTrigger}
            >
              {child}
            </OptimizedEntranceAnimation>
          ))
        : <OptimizedEntranceAnimation type={type} autoTrigger={autoTrigger}>{children}</OptimizedEntranceAnimation>
      }
    </div>
  )
})

OptimizedStaggeredAnimation.displayName = 'OptimizedStaggeredAnimation'

// Componente para animaciones con Intersection Observer (para elementos que no son críticos)
export const LazyEntranceAnimation = memo(({ 
  children, 
  type = 'fadeInUp',
  delay = 0,
  duration = 400,
  className = '',
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        }
      },
      { threshold, rootMargin }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [delay, threshold, rootMargin, hasAnimated])

  const getAnimationClass = () => {
    const baseClass = `transition-all ease-out`
    const durationClass = duration <= 200 ? 'duration-200' : 
                         duration <= 300 ? 'duration-300' : 
                         duration <= 500 ? 'duration-500' : 'duration-700'
    
    if (!isVisible) {
      switch (type) {
        case 'fadeInUp':
          return `${baseClass} ${durationClass} opacity-0 translate-y-8`
        case 'fadeInScale':
          return `${baseClass} ${durationClass} opacity-0 scale-95`
        case 'slideInRight':
          return `${baseClass} ${durationClass} opacity-0 translate-x-8`
        case 'fadeIn':
          return `${baseClass} ${durationClass} opacity-0`
        default:
          return `${baseClass} ${durationClass} opacity-0 translate-y-8`
      }
    } else {
      return `${baseClass} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`
    }
  }

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
})

LazyEntranceAnimation.displayName = 'LazyEntranceAnimation'

// Componente para animaciones instantáneas (sin delay)
export const InstantAnimation = memo(({ 
  children, 
  type = 'fadeIn',
  className = ''
}) => {
  return (
    <OptimizedEntranceAnimation
      type={type}
      delay={0}
      duration={200}
      autoTrigger={true}
      className={className}
    >
      {children}
    </OptimizedEntranceAnimation>
  )
})

InstantAnimation.displayName = 'InstantAnimation'

export default {
  OptimizedEntranceAnimation,
  ResultsAnimation,
  OptimizedStaggeredAnimation,
  LazyEntranceAnimation,
  InstantAnimation,
  useOptimizedEntranceAnimation
}