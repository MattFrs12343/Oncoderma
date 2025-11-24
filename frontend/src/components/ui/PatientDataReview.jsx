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

  const dataItems = [
    {
      label: 'Nombre completo',
      value: formData.nombre || '-',
    },
    {
      label: 'Edad',
      value: formData.age ? `${formData.age} años` : '-',
    },
    {
      label: 'Sexo',
      value: formData.sex ? getSexLabel(formData.sex) : '-',
    },
    {
      label: 'Zona anatómica',
      value: formData.anatom_site_general ? getAnatomSiteLabel(formData.anatom_site_general) : '-',
    },
    {
      label: 'Carnet de identidad (CI)',
      value: formData.ci || '-',
    },
    {
      label: 'Complemento',
      value: formData.complemento || '-',
    },
    {
      label: 'Teléfono',
      value: formData.telefono || '-',
    },
  ]

  return (
    <div
      className={`
        rounded-xl p-5 border
        ${theme === 'dark' ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200 shadow-md'}
      `}
    >
      <div className="flex items-center gap-2 mb-4">
        <div 
          className={`
            p-2 rounded-lg shadow-sm
            ${theme === 'dark' 
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20' 
              : 'bg-gradient-to-br from-cyan-500 to-blue-600'
            }
          `}
        >
          <svg 
            className={`
              w-4 h-4
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
        <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Datos del Paciente
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {dataItems.map((item, index) => (
          <div
            key={index}
            className={`
              p-2.5 rounded-lg border
              ${theme === 'dark' ? 'bg-[#0f1419] border-gray-700' : 'bg-gray-50 border-gray-200'}
            `}
          >
            <p className={`text-xs font-semibold mb-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.label}
            </p>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PatientDataReview
