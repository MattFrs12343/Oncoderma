import { useState, useCallback, useMemo, useRef } from 'react'

/**
 * Hook optimizado para manejo de estado con memoización automática
 * Reduce re-renders innecesarios y optimiza el rendimiento
 */
export const useOptimizedState = (initialState) => {
  const [state, setState] = useState(initialState)
  const previousStateRef = useRef(initialState)

  // Setter optimizado que evita actualizaciones innecesarias
  const setOptimizedState = useCallback((newState) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' ? newState(prevState) : newState
      
      // Comparación superficial para evitar re-renders innecesarios
      if (JSON.stringify(nextState) === JSON.stringify(previousStateRef.current)) {
        return prevState
      }
      
      previousStateRef.current = nextState
      return nextState
    })
  }, [])

  // Resetear al estado inicial
  const resetState = useCallback(() => {
    setOptimizedState(initialState)
  }, [initialState, setOptimizedState])

  // Actualizar parcialmente el estado (para objetos)
  const updateState = useCallback((updates) => {
    setOptimizedState(prevState => ({
      ...prevState,
      ...updates
    }))
  }, [setOptimizedState])

  return [state, setOptimizedState, { resetState, updateState }]
}

/**
 * Hook para debounce optimizado
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef()

  useMemo(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para throttle optimizado
 */
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

/**
 * Hook para memoización de cálculos costosos
 */
export const useExpensiveCalculation = (calculation, dependencies) => {
  return useMemo(() => {
    console.log('Ejecutando cálculo costoso...')
    return calculation()
  }, dependencies)
}

/**
 * Hook para caché persistente con expiración
 */
export const usePersistentCache = (key, defaultValue, ttl = 5 * 60 * 1000) => {
  const [value, setValue] = useState(() => {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < ttl) {
          return data
        }
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn('Error reading from cache:', error)
    }
    return defaultValue
  })

  const setCachedValue = useCallback((newValue) => {
    try {
      const cacheData = {
        data: newValue,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
      setValue(newValue)
    } catch (error) {
      console.warn('Error writing to cache:', error)
      setValue(newValue)
    }
  }, [key])

  const clearCache = useCallback(() => {
    localStorage.removeItem(key)
    setValue(defaultValue)
  }, [key, defaultValue])

  return [value, setCachedValue, clearCache]
}

/**
 * Hook para batch de actualizaciones de estado
 */
export const useBatchedState = (initialState) => {
  const [state, setState] = useState(initialState)
  const batchedUpdates = useRef([])
  const timeoutRef = useRef()

  const batchUpdate = useCallback((update) => {
    batchedUpdates.current.push(update)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setState(prevState => {
        let newState = prevState
        batchedUpdates.current.forEach(update => {
          newState = typeof update === 'function' ? update(newState) : { ...newState, ...update }
        })
        batchedUpdates.current = []
        return newState
      })
    }, 0)
  }, [])

  return [state, batchUpdate]
}

/**
 * Hook para optimizar listas grandes con virtualización
 */
export const useVirtualizedList = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight
    }
  }, [items, itemHeight, containerHeight, scrollTop])

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return {
    visibleItems,
    handleScroll,
    totalHeight: visibleItems.totalHeight
  }
}