'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Check, Eye, MessageCircle, ShoppingBag, Heart, Flag } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'
import AnimatedHeroBackground from '@/components/shared/animated-background'
import LanguageSwitcher from '@/components/shared/language-switcher'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_STORE_URL || 'https://instagram.com/sellioai'

export default function StepInstagramCta() {
  const { t, isRTL } = useTranslation()
  const { language, sessionId, setSessionId, setStep, resetSession, landingViewedAt } = useTestSession()
  const isAr = language === 'ar'
  const [hasClicked, setHasClicked] = useState(false)

  const handleBackToHome = () => {
    resetSession()
    setStep('landing')
  }

  const handleInstagramClick = async () => {
    const now = new Date().toISOString()
    const sid = sessionId || crypto.randomUUID()

    // Save session ID to context so survey can use it later
    setSessionId(sid)

    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sid,
          language,
          userAgent: navigator.userAgent,
          landingViewedAt: landingViewedAt || now,
          instagramClickedAt: now,
        }),
      })
    } catch (e) {
      console.error('Failed to create session:', e)
    }

    window.open(INSTAGRAM_URL, '_blank')
    setHasClicked(true)
  }

  const handleProceed = () => {
    setStep('instructions')
  }

  const instructions = [
    { icon: Eye, titleKey: 'steps.instructions.instruction1Title', descKey: 'steps.instructions.instruction1Desc' },
    { icon: MessageCircle, titleKey: 'steps.instructions.instruction2Title', descKey: 'steps.instructions.instruction2Desc' },
    { icon: ShoppingBag, titleKey: 'steps.instructions.instruction3Title', descKey: 'steps.instructions.instruction3Desc' },
    { icon: Heart, titleKey: 'steps.instructions.instruction4Title', descKey: 'steps.instructions.instruction4Desc' },
    { icon: Flag, titleKey: 'steps.instructions.instruction5Title', descKey: 'steps.instructions.instruction5Desc' },
  ]

  return (
    <div
      className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 overflow-x-hidden relative"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToHome}>
            <img src="/assets/logo/dark.png" alt="SellioAI" className="h-10 md:h-12 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline-block">SellioAI</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="relative pt-28 sm:pt-36 min-h-screen flex items-center justify-center px-4 py-12 z-10">
        <AnimatedHeroBackground />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="bg-white max-w-lg w-full p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(39,174,96,0.1),0_4px_20px_rgba(0,0,0,0.06)] border border-[#27AE60]/20 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#27AE60]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#27AE60]/20">
                <Flag className="w-8 h-8 text-[#27AE60]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {t('steps.instructions.title')}
              </h1>
              <p className="text-gray-500">{t('steps.instructions.subtitle')}</p>
            </div>

            {/* Instruction cards */}
            <div className="space-y-3 mb-6">
              {instructions.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                    className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#27AE60]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-[#27AE60]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{t(item.titleKey)}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{t(item.descKey)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 mb-6 text-center">
              <p className="text-yellow-700 text-xs font-medium">{t('steps.instructions.reminder')}</p>
            </div>

            {/* Instagram CTA */}
            {!hasClicked ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleInstagramClick}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E1306C] via-[#DD2A7B] to-[#8134AF] text-white font-bold text-lg shadow-[0_4px_20px_rgba(225,48,108,0.3)] hover:shadow-[0_4px_30px_rgba(225,48,108,0.45)] transition-shadow flex items-center justify-center gap-3"
              >
                {t('steps.instagramCta.buttonLabel')}
                <ExternalLink className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="bg-[#f0faf4] border border-[#27AE60]/20 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#27AE60] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-start">
                    <p className="text-[#27AE60] font-semibold text-sm">{t('steps.instagramCta.afterClick')}</p>
                    <p className="text-gray-500 text-xs">{t('steps.instagramCta.afterClickDesc')}</p>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full py-4 px-6 rounded-2xl bg-[#27AE60] hover:bg-[#219a52] text-white font-bold text-base shadow-[0_4px_20px_rgba(39,174,96,0.25)] transition-all flex items-center justify-center gap-2"
                >
                  {t('steps.instructions.cta')}
                </button>

                <button
                  onClick={handleInstagramClick}
                  className="w-full py-3 px-6 rounded-2xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-gray-300 transition-all"
                >
                  {isAr ? 'إعادة فتح إنستغرام' : 'Reopen Instagram'}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
