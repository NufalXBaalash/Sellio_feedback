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
  const { language, flowType, surveyAnswers, merchantAnswers, resetSession, setStep, sessionId } = useTestSession()
  const isAr = language === 'ar'
  const isMerchant = flowType === 'merchant'
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [claimStatus, setClaimStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const formValid = form.name.trim().length > 0 && form.email.includes('@')

  const handleShare = async () => {
    const url = window.location.origin
    if (navigator.share) { try { await navigator.share({ url }) } catch { /* cancelled */ } }
    else { await navigator.clipboard.writeText(url) }
  }

  const handleClaim = async () => {
    if (!formValid) return
    setClaimStatus('sending')
    try {
      const isUseful = isMerchant
        ? (merchantAnswers.m_merchant_nps != null && merchantAnswers.m_merchant_nps >= 7 ? 'yes' : 'no')
        : (surveyAnswers.overall_rating && surveyAnswers.overall_rating >= 3 ? 'yes' : 'no')
      const feedback = isMerchant ? (merchantAnswers.m_open_feedback || '') : (surveyAnswers.open_feedback || '')
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          isUseful,
          feedback,
          sessionId,
        }),
      })
      setClaimStatus(res.ok ? 'sent' : 'error')
    } catch { setClaimStatus('error') }
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
            className="text-2xl font-bold text-gray-900 mb-2">{t(isMerchant ? 'steps.thankYou.merchantTitle' : 'steps.thankYou.title')}</motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="text-sm text-gray-500 mb-3 leading-relaxed">{t(isMerchant ? 'steps.thankYou.merchantDescription' : 'steps.thankYou.description')}</motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xs text-gray-400 mb-5 leading-relaxed">{t(isMerchant ? 'steps.thankYou.merchantDetail' : 'steps.thankYou.detail')}</motion.p>

          {/* Claim free access: name + phone + email */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="mb-4">
            {claimStatus === 'sent' ? (
              <div className="bg-[#f0faf4] border border-[#27AE60]/20 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#27AE60] rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-[#27AE60] font-semibold text-xs">{isAr ? 'تم! كود الوصول المجاني في طريقه إلى بريدك 🎁' : 'Done! Your 100% free access code is on its way to your email 🎁'}</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-2 mb-3 bg-gradient-to-r from-[#27AE60]/5 to-[#27AE60]/10 rounded-lg p-2.5 border border-[#27AE60]/15">
                  <Gift className="w-4 h-4 text-[#27AE60] shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {isAr ? 'أدخل اسمك ورقم هاتفك وبريدك الإلكتروني لتحصل على SellioAI مجاناً (خصم 100%)!' : 'Enter your name, phone, and email to get SellioAI 100% FREE!'}
                  </p>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder={isAr ? 'الاسم بالكامل' : 'Full name'}
                    disabled={claimStatus === 'sending'}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] outline-none disabled:opacity-50"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder={isAr ? 'رقم الهاتف' : 'Phone number'}
                    disabled={claimStatus === 'sending'}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] outline-none disabled:opacity-50"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder={isAr ? 'أنت@مثال.com' : 'you@example.com'}
                    disabled={claimStatus === 'sending'}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#27AE60]/30 focus:border-[#27AE60] outline-none disabled:opacity-50"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClaim}
                    disabled={!formValid || claimStatus === 'sending'}
                    className="w-full py-2.5 bg-[#27AE60] hover:bg-[#219a52] text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 font-semibold text-xs"
                  >
                    {claimStatus === 'sending' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-3.5 h-3.5" />{isAr ? 'احصل عليها مجاناً' : 'Claim 100% Free'}</>}
                  </motion.button>
                </div>
                {claimStatus === 'error' && <p className="text-red-400 text-[11px] mt-1.5">{isAr ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Please try again.'}</p>}
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
