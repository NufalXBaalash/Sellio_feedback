'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface QuestionYesNoProps {
  question: string
  yesLabel: string
  noLabel: string
  value: boolean | null | undefined
  onChange: (value: boolean) => void
}

export default function QuestionYesNo({ question, yesLabel, noLabel, value, onChange }: QuestionYesNoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug">{question}</h2>
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(true)}
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
            value === true ? 'border-[#27AE60] bg-[#27AE60]/5 shadow-[0_0_15px_rgba(39,174,96,0.15)]' : 'border-gray-200 bg-white hover:border-[#27AE60]/40'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${value === true ? 'bg-[#27AE60] text-white' : 'bg-green-50 text-[#27AE60]'}`}>
            <Check className="w-5 h-5" />
          </div>
          <span className={`font-semibold text-xs sm:text-sm ${value === true ? 'text-[#27AE60]' : 'text-gray-700'}`}>{yesLabel}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(false)}
          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
            value === false ? 'border-red-400 bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-gray-200 bg-white hover:border-red-300/40'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${value === false ? 'bg-red-400 text-white' : 'bg-red-50 text-red-400'}`}>
            <X className="w-5 h-5" />
          </div>
          <span className={`font-semibold text-xs sm:text-sm ${value === false ? 'text-red-500' : 'text-gray-700'}`}>{noLabel}</span>
        </motion.button>
      </div>
    </div>
  )
}
