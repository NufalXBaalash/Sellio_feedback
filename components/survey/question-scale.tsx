'use client'

import { motion } from 'framer-motion'

interface ScaleOption { key: string; label: string }

interface QuestionScaleProps {
  question: string
  options: ScaleOption[]
  value: string | null | undefined
  onChange: (value: string) => void
}

export default function QuestionScale({ question, options, value, onChange }: QuestionScaleProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug">{question}</h2>
      <div className="flex flex-col gap-2 max-w-sm mx-auto">
        {options.map((option) => (
          <motion.button
            key={option.key}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.key)}
            className={`w-full py-3 px-4 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
              value === option.key
                ? 'border-[#27AE60] bg-[#27AE60]/5 text-[#27AE60] shadow-[0_0_12px_rgba(39,174,96,0.1)]'
                : 'border-gray-200 bg-white text-gray-700 hover:border-[#27AE60]/30'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
