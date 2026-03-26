'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useDisclaimerStore } from '@/lib/disclaimerState'
import { Card } from '@/components/ui/card'
import { 
  Shield, 
  Stethoscope, 
  AlertTriangle, 
  BookOpen, 
  CheckCircle,
  Heart,
  Brain
} from 'lucide-react'

interface MedicalScrollSectionsProps {
  onComplianceProgress?: (progress: number) => void
  className?: string
}

export default function MedicalScrollSections({ 
  onComplianceProgress,
  className = '' 
}: MedicalScrollSectionsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [acknowledged, setAcknowledged] = useState({
    notMedicalDevice: false,
    consultPhysician: false,
    contraindications: false,
    noGuarantees: false
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Update disclaimer state
  const updateAcknowledgments = useDisclaimerStore(state => state.updateAcknowledgments)
  const updateScrollProgress = useDisclaimerStore(state => state.updateScrollProgress)

  // Calculate progress based on acknowledgments
  const calculateProgress = useCallback(() => {
    const acknowledgedCount = Object.values(acknowledged).filter(Boolean).length
    const progress = acknowledgedCount / 4
    return progress
  }, [acknowledged])

  // Update acknowledgments and progress
  useEffect(() => {
    const progress = calculateProgress()
    updateAcknowledgments(acknowledged)
    updateScrollProgress(progress)
    onComplianceProgress?.(progress)
  }, [acknowledged, updateAcknowledgments, updateScrollProgress, onComplianceProgress, calculateProgress])

  const handleAcknowledgment = (key: keyof typeof acknowledged, value: boolean) => {
    setAcknowledged(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const allAcknowledged = Object.values(acknowledged).every(Boolean)

  return (
    <div 
      ref={containerRef}
      className={`py-20 ${className}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, type: "spring" }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Información Médica <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Esencial</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Tu seguridad es nuestra máxima prioridad. Lee cada sección cuidadosamente para acceder de forma segura a las frecuencias terapéuticas.
          </p>
          
          {/* Progress indicator */}
          <motion.div 
            className="mt-8 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">Progreso de Seguridad</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(calculateProgress() * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div 
                className={`h-full ${allAcknowledged ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress() * 100}%` }}
                transition={{ duration: 0.8, type: "spring" }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Section 1: FDA Medical Device Disclaimer */}
        <MedicalSection
          icon={Shield}
          title="Aviso FDA - Dispositivo Médico"
          colorScheme="red"
          acknowledgmentKey="notMedicalDevice"
          acknowledged={acknowledged.notMedicalDevice}
          onAcknowledgment={handleAcknowledgment}
          delay={0.1}
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold text-red-900">
              <strong>FreqHeal NO es un dispositivo médico aprobado por la FDA.</strong>
            </p>
            <p className="text-red-800 leading-relaxed">
              Esta plataforma está diseñada para propósitos de bienestar, investigación y educación únicamente. 
              La tecnología de terapia de frecuencias no ha sido evaluada por la Administración de Alimentos 
              y Medicamentos de los EE.UU. (FDA) como dispositivo médico para el diagnóstico, tratamiento, 
              cura o prevención de cualquier enfermedad o condición médica.
            </p>
            <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-red-800 text-sm">
                <strong>Importante:</strong> Los efectos reportados por los usuarios son subjetivos y no constituyen 
                evidencia médica de eficacia terapéutica.
              </p>
            </div>
          </div>
        </MedicalSection>

        {/* Section 2: Medical Supervision Required */}
        <MedicalSection
          icon={Stethoscope}
          title="Supervisión Médica Requerida"
          colorScheme="blue"
          acknowledgmentKey="consultPhysician"
          acknowledged={acknowledged.consultPhysician}
          onAcknowledgment={handleAcknowledgment}
          delay={0.2}
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold text-blue-900">
              <strong>Siempre consulta a tu proveedor de salud</strong> antes de comenzar la terapia de frecuencias.
            </p>
            <p className="text-blue-800 leading-relaxed">
              Los protocolos de grado clínico deben administrarse únicamente bajo supervisión médica calificada. 
              Esto es particularmente importante si estás embarazada, amamantando, tienes historial de convulsiones, 
              condiciones cardíacas, trastornos psiquiátricos, o tomas medicamentos que afectan el sistema nervioso.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Condiciones que Requieren Supervisión</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Embarazo o lactancia</li>
                  <li>• Trastornos del estado de ánimo</li>
                  <li>• Medicación neurológica</li>
                  <li>• Condiciones cardíacas</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Consulta Antes de Usar</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Médico de cabecera</li>
                  <li>• Neurólogo (si aplica)</li>
                  <li>• Psiquiatra (si aplica)</li>
                  <li>• Cardiólogo (si aplica)</li>
                </ul>
              </div>
            </div>
          </div>
        </MedicalSection>

        {/* Section 3: Important Contraindications */}
        <MedicalSection
          icon={AlertTriangle}
          title="Contraindicaciones Importantes"
          colorScheme="yellow"
          acknowledgmentKey="contraindications"
          acknowledged={acknowledged.contraindications}
          onAcknowledgment={handleAcknowledgment}
          delay={0.3}
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold text-yellow-900">
              <strong>NO uses FreqHeal si tienes alguna de estas condiciones:</strong>
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Neurológicas
                </h4>
                <ul className="text-yellow-800 space-y-2 text-sm">
                  <li>• Epilepsia activa o trastornos convulsivos</li>
                  <li>• Lesión cerebral traumática reciente</li>
                  <li>• Trastornos psiquiátricos severos sin supervisión</li>
                  <li>• Abuso activo de sustancias o abstinencia</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Cardiovasculares y Otras
                </h4>
                <ul className="text-yellow-800 space-y-2 text-sm">
                  <li>• Marcapasos o dispositivos cardíacos implantados</li>
                  <li>• Embarazo (primer trimestre) o embarazo de alto riesgo</li>
                  <li>• Implantes cocleares</li>
                  <li>• Sensibilidad extrema al sonido</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-100 border border-orange-300 p-5 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ Detén Inmediatamente Si Experimentas:</h4>
              <p className="text-orange-800 text-sm">
                Mareos, náuseas, dolores de cabeza, ansiedad extrema, palpitaciones cardíacas, 
                o cualquier reacción adversa. Contacta a tu médico si los síntomas persisten.
              </p>
            </div>
          </div>
        </MedicalSection>

        {/* Section 4: Results and Legal Disclaimer */}
        <MedicalSection
          icon={BookOpen}
          title="Limitaciones y Descargo Legal"
          colorScheme="gray"
          acknowledgmentKey="noGuarantees"
          acknowledged={acknowledged.noGuarantees}
          onAcknowledgment={handleAcknowledgment}
          delay={0.4}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Resultados Individuales</h4>
                <p className="text-gray-700 text-sm">
                  <strong>Los resultados pueden variar.</strong> Aunque los estudios clínicos muestran resultados prometedores, 
                  FreqHeal no puede garantizar resultados específicos para usuarios individuales.
                </p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Complemento, No Sustituto</h4>
                <p className="text-gray-700 text-sm">
                  <strong>No reemplaza el cuidado médico.</strong> La terapia de frecuencias debe complementar, 
                  no reemplazar, el tratamiento médico convencional.
                </p>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">Propósitos de Investigación</h4>
                <p className="text-gray-700 text-sm">
                  Algunas frecuencias se proporcionan para investigación y educación, 
                  y deben usarse solo bajo supervisión apropiada.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-5 rounded-r-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Responsabilidad del Usuario</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                Al usar FreqHeal, reconoces que entiendes estas limitaciones y aceptas usar la plataforma 
                de manera responsable y bajo tu propio riesgo. Siempre busca consejo médico profesional 
                para condiciones de salud específicas.
              </p>
            </div>
          </div>
        </MedicalSection>

        {/* Emergency Information - Always Visible */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-3xl shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3">🚨 Información de Emergencia</h3>
              <p className="text-red-100 leading-relaxed">
                Si experimentas cualquier reacción adversa durante o después de usar la terapia de frecuencias, 
                <strong> discontinúa el uso inmediatamente</strong> y contacta a tu proveedor de salud. 
                Para emergencias médicas, llama al 911 (EE.UU.) o a los servicios de emergencia locales.
              </p>
              <div className="mt-4 text-sm text-red-200">
                <p>
                  <strong>Contacto médico:</strong> medical@freqheal.com | 
                  <strong> Versión:</strong> 2.0 | <strong>Actualizado:</strong> Marzo 2024
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Completion Status */}
        {allAcknowledged && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="inline-flex items-center space-x-3 bg-green-50 border-2 border-green-200 px-8 py-4 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="font-semibold text-green-900">
                ✅ Revisión de Seguridad Completada - ¡Puedes acceder a las frecuencias!
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Individual Medical Section Component with Framer Motion animations
interface MedicalSectionProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
  colorScheme: 'red' | 'blue' | 'yellow' | 'gray'
  acknowledgmentKey: keyof typeof defaultAcknowledged
  acknowledged: boolean
  onAcknowledgment: (key: keyof typeof defaultAcknowledged, value: boolean) => void
  delay: number
}

const defaultAcknowledged = {
  notMedicalDevice: false,
  consultPhysician: false,
  contraindications: false,
  noGuarantees: false
}

function MedicalSection({ 
  icon: Icon, 
  title, 
  children, 
  colorScheme, 
  acknowledgmentKey,
  acknowledged,
  onAcknowledgment,
  delay 
}: MedicalSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  const colorMap = {
    red: {
      bg: 'from-red-50 to-red-100/50',
      border: 'border-red-200',
      icon: 'bg-red-600',
      text: 'text-red-900',
      checkbox: 'text-red-600'
    },
    blue: {
      bg: 'from-blue-50 to-blue-100/50',
      border: 'border-blue-200',
      icon: 'bg-blue-600',
      text: 'text-blue-900',
      checkbox: 'text-blue-600'
    },
    yellow: {
      bg: 'from-yellow-50 to-yellow-100/50',
      border: 'border-yellow-200',
      icon: 'bg-yellow-600',
      text: 'text-yellow-900',
      checkbox: 'text-yellow-600'
    },
    gray: {
      bg: 'from-gray-50 to-gray-100/50',
      border: 'border-gray-200',
      icon: 'bg-gray-600',
      text: 'text-gray-900',
      checkbox: 'text-gray-600'
    }
  }

  const colors = colorMap[colorScheme]

  const acknowledgmentText = {
    notMedicalDevice: "Entiendo que FreqHeal no es un dispositivo médico aprobado por la FDA",
    consultPhysician: "Consultaré con mi proveedor de salud antes de usar la terapia de frecuencias",
    contraindications: "He leído y entiendo las contraindicaciones",
    noGuarantees: "Entiendo las limitaciones y usaré la plataforma de manera responsable"
  }

  return (
    <motion.div 
      ref={ref}
      className="mb-16"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      <Card className={`bg-gradient-to-br ${colors.bg} ${colors.border} border-2 overflow-hidden shadow-xl`}>
        <div className="p-8 md:p-10">
          <div className="flex items-start space-x-6">
            {/* Icon */}
            <motion.div
              className={`flex-shrink-0 w-16 h-16 ${colors.icon} rounded-3xl flex items-center justify-center shadow-lg`}
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
              transition={{ duration: 0.6, delay: delay + 0.1, type: "spring" }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            
            {/* Content */}
            <div className="flex-1">
              <motion.h3 
                className={`text-2xl md:text-3xl font-bold ${colors.text} mb-6`}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: delay + 0.2 }}
              >
                {title}
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: delay + 0.3 }}
              >
                {children}
              </motion.div>
              
              {/* Acknowledgment Checkbox */}
              <motion.div
                className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: delay + 0.4 }}
              >
                <label className="flex items-start space-x-4 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => onAcknowledgment(acknowledgmentKey, e.target.checked)}
                    className={`w-6 h-6 ${colors.checkbox} mt-1 rounded focus:ring-2 focus:ring-offset-2`}
                  />
                  <span className={`font-medium ${colors.text} leading-relaxed`}>
                    {acknowledgmentText[acknowledgmentKey]}
                  </span>
                </label>
                
                {acknowledged && (
                  <motion.div
                    className="mt-3 flex items-center space-x-2 text-green-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Confirmado</span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}