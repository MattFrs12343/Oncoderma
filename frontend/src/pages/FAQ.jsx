import { useState } from 'react'

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null)

  const faqItems = [
    {
      id: 1,
      question: '¿Qué tipos de imágenes puedo subir?',
      answer: 'Puedes subir imágenes en formato JPG o PNG, con un tamaño máximo de 10MB. Recomendamos imágenes claras, bien iluminadas y enfocadas en la lesión de piel.',
      icon: '📷',
      color: 'blue'
    },
    {
      id: 2,
      question: '¿Qué tan preciso es el análisis?',
      answer: 'Nuestro modelo de IA tiene una precisión del 95% en condiciones de laboratorio. Sin embargo, este es solo una herramienta de apoyo y NO reemplaza el diagnóstico médico profesional.',
      icon: '🎯',
      color: 'green'
    },
    {
      id: 3,
      question: '¿Se almacenan mis imágenes?',
      answer: 'No. Las imágenes se procesan temporalmente y se eliminan inmediatamente después del análisis. No almacenamos ninguna información personal ni médica.',
      icon: '🔒',
      color: 'purple'
    },
    {
      id: 4,
      question: '¿Puedo usar esto para diagnosticar cáncer?',
      answer: 'NO. Esta aplicación es únicamente una herramienta de apoyo. Siempre debes consultar con un dermatólogo o médico especialista para cualquier diagnóstico médico.',
      icon: '⚠️',
      color: 'red'
    },
    {
      id: 5,
      question: '¿Cuánto tiempo toma el análisis?',
      answer: 'El análisis típicamente toma entre 2-8 segundos, dependiendo del tamaño y calidad de la imagen.',
      icon: '⏱️',
      color: 'orange'
    },
    {
      id: 6,
      question: '¿Funciona en dispositivos móviles?',
      answer: 'Sí, la aplicación está optimizada para funcionar en navegadores móviles modernos (iOS Safari, Android Chrome, etc.).',
      icon: '📱',
      color: 'indigo'
    }
  ]

  const toggleQuestion = (questionId) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId)
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100 border-blue-200',
      green: 'from-green-50 to-green-100 border-green-200',
      purple: 'from-purple-50 to-purple-100 border-purple-200',
      red: 'from-red-50 to-red-100 border-red-200',
      orange: 'from-orange-50 to-orange-100 border-orange-200',
      indigo: 'from-indigo-50 to-indigo-100 border-indigo-200'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-accent/10 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Preguntas Frecuentes</h1>
              <p className="text-sm text-gray-600">Respuestas a las dudas más comunes sobre OncoDerma</p>
            </div>
          </div>
          <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            6 Preguntas
          </div>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="grid md:grid-cols-2 gap-4">
        {faqItems.map((item) => (
          <div 
            key={item.id} 
            className={`card bg-gradient-to-br ${getColorClasses(item.color)} border group hover:shadow-lg transition-all duration-200`}
          >
            <button
              onClick={() => toggleQuestion(item.id)}
              className="w-full text-left focus:outline-none"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <h3 className="text-sm font-bold text-primary pr-2 leading-tight">
                    {item.question}
                  </h3>
                </div>
                <div className={`transform transition-transform duration-200 flex-shrink-0 ${
                  openQuestion === item.id ? 'rotate-180' : ''
                }`}>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </button>
            
            {openQuestion === item.id && (
              <div className="mt-3 pt-3 border-t border-white/50">
                <p className="text-xs text-primary leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-yellow-500/10 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Consejos Útiles</h2>
              <p className="text-sm text-gray-600">Tips para obtener mejores resultados</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Consejos positivos */}
          <div className="space-y-3">
            <h3 className="font-bold text-green-600 text-sm flex items-center mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Recomendaciones
            </h3>
            {[
              { title: 'Buena iluminación', desc: 'Usa luz natural o lámpara brillante' },
              { title: 'Imagen enfocada', desc: 'Lesión nítida y bien definida' },
              { title: 'Distancia adecuada', desc: 'Permite ver claramente la lesión' }
            ].map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-xs mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-600">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consejos negativos */}
          <div className="space-y-3">
            <h3 className="font-bold text-red-600 text-sm flex items-center mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Evitar
            </h3>
            {[
              { title: 'Evita sombras', desc: 'Pueden afectar la precisión del análisis' },
              { title: 'No uses flash', desc: 'Crea reflejos y altera colores' },
              { title: 'Imágenes borrosas', desc: 'Reducen la precisión del análisis' }
            ].map((tip, index) => (
              <div key={index} className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg group hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-xs mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-600">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ