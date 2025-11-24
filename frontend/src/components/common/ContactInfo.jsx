const ContactInfo = ({ variant = 'default', showTitle = true }) => {
  const whatsappNumber = '8888888'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          <span className="text-lg">📱</span>
          <span className="font-medium">WhatsApp: {whatsappNumber}</span>
        </a>
      </div>
    )
  }

  return (
    <div className="text-center">
      {showTitle && (
        <h3 className="text-xl font-semibold text-primary mb-4">
          Contacto y Soporte
        </h3>
      )}
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 mb-3">
            ¿Necesitas ayuda o tienes preguntas? Contáctanos a través de WhatsApp
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <span className="text-lg">📱</span>
            <span>WhatsApp: {whatsappNumber}</span>
          </a>
        </div>
        <div className="text-sm text-gray-500">
          <p>Horario de atención: 24/7 para soporte técnico</p>
          <p>Respuesta promedio: Menos de 2 horas</p>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo