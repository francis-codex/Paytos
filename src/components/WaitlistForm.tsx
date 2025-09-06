import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import { addToWaitlist } from '../lib/supabase'

interface WaitlistFormProps {
  onSuccess: () => void
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [showPhone, setShowPhone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    if (!phone) return true // Phone is optional
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: { email?: string; phone?: string } = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      await addToWaitlist(email, phone || undefined)
      onSuccess()
      setEmail('')
      setPhone('')
      setShowPhone(false)
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      setErrors({ email: 'Something went wrong. Please try again.' })
    }
    
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/10">
        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Join the Waitlist</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Horizontal Input Layout */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Email Field */}
            <div className="flex-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-patos-cream focus:ring-2 focus:ring-patos-cream/20 transition-all placeholder-gray-400 text-white"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Phone Field (Always visible on large screens) */}
            <div className="flex-1 lg:block hidden">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-patos-cream focus:ring-2 focus:ring-patos-cream/20 transition-all placeholder-gray-400 text-white"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.phone}
                </motion.p>
              )}
            </div>

            {/* Submit Button - Aligned with inputs on large screens */}
            <div className="lg:w-auto w-full">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full lg:w-auto bg-gradient-to-r from-patos-cream to-yellow-300 text-slate-900 font-semibold py-3 px-6 lg:px-8 rounded-lg hover:from-patos-cream/90 hover:to-yellow-300/90 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Get Early Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Phone Field (Progressive for mobile) */}
          <div className="lg:hidden">
            <motion.div
              initial={false}
              animate={{ height: showPhone ? 'auto' : 0, opacity: showPhone ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-patos-cream focus:ring-2 focus:ring-patos-cream/20 transition-all placeholder-gray-400 text-white"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {errors.phone}
                </motion.p>
              )}
            </motion.div>

            {/* Add Phone Button (Mobile only) */}
            {!showPhone && (
              <button
                type="button"
                onClick={() => setShowPhone(true)}
                className="w-full py-2 text-patos-cream hover:text-white transition-colors text-sm"
              >
                + Add phone number (optional)
              </button>
            )}
          </div>
        </form>

        <p className="text-gray-400 text-xs text-center mt-4">
          Be the first to experience SMS-based crypto payments
        </p>
      </div>
    </motion.div>
  )
} 