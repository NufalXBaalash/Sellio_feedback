'use client'

import { motion } from 'framer-motion'

interface SelectOption { key: string; label: string }

interface QuestionSelectTextProps {
  question: string
  selectPlaceholder: string
  options: SelectOption[]
  textPlaceholder: string
  selectedValue: string | null | undefined
  textValue: string | null | undefined
  onSelectChange: (value: string) => void
  onTextChange: (value: string) => void
  // Show the free-text field only for this option value (default: "Other").
  showTextFor?: string
  // Show the free-text field for ANY selected value (overrides showTextFor).
  alwaysShowText?: boolean
}

export default function QuestionSelectText({
  question, selectPlaceholder, options, textPlaceholder,
  selectedValue, textValue, onSelectChange, onTextChange, showTextFor = 'optionOther', alwaysShowText = false,
}: QuestionSelectTextProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug">{question}</h2>
      <div className="max-w-sm mx-auto space-y-3">
        <select
          value={selectedValue || ''}
          onChange={(e) => onSelectChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none shadow-sm text-sm appearance-none"
        >
          <option value="" disabled>{selectPlaceholder}</option>
          {options.map((opt) => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
        </select>
        {(alwaysShowText ? !!selectedValue : selectedValue === showTextFor) && (
          <motion.textarea
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            value={textValue || ''}
            onChange={(e) => onTextChange(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none resize-none placeholder:text-gray-400 shadow-sm text-sm"
            placeholder={textPlaceholder}
          />
        )}
      </div>
    </div>
  )
}
