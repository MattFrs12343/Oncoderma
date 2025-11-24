import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-secondary">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>
        
        <h2 className="text-3xl font-bold text-primary mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Ir al Inicio
          </Button>
          <Button
            variant="outline"
            size="large"
            onClick={() => navigate(-1)}
          >
            Volver Atrás
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
