'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'

interface SurveyProgressProps {
  current: number
  total: number
  onBack: () => void
  showBack?: boolean
}

export default function SurveyProgress({ current, total, onBack, showBack = true }: SurveyProgressProps) {
  const { t, isRTL } = useTranslation()
  const { language } = useTestSession()
  const isAr = language === 'ar'

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          {showBack && current > 0 && (
            <button
              onClick={onBack}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors"
              aria-label={t('common.back')}
            >
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500">
                {t('survey.progressLabel', { current: String(current + 1), total: String(total) })}
              </span>
              <span className="text-xs font-medium text-[#27AE60]">
                {Math.round(((current + 1) / total) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#27AE60] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((current + 1) / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
