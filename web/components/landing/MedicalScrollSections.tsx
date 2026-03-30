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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
            Essential Medical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Information</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your safety is our highest priority. Read each section carefully to safely access therapeutic frequencies.
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
              <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Safety Progress</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(calculateProgress() * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
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
          title="FDA Notice — Medical Device"
          colorScheme="red"
          acknowledgmentKey="notMedicalDevice"
          acknowledged={acknowledged.notMedicalDevice}
          onAcknowledgment={handleAcknowledgment}
          delay={0.1}
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold text-red-900 dark:text-red-200">
              <strong>FreqTherapy is NOT an FDA-approved medical device.</strong>
            </p>
            <p className="text-red-800 dark:text-red-300 leading-relaxed">
              This platform is designed for wellness, research, and educational purposes only. 
              Frequency therapy technology has not been evaluated by the U.S. Food and Drug 
              Administration (FDA) as a medical device for the diagnosis, treatment, 
              cure, or prevention of any disease or medical condition.
            </p>
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-r-lg">
              <p className="text-red-800 dark:text-red-300 text-sm">
                <strong>Important:</strong> Effects reported by users are subjective and do not constitute 
                medical evidence of therapeutic efficacy.
              </p>
            </div>
          </div>
        </MedicalSection>

        {/* Section 2: Medical Supervision Required */}
        <MedicalSection
          icon={Stethoscope}
          title="Medical Supervision Required"
          colorScheme="blue"
          acknowledgmentKey="consultPhysician"
          acknowledged={acknowledged.consultPhysician}
          onAcknowledgment={handleAcknowledgment}
          delay={0.2}
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold text-blue-900 dark:text-blue-200">
              <strong>Always consult your healthcare provider</strong> before starting frequency therapy.
            </p>
            <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
              Clinical-grade protocols should only be administered under qualified medical supervision. 
              This is particularly important if you are pregnant, breastfeeding, have a history of seizures, 
              heart conditions, psychiatric disorders, or take medications that affect the nervous system.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Conditions Requiring Supervision</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Pregnancy or breastfeeding</li>
                  <li>• Mood disorders</li>
                  <li>• Neurological medication</li>
                  <li>• Heart conditions</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Consult Before Use</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>• Primary care physician</li>
                  <li>• Neurologist (if applicable)</li>
                  <li>• Psychiatrist (if applicable)</li>
                  <li>• Cardiologist (if applicable)</li>
                </ul>
              </div>
            </div>
          </div>
        </MedicalSection>

        {/* Section 3: Important Contraindications */}
        <MedicalSection
          icon={AlertTriangle}
          title="Important Contraindications"
          colorScheme="yellow"
          acknowledgmentKey="contraindications"
          acknowledged={acknowledged.contraindications}
          onAcknowledgment={handleAcknowledgment}
          delay={0.3}
        >
          <div className="space-y-4">
            <p className="text-lg font-semibold text-yellow-900 dark:text-yellow-200">
              <strong>DO NOT use FreqTherapy if you have any of these conditions:</strong>
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-5 rounded-xl border border-yellow-200 dark:border-yellow-700">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Neurological
                </h4>
                <ul className="text-yellow-800 dark:text-yellow-300 space-y-2 text-sm">
                  <li>• Active epilepsy or seizure disorders</li>
                  <li>• Recent traumatic brain injury</li>
                  <li>• Severe unsupervised psychiatric disorders</li>
                  <li>• Active substance abuse or withdrawal</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-5 rounded-xl border border-yellow-200 dark:border-yellow-700">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Cardiovascular &amp; Other
                </h4>
                <ul className="text-yellow-800 dark:text-yellow-300 space-y-2 text-sm">
                  <li>• Pacemaker or implanted cardiac devices</li>
                  <li>• Pregnancy (first trimester) or high-risk pregnancy</li>
                  <li>• Cochlear implants</li>
                  <li>• Extreme sound sensitivity</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 p-5 rounded-lg">
              <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-2">⚠️ Stop Immediately If You Experience:</h4>
              <p className="text-orange-800 dark:text-orange-300 text-sm">
                Dizziness, nausea, headaches, extreme anxiety, heart palpitations, 
                or any adverse reaction. Contact your doctor if symptoms persist.
              </p>
            </div>
          </div>
        </MedicalSection>

        {/* Section 4: Results and Legal Disclaimer */}
        <MedicalSection
          icon={BookOpen}
          title="Limitations &amp; Legal Disclaimer"
          colorScheme="gray"
          acknowledgmentKey="noGuarantees"
          acknowledged={acknowledged.noGuarantees}
          onAcknowledgment={handleAcknowledgment}
          delay={0.4}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Individual Results</h4>
                <p className="text-gray-700 dark:text-slate-300 text-sm">
                  <strong>Results may vary.</strong> While clinical studies show promising results, 
                  FreqTherapy cannot guarantee specific results for individual users.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Complement, Not Substitute</h4>
                <p className="text-gray-700 dark:text-slate-300 text-sm">
                  <strong>Does not replace medical care.</strong> Frequency therapy should complement, 
                  not replace, conventional medical treatment.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/50 p-5 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Research Purposes</h4>
                <p className="text-gray-700 dark:text-slate-300 text-sm">
                  Some frequencies are provided for research and education, 
                  and should only be used under appropriate supervision.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-5 rounded-r-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">User Responsibility</h4>
              <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
                By using FreqTherapy, you acknowledge that you understand these limitations and agree to use the platform 
                responsibly and at your own risk. Always seek professional medical advice 
                for specific health conditions.
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
              <h3 className="text-xl font-bold mb-3">🚨 Emergency Information</h3>
              <p className="text-red-100 leading-relaxed">
                If you experience any adverse reaction during or after using frequency therapy, 
                <strong> discontinue use immediately</strong> and contact your healthcare provider. 
                For medical emergencies, call 911 (U.S.) or your local emergency services.
              </p>
              <div className="mt-4 text-sm text-red-200">
                <p>
                  <strong>Medical contact:</strong> medical@freqtherapy.com | 
                  <strong> Version:</strong> 2.0 | <strong>Updated:</strong> March 2024
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
            <div className="inline-flex items-center space-x-3 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 px-8 py-4 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-900 dark:text-green-200">
                ✅ Safety Review Complete — You can now access the frequencies!
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
      bg: 'from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'bg-red-600',
      text: 'text-red-900 dark:text-red-200',
      checkbox: 'text-red-600'
    },
    blue: {
      bg: 'from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-600',
      text: 'text-blue-900 dark:text-blue-200',
      checkbox: 'text-blue-600'
    },
    yellow: {
      bg: 'from-yellow-50 to-yellow-100/50 dark:from-yellow-950/40 dark:to-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'bg-yellow-600',
      text: 'text-yellow-900 dark:text-yellow-200',
      checkbox: 'text-yellow-600'
    },
    gray: {
      bg: 'from-gray-50 to-gray-100/50 dark:from-slate-800/40 dark:to-slate-700/20',
      border: 'border-gray-200 dark:border-slate-700',
      icon: 'bg-gray-600',
      text: 'text-gray-900 dark:text-slate-200',
      checkbox: 'text-gray-600'
    }
  }

  const colors = colorMap[colorScheme]

  const acknowledgmentText = {
    notMedicalDevice: "I understand that FreqTherapy is not an FDA-approved medical device",
    consultPhysician: "I will consult with my healthcare provider before using frequency therapy",
    contraindications: "I have read and understand the contraindications",
    noGuarantees: "I understand the limitations and will use the platform responsibly"
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
                className="mt-8 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-slate-600/50"
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
                    className="mt-3 flex items-center space-x-2 text-green-700 dark:text-green-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Confirmed</span>
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