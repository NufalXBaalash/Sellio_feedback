'use client'

import { motion } from 'framer-motion'

interface QuestionNPSProps {
  question: string
  lowLabel: string
  highLabel: string
  value: number | null | undefined
  onChange: (value: number) => void
}

function getNpsColor(score: number): string {
  if (score <= 6) return 'bg-red-400 hover:bg-red-500 text-white'
  if (score <= 8) return 'bg-yellow-400 hover:bg-yellow-500 text-white'
  return 'bg-[#27AE60] hover:bg-[#219a52] text-white'
}

function getNpsSelectedColor(score: number): string {
  if (score <= 6) return 'bg-red-500 text-white border-red-600 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
  if (score <= 8) return 'bg-yellow-500 text-white border-yellow-600 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
  return 'bg-[#27AE60] text-white border-[#219a52] shadow-[0_0_12px_rgba(39,174,96,0.3)]'
}

export default function QuestionNPS({ question, lowLabel, highLabel, value, onChange }: QuestionNPSProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug">{question}</h2>
      <div className="max-w-sm mx-auto">
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <motion.button
              key={score}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(score)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-bold transition-all duration-200 border-2 ${
                value === score ? getNpsSelectedColor(score) : `border-transparent ${getNpsColor(score)}`
              }`}
            >
              {score}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-0.5">
          <span className="text-[10px] text-gray-400">{lowLabel}</span>
          <span className="text-[10px] text-gray-400">{highLabel}</span>
        </div>
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-400" />Detractors (0–6)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-400" />Passives (7–8)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#27AE60]" />Promoters (9–10)</span>
        </div>
      </div>
    </div>
  )
}
