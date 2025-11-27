import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeToggle from '../ui/ThemeToggle'

const NavBar = ({ 
  navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/analizar', label: 'Analizar' },
    { path: '/buscar', label: 'Buscar' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contacto', label: 'Contacto' },
  ],
  userName = 'Usuario',
  onLogout = () => {}
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { theme } = useTheme()

  const isActive = (path) => location.pathname === path

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
            <img 
              src={theme === 'light' ? '/img/OncoDerma-Logo.png' : '/img/DarckLogoOscuro.png'} 
              alt="OncoDerma" 
              className="h-10 sm:h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <div className="flex items-center ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
              <ThemeToggle />
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300 dark:border-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Hola, <span className="font-medium text-gray-900 dark:text-white">{userName}</span>
              </span>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[44px] min-h-[44px]"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 min-h-[48px] flex items-center ${
                  isActive(link.path)
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Theme Toggle Mobile */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center justify-between min-h-[48px]">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Tema</span>
                <ThemeToggle />
              </div>
            </div>
            
            {/* User Info Mobile */}
            <div className="pt-2 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Hola, <span className="font-medium text-gray-900 dark:text-white">{userName}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout()
                    closeMenu()
                  }}
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
}

export default NavBar
