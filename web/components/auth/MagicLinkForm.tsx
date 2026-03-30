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
      setLocalError('Please enter a valid email address')
      return
    }
    
    console.log('🔐 [MagicLinkForm] Submitting magic link request for:', email)
    
    try {
      const result = await signInWithMagicLink(email)
      
      if (result.error) {
        console.error('❌ [MagicLinkForm] Magic link failed:', result.error)
        setLocalError(result.error.message || 'Failed to send magic link')
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
      setLocalError(error?.message || 'An unexpected error occurred')
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
          className={`glass-card p-8 rounded-3xl border border-white/20 dark:border-gray-600 shadow-2xl backdrop-blur-md ${className}`}
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Instant Access
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We&apos;ll send you a magic link to sign in without a password
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="you@email.com"
                        className={`w-full px-4 py-4 pl-12 bg-white/80 dark:bg-white/10 border-2 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-gray-900 dark:text-white ${
                          displayError
                            ? 'border-red-300 focus:border-red-500'
                            : isValidEmail
                              ? 'border-green-300 focus:border-green-500'
                              : 'border-gray-200 dark:border-gray-600 focus:border-blue-500'
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
                        className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 px-4 py-3 rounded-xl border border-red-200 dark:border-red-800"
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
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'btn-primary-glow text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                      whileHover={isValidEmail && !loading ? { scale: 1.02 } : {}}
                      whileTap={isValidEmail && !loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Magic Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-4 rounded-2xl font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>

                {/* Privacy note */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your email will only be used to send you the sign-in link.
                    <br />
                    We do not share your information with third parties.
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

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Link Sent!
                </h3>
                
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    We&apos;ve sent a magic link to:
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-800">
                    <span className="font-medium text-blue-800 dark:text-blue-300">{email}</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      1
                    </div>
                    <p className="text-left">
                      Check your inbox (and spam) for the email from FreqTherapy
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      2
                    </div>
                    <p className="text-left">
                      Click the link to sign in automatically
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                      3
                    </div>
                    <p className="text-left">
                      Enjoy all FreqTherapy frequencies
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleCancel}
                  className="mt-6 px-6 py-3 rounded-xl font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Got it
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
