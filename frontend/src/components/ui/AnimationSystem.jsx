import { memo, useState, useEffect, useRef } from 'react'

// Hook para animaciones de entrada
export const useEntranceAnimation = (delay = 0, threshold = 0.1) => {
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
      { threshold }
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
  }, [delay, threshold, hasAnimated])

  return { elementRef, isVisible, hasAnimated }
}

// Componente para animaciones de entrada
export const EntranceAnimation = memo(({ 
  children, 
  type = 'fadeInUp', // 'fadeInUp', 'fadeInScale', 'slideInRight', 'fadeIn'
  delay = 0,
  duration = 600,
  className = '',
  threshold = 0.1,
  once = true
}) => {
  const { elementRef, isVisible } = useEntranceAnimation(delay, threshold)

  const getAnimationClass = () => {
    const baseClass = `transition-all duration-${duration} ease-out`
    
    if (!isVisible) {
      switch (type) {
        case 'fadeInUp':
          return `${baseClass} opacity-0 translate-y-8`
        case 'fadeInScale':
          return `${baseClass} opacity-0 scale-95`
        case 'slideInRight':
          return `${baseClass} opacity-0 translate-x-8`
        case 'fadeIn':
          return `${baseClass} opacity-0`
        case 'slideInLeft':
          return `${baseClass} opacity-0 -translate-x-8`
        case 'fadeInDown':
          return `${baseClass} opacity-0 -translate-y-8`
        default:
          return `${baseClass} opacity-0 translate-y-8`
      }
    } else {
      return `${baseClass} opacity-100 translate-y-0 translate-x-0 scale-100`
    }
  }

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
})

EntranceAnimation.displayName = 'EntranceAnimation'

// Componente para animaciones escalonadas
export const StaggeredAnimation = memo(({ 
  children, 
  staggerDelay = 100,
  type = 'fadeInUp',
  className = ''
}) => {
  return (
    <div className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <EntranceAnimation
              key={index}
              type={type}
              delay={index * staggerDelay}
            >
              {child}
            </EntranceAnimation>
          ))
        : <EntranceAnimation type={type}>{children}</EntranceAnimation>
      }
    </div>
  )
})

StaggeredAnimation.displayName = 'StaggeredAnimation'

// Componente para micro-interacciones
export const MicroInteraction = memo(({ 
  children, 
  type = 'hover-lift', // 'hover-lift', 'hover-glow', 'hover-scale', 'click-bounce'
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isActive, setIsActive] = useState(false)

  const getMicroInteractionClass = () => {
    if (disabled) return ''

    switch (type) {
      case 'hover-lift':
        return 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
      case 'hover-glow':
        return 'transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25'
      case 'hover-scale':
        return 'transition-transform duration-200 hover:scale-105'
      case 'click-bounce':
        return `transition-transform duration-150 ${isActive ? 'scale-95' : 'scale-100'} active:scale-95`
      case 'hover-rotate':
        return 'transition-transform duration-300 hover:rotate-3'
      case 'hover-pulse':
        return 'transition-all duration-300 hover:animate-pulse'
      default:
        return 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    }
  }

  const handleMouseDown = () => setIsActive(true)
  const handleMouseUp = () => setIsActive(false)
  const handleMouseLeave = () => setIsActive(false)

  return (
    <div
      className={`${getMicroInteractionClass()} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
})

MicroInteraction.displayName = 'MicroInteraction'

// Componente para loading states animados
export const AnimatedLoader = memo(({ 
  type = 'pulse', // 'pulse', 'spin', 'bounce', 'wave'
  size = 'md', // 'sm', 'md', 'lg'
  color = 'blue',
  className = ''
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4'
      case 'md': return 'w-8 h-8'
      case 'lg': return 'w-12 h-12'
      default: return 'w-8 h-8'
    }
  }

  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'text-blue-500'
      case 'green': return 'text-green-500'
      case 'red': return 'text-red-500'
      case 'yellow': return 'text-yellow-500'
      default: return 'text-blue-500'
    }
  }

  if (type === 'pulse') {
    return (
      <div className={`${getSizeClass()} ${getColorClass()} ${className}`}>
        <div className="w-full h-full bg-current rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (type === 'spin') {
    return (
      <div className={`${getSizeClass()} ${className}`}>
        <svg className={`animate-spin ${getColorClass()}`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  if (type === 'bounce') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${getSizeClass()} ${getColorClass()} bg-current rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    )
  }

  if (type === 'wave') {
    return (
      <div className={`flex items-end space-x-1 ${className}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-1 ${getColorClass()} bg-current rounded-full animate-pulse`}
            style={{ 
              height: `${8 + (i % 2) * 4}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    )
  }

  return null
})

AnimatedLoader.displayName = 'AnimatedLoader'

// Componente para transiciones de estado
export const StateTransition = memo(({ 
  show, 
  children, 
  type = 'fade', // 'fade', 'slide', 'scale'
  duration = 300,
  className = ''
}) => {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!shouldRender) return null

  const getTransitionClass = () => {
    const baseClass = `transition-all duration-${duration} ease-in-out`
    
    switch (type) {
      case 'fade':
        return `${baseClass} ${show ? 'opacity-100' : 'opacity-0'}`
      case 'slide':
        return `${baseClass} ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`
      case 'scale':
        return `${baseClass} ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`
      default:
        return `${baseClass} ${show ? 'opacity-100' : 'opacity-0'}`
    }
  }

  return (
    <div className={`${getTransitionClass()} ${className}`}>
      {children}
    </div>
  )
})

StateTransition.displayName = 'StateTransition'

// Componente para animaciones de números
export const AnimatedNumber = memo(({ 
  value, 
  duration = 1000,
  format = (n) => n.toString(),
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const startValue = displayValue
    const endValue = value
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const currentValue = startValue + (endValue - startValue) * easeOut
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={`${isAnimating ? 'animate-pulse' : ''} ${className}`}>
      {format(displayValue)}
    </span>
  )
})

AnimatedNumber.displayName = 'AnimatedNumber'

// Componente para efectos de partículas
export const ParticleEffect = memo(({ 
  count = 20,
  color = 'blue',
  size = 'sm',
  className = ''
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100
  }))

  const getParticleClass = () => {
    const sizeClass = size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
    const colorClass = `bg-${color}-400`
    return `${sizeClass} ${colorClass} rounded-full absolute animate-ping`
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={getParticleClass()}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  )
})

ParticleEffect.displayName = 'ParticleEffect'

export default {
  EntranceAnimation,
  StaggeredAnimation,
  MicroInteraction,
  AnimatedLoader,
  StateTransition,
  AnimatedNumber,
  ParticleEffect,
  useEntranceAnimation
}