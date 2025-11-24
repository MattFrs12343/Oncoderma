import { useRef, useCallback, useEffect } from 'react'

export const useWebWorker = (workerScript) => {
  const workerRef = useRef(null)
  const tasksRef = useRef(new Map())
  
  // Inicializar worker
  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(workerScript)
      
      workerRef.current.onmessage = (e) => {
        const { type, data, error } = e.data
        const taskId = data?.taskId || 'default'
        const task = tasksRef.current.get(taskId)
        
        if (task) {
          if (error) {
            task.reject(new Error(error))
          } else {
            task.resolve({ type, data })
          }
          tasksRef.current.delete(taskId)
        }
      }
      
      workerRef.current.onerror = (error) => {
        console.error('Worker error:', error)
        // Rechazar todas las tareas pendientes
        tasksRef.current.forEach(task => {
          task.reject(new Error('Worker error'))
        })
        tasksRef.current.clear()
      }
    }
    
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [workerScript])
  
  // Ejecutar tarea en el worker
  const executeTask = useCallback((type, data) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Web Worker not supported'))
        return
      }
      
      const taskId = Date.now() + Math.random()
      tasksRef.current.set(taskId, { resolve, reject })
      
      workerRef.current.postMessage({
        type,
        data: { ...data, taskId }
      })
      
      // Timeout después de 30 segundos
      setTimeout(() => {
        if (tasksRef.current.has(taskId)) {
          tasksRef.current.delete(taskId)
          reject(new Error('Task timeout'))
        }
      }, 30000)
    })
  }, [])
  
  // Verificar si Web Workers están soportados
  const isSupported = typeof Worker !== 'undefined'
  
  return {
    executeTask,
    isSupported,
    isReady: !!workerRef.current
  }
}