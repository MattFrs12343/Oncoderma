import { useTheme } from '../../contexts/ThemeContext'
import Alert from '../Alert'

const PatientForm = ({
  formData,
  error,
  loading,
  sexOptions,
  anatomSiteOptions,
  onChange,
  onSubmit,
  onReset,
  submitButtonText = 'Siguiente',
}) => {
  const { theme } = useTheme()

  return (
    <div
      className={`
        rounded-xl p-6 max-w-2xl mx-auto border
        ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-md'}
      `}
    >
      <div className="flex items-center justify-center gap-3 mb-5">
        <div 
          className={`
            p-2.5 rounded-lg shadow-sm
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20' 
              : 'bg-gradient-to-br from-cyan-500 to-blue-600'
            }
          `}
        >
          <svg 
            className={`
              w-5 h-5
              ${theme === 'dark' ? 'text-cyan-400' : 'text-white'}
            `} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Datos del Paciente
        </h2>
      </div>

      {error && <Alert type="error" message={error} onClose={() => {}} className="mb-4" />}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Nombre completo */}
        <div>
          <label
            htmlFor="nombre"
            className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Nombre completo *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre || ''}
            onChange={onChange}
            className={`
              w-full px-3 py-2.5 rounded-lg border-2 transition-all
              ${
                theme === 'dark'
                  ? 'bg-[#0f1419] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
              focus:outline-none focus:ring-1 focus:ring-blue-500
            `}
            placeholder="Luis Andrade"
            required
          />
        </div>

        {/* Grid de 2 columnas para campos más compactos */}
        <div className="grid grid-cols-2 gap-4">
          {/* Edad */}
          <div>
            <label
              htmlFor="age"
              className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Edad *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={onChange}
              min="0"
              max="120"
              className={`
                w-full px-3 py-2.5 rounded-lg border-2 transition-all
                ${
                  theme === 'dark'
                    ? 'bg-[#0f1419] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              placeholder="45"
              required
            />
          </div>

          {/* Sexo */}
          <div>
            <label
              htmlFor="sex"
              className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Sexo *
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={onChange}
              className={`
                w-full px-3 py-2.5 rounded-lg border-2 transition-all
                ${
                  theme === 'dark'
                    ? 'bg-[#0f1419] border-gray-700 text-gray-200 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              required
            >
              <option value="">Seleccione sexo</option>
              {sexOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Zona anatómica */}
        <div>
          <label
            htmlFor="anatom_site_general"
            className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Zona anatómica *
          </label>
          <select
            id="anatom_site_general"
            name="anatom_site_general"
            value={formData.anatom_site_general}
            onChange={onChange}
            className={`
              w-full px-3 py-2.5 rounded-lg border-2 transition-all
              ${
                theme === 'dark'
                  ? 'bg-[#0f1419] border-gray-700 text-gray-200 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }
              focus:outline-none focus:ring-1 focus:ring-blue-500
            `}
            required
          >
            <option value="">Seleccione zona anatómica</option>
            {anatomSiteOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de 2 columnas para CI y Complemento */}
        <div className="grid grid-cols-2 gap-4">
          {/* CI */}
          <div>
            <label
              htmlFor="ci"
              className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              CI *
            </label>
            <input
              type="text"
              id="ci"
              name="ci"
              value={formData.ci || ''}
              onChange={onChange}
              className={`
                w-full px-3 py-2.5 rounded-lg border-2 transition-all
                ${
                  theme === 'dark'
                    ? 'bg-[#0f1419] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              placeholder="12345678"
              required
            />
          </div>

          {/* Complemento */}
          <div>
            <label
              htmlFor="complemento"
              className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Complemento
            </label>
            <input
              type="text"
              id="complemento"
              name="complemento"
              value={formData.complemento || ''}
              onChange={onChange}
              className={`
                w-full px-3 py-2.5 rounded-lg border-2 transition-all
                ${
                  theme === 'dark'
                    ? 'bg-[#0f1419] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              placeholder="1A"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="telefono"
            className={`block text-sm font-semibold mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono || ''}
            onChange={onChange}
            className={`
              w-full px-3 py-2.5 rounded-lg border-2 transition-all
              ${
                theme === 'dark'
                  ? 'bg-[#0f1419] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
              focus:outline-none focus:ring-1 focus:ring-blue-500
            `}
            placeholder="70123456"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : submitButtonText}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={loading}
            className={`
              px-6 py-2.5 rounded-lg border-2 font-semibold transition-all flex items-center gap-2
              ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}

export default PatientForm
