'use client'

import { Globe } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { locale, isRTL, setLocale } = useTranslation()

  return (
    <button
      onClick={() => setLocale(isRTL ? 'en' : 'ar')}
      className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all"
    >
      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      {isRTL ? 'English' : 'عربي'}
    </button>
  )
}
