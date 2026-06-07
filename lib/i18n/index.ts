import { useContext, createContext } from 'react'
import type { Locale } from '@/lib/types/session'
import en from './locales/en.json'
import ar from './locales/ar.json'

const locales: Record<Locale, typeof en> = { en, ar }

export type TranslationKeys = typeof en

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // fallback to key
    }
  }
  return typeof current === 'string' ? current : path
}

interface TranslationContextValue {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: Locale
  isRTL: boolean
  setLocale: (locale: Locale) => void
}

export const TranslationContext = createContext<TranslationContextValue>({
  t: (key) => key,
  locale: 'en',
  isRTL: false,
  setLocale: () => {},
})

export function useTranslation() {
  return useContext(TranslationContext)
}

export function getTranslationHook(locale: Locale) {
  const translations = locales[locale]
  const isRTL = locale === 'ar'

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(translations as unknown as Record<string, unknown>, key)
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v))
      })
    }
    return value
  }

  return { t, locale, isRTL, translations }
}

export { locales }
