'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/authState'
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react'

interface MagicLinkFormProps {
  isVisible: boolean
  onCancel: () => void
  className?: string
}

export default function MagicLinkForm({ isVisible, onCancel, className = '' }: MagicLinkFormProps) {
  const { signInWithMagicLink, loading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setIsValidEmail(validateEmail(newEmail))
    
    // Clear errors when user starts typing
    if (error) clearError()
    if (localError) setLocalError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValidEmail) {
      setLocalError('Por favor, introduce una dirección de email válida')
      return
    }
    
    console.log('🔐 [MagicLinkForm] Submitting magic link request for:', email)
    
    try {
      const result = await signInWithMagicLink(email)
      
      if (result.error) {
        console.error('❌ [MagicLinkForm] Magic link failed:', result.error)
        setLocalError(result.error.message || 'Error al enviar el enlace mágico')
        return
      }
      
      console.log('✅ [MagicLinkForm] Magic link sent successfully')
      setIsEmailSent(true)
      
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setIsEmailSent(false)
        onCancel()
      }, 8000)
      
    } catch (error: any) {
      console.error('❌ [MagicLinkForm] Unexpected error:', error)
      setLocalError(error?.message || 'Error inesperado')
    }
  }

  const handleCancel = () => {
    setEmail('')
    setIsEmailSent(false)
    setIsValidEmail(false)
    setLocalError(null)
    if (error) clearError()
    onCancel()
  }

  const displayError = error || localError

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`glass-card p-8 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md ${className}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {!isEmailSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Mail className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Acceso Instantáneo
                  </h3>
                  <p className="text-gray-600">
                    Te enviaremos un enlace mágico para acceder sin contraseñas
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="tu@email.com"
                        className={`w-full px-4 py-4 pl-12 bg-white/80 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                          displayError
                            ? 'border-red-300 focus:border-red-500'
                            : isValidEmail
                              ? 'border-green-300 focus:border-green-500'
                              : 'border-gray-200 focus:border-blue-500'
                        }`}
                        disabled={loading}
                        autoComplete="email"
                        autoFocus
                        required
                      />
                      <Mail className={`absolute left-4 top-4 w-5 h-5 transition-colors ${
                        displayError
                          ? 'text-red-400'
                          : isValidEmail
                            ? 'text-green-400'
                            : 'text-gray-400'
                      }`} />
                      
                      {/* Validation indicator */}
                      {email && (
                        <motion.div
                          className="absolute right-4 top-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isValidEmail ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {displayError && (
                      <motion.div
                        className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{displayError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      type="submit"
                      disabled={!isValidEmail || loading}
                      className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                        !isValidEmail || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'btn-primary-glow text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                      whileHover={isValidEmail && !loading ? { scale: 1.02 } : {}}
                      whileTap={isValidEmail && !loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Enviar Enlace Mágico</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-4 rounded-2xl font-medium text-gray-600 hover:text-gray-800 hover:bg-white/50 transition-colors"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                  </div>
                </form>

                {/* Privacy note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Tu email solo se usará para enviarte el enlace de acceso.
                    <br />
                    No compartimos tu información con terceros.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                className="text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Success animation */}
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15 
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  ¡Enlace Enviado!
                </h3>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">
                    Hemos enviado un enlace mágico a:
                  </p>
                  <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                    <span className="font-medium text-blue-800">{email}</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      1
                    </div>
                    <p className="text-left">
                      Revisa tu bandeja de entrada (y spam) para el email de FreqHeal
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      2
                    </div>
                    <p className="text-left">
                      Haz clic en el enlace para acceder automáticamente
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      3
                    </div>
                    <p className="text-left">
                      Disfruta de todas las frecuencias de FreqHeal
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleCancel}
                  className="mt-6 px-6 py-3 rounded-xl font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Entendido
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}