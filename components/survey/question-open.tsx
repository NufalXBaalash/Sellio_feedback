'use client'

interface QuestionOpenProps {
  question: string
  placeholder: string
  hint?: string
  value: string | null | undefined
  onChange: (value: string) => void
}

export default function QuestionOpen({ question, placeholder, hint, value, onChange }: QuestionOpenProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-snug">
        {question}
      </h2>
      <div className="max-w-lg mx-auto">
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none resize-none placeholder:text-gray-400 shadow-sm text-base leading-relaxed"
          placeholder={placeholder}
        />
        <div className="flex items-center justify-between mt-2 px-1">
          {hint && <span className="text-xs text-gray-400">{hint}</span>}
          <span className="text-xs text-gray-300">{(value || '').length} chars</span>
        </div>
      </div>
    </div>
  )
}
