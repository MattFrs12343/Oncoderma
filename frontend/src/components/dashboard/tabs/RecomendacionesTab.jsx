import { motion } from 'framer-motion'
import { ANIMATION_VARIANTS, RISK_COLORS } from '../../../utils/dashboardConstants'
import { SKIN_LESION_TYPES } from '../../../utils/constants'

const RecomendacionesTab = ({ dashboardData }) => {
  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No hay recomendaciones disponibles</div>
      </div>
    )
  }

  const { recommendations, mainResult, riskAssessment } = dashboardData
  const { immediate, general, specific } = recommendations
  
  const riskLevel = riskAssessment?.level === 'urgente' ? 'high' : 
                   riskAssessment?.level === 'atencion' ? 'medium' : 'low'
  const colors = RISK_COLORS[riskLevel]
  const lesionInfo = SKIN_LESION_TYPES[mainResult?.type] || {}

  const RecommendationSection = ({ 
    title, 
    items, 
    icon, 
    priority = 'normal',
    delay = 0 
  }) => {
    const priorityStyles = {
      urgent: 'border-red-300 bg-red-50',
      high: 'border-orange-300 bg-orange-50',
      normal: 'border-blue-300 bg-blue-50',
      low: 'border-green-300 bg-green-50'
    }

    const priorityColors = {
      urgent: 'text-red-700',
      high: 'text-orange-700',
      normal: 'text-blue-700',
      low: 'text-green-700'
    }

    return (
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
        className={`rounded-xl p-6 border-2 ${priorityStyles[priority]}`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-2xl"
          >
            {icon}
          </motion.span>
          <h4 className={`text-lg font-bold ${priorityColors[priority]}`}>
            {title}
          </h4>
          {priority === 'urgent' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
          )}
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: delay + 0.3 + index * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${
                  priority === 'urgent' ? 'bg-red-500' :
                  priority === 'high' ? 'bg-orange-500' :
                  priority === 'normal' ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                {index + 1}
              </div>
              <p className={`text-sm leading-relaxed ${priorityColors[priority]}`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  const CareCard = ({ title, items, icon, bgColor, textColor }) => (
    <motion.div
      variants={ANIMATION_VARIANTS.card}
      className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h5 className="font-semibold text-gray-700">{title}</h5>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <span className="text-gray-600">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Título de la pestaña */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-primary mb-2">
          Recomendaciones Personalizadas
        </h2>
        <p className="text-gray-600">
          Acciones específicas basadas en tu resultado de análisis
        </p>
      </motion.div>

      {/* Resumen del caso */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-3xl">{mainResult?.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-primary">
              Recomendaciones para: {mainResult?.simpleName}
            </h3>
            <p className="text-sm text-gray-600">
              Probabilidad: {mainResult?.probability}% | Riesgo: {riskAssessment?.level}
            </p>
          </div>
        </div>
        
        <div 
          className="p-4 rounded-lg border-2"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
            color: colors.text
          }}
        >
          <p className="text-sm font-medium">
            {riskAssessment?.message}
          </p>
          {riskAssessment?.timeframe && (
            <p className="text-xs mt-1 opacity-80">
              Timeframe: {riskAssessment.timeframe}
            </p>
          )}
        </div>
      </motion.div>

      {/* Acciones inmediatas */}
      {immediate && immediate.length > 0 && (
        <RecommendationSection
          title="Acciones Inmediatas"
          items={immediate}
          icon="🚨"
          priority={riskLevel === 'high' ? 'urgent' : riskLevel === 'medium' ? 'high' : 'normal'}
          delay={0.2}
        />
      )}

      {/* Recomendaciones específicas */}
      {specific && specific.length > 0 && (
        <RecommendationSection
          title={`Específico para ${mainResult?.simpleName}`}
          items={specific}
          icon="🎯"
          priority="normal"
          delay={0.4}
        />
      )}

      {/* Cuidados generales */}
      {general && general.length > 0 && (
        <motion.div
          variants={ANIMATION_VARIANTS.card}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <span className="mr-2">🛡️</span>
            Cuidados Generales de la Piel
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CareCard
              title="Protección Solar"
              items={[
                'Usar SPF 30+ diariamente',
                'Evitar exposición 10-16h',
                'Usar sombreros y ropa protectora',
                'Reaplicar protector cada 2 horas'
              ]}
              icon="☀️"
            />
            
            <CareCard
              title="Autoexamen"
              items={[
                'Revisar piel mensualmente',
                'Usar regla ABCDE',
                'Documentar con fotos',
                'Consultar cambios sospechosos'
              ]}
              icon="🔍"
            />
            
            <CareCard
              title="Seguimiento Médico"
              items={[
                'Chequeos dermatológicos regulares',
                'Mantener historial médico',
                'Informar antecedentes familiares',
                'No automedicarse'
              ]}
              icon="👨‍⚕️"
            />
            
            <CareCard
              title="Estilo de Vida"
              items={[
                'Dieta rica en antioxidantes',
                'Hidratación adecuada',
                'Evitar camas solares',
                'Mantener piel hidratada'
              ]}
              icon="💪"
            />
          </div>
        </motion.div>
      )}

      {/* Información sobre la regla ABCDE */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
      >
        <h4 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <span className="mr-2">📚</span>
          Regla ABCDE para Autoexamen
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { letter: 'A', word: 'Asimetría', desc: 'Una mitad no coincide con la otra' },
            { letter: 'B', word: 'Bordes', desc: 'Bordes irregulares o mal definidos' },
            { letter: 'C', word: 'Color', desc: 'Color no uniforme o múltiples colores' },
            { letter: 'D', word: 'Diámetro', desc: 'Mayor a 6mm (tamaño de un borrador)' },
            { letter: 'E', word: 'Evolución', desc: 'Cambios en tamaño, forma o color' }
          ].map((item, index) => (
            <motion.div
              key={item.letter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2">
                {item.letter}
              </div>
              <h6 className="font-semibold text-purple-800 text-sm mb-1">
                {item.word}
              </h6>
              <p className="text-xs text-purple-700">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recursos adicionales */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h4 className="text-lg font-semibold text-primary mb-4 flex items-center">
          <span className="mr-2">📞</span>
          Recursos y Contactos Útiles
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Emergencias</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">🚨</span>
                <span>Emergencias: 911</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">🏥</span>
                <span>Línea de salud: 123</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-gray-700 mb-3">Organizaciones</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">🎗️</span>
                <span>Fundación Cáncer de Piel</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-500">👥</span>
                <span>Grupos de apoyo locales</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer final */}
      <motion.div
        variants={ANIMATION_VARIANTS.card}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-yellow-800 mb-1">
              Importante: Estas son recomendaciones generales
            </p>
            <p className="text-xs text-yellow-700">
              Las recomendaciones proporcionadas son de carácter general y educativo. 
              Siempre consulta con un profesional médico calificado para obtener consejos específicos sobre tu situación particular. 
              Este análisis no reemplaza la evaluación médica profesional.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecomendacionesTab