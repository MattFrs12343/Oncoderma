import { Outlet, Link } from 'react-router-dom'
import NavBar from './NavBar'
import SystemInfo from '../common/SystemInfo'
import PerformanceMetrics from '../common/PerformanceMetrics'
import FooterLogo from '../ui/FooterLogo'

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Barra de navegación */}
      <NavBar />
      
      {/* Contenido principal */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      
      {/* Footer mejorado */}
      <footer className="bg-background border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo y descripción */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <FooterLogo className="h-12 w-auto" />
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Análisis de piel con inteligencia artificial
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Tecnología avanzada para el cuidado de la salud
                </p>
                <div className="flex items-center justify-center md:justify-start mt-2 space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Sistema activo</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">IA Avanzada</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enlaces y navegación */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Navegación
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Link to="/home" className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Inicio</span>
                </Link>
                <Link to="/analizar" className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span>Análisis</span>
                </Link>
                <Link to="/faq" className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>FAQ</span>
                </Link>
                <Link to="/contacto" className="flex items-center justify-center space-x-2 text-xs text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                  </svg>
                  <span>Contacto</span>
                </Link>
              </div>
            </div>
            
            {/* Disclaimer médico */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <h3 className="text-sm font-semibold text-primary flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Aviso Médico
              </h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-sm">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-center md:text-right">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                      <strong>Importante:</strong> Esta aplicación es una herramienta de apoyo y no reemplaza el diagnóstico médico profesional. Siempre consulta con un dermatólogo especialista.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright y herramientas de desarrollo */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  © 2024 OncoDerma. Desarrollado para fines educativos y de demostración.
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>Versión 1.0.0</span>
                  <span>•</span>
                  <span>React + FastAPI</span>
                </div>
              </div>
              
              {/* Herramientas de desarrollo */}
              {process.env.NODE_ENV === 'development' && (
                <div className="flex items-center space-x-4">
                  <PerformanceMetrics />
                  <SystemInfo />
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout