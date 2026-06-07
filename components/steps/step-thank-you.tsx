'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Check, Share2, Mail, ArrowRight, ArrowLeft, Send, Gift } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'
import AnimatedHeroBackground from '@/components/shared/animated-background'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function StepThankYou() {
  const { t, isRTL } = useTranslation()
  const { language, surveyAnswers, resetSession, setStep } = useTestSession()
  const isAr = language === 'ar'

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleShare = async () => {
    const url = window.location.origin
    if (navigator.share) {
      try { await navigator.share({ url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) return
    setEmailStatus('sending')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          isUseful: surveyAnswers.overall_rating && surveyAnswers.overall_rating >= 3 ? 'yes' : 'no',
          feedback: surveyAnswers.open_feedback || '',
        }),
      })
      setEmailStatus(res.ok ? 'sent' : 'error')
    } catch {
      setEmailStatus('error')
    }
  }

  const handleStartNew = () => {
    resetSession()
    setStep('landing')
  }

  return (
    <div
      className="min-h-screen bg-[#f8fdf9] flex items-center justify-center p-4 font-sans text-gray-700 relative"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <AnimatedHeroBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="bg-white max-w-md w-full p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(39,174,96,0.1),0_4px_20px_rgba(0,0,0,0.06)] border border-[#27AE60]/20 text-center relative overflow-hidden z-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#27AE60]/20"
          >
            <Check className="w-10 h-10 text-[#27AE60]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            {t('steps.thankYou.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-500 mb-4 leading-relaxed"
          >
            {t('steps.thankYou.description')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-400 text-sm mb-8 leading-relaxed"
          >
            {t('steps.thankYou.detail')}
          </motion.p>

          {/* Email section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-6"
          >
            {emailStatus === 'sent' ? (
              <div className="bg-[#f0faf4] border border-[#27AE60]/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#27AE60] rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <p className="text-[#27AE60] font-semibold text-sm">
                  {isAr ? 'تم إرسال بريد التأكيد مع كود الخصم!' : 'Confirmation email with your discount code sent!'}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                {/* Discount reminder */}
                <div className="flex items-start gap-3 mb-4 bg-gradient-to-r from-[#27AE60]/5 to-[#27AE60]/10 rounded-xl p-3 border border-[#27AE60]/15">
                  <Gift className="w-5 h-5 text-[#27AE60] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {isAr
                      ? 'أدخل بريدك الإلكتروني وسنرسل لك كود خصم 50% لنفسك أو لأي شخص تختاره!'
                      : 'Enter your email and we\'ll send you a 50% discount code for yourself or anyone you choose!'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'أنت@مثال.com' : 'you@example.com'}
                    disabled={emailStatus === 'sending'}
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] outline-none disabled:opacity-50"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendEmail}
                    disabled={!email.includes('@') || emailStatus === 'sending'}
                    className="px-4 py-3 bg-[#27AE60] hover:bg-[#219a52] text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {emailStatus === 'sending' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
                {emailStatus === 'error' && (
                  <p className="text-red-400 text-xs mt-2">
                    {isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.'}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Share + Start New */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t('steps.thankYou.share')}
            </button>

            <button
              onClick={handleStartNew}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-gray-400 font-medium text-sm hover:text-[#27AE60] transition-colors"
            >
              {isAr ? 'ابدأ اختبار جديد' : 'Start a New Test'}
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-6"
          >
            <p className="text-xs text-gray-300">
              SellioAI © {new Date().getFullYear()}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
