import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

/**
 * Componente que maneja la redirección automática al HOME
 */
const AutoRedirect = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Solo redirigir si el usuario está autenticado y no está ya en una ruta específica
    if (isAuthenticated) {
      const currentPath = location.pathname
      
      // Si está en la raíz o en una ruta no válida, redirigir al home
      if (currentPath === '/' || currentPath === '/home' || currentPath === '') {
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, location.pathname, navigate])

  return null // Este componente no renderiza nada
}

export default AutoRedirect