import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, DollarSign, Users, Github } from 'lucide-react'
import { WaitlistForm } from './components/WaitlistForm'
import { FloatingElements } from './components/FloatingElements'

function App() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleWaitlistSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      <FloatingElements />

      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            🎉 Welcome to the paie waitlist!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 py-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="paie Logo" 
                className="w-full h-full object-cover rounded-xl"
                style={{ filter: 'drop-shadow(none)' }}
              />
            </div>
            <span className="text-2xl font-bold text-paie-cream">paie</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <a href="#waitlist" className="text-gray-300 hover:text-paie-cream transition-colors">
              Join Waitlist
            </a>
            <div className="flex items-center space-x-3">
              <a 
                href="https://github.com/Arihaan/paie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-paie-cream transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/intent/user?screen_name=0xpaie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-paie-cream transition-colors text-lg font-bold"
              >
                𝕏
              </a>
            </div>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section - Optimized for viewport */}
      <main className="relative z-10 px-4 sm:px-6 flex-1">
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] pt-4 sm:pt-6 lg:pt-8">
          <div className="w-full max-w-6xl mx-auto text-center space-y-6 lg:space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Coming Soon</span>
            </motion.div>

            {/* Main Headline - Single Line */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-paie-cream"
            >
              Pay Tokens over SMS
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Send and receive <span className="text-paie-blue font-semibold">USDC on Base</span> via 
              simple text messages. No smartphone or internet required.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8"
            >
              {[
                { icon: Users, label: 'Global Access', value: '5B+' },
                { icon: MessageSquare, label: 'SMS Compatible', value: '100%' },
                { icon: DollarSign, label: 'Transaction Fee', value: '<$0.01' },
              ].map((stat, index) => (
                <div key={stat.label} className="flex items-center space-x-3 glass-effect rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-paie-cream" />
                  <div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Waitlist Form */}
            <div id="waitlist" className="pt-2">
              <WaitlistForm onSuccess={handleWaitlistSuccess} />
            </div>
          </div>
        </div>
      </main>

      {/* Demo Section - Below the fold */}
      <section className="relative z-10 px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/10">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                { step: '1', action: 'REGISTER 1234', response: 'Wallet created successfully!' },
                { step: '2', action: 'SEND +1234567890 10 USDC 1234', response: 'Confirm sending 10 USDC?' },
                { step: '3', action: 'YES', response: 'Sent! New balance: $40 USDC' },
              ].map((demo, index) => (
                <motion.div
                  key={demo.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  className="text-left"
                >
                  <div className="bg-slate-800 rounded-lg p-3 sm:p-4 mb-2 border border-slate-700">
                    <div className="text-green-400 text-xs sm:text-sm font-mono">→ {demo.action}</div>
                  </div>
                  <div className="bg-paie-cream/20 rounded-lg p-3 sm:p-4 border border-paie-cream/30">
                    <div className="text-paie-cream text-xs sm:text-sm font-mono">← {demo.response}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="paie Logo" 
                className="w-full h-full object-cover rounded-lg"
                style={{ filter: 'drop-shadow(none)' }}
              />
            </div>
            <span className="text-xl font-bold text-paie-cream">paie</span>
          </div>
          <p className="text-gray-400 text-sm">
            Making cryptocurrency accessible to everyone, everywhere.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
