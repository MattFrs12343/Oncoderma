import { useTheme } from '../../contexts/ThemeContext'

const PatientDataReview = ({ formData, sexOptions, anatomSiteOptions }) => {
  const { theme } = useTheme()

  const getSexLabel = (value) => {
    const option = sexOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  const getAnatomSiteLabel = (value) => {
    const option = anatomSiteOptions.find((opt) => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div
      className={`
        rounded-xl p-4 border
        ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-md'}
      `}
    >
      {/* Header con icono */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/30">
        <svg 
          className={`w-4 h-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
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
        <h3 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Datos del Paciente
        </h3>
      </div>

      {/* Ficha médica vertical compacta */}
      <div className="space-y-1.5 text-sm">
        {/* Nombre */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Nombre:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.nombre || '—'}
          </span>
        </div>

        {/* Edad */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Edad:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.age ? `${formData.age} años` : '—'}
          </span>
        </div>

        {/* Sexo */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Sexo:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.sex ? getSexLabel(formData.sex) : '—'}
          </span>
        </div>

        {/* CI */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • CI:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.ci || '—'}
          </span>
        </div>

        {/* Complemento */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Complemento:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.complemento || '—'}
          </span>
        </div>

        {/* Teléfono */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Teléfono:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.telefono || '—'}
          </span>
        </div>

        {/* Zona anatómica */}
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Zona anatómica:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.anatom_site_general ? getAnatomSiteLabel(formData.anatom_site_general) : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PatientDataReview
