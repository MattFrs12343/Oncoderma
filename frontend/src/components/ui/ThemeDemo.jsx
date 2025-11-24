import { useTheme } from '../../contexts/ThemeContext'

const ThemeDemo = () => {
  const { theme, isDark } = useTheme()

  return (
    <div className="card max-w-2xl mx-auto mt-8">
      <h3 className="text-lg font-semibold text-primary mb-4">
        Demostración de Tema: {isDark ? 'Oscuro' : 'Claro'}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Colores principales */}
        <div className="space-y-3">
          <h4 className="font-medium text-secondary">Colores Principales</h4>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary rounded border border-gray-600/30"></div>
            <span className="text-sm text-primary">Primary (Texto principal)</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-secondary rounded border border-gray-600/30"></div>
            <span className="text-sm text-secondary">Secondary (Destacados)</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-accent rounded border border-gray-600/30"></div>
            <span className="text-sm text-accent">Accent (Acentos)</span>
          </div>
        </div>

        {/* Colores de estado */}
        <div className="space-y-3">
          <h4 className="font-medium text-secondary">Colores de Estado</h4>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-600 rounded border border-gray-600/30"></div>
            <span className="text-sm text-green-600">Éxito</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-red-600 rounded border border-gray-600/30"></div>
            <span className="text-sm text-red-600">Error</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-600 rounded border border-gray-600/30"></div>
            <span className="text-sm text-gray-600">Texto secundario</span>
          </div>
        </div>
      </div>

      {/* Botones de ejemplo */}
      <div className="mt-6 space-y-3">
        <h4 className="font-medium text-secondary">Componentes</h4>
        <div className="flex space-x-3">
          <button className="btn-primary">Botón Principal</button>
          <button className="btn-secondary">Botón Secundario</button>
        </div>
        
        <input 
          type="text" 
          placeholder="Campo de entrada de ejemplo" 
          className="input-field"
        />
      </div>

      {/* Información del tema actual */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Tema actual:</strong> {theme} | 
          <strong> Modo oscuro:</strong> {isDark ? 'Activado' : 'Desactivado'}
        </p>
      </div>
    </div>
  )
}

export default ThemeDemo