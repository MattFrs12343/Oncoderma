import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const Buscar = () => {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCI, setSelectedCI] = useState(null)
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchRef = useRef(null)

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Buscar sugerencias cuando el usuario escribe
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Solo buscar si hay 4 o más dígitos
      if (searchQuery.length < 4) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          setError('No se encontró el ID de usuario')
          return
        }

        const response = await fetch(`/api/search-patients?ci=${searchQuery}&user_id=${userId}`)
        const data = await response.json()

        if (data.success) {
          setSuggestions(data.results)
          setShowSuggestions(data.results.length > 0)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Buscar información del paciente
  const handleSelectCI = async (ci) => {
    setSearchQuery(ci)
    setSelectedCI(ci)
    setShowSuggestions(false)
    setLoading(true)
    setError('')

    try {
      // Extraer solo el CI sin complemento para la búsqueda
      const ciOnly = ci.split('-')[0]
      
      const response = await fetch(`/api/patient-history/${ciOnly}`)
      const data = await response.json()

      if (data.success && data.patient) {
        setPatientData(data)
      } else {
        setError(data.message || 'No se encontró información del paciente')
        setPatientData(null)
      }
    } catch (error) {
      console.error('Error fetching patient data:', error)
      setError('Error al obtener información del paciente')
      setPatientData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setSelectedCI(null)
    setPatientData(null)
    setError('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelectCI(suggestions[0])
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Minimalista */}
        <div className="mb-16 text-center">
          <h1 className={`text-4xl sm:text-5xl font-light tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Buscar Paciente
          </h1>
          <div className={`w-16 h-0.5 mx-auto mb-4 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-600'}`}></div>
          <p className={`text-sm font-light ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Ingresa el carnet de identidad para consultar el historial
          </p>
        </div>

        {/* Barra de búsqueda minimalista */}
        <div className="mb-12" ref={searchRef}>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className={`h-5 w-5 transition-colors ${
                searchQuery.length > 0 
                  ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                  : theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className={`w-full pl-14 pr-6 py-5 text-lg font-light tracking-wide transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-900/50 border-slate-800 text-white placeholder-gray-600 focus:bg-slate-900 focus:border-cyan-500/50'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-cyan-500'
              } border-2 rounded-2xl focus:outline-none focus:ring-4 ${
                theme === 'dark' ? 'focus:ring-cyan-500/10' : 'focus:ring-cyan-500/10'
              }`}
              placeholder="Ej: 12345678 o 12345678-1A"
            />

            {/* Sugerencias minimalistas */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute z-10 w-full mt-3 rounded-2xl overflow-hidden shadow-2xl border ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-slate-800 shadow-black/50' 
                  : 'bg-white border-gray-100 shadow-gray-200/50'
              }`}>
                {suggestions.map((ci, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectCI(ci)}
                    className={`w-full px-6 py-4 text-left transition-all duration-200 ${
                      theme === 'dark'
                        ? 'hover:bg-slate-800 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    } ${index !== suggestions.length - 1 ? 'border-b' : ''} ${
                      theme === 'dark' ? 'border-slate-800' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-base tracking-wider ${
                        theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                      }`}>{ci}</span>
                      <svg className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hint minimalista */}
          {searchQuery.length > 0 && searchQuery.length < 4 && (
            <p className={`mt-3 text-center text-xs font-light ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              Ingresa al menos 4 dígitos
            </p>
          )}
        </div>

        {/* Loading minimalista */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className={`inline-block animate-spin rounded-full h-12 w-12 border-2 ${
              theme === 'dark' ? 'border-slate-800 border-t-cyan-500' : 'border-gray-200 border-t-cyan-600'
            }`}></div>
            <p className={`mt-4 text-sm font-light ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
              Cargando información...
            </p>
          </div>
        )}

        {/* Error minimalista */}
        {error && (
          <div className={`max-w-2xl mx-auto rounded-2xl p-6 border ${
            theme === 'dark' ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              <svg className={`h-5 w-5 mr-3 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-sm font-light ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            </div>
          </div>
        )}

        {/* Información del Paciente */}
        {patientData && patientData.patient && !loading && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Datos Personales - Diseño Minimalista */}
            <div className={`rounded-2xl p-8 border transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'
                }`}>
                  <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Información del Paciente
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Nombre Completo</p>
                  <p className={`text-lg font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {patientData.patient.nombre}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Carnet de Identidad</p>
                  <p className={`text-lg font-mono font-light ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {patientData.patient.ci}{patientData.patient.complemento ? `-${patientData.patient.complemento}` : ''}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Edad</p>
                  <p className={`text-lg font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {patientData.patient.edad} años
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Sexo</p>
                  <p className={`text-lg font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {patientData.patient.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
                {patientData.patient.telefono && (
                  <div className="space-y-1">
                    <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>Teléfono</p>
                    <p className={`text-lg font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {patientData.patient.telefono}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Análisis - Diseño Minimalista */}
            <div className={`rounded-2xl p-8 border transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'
                  }`}>
                    <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Historial de Análisis
                  </h2>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-light ${
                  theme === 'dark' ? 'bg-slate-800 text-gray-400' : 'bg-white text-gray-600'
                }`}>
                  {patientData.history.length} {patientData.history.length === 1 ? 'análisis' : 'análisis'}
                </span>
              </div>

              {patientData.history.length === 0 ? (
                <div className="text-center py-12">
                  <svg className={`mx-auto h-16 w-16 mb-4 ${theme === 'dark' ? 'text-gray-800' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className={`font-light ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                    No hay análisis registrados
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientData.history.map((record, index) => (
                    <div
                      key={record.id}
                      className={`p-6 rounded-xl border transition-all duration-200 ${
                        theme === 'dark' 
                          ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {/* Header del análisis */}
                      <div className="flex justify-between items-start mb-4 pb-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-gray-100'}">
                        <div>
                          <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Análisis #{patientData.history.length - index}
                          </p>
                          <p className={`text-sm font-light ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            {record.fecha} • {record.hora}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Realizado por
                          </p>
                          <p className={`text-sm font-light ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            {record.usuario}
                          </p>
                        </div>
                      </div>

                      {/* Zona clínica */}
                      <div className="mb-4">
                        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Zona Clínica
                        </p>
                        <p className={`text-sm font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {record.zona_clinica}
                        </p>
                      </div>

                      {/* TOP 3 Diagnósticos - Diseño Minimalista */}
                      <div>
                        <p className={`text-xs font-medium uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Top 3 Diagnósticos
                        </p>
                        <div className="space-y-3">
                          {record.top3.map((diagnosis, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                                theme === 'dark' 
                                  ? 'bg-slate-900/50 border-slate-800 hover:border-cyan-500/30' 
                                  : 'bg-white border-gray-200 hover:border-cyan-500/50'
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                {/* Número de posición minimalista */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  idx === 0 
                                    ? theme === 'dark' 
                                      ? 'bg-cyan-500/20 text-cyan-400' 
                                      : 'bg-cyan-100 text-cyan-600'
                                    : idx === 1 
                                    ? theme === 'dark'
                                      ? 'bg-blue-500/20 text-blue-400'
                                      : 'bg-blue-100 text-blue-600'
                                    : theme === 'dark'
                                      ? 'bg-purple-500/20 text-purple-400'
                                      : 'bg-purple-100 text-purple-600'
                                }`}>
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className={`text-base font-light mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {diagnosis.nombre}
                                  </p>
                                  <p className={`text-xs font-light ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {diagnosis.enfermedad}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Probabilidad y Status minimalista */}
                              <div className="text-right">
                                <p className={`text-2xl font-light mb-1 ${
                                  diagnosis.status === 'Maligno' 
                                    ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    : theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                                }`}>
                                  {diagnosis.probabilidad.toFixed(1)}%
                                </p>
                                <span className={`text-xs px-3 py-1 rounded-full font-light ${
                                  diagnosis.status === 'Maligno'
                                    ? theme === 'dark' 
                                      ? 'bg-red-500/10 text-red-400' 
                                      : 'bg-red-50 text-red-600'
                                    : theme === 'dark' 
                                      ? 'bg-emerald-500/10 text-emerald-400' 
                                      : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {diagnosis.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado inicial minimalista */}
        {!selectedCI && !loading && !error && (
          <div className="text-center py-20">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              theme === 'dark' ? 'bg-slate-900/50' : 'bg-gray-100'
            }`}>
              <svg className={`h-10 w-10 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className={`text-lg font-light mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Comienza tu búsqueda
            </h3>
            <p className={`text-sm font-light ${theme === 'dark' ? 'text-gray-700' : 'text-gray-400'}`}>
              Ingresa al menos 4 dígitos del carnet de identidad
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Buscar
