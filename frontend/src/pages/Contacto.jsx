const Contacto = () => {
  const whatsappNumber = '67708839'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  const supportTopics = [
    {
      title: 'Soporte Técnico',
      description: 'Problemas con la aplicación, errores de carga, o dificultades técnicas',
      icon: '🔧',
      urgency: 'Respuesta en 2-4 horas',
      color: 'blue'
    },
    {
      title: 'Consultas sobre Resultados',
      description: 'Preguntas sobre interpretación de resultados o funcionamiento del análisis',
      icon: '📊',
      urgency: 'Respuesta en 1-2 horas',
      color: 'green'
    },
    {
      title: 'Información General',
      description: 'Preguntas sobre la aplicación, características o términos de uso',
      icon: 'ℹ️',
      urgency: 'Respuesta en 4-8 horas',
      color: 'purple'
    },
    {
      title: 'Reportar Problemas',
      description: 'Reportar errores, bugs o sugerir mejoras para la aplicación',
      icon: '🐛',
      urgency: 'Respuesta en 24 horas',
      color: 'orange'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-50 to-blue-100',
      green: 'from-green-50 to-green-100',
      purple: 'from-purple-50 to-purple-100',
      orange: 'from-orange-50 to-orange-100'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-green-500/10 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Contacto y Soporte</h1>
              <p className="text-sm text-gray-600">Estamos aquí para ayudarte 24/7</p>
            </div>
          </div>
          <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Disponible
          </div>
        </div>

        {/* WhatsApp principal */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">WhatsApp: {whatsappNumber}</h2>
          <p className="text-sm text-gray-600 mb-4">Canal principal de soporte - Respuesta inmediata</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Abrir WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Tipos de soporte */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-accent/10 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">¿En qué podemos ayudarte?</h2>
              <p className="text-sm text-gray-600">Selecciona el tipo de consulta</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {supportTopics.map((topic, index) => (
            <div key={index} className={`bg-gradient-to-br ${getColorClasses(topic.color)} p-4 rounded-lg group hover:shadow-lg transition-all duration-200`}>
              <div className="flex items-start">
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-200">
                  {topic.icon}
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-primary text-sm mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {topic.description}
                  </p>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs text-green-600 font-medium">
                      {topic.urgency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Horarios */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-blue-500/10 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-primary">Horarios de Atención</h3>
          </div>
          <div className="space-y-3">
            {[
              { service: 'WhatsApp', time: '24/7', color: 'text-green-600' },
              { service: 'Soporte Técnico', time: 'Lun-Dom 8:00-22:00', color: 'text-secondary' },
              { service: 'Consultas Médicas', time: 'Lun-Vie 9:00-18:00', color: 'text-secondary' },
              { service: 'Respuesta Promedio', time: '< 2 horas', color: 'text-accent' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-primary text-sm">{item.service}</span>
                <span className={`font-semibold text-sm ${item.color}`}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergencias */}
        <div className="card bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-red-800">Emergencias Médicas</h3>
          </div>
          <div className="space-y-3 text-red-700">
            <p className="font-medium text-sm">
              Si tienes una emergencia médica, NO uses esta aplicación.
            </p>
            <div className="bg-red-100 p-3 rounded-lg">
              <p className="font-semibold mb-2 text-xs">Contacta inmediatamente:</p>
              <ul className="space-y-1 text-xs">
                <li>• Servicios de emergencia: 911</li>
                <li>• Tu médico de cabecera</li>
                <li>• Sala de emergencias más cercana</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Canales alternativos */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-purple-500/10 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Otros Canales</h2>
              <p className="text-sm text-gray-600">Métodos alternativos de contacto</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '📧', title: 'Email', info: 'soporte@oncoderma.com', time: '24-48h', color: 'blue' },
            { icon: '🌐', title: 'Web', info: 'www.oncoderma.com', time: 'Recursos', color: 'purple' },
            { icon: '📱', title: 'WhatsApp', info: whatsappNumber, time: '24/7', color: 'green' }
          ].map((channel, index) => (
            <div key={index} className={`bg-gradient-to-br from-${channel.color}-50 to-${channel.color}-100 p-4 rounded-lg text-center group hover:shadow-md transition-all duration-200`}>
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-200">
                {channel.icon}
              </span>
              <h4 className="font-bold text-primary text-sm mb-1">{channel.title}</h4>
              <p className="text-xs text-gray-600 mb-1">{channel.info}</p>
              <p className="text-xs text-gray-500">({channel.time})</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="card bg-gradient-to-r from-secondary to-primary text-white text-center">
        <h3 className="text-xl font-bold mb-3">¿Necesitas ayuda ahora?</h3>
        <p className="mb-4 opacity-90 text-sm">
          Nuestro equipo está listo para ayudarte con cualquier consulta sobre OncoDerma.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-secondary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
        >
          <span>💬</span>
          <span>Iniciar Conversación</span>
        </a>
      </div>
    </div>
  )
}

export default Contacto