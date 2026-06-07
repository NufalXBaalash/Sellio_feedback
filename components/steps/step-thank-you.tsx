'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Share2, Mail, ArrowRight, ArrowLeft, Send, Gift } from 'lucide-react'
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
    if (navigator.share) { try { await navigator.share({ url }) } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(url) }
  }

  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) return
    setEmailStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), isUseful: surveyAnswers.overall_rating && surveyAnswers.overall_rating >= 3 ? 'yes' : 'no', feedback: surveyAnswers.open_feedback || '' }),
      })
      setEmailStatus(res.ok ? 'sent' : 'error')
    } catch { setEmailStatus('error') }
  }

  const handleStartNew = () => { resetSession(); setStep('landing') }

  return (
    <div className="min-h-screen bg-[#f8fdf9] flex items-center justify-center p-3 sm:p-4 font-sans text-gray-700 relative" dir={isAr ? 'rtl' : 'ltr'}>
      <AnimatedHeroBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="bg-white max-w-sm w-full p-6 sm:p-8 rounded-2xl shadow-[0_20px_60px_rgba(39,174,96,0.1),0_4px_20px_rgba(0,0,0,0.06)] border border-[#27AE60]/20 text-center relative overflow-hidden z-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#27AE60] opacity-[0.04] blur-[80px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="w-14 h-14 bg-[#27AE60]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#27AE60]/20">
            <Check className="w-7 h-7 text-[#27AE60]" />
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-2">{t('steps.thankYou.title')}</motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-gray-500 mb-3 leading-relaxed">{t('steps.thankYou.description')}</motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xs text-gray-400 mb-5 leading-relaxed">{t('steps.thankYou.detail')}</motion.p>

          {/* Email section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="mb-4">
            {emailStatus === 'sent' ? (
              <div className="bg-[#f0faf4] border border-[#27AE60]/20 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#27AE60] rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[#27AE60] font-semibold text-xs">{isAr ? 'تم إرسال بريد التأكيد مع كود الخصم!' : 'Confirmation email with your discount code sent!'}</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-3 bg-gradient-to-r from-[#27AE60]/5 to-[#27AE60]/10 rounded-lg p-2.5 border border-[#27AE60]/15">
                  <Gift className="w-4 h-4 text-[#27AE60] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {isAr ? 'أدخل بريدك الإلكتروني وسنرسل لك كود خصم 50% لنفسك أو لأي شخص تختاره!' : 'Enter your email and we\'ll send you a 50% discount code for yourself or anyone you choose!'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'أنت@مثال.com' : 'you@example.com'}
                    disabled={emailStatus === 'sending'}
                    className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] outline-none disabled:opacity-50"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendEmail}
                    disabled={!email.includes('@') || emailStatus === 'sending'}
                    className="px-3.5 py-2.5 bg-[#27AE60] hover:bg-[#219a52] text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    {emailStatus === 'sending' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                  </motion.button>
                </div>
                {emailStatus === 'error' && <p className="text-red-400 text-[11px] mt-1.5">{isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.'}</p>}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="flex flex-col gap-2">
            <button onClick={handleShare} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 font-medium text-xs hover:bg-gray-100 transition-colors">
              <Share2 className="w-3.5 h-3.5" />{t('steps.thankYou.share')}
            </button>
            <button onClick={handleStartNew} className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-gray-400 font-medium text-xs hover:text-[#27AE60] transition-colors">
              {isAr ? 'ابدأ اختبار جديد' : 'Start a New Test'}
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }} className="mt-4">
            <p className="text-[10px] text-gray-300">SellioAI © {new Date().getFullYear()}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
