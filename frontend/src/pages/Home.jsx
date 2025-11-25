import { Link } from 'react-router-dom'
import { memo, useMemo } from 'react'

const Home = memo(() => {
  const features = useMemo(() => [
    {
      id: 'rapid-analysis',
      title: 'IA Avanzada',
      description: 'Análisis rápido',
      gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      id: 'easy-use',
      title: 'Fácil de usar',
      description: 'Interfaz intuitiva',
      gradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    },
    {
      id: 'clear-results',
      title: 'Resultados claros',
      description: 'Visuales precisos',
      gradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
    },
    {
      id: 'privacy',
      title: 'Privacidad',
      description: 'Datos seguros',
      gradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
    }
  ], [])

  const howItWorksSteps = useMemo(() => [
    {
      id: 'upload',
      emoji: '📸',
      title: 'Sube tu imagen',
      description: 'Toma una foto clara de la zona de piel que quieres analizar o sube una imagen existente.',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'analyze',
      emoji: '🤖',
      title: 'Análisis con IA',
      description: 'Nuestro modelo de inteligencia artificial procesa la imagen y analiza las características de la piel.',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 'results',
      emoji: '📊',
      title: 'Obtén resultados',
      description: 'Recibe un porcentaje de probabilidad y recomendaciones para consultar con un especialista.',
      gradient: 'from-green-400 to-green-600'
    }
  ], [])

  const doctorAdvantages = useMemo(() => [
    {
      id: 'diagnostic-support',
      title: 'Herramienta de apoyo diagnóstico',
      description: 'Complementa el criterio médico con análisis basado en IA'
    },
    {
      id: 'early-detection',
      title: 'Detección temprana',
      description: 'Ayuda a identificar casos que requieren atención prioritaria'
    },
    {
      id: 'consultation-efficiency',
      title: 'Eficiencia en consultas',
      description: 'Optimiza el tiempo de evaluación inicial'
    },
    {
      id: 'visual-documentation',
      title: 'Documentación visual',
      description: 'Facilita el seguimiento y comparación de lesiones'
    }
  ], [])

  const renderFeatures = useMemo(() => (
    <div className="grid grid-cols-2 gap-3">
      {features.map((feature) => (
        <div key={feature.id} className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-lg group hover:shadow-md transition-all duration-200`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{feature.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [features])

  return (
    <div className="py-8 space-y-16">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
          </div>

          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Inteligencia Artificial Médica</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent leading-tight">
                OncoDerma
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                Análisis inteligente de imágenes dermatológicas para la 
                <span className="font-semibold text-blue-600 dark:text-blue-400"> detección temprana</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              <div className="flex items-center justify-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Análisis en segundos</span>
              </div>
              
              <div className="flex items-center justify-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">100% privado</span>
              </div>
              
              <div className="flex items-center justify-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Apoyo médico</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/analizar"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Comenzar Análisis
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
              </Link>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Sin registro • Completamente gratuito • Resultados instantáneos
              </p>
            </div>

            <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">95% Precisión</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">&lt;30s Análisis</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Datos Seguros</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es OncoDerma */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-cyan-500/10 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">¿Qué es OncoDerma?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Inteligencia artificial para análisis dermatológico</p>
              </div>
            </div>
            <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              IA Avanzada
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Aplicación Innovadora</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      OncoDerma utiliza inteligencia artificial para analizar imágenes de la piel 
                      y proporcionar estimaciones del riesgo de cáncer de piel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Herramienta de Apoyo</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      Diseñada para ayudar tanto a pacientes como a profesionales de la salud 
                      en la detección temprana de anomalías en la piel.
                    </p>
                  </div>
                </div>
              </div>

              {renderFeatures}
            </div>

            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-900/5 p-4 rounded-lg">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-sm flex items-center">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Tecnología Médica
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Dermatología digital</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Análisis especializado</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-900 to-cyan-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Detección temprana</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Prevención efectiva</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Apoyo médico</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Herramienta profesional</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 text-center">
            ¿Cómo funciona?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step) => (
              <div key={step.id} className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                  <span className="text-4xl">{step.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas para médicos */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-900/5 to-cyan-500/5 rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 text-center">
            Ventajas para Médicos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[doctorAdvantages.slice(0, 2), doctorAdvantages.slice(2, 4)].map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-4">
                {column.map((advantage) => (
                  <div key={advantage.id} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{advantage.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{advantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad y privacidad */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-cyan-500/10 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Seguridad y Privacidad</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tu privacidad es nuestra prioridad</p>
              </div>
            </div>
            <div className="bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Certificado
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">Eliminación automática</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Imágenes borradas inmediatamente</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">Sin almacenamiento</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">No guardamos información personal</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">Cifrado HTTPS</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Comunicación completamente segura</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">Estándares médicos</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300">Cumplimiento normativo completo</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-900/5 p-4 rounded-lg">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-sm flex items-center">
                <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                Proceso Seguro
              </h4>
              <div className="space-y-2">
                {[
                  { step: 1, text: "Subida cifrada", color: "from-cyan-500 to-blue-900" },
                  { step: 2, text: "Análisis protegido", color: "from-blue-900 to-cyan-500" },
                  { step: 3, text: "Resultado privado", color: "from-cyan-500 to-blue-900" },
                  { step: 4, text: "Eliminación automática", color: "from-blue-900 to-cyan-500" },
                  { step: 5, text: "Datos seguros", color: "from-cyan-500 to-blue-900" }
                ].map((item) => (
                  <div key={item.step} className="flex items-center group">
                    <div className={`bg-gradient-to-r ${item.color} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 group-hover:scale-110 transition-transform duration-200`}>
                      {item.step}
                    </div>
                    <span className="text-xs text-slate-900 dark:text-white font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados confiables */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-blue-900/10 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-blue-900 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resultados Confiables</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">IA entrenada con miles de imágenes dermatológicas</p>
              </div>
            </div>
            <div className="bg-blue-900/10 text-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verificado
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">95%</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Precisión</p>
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">&lt;30s</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Análisis</p>
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg group hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">24/7</div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Disponible</p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-900/5 p-4 rounded-lg">
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 text-sm flex items-center">
                <span className="w-2 h-2 bg-blue-900 dark:bg-blue-300 rounded-full mr-2"></span>
                Tecnología IA
              </h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Miles de imágenes</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Dataset entrenado</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-900 to-cyan-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Algoritmos avanzados</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Deep Learning</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-900 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">Validación médica</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Supervisado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información Legal */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-red-500/10 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Información Legal</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">Términos importantes y responsabilidades</p>
              </div>
            </div>
            <div className="bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Importante
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Fines Educativos</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Esta aplicación es solo para fines educativos y de demostración</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">No Diagnóstico Médico</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">No debe utilizarse como único criterio para decisiones médicas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Limitación de Responsabilidad</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Los desarrolladores no se hacen responsables por decisiones médicas basadas en esta aplicación</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Aceptación de Términos</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">El uso de esta aplicación implica la aceptación de estos términos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="bg-red-500 p-2 rounded-full mr-3 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-red-700 dark:text-red-400 text-sm mb-2">⚠️ IMPORTANTE - Disclaimer Médico</h4>
                <p className="text-sm text-slate-900 dark:text-white leading-relaxed">
                  Esta aplicación es únicamente una herramienta de apoyo y <strong>NO reemplaza el diagnóstico médico profesional</strong>. 
                  Siempre consulta con un dermatólogo o especialista para evaluación y diagnóstico definitivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})

Home.displayName = 'Home'

export default Home
