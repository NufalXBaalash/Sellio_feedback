'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'
import AnimatedHeroBackground from '@/components/shared/animated-background'
import LanguageSwitcher from '@/components/shared/language-switcher'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_STORE_URL || 'https://instagram.com/sellioai'

export default function StepInstructions() {
  const { t, isRTL } = useTranslation()
  const { language, sessionId, setStep, resetSession } = useTestSession()
  const isAr = language === 'ar'

  const handleBackToHome = () => {
    resetSession()
    setStep('landing')
  }

  const handleDoneTesting = async () => {
    const now = new Date().toISOString()

    if (sessionId) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field: 'status',
            value: 'survey_started',
            testReturnedAt: now,
            surveyStartedAt: now,
          }),
        })
      } catch (e) {
        console.error('Failed to update session status:', e)
      }
    }

    setStep('survey')
  }

  const handleReopenInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank')
  }

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
          className="bg-white max-w-md w-full p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(39,174,96,0.1),0_4px_20px_rgba(0,0,0,0.06)] border border-[#27AE60]/20 text-center relative overflow-hidden z-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Pulsing indicator */}
            <div className="w-20 h-20 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#27AE60]/20 relative">
              <div className="absolute inset-0 rounded-full bg-[#27AE60]/20 animate-ping" />
              <div className="w-10 h-10 bg-[#27AE60] rounded-2xl flex items-center justify-center relative z-10">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              {isAr ? 'هل أنت جاهز لتقييم تجربتك؟' : 'Ready to Rate Your Experience?'}
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {isAr
                ? 'عند الانتهاء من التفاعل مع الذكاء الاصطناعي، اضغط الزر أدناه للإجابة على استبيان قصير عن تجربتك.'
                : 'Once you\'ve finished interacting with the AI, click the button below to answer a short survey about your experience.'}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDoneTesting}
              className="w-full py-4 px-6 rounded-2xl bg-[#27AE60] hover:bg-[#219a52] text-white font-bold text-base shadow-[0_4px_20px_rgba(39,174,96,0.25)] hover:shadow-[0_4px_30px_rgba(39,174,96,0.4)] transition-all flex items-center justify-center gap-3 mb-4"
            >
              {t('steps.instructions.cta')}
              {isAr ? (
                <ArrowLeft className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </motion.button>

            <button
              onClick={handleReopenInstagram}
              className="w-full py-3 px-6 rounded-2xl border-2 border-gray-200 text-gray-600 font-medium text-sm hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {isAr ? 'إعادة فتح إنستغرام' : 'Reopen Instagram'}
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
