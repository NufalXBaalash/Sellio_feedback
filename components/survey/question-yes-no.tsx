'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface QuestionYesNoProps {
  question: string
  yesLabel: string
  noLabel: string
  value: boolean | null | undefined
  onChange: (value: boolean) => void
}

export default function QuestionYesNo({ question, yesLabel, noLabel, value, onChange }: QuestionYesNoProps) {
  const { isRTL } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-snug">
        {question}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(true)}
          className={`relative min-h-[120px] flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
            value === true
              ? 'border-[#27AE60] bg-[#27AE60]/5 shadow-[0_0_20px_rgba(39,174,96,0.15)]'
              : 'border-gray-200 bg-white hover:border-[#27AE60]/40 hover:shadow-sm'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            value === true ? 'bg-[#27AE60] text-white' : 'bg-green-50 text-[#27AE60]'
          }`}>
            <Check className="w-6 h-6" />
          </div>
          <span className={`font-semibold text-sm sm:text-base ${value === true ? 'text-[#27AE60]' : 'text-gray-700'}`}>
            {yesLabel}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(false)}
          className={`relative min-h-[120px] flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
            value === false
              ? 'border-red-400 bg-red-50 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
              : 'border-gray-200 bg-white hover:border-red-300/40 hover:shadow-sm'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            value === false ? 'bg-red-400 text-white' : 'bg-red-50 text-red-400'
          }`}>
            <X className="w-6 h-6" />
          </div>
          <span className={`font-semibold text-sm sm:text-base ${value === false ? 'text-red-500' : 'text-gray-700'}`}>
            {noLabel}
          </span>
        </motion.button>
      </div>
    </div>
  )
}
