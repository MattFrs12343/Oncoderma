import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const FAQPage = () => {
  const { theme } = useTheme()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: '¿Qué es OncoDerma?',
      answer: 'OncoDerma es una aplicación web que utiliza inteligencia artificial para analizar imágenes de lesiones cutáneas y proporcionar información sobre posibles condiciones dermatológicas. Es una herramienta de apoyo para profesionales de la salud y con fines académicos.',
    },
    {
      question: '¿Cómo funciona el análisis?',
      answer: 'Nuestro sistema utiliza un modelo de deep learning entrenado con miles de imágenes dermatológicas. Cuando subes una imagen, el modelo analiza características como color, textura, forma y patrón para clasificar la lesión en diferentes categorías (Melanoma, Nevus, Carcinoma basocelular, Queratosis benigna).',
    },
    {
      question: '¿Es un diagnóstico médico?',
      answer: 'NO. OncoDerma es una herramienta de apoyo con fines académicos y de investigación. Los resultados NO constituyen un diagnóstico médico y NO reemplazan la evaluación de un dermatólogo certificado. Siempre consulte a un profesional de la salud para un diagnóstico definitivo.',
    },
    {
      question: '¿Qué tipo de imágenes puedo subir?',
      answer: 'Puedes subir imágenes en formato JPEG o PNG de hasta 10MB. Para mejores resultados, la imagen debe ser clara, bien iluminada, enfocada en la lesión y tomada desde una distancia apropiada. Se recomienda una resolución mínima de 224x224 píxeles.',
    },
    {
      question: '¿Qué significan los resultados?',
      answer: 'El sistema proporciona las 3 clasificaciones más probables con sus porcentajes de probabilidad. MEL (Melanoma), NV (Nevus/lunar benigno), BCC (Carcinoma basocelular) y BKL (Queratosis benigna). Un porcentaje más alto indica mayor probabilidad según el modelo, pero NO es un diagnóstico definitivo.',
    },
    {
      question: '¿Mis imágenes están seguras?',
      answer: 'Sí. Implementamos medidas de seguridad para proteger tus datos. Las imágenes se procesan de forma segura y no se almacenan permanentemente en nuestros servidores. Sin embargo, al ser un proyecto académico, te recomendamos no incluir información personal identificable en las imágenes.',
    },
    {
      question: '¿Qué datos necesito proporcionar?',
      answer: 'Para realizar el análisis necesitas proporcionar: 1) Una imagen de la lesión cutánea, 2) Edad del paciente, 3) Sexo (Masculino/Femenino), y 4) Zona anatómica donde se encuentra la lesión. Estos datos ayudan al modelo a realizar un análisis más preciso.',
    },
    {
      question: '¿Qué tan preciso es el sistema?',
      answer: 'Nuestro modelo ha sido entrenado con un conjunto de datos dermatológicos y ha demostrado buenos resultados en pruebas. Sin embargo, la precisión puede variar según la calidad de la imagen y las características de la lesión. Por eso es fundamental que un dermatólogo profesional realice el diagnóstico final.',
    },
    {
      question: '¿Puedo usar esto para autodiagnóstico?',
      answer: 'NO. Esta herramienta NO debe usarse para autodiagnóstico. Si tienes preocupaciones sobre una lesión en tu piel, consulta inmediatamente a un dermatólogo certificado. La detección temprana por un profesional es crucial para el tratamiento efectivo de condiciones dermatológicas.',
    },
    {
      question: '¿Qué hago si el resultado indica Melanoma?',
      answer: 'Si el sistema indica una alta probabilidad de melanoma, NO entres en pánico. Recuerda que esto NO es un diagnóstico. Sin embargo, es importante que consultes a un dermatólogo lo antes posible para una evaluación profesional. El melanoma detectado tempranamente tiene altas tasas de curación.',
    },
    {
      question: '¿Funciona en dispositivos móviles?',
      answer: 'Sí, OncoDerma está diseñado para funcionar en computadoras, tablets y smartphones. Puedes tomar una foto directamente con la cámara de tu dispositivo móvil o subir una imagen existente.',
    },
    {
      question: '¿Necesito crear una cuenta?',
      answer: 'Sí, necesitas iniciar sesión para acceder a las funcionalidades de análisis. Esto nos permite mantener un registro seguro y proporcionar una mejor experiencia de usuario.',
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={`min-h-screen py-12 ${theme === 'dark' ? 'bg-[#0f1419]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Preguntas Frecuentes
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Encuentra respuestas a las preguntas más comunes sobre OncoDerma
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-6 cursor-pointer transition-all ${
                theme === 'dark' 
                  ? 'bg-[#1a2332] border border-gray-700 hover:border-cyan-500' 
                  : 'bg-white border border-gray-200 hover:border-cyan-500'
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </h3>
                  {openIndex === index && (
                    <p className={`leading-relaxed mt-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {faq.answer}
                    </p>
                  )}
                </div>
                <svg
                  className={`w-6 h-6 flex-shrink-0 ml-4 transition-transform duration-200 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  } ${theme === 'dark' ? 'text-cyan-500' : 'text-blue-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer final */}
        <div className="mt-12">
          <div className={`rounded-xl p-6 border-2 ${
            theme === 'dark'
              ? 'bg-amber-900/20 border-amber-700'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
          }`}>
            <div className="flex items-start space-x-4">
              <svg
                className={`w-8 h-8 flex-shrink-0 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-900'}`}>
                  Recordatorio Importante
                </h3>
                <p className={`leading-relaxed ${theme === 'dark' ? 'text-amber-200' : 'text-amber-800'}`}>
                  OncoDerma es una herramienta de apoyo con fines académicos y de investigación.
                  <strong> NO reemplaza la consulta con un dermatólogo profesional.</strong> Si
                  tienes alguna preocupación sobre tu piel, consulta siempre a un médico certificado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="mt-8 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            ¿No encontraste la respuesta que buscabas?{' '}
            <a href="/contacto" className="text-cyan-500 font-medium hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FAQPage
