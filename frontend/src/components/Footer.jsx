import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <div className="mb-4">
              <Logo className="h-8 w-auto" textClassName="text-lg" />
            </div>
            <p className="text-sm text-gray-600">
              Análisis de piel con inteligencia artificial para apoyo en detección temprana.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-secondary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/analizar" className="text-sm text-gray-600 hover:text-secondary">
                  Analizar
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 hover:text-secondary">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm text-gray-600 hover:text-secondary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">Información</h3>
            <p className="text-xs text-gray-600 mb-4">
              ⚠️ Este sistema es solo con fines académicos y de investigación. 
              NO reemplaza una evaluación médica profesional.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} OncoDerma. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
