import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = authService.isAuthenticated()
        const currentUser = authService.getCurrentUser()
        
        setIsAuthenticated(isAuth)
        setUser(currentUser)
      } catch (error) {
        console.error('Error checking authentication:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Función de login
  const login = async (username, password) => {
    try {
      setLoading(true)
      
      // Intentar login con el backend
      const result = await authService.login(username, password)
      
      if (result.success) {
        setIsAuthenticated(true)
        setUser(result.user)
        return result
      } else {
        // Si falla el backend, intentar validación local como fallback
        const isValidLocal = authService.validateCredentialsLocal(username, password)
        
        if (isValidLocal) {
          const localUser = {
            username,
            login_time: Date.now(),
            source: 'local'
          }
          
          // Simular token local
          localStorage.setItem('oncoderma_token', 'local-token-' + Date.now())
          localStorage.setItem('oncoderma_user', JSON.stringify(localUser))
          
          setIsAuthenticated(true)
          setUser(localUser)
          
          return {
            success: true,
            message: 'Autenticación exitosa (modo local)',
            user: localUser
          }
        } else {
          return result
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: 'Error de autenticación'
      }
    } finally {
      setLoading(false)
    }
  }

  // Función de logout
  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  // Función para refrescar el estado de autenticación
  const refreshAuth = () => {
    const isAuth = authService.isAuthenticated()
    const currentUser = authService.getCurrentUser()
    
    setIsAuthenticated(isAuth)
    setUser(currentUser)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}