import React from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Shield, Zap, Globe } from 'lucide-react'

const features = [
  {
    icon: Smartphone,
    title: 'SMS-Based',
    description: 'Send crypto via text messages on any phone',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'PIN-protected transactions with encrypted wallets',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Instant',
    description: 'Fast Solana blockchain transactions',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Globe,
    title: 'Universal',
    description: 'Works on feature phones worldwide',
    gradient: 'from-green-500 to-emerald-500'
  }
]

export const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.6 + index * 0.1,
            type: "spring",
            stiffness: 100
          }}
          whileHover={{ 
            y: -10,
            transition: { duration: 0.2 }
          }}
          className="group relative"
        >
          {/* Glow effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
          
          {/* Card */}
          <div className="relative glass-effect rounded-2xl p-6 h-full border border-white/10 group-hover:border-white/20 transition-all duration-300">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className="w-full h-full text-white" />
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
              {feature.description}
            </p>
            
            {/* Hover indicator */}
            <motion.div
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl`}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
} 