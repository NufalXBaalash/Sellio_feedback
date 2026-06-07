'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface QuestionRatingProps {
  question: string
  labels: [string, string, string, string, string]
  value: number | null | undefined
  onChange: (value: number) => void
}

export default function QuestionRating({ question, labels, value, onChange }: QuestionRatingProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug">{question}</h2>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {[1, 2, 3, 4, 5].map((rating) => (
            <motion.button key={rating} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onChange(rating)} className="focus:outline-none">
              <Star className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-200 ${value && rating <= value ? 'text-[#27AE60] fill-[#27AE60]' : 'text-gray-300 hover:text-[#27AE60]/50'}`} />
            </motion.button>
          ))}
        </div>
        {value !== null && value !== undefined && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="text-xs font-semibold text-[#27AE60]">{labels[value - 1]}</span>
          </motion.div>
        )}
      </div>
      <div className="flex justify-between max-w-[260px] mx-auto px-1">
        <span className="text-[10px] text-gray-400">{labels[0]}</span>
        <span className="text-[10px] text-gray-400">{labels[4]}</span>
      </div>
    </div>
  )
}
