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
      // Buscar desde el primer dígito
      if (searchQuery.length < 1) {
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
      handleSelectCI(suggestions[0].ci)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Minimalista */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Buscar Paciente
          </h1>
          <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Consulta el historial médico de tus pacientes
          </p>
        </div>

        {/* Barra de búsqueda con degradado */}
        <div className="mb-8" ref={searchRef}>
          <div className={`relative max-w-3xl mx-auto rounded-xl p-6 border shadow-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-cyan-500/30' 
              : 'bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/50 border-cyan-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className={`text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent`}>
                Buscar por CI
              </h2>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-base shadow-md ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-cyan-500/30 text-gray-200 placeholder-gray-500 focus:border-cyan-500 focus:shadow-cyan-500/20'
                    : 'bg-white border-cyan-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:shadow-cyan-500/20'
                } focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:shadow-lg`}
                placeholder="Ingresa el CI del paciente (ej: 12345678)"
              />

              {/* Sugerencias con CI y Nombre */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute z-10 w-full mt-2 rounded-lg overflow-hidden shadow-lg border ${
                  theme === 'dark' 
                    ? 'bg-slate-900 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectCI(suggestion.ci)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 ${
                        theme === 'dark'
                          ? 'hover:bg-slate-800 text-gray-300'
                          : 'hover:bg-gray-50 text-gray-700'
                      } ${index !== suggestions.length - 1 ? 'border-b' : ''} ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={`font-mono text-sm font-bold ${
                            theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                          }`}>{suggestion.ci}</span>
                          <span className={`text-sm font-semibold truncate ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{suggestion.nombre}</span>
                        </div>
                        <svg className={`h-4 w-4 flex-shrink-0 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hint */}
            {searchQuery.length === 0 && (
              <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Comienza a escribir para ver sugerencias
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className={`inline-block animate-spin rounded-full h-10 w-10 border-2 ${
              theme === 'dark' ? 'border-gray-700 border-t-cyan-500' : 'border-gray-300 border-t-cyan-600'
            }`}></div>
            <p className={`mt-3 text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Cargando información...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={`max-w-3xl mx-auto rounded-xl p-4 border ${
            theme === 'dark' ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <svg className={`h-5 w-5 flex-shrink-0 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
            </div>
          </div>
        )}

        {/* Información del Paciente */}
        {patientData && patientData.patient && !loading && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Datos Personales */}
            <div className={`rounded-xl p-6 border ${
              theme === 'dark' 
                ? 'bg-slate-800 border-gray-700' 
                : 'bg-white border-gray-200 shadow-md'
            }`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-lg ${
                  theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}>
                  <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Información del Paciente
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nombre Completo</p>
                  <p className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {patientData.patient.nombre}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Carnet de Identidad</p>
                  <p className={`text-base font-mono font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {patientData.patient.ci}{patientData.patient.complemento ? `-${patientData.patient.complemento}` : ''}
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Edad</p>
                  <p className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {patientData.patient.edad} años
                  </p>
                </div>
                <div>
                  <p className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sexo</p>
                  <p className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {patientData.patient.sexo === 'M' ? 'Masculino' : 'Femenino'}
                  </p>
                </div>
                {patientData.patient.telefono && (
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Teléfono</p>
                    <p className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {patientData.patient.telefono}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Historial de Análisis con degradado */}
            <div className={`rounded-xl p-6 border shadow-xl ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-purple-500/30' 
                : 'bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 border-purple-200'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                    Historial de Análisis
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                    : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                }`}>
                  {patientData.history.length} {patientData.history.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              {patientData.history.length === 0 ? (
                <div className="text-center py-8">
                  <svg className={`mx-auto h-12 w-12 mb-3 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    No hay análisis registrados
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientData.history.map((record, index) => (
                    <div
                      key={record.id}
                      className={`p-5 rounded-lg border shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-slate-900/80 to-slate-900/50 border-purple-500/20 hover:border-purple-500/40' 
                          : 'bg-gradient-to-br from-white to-purple-50/30 border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      {/* Header del análisis */}
                      <div className={`flex justify-between items-start mb-4 pb-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div>
                          <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            ANÁLISIS #{patientData.history.length - index}
                          </p>
                          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {record.fecha} • {record.hora}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-bold mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            REALIZADO POR
                          </p>
                          <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            {record.usuario}
                          </p>
                        </div>
                      </div>

                      {/* Zona clínica */}
                      <div className="mb-3">
                        <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Zona Clínica: 
                        </span>
                        <span className={`text-xs font-bold ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {record.zona_clinica}
                        </span>
                      </div>

                      {/* TOP 3 Diagnósticos - Formato Tabla Compacta */}
                      <div>
                        <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                          Top 3 Diagnósticos
                        </p>
                        <div className="space-y-1.5">
                          {record.top3.map((diagnosis, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between py-2 px-3 rounded border-l-4 ${
                                idx === 0 
                                  ? theme === 'dark'
                                    ? 'border-l-cyan-500 bg-cyan-500/5'
                                    : 'border-l-cyan-500 bg-cyan-50/50'
                                  : idx === 1
                                  ? theme === 'dark'
                                    ? 'border-l-blue-500 bg-blue-500/5'
                                    : 'border-l-blue-500 bg-blue-50/50'
                                  : theme === 'dark'
                                    ? 'border-l-purple-500 bg-purple-500/5'
                                    : 'border-l-purple-500 bg-purple-50/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span className={`text-xs font-bold w-4 ${
                                  idx === 0 
                                    ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                                    : idx === 1
                                    ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                    : theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                }`}>
                                  {idx + 1}.
                                </span>
                                <div className="flex-1">
                                  <p className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {diagnosis.nombre}
                                  </p>
                                  <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    {diagnosis.enfermedad}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className={`text-base font-black ${
                                  diagnosis.status === 'Maligno' 
                                    ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    : theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                                }`}>
                                  {diagnosis.probabilidad.toFixed(1)}%
                                </span>
                                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                                  diagnosis.status === 'Maligno'
                                    ? theme === 'dark' 
                                      ? 'bg-red-500/20 text-red-400' 
                                      : 'bg-red-100 text-red-700'
                                    : theme === 'dark' 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : 'bg-emerald-100 text-emerald-700'
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

        {/* Estado inicial */}
        {!selectedCI && !loading && !error && (
          <div className="text-center py-16">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <svg className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className={`text-base font-bold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Comienza tu búsqueda
            </h3>
            <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
              Ingresa el CI del paciente en el campo de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Buscar
