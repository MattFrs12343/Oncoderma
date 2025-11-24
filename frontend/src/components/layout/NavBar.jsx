import { useState, memo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import ThemeToggle from '../ui/ThemeToggle'
import AdaptiveLogo from '../ui/AdaptiveLogo'

const NavBar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Analizar', href: '/analizar', current: location.pathname === '/analizar' },
    { name: 'FAQ', href: '/faq', current: location.pathname === '/faq' },
    { name: 'Contacto', href: '/contacto', current: location.pathname === '/contacto' },
  ]

  const handleLogout = useCallback(() => {
    logout()
    setIsMenuOpen(false)
  }, [logout])

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20">
          {/* Logo y marca */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <AdaptiveLogo className="h-10 sm:h-12 lg:h-14 w-auto" alt="OncoDerma" />
            </Link>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.current
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Toggle de tema */}
            <div className="flex items-center ml-4 pl-4 relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <ThemeToggle />
            </div>
            
            {/* Usuario y logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Hola, <span className="font-medium text-gray-900 dark:text-white">{user?.displayName || user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[44px] min-h-[44px]"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {/* Icono hamburguesa */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icono X */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-3 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 min-h-[48px] flex items-center ${
                  item.current
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Toggle de tema móvil */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center justify-between min-h-[48px]">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Tema</span>
                <ThemeToggle />
              </div>
            </div>
            
            {/* Usuario y logout móvil */}
            <div className="pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Hola, <span className="font-medium text-gray-900 dark:text-white">{user?.displayName || user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 min-h-[48px]"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
})

export default NavBar