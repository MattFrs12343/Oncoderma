const MedicalDisclaimer = ({ variant = 'default', className = '' }) => {
  const variants = {
    default: {
      container: 'bg-yellow-50 border border-yellow-200 rounded-lg p-4',
      title: 'text-yellow-800 font-semibold mb-2',
      text: 'text-yellow-700'
    },
    compact: {
      container: 'bg-red-50 border border-red-200 rounded-lg p-3',
      title: 'text-red-800 font-medium mb-1 text-sm',
      text: 'text-red-700 text-sm'
    },
    prominent: {
      container: 'bg-red-100 border-2 border-red-300 rounded-lg p-6',
      title: 'text-red-900 font-bold mb-3 text-lg',
      text: 'text-red-800'
    }
  }

  const style = variants[variant] || variants.default

  return (
    <div className={`${style.container} ${className}`}>
      <h3 className={style.title}>
        ⚠️ Disclaimer Médico Importante
      </h3>
      <p className={style.text}>
        <strong>Esta aplicación es únicamente una herramienta de apoyo y NO reemplaza el diagnóstico médico profesional.</strong> 
        {' '}Los resultados proporcionados deben ser siempre evaluados por un dermatólogo o médico especialista calificado. 
        Nunca tome decisiones médicas basándose únicamente en los resultados de esta aplicación.
      </p>
      {variant === 'prominent' && (
        <div className="mt-3 text-sm text-red-700">
          <p className="font-medium">Recuerde:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Consulte siempre con un profesional de la salud</li>
            <li>Esta herramienta no diagnostica enfermedades</li>
            <li>Los resultados son solo orientativos</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default MedicalDisclaimer