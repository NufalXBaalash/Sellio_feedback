'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Clock, Store, MessageCircle, ClipboardList, Gift } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'
import AnimatedHeroBackground from '@/components/shared/animated-background'
import LanguageSwitcher from '@/components/shared/language-switcher'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function StepLanding() {
  const { t, isRTL } = useTranslation()
  const { language, setStep, sessionId } = useTestSession()
  const isAr = language === 'ar'

  const handleStart = () => {
    setStep('instagram-cta')
  }

  return (
    <div
      className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 overflow-x-hidden relative"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo/dark.png" alt="SellioAI Logo" className="h-10 md:h-12 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline-block">SellioAI</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-36 md:pt-44 pb-14 sm:pb-20 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-center text-center z-10 overflow-hidden">
        <AnimatedHeroBackground />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white border border-[#27AE60]/30 text-xs sm:text-sm font-medium text-[#27AE60] mb-6 sm:mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse" />
            {t('steps.landing.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.15] text-gray-900"
          >
            {t('steps.landing.titleLine1')}
            <br />
            <span className="text-[#27AE60]">{t('steps.landing.titleLine2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {t('steps.landing.description')}
          </motion.p>

          {/* What you'll do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mb-8"
          >
            <p className="text-sm font-semibold text-gray-600 mb-4">{t('steps.landing.whatYoullDo')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {[
                { icon: Store, label: t('steps.landing.step1') },
                { icon: MessageCircle, label: t('steps.landing.step2') },
                { icon: ClipboardList, label: t('steps.landing.step3') },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-[#27AE60]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#27AE60]" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 50% discount offer banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mb-8 bg-gradient-to-r from-[#27AE60]/5 to-[#27AE60]/10 border border-[#27AE60]/20 rounded-2xl p-5 max-w-lg mx-auto"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5 text-[#27AE60]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#27AE60] mb-1">{t('steps.landing.discountBadge')}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{t('steps.landing.discountText')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={handleStart}
              className="group w-full max-w-xs h-14 px-8 rounded-full bg-[#27AE60] text-white font-bold text-lg hover:bg-[#219a52] transition-colors flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(39,174,96,0.3)] hover:shadow-[0_4px_30px_rgba(39,174,96,0.45)] hover:-translate-y-0.5 duration-300"
            >
              {t('steps.landing.cta')}
              {isAr ? (
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {t('steps.landing.timeEstimate')}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
