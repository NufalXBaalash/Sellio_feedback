'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Clock, Store, ShoppingBag, MessageCircle, ClipboardList, Gift } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'
import AnimatedHeroBackground from '@/components/shared/animated-background'
import LanguageSwitcher from '@/components/shared/language-switcher'
import type { FlowType } from '@/lib/types/session'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function StepLanding() {
  const { t, isRTL } = useTranslation()
  const { language, setStep, setFlowType } = useTestSession()
  const isAr = language === 'ar'

  const chooseFlow = (flow: FlowType) => {
    setFlowType(flow)
    setStep('instagram-cta')
  }

  return (
    <div
      className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 overflow-x-hidden relative"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-200/60 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/logo/dark.png" alt="SellioAI Logo" className="h-8 md:h-10 w-auto object-contain" />
            <span className="text-lg font-bold tracking-tight text-gray-900 hidden sm:inline-block">SellioAI</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 sm:pt-24 md:pt-32 pb-10 sm:pb-14 px-4 sm:px-6 min-h-screen flex flex-col items-center justify-start sm:justify-center text-center z-10 overflow-hidden">
        <AnimatedHeroBackground />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white border border-[#27AE60]/30 text-xs sm:text-sm font-medium text-[#27AE60] mb-4 sm:mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse" />
            {t('steps.landing.badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-[1.15] text-gray-900"
          >
            {t('steps.landing.titleLine1')}
            <br />
            <span className="text-[#27AE60]">{t('steps.landing.titleLine2')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="text-sm sm:text-base md:text-lg text-gray-500 mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed"
          >
            {t('steps.landing.description')}
          </motion.p>

          {/* What you'll do */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mb-5"
          >
            <p className="text-xs font-semibold text-gray-600 mb-3">{t('steps.landing.whatYoullDo')}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6">
              {[
                { icon: Store, label: t('steps.landing.step1') },
                { icon: MessageCircle, label: t('steps.landing.step2') },
                { icon: ClipboardList, label: t('steps.landing.step3') },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="w-7 h-7 rounded-lg bg-[#27AE60]/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#27AE60]" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 100% free offer banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mb-5 bg-gradient-to-r from-[#27AE60]/5 to-[#27AE60]/10 border border-[#27AE60]/20 rounded-xl p-3.5 sm:p-5 max-w-lg mx-auto"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#27AE60]/10 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-[#27AE60]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#27AE60] mb-0.5">{t('steps.landing.discountBadge')}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{t('steps.landing.discountText')}</p>
              </div>
            </div>
          </motion.div>

          {/* Role selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-sm font-semibold text-gray-700">{t('steps.landing.flowSelector.heading')}</p>

            <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              {/* Customer card — compact horizontal */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => chooseFlow('customer')}
                className="group relative w-full text-start p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-[#27AE60]/40 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#27AE60]/10 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#27AE60]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{t('steps.landing.flowSelector.customerTitle')}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-snug mt-0.5">{t('steps.landing.flowSelector.customerSubtitle')}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <Clock className="w-2.5 h-2.5" />
                    {t('steps.landing.flowSelector.customerBadge')}
                  </span>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#27AE60]/10 group-hover:bg-[#27AE60] flex items-center justify-center transition-colors">
                  {isAr
                    ? <ArrowLeft className="w-4 h-4 text-[#27AE60] group-hover:text-white transition-colors" />
                    : <ArrowRight className="w-4 h-4 text-[#27AE60] group-hover:text-white transition-colors" />}
                </div>
              </motion.button>

              {/* Merchant card — highlighted, compact horizontal */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => chooseFlow('merchant')}
                className="group relative w-full text-start p-3.5 sm:p-4 rounded-2xl bg-[#f0faf4] border-2 border-[#27AE60] shadow-[0_8px_30px_rgba(39,174,96,0.12)] hover:shadow-[0_8px_40px_rgba(39,174,96,0.22)] transition-all flex items-center gap-3"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#27AE60] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight flex items-center gap-1.5 flex-wrap">
                    {t('steps.landing.flowSelector.merchantTitle')}
                    <span className="text-[8px] sm:text-[9px] font-bold text-white bg-[#27AE60] rounded px-1.5 py-0.5 uppercase tracking-wide whitespace-nowrap">
                      {t('steps.landing.flowSelector.priorityTag')}
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-snug mt-0.5">{t('steps.landing.flowSelector.merchantSubtitle')}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <Clock className="w-2.5 h-2.5" />
                    {t('steps.landing.flowSelector.merchantBadge')}
                  </span>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#27AE60] flex items-center justify-center">
                  {isAr
                    ? <ArrowLeft className="w-4 h-4 text-white" />
                    : <ArrowRight className="w-4 h-4 text-white" />}
                </div>
              </motion.button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 mt-1">
              <Clock className="w-3 h-3" />
              {t('steps.landing.timeEstimate')}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
