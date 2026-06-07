'use client'

import { motion } from 'framer-motion'

interface SelectOption {
  key: string
  label: string
}

interface QuestionSelectTextProps {
  question: string
  selectPlaceholder: string
  options: SelectOption[]
  textPlaceholder: string
  selectedValue: string | null | undefined
  textValue: string | null | undefined
  onSelectChange: (value: string) => void
  onTextChange: (value: string) => void
  showTextFor?: string
}

export default function QuestionSelectText({
  question,
  selectPlaceholder,
  options,
  textPlaceholder,
  selectedValue,
  textValue,
  onSelectChange,
  onTextChange,
  showTextFor = 'optionOther',
}: QuestionSelectTextProps) {
  const showText = selectedValue === showTextFor

  return (
    <div className="space-y-5">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-snug">
        {question}
      </h2>
      <div className="max-w-lg mx-auto space-y-4">
        <select
          value={selectedValue || ''}
          onChange={(e) => onSelectChange(e.target.value)}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none shadow-sm appearance-none"
        >
          <option value="" disabled>{selectPlaceholder}</option>
          {options.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        {showText && (
          <motion.textarea
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            value={textValue || ''}
            onChange={(e) => onTextChange(e.target.value)}
            rows={3}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none resize-none placeholder:text-gray-400 shadow-sm"
            placeholder={textPlaceholder}
          />
        )}
      </div>
    </div>
  )
}
