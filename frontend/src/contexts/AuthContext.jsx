import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedToken = localStorage.getItem('oncoderma_token')
    const savedUser = localStorage.getItem('oncoderma_user')
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error al cargar sesión:', error)
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password)
      
      if (response.success && response.token) {
        setToken(response.token)
        setUser(response.user)
        localStorage.setItem('oncoderma_token', response.token)
        localStorage.setItem('oncoderma_user', JSON.stringify(response.user))
        return { success: true }
      }
      
      return { success: false, message: response.message || 'Error al iniciar sesión' }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, message: error.message || 'Error de conexión' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('oncoderma_token')
    localStorage.removeItem('oncoderma_user')
  }

  const isAuthenticated = () => {
    return !!token && !!user
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
