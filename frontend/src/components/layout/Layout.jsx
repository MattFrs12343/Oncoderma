import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

const Layout = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    // Redirigir al login
    navigate('/login')
  }

  // Obtener nombre de usuario del localStorage
  const userName = localStorage.getItem('username') || 'Usuario'

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
