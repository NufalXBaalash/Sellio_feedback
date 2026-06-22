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
  const { language, sessionId, setSessionId, setStep, resetSession, landingViewedAt, flowType } = useTestSession()
  const isAr = language === 'ar'
  const [hasClicked, setHasClicked] = useState(false)

  const handleBackToHome = () => { resetSession(); setStep('landing') }

  const handleInstagramClick = async () => {
    const now = new Date().toISOString()
    const sid = sessionId || crypto.randomUUID()
    setSessionId(sid)
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, language, flowType, userAgent: navigator.userAgent, landingViewedAt: landingViewedAt || now, instagramClickedAt: now }),
      })
    } catch (e) { console.error('Failed to create session:', e) }
    window.open(INSTAGRAM_URL, '_blank')
    setHasClicked(true)
  }

  const instructions = [
    { icon: Eye, titleKey: 'steps.instructions.instruction1Title', descKey: 'steps.instructions.instruction1Desc' },
    { icon: MessageCircle, titleKey: 'steps.instructions.instruction2Title', descKey: 'steps.instructions.instruction2Desc' },
    { icon: ShoppingBag, titleKey: 'steps.instructions.instruction3Title', descKey: 'steps.instructions.instruction3Desc' },
    { icon: Heart, titleKey: 'steps.instructions.instruction4Title', descKey: 'steps.instructions.instruction4Desc' },
    { icon: Flag, titleKey: 'steps.instructions.instruction5Title', descKey: 'steps.instructions.instruction5Desc' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 overflow-x-hidden relative" dir={isAr ? 'rtl' : 'ltr'}>
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToHome}>
            <img src="/assets/logo/dark.png" alt="SellioAI" className="h-8 md:h-10 w-auto object-contain" />
            <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:inline-block">SellioAI</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <section className="relative pt-20 sm:pt-28 min-h-screen flex items-center justify-center px-4 py-8 z-10">
        <AnimatedHeroBackground />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="bg-white max-w-lg w-full p-5 sm:p-8 rounded-2xl shadow-[0_20px_60px_rgba(39,174,96,0.1),0_4px_20px_rgba(0,0,0,0.06)] border border-[#27AE60]/20 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-[#27AE60]/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#27AE60]/20">
                <Flag className="w-6 h-6 text-[#27AE60]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{t('steps.instructions.title')}</h1>
              <p className="text-sm text-gray-500">{t('steps.instructions.subtitle')}</p>
            </div>

            {/* Instruction cards */}
            <div className="space-y-2 mb-4">
              {instructions.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                    className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#27AE60]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#27AE60]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs mb-0.5">{t(item.titleKey)}</h3>
                      <p className="text-gray-500 text-[11px] leading-relaxed">{t(item.descKey)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-2.5 mb-4 text-center">
              <p className="text-yellow-700 text-[11px] font-medium">{t('steps.instructions.reminder')}</p>
            </div>

            {/* Instagram CTA */}
            {!hasClicked ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleInstagramClick}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#E1306C] via-[#DD2A7B] to-[#8134AF] text-white font-bold text-base shadow-[0_4px_20px_rgba(225,48,108,0.3)] hover:shadow-[0_4px_30px_rgba(225,48,108,0.45)] transition-shadow flex items-center justify-center gap-2.5"
              >
                {t('steps.instagramCta.buttonLabel')}
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2.5">
                <div className="bg-[#f0faf4] border border-[#27AE60]/20 rounded-xl p-3 flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-[#27AE60] rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-start">
                    <p className="text-[#27AE60] font-semibold text-xs">{t('steps.instagramCta.afterClick')}</p>
                    <p className="text-gray-500 text-[11px]">{t('steps.instagramCta.afterClickDesc')}</p>
                  </div>
                </div>
                <button onClick={() => setStep('instructions')} className="w-full py-3 px-5 rounded-xl bg-[#27AE60] hover:bg-[#219a52] text-white font-bold text-sm shadow-[0_4px_20px_rgba(39,174,96,0.25)] transition-all flex items-center justify-center gap-2">
                  {t('steps.instructions.cta')}
                </button>
                <button onClick={handleInstagramClick} className="w-full py-2.5 px-5 rounded-xl border-2 border-gray-200 text-gray-600 font-medium text-xs hover:border-gray-300 transition-all">
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
