import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import HistorySection from '../components/dashboard/HistorySection'

// Mock data
const mockHistory = [
  {
    id: 1,
    date: '2024-01-15',
    time: '14:30',
    nombre: 'María González',
    age: 45,
    sex: 'Femenino',
    location: 'Torso anterior',
    result: 'Nevus (lunar benigno)',
    probability: 89.5,
    status: 'completed',
    top3: [
      { class: 'NV', prob: 0.895 },
      { class: 'BKL', prob: 0.078 },
      { class: 'MEL', prob: 0.027 }
    ]
  },
  {
    id: 2,
    date: '2024-01-10',
    time: '10:15',
    nombre: 'Carlos Ruiz',
    age: 52,
    sex: 'Masculino',
    location: 'Cabeza/Cuello',
    result: 'Queratosis benigna',
    probability: 76.3,
    status: 'completed',
    top3: [
      { class: 'BKL', prob: 0.763 },
      { class: 'NV', prob: 0.182 },
      { class: 'BCC', prob: 0.055 }
    ]
  },
  {
    id: 3,
    date: '2024-01-05',
    time: '16:45',
    nombre: 'Ana Martínez',
    age: 38,
    sex: 'Femenino',
    location: 'Extremidad superior',
    result: 'Nevus (lunar benigno)',
    probability: 92.1,
    status: 'completed',
    top3: [
      { class: 'NV', prob: 0.921 },
      { class: 'BKL', prob: 0.065 },
      { class: 'MEL', prob: 0.014 }
    ]
  },
]

const diseaseInfo = {
  'MEL': {
    name: 'Melanoma',
    status: 'Maligno',
    description: 'Tipo de cáncer de piel que se desarrolla en los melanocitos',
  },
  'NV': {
    name: 'Nevus melanocítico',
    status: 'Benigno',
    description: 'Lunar común, generalmente inofensivo',
  },
  'BCC': {
    name: 'Carcinoma basocelular',
    status: 'Maligno',
    description: 'Tipo más común de cáncer de piel, crecimiento lento',
  },
  'BKL': {
    name: 'Lesión tipo queratosis benigna',
    status: 'Benigno',
    description: 'Crecimiento benigno de la piel, común en adultos',
  },
}

const Stepper = ({ steps, currentStep }) => {
  const { theme } = useTheme()

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-all duration-300
                  ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : index === currentStep
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-500/20'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {index < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center
                  ${
                    index === currentStep
                      ? theme === 'dark'
                        ? 'text-cyan-400'
                        : 'text-cyan-600'
                      : theme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  w-16 h-1 mx-2 rounded transition-all duration-300
                  ${
                    index < currentStep
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                      : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const PatientForm = ({ formData, onChange, onSubmit, onReset }) => {
  const { theme } = useTheme()

  const sexOptions = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
  ]

  const anatomSiteOptions = [
    { value: 'anterior torso', label: 'Torso anterior' },
    { value: 'posterior torso', label: 'Torso posterior' },
    { value: 'head/neck', label: 'Cabeza/Cuello' },
    { value: 'upper extremity', label: 'Extremidad superior' },
    { value: 'lower extremity', label: 'Extremidad inferior' },
    { value: 'palms/soles', label: 'Palmas/Plantas' },
    { value: 'oral/genital', label: 'Oral/Genital' },
  ]

  return (
    <div
      className={`
        rounded-xl p-6 max-w-2xl mx-auto border
        ${theme === 'dark' ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-200 shadow-md'}
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

      <form onSubmit={onSubmit} className="space-y-4">
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
                  ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
              focus:outline-none focus:ring-1 focus:ring-blue-500
            `}
            placeholder="Luis Andrade"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                    ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              placeholder="45"
              required
            />
          </div>

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
                    ? 'bg-slate-900 border-gray-700 text-gray-200 focus:border-cyan-500'
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
                  ? 'bg-slate-900 border-gray-700 text-gray-200 focus:border-cyan-500'
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

        <div className="grid grid-cols-2 gap-4">
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
                    ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              placeholder="12345678"
              required
            />
          </div>

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
                    ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }
                focus:outline-none focus:ring-1 focus:ring-blue-500
              `}
              placeholder="1A"
            />
          </div>
        </div>

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
                  ? 'bg-slate-900 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-cyan-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
              }
              focus:outline-none focus:ring-1 focus:ring-blue-500
            `}
            placeholder="70123456"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200"
          >
            Siguiente
          </button>
          <button
            type="button"
            onClick={onReset}
            className={`
              px-6 py-2.5 rounded-lg border-2 font-semibold transition-all flex items-center gap-2
              ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
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

const ImageUploadZone = ({ preview, onImageSelect }) => {
  const { theme } = useTheme()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          onImageSelect(reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageSelect(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-all duration-300
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02] shadow-md'
            : theme === 'dark'
            ? 'border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/5'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm'
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {preview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <div
                className={`
                  absolute top-2 right-2 p-2 rounded-full
                  ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'}
                  backdrop-blur-sm
                `}
              >
                <svg
                  className="w-5 h-5 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Click para cambiar imagen o arrastra una nueva
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div
                className={`
                  p-3 rounded-full
                  ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}
                `}
              >
                <svg
                  className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Arrastra tu imagen aquí
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                o haz click para seleccionar
              </p>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              JPEG o PNG (máx. 10MB)
            </p>
          </div>
        )}
      </label>
    </div>
  )
}

const PatientDataReview = ({ formData }) => {
  const { theme } = useTheme()

  const sexOptions = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Femenino' },
  ]

  const anatomSiteOptions = [
    { value: 'anterior torso', label: 'Torso anterior' },
    { value: 'posterior torso', label: 'Torso posterior' },
    { value: 'head/neck', label: 'Cabeza/Cuello' },
    { value: 'upper extremity', label: 'Extremidad superior' },
    { value: 'lower extremity', label: 'Extremidad inferior' },
    { value: 'palms/soles', label: 'Palmas/Plantas' },
    { value: 'oral/genital', label: 'Oral/Genital' },
  ]

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
        ${theme === 'dark' ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-200 shadow-md'}
      `}
    >
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

      <div className="space-y-1.5 text-sm">
        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Nombre:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.nombre || '—'}
          </span>
        </div>

        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Edad:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.age ? `${formData.age} años` : '—'}
          </span>
        </div>

        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Sexo:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.sex ? getSexLabel(formData.sex) : '—'}
          </span>
        </div>

        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • CI:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.ci || '—'}
          </span>
        </div>

        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Complemento:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.complemento || '—'}
          </span>
        </div>

        <div className="flex items-start">
          <span className={`font-bold min-w-[140px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            • Teléfono:
          </span>
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {formData.telefono || '—'}
          </span>
        </div>

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

const Analizar = () => {
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    nombre: '',
    age: '',
    sex: '',
    anatom_site_general: '',
    ci: '',
    complemento: '',
    telefono: '',
  })
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  const steps = [
    { label: 'Datos del Paciente' },
    { label: 'Revisión y Análisis' },
    { label: 'Resultados' },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setFormData({
      nombre: '',
      age: '',
      sex: '',
      anatom_site_general: '',
      ci: '',
      complemento: '',
      telefono: '',
    })
    setPreview(null)
    setCurrentStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setCurrentStep(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setCurrentStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 2000)
  }

  return (
    <div className={`min-h-screen py-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Análisis de Imagen
          </h1>
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentStep === 0
              ? 'Completa los datos del paciente para continuar'
              : currentStep === 1
              ? 'Revisa los datos y sube la imagen para analizar'
              : 'Resultados del análisis'}
          </p>
        </div>

        <Stepper steps={steps} currentStep={currentStep} />

        {currentStep === 0 && (
          <PatientForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleFormSubmit}
            onReset={handleReset}
          />
        )}

        {currentStep === 1 && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <PatientDataReview formData={formData} />

            <div
              className={`
                rounded-xl p-6 border
                ${theme === 'dark' ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-200 shadow-md'}
              `}
            >
              <div className="flex items-center gap-2 mb-4">
                <svg 
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Imagen de la Lesión
                </h3>
              </div>

              <ImageUploadZone preview={preview} onImageSelect={setPreview} />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={analyzing}
                  className={`
                    px-6 py-2.5 rounded-lg border-2 font-semibold transition-all
                    ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  ← Atrás
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !preview}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    'Analizar Imagen'
                  )}
                </button>
                <button
                  onClick={() => {
                    setAnalyzing(true)
                    setTimeout(() => {
                      setAnalyzing(false)
                      setCurrentStep(2)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }, 1500)
                  }}
                  disabled={analyzing}
                  className={`
                    px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2
                    ${theme === 'dark'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  title="Ver resultados con datos de prueba"
                >
                  Test
                </button>
              </div>
            </div>

            {/* History Section - Below Image Upload */}
            <HistorySection historyData={mockHistory} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="max-w-5xl mx-auto space-y-4">
            {/* History Section - Results Step */}
            <HistorySection historyData={mockHistory} />

            {/* Action Buttons */}
            <div
              className={`
                rounded-xl p-4 border
                ${theme === 'dark' ? 'bg-slate-800 border-gray-700' : 'bg-white border-gray-200 shadow-md'}
              `}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleReset}
                  className="w-full sm:flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                >
                  Realizar Nuevo Análisis
                </button>
                <button
                  onClick={() => window.print()}
                  className={`
                    w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold transition-all border-2 text-sm
                    ${theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analizar
