'use client'
import { motion } from 'framer-motion'

export default function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-brand-navy to-brand-emerald rounded-2xl flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">📈</div>
          <div className="text-xl font-semibold">Smart Investing</div>
          <div className="text-sm opacity-90">Data-Driven Decisions</div>
        </div>
      </div>
    </motion.div>
  )
}