import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

const Layout = () => {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const username = localStorage.getItem('username')
    
    // Si no está autenticado O no tiene username válido, redirigir al login
    if (!isAuthenticated || isAuthenticated !== 'true' || !username || username === 'Usuario') {
      // Limpiar localStorage corrupto
      localStorage.clear()
      navigate('/login', { replace: true })
    } else {
      setIsChecking(false)
    }
  }, [navigate])

  const handleLogout = () => {
    // Limpiar TODO el localStorage
    localStorage.clear()
    // Redirigir al login
    navigate('/login', { replace: true })
  }

  // Obtener nombre de usuario del localStorage
  const userName = localStorage.getItem('username')

  // No renderizar nada mientras se verifica la autenticación
  if (isChecking || !userName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <NavBar userName={userName} onLogout={handleLogout} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
