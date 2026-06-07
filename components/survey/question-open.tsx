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
    <div className="space-y-3">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center leading-snug">{question}</h2>
      <div className="max-w-sm mx-auto">
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] transition-all text-gray-900 outline-none resize-none placeholder:text-gray-400 shadow-sm text-sm leading-relaxed"
          placeholder={placeholder}
        />
        <div className="flex items-center justify-between mt-1.5 px-1">
          {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
          <span className="text-[10px] text-gray-300">{(value || '').length}</span>
        </div>
      </div>
    </div>
  )
}
