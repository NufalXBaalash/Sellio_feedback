'use client'

import { useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useTestSession } from '@/components/test-session-provider'
import SurveyProgress from '@/components/survey/survey-progress'
import QuestionYesNo from '@/components/survey/question-yes-no'
import QuestionRating from '@/components/survey/question-rating'
import QuestionScale from '@/components/survey/question-scale'
import QuestionNPS from '@/components/survey/question-nps'
import QuestionSelectText from '@/components/survey/question-select-text'
import QuestionOpen from '@/components/survey/question-open'
import QuestionPricingCard from '@/components/survey/question-pricing-card'
import LanguageSwitcher from '@/components/shared/language-switcher'
import type { MerchantSurveyAnswers, MerchantWillingToPay, MerchantPricingFair } from '@/lib/types/session'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface MerchantSurveyQuestion {
  id: keyof MerchantSurveyAnswers
  isConditional?: (answers: MerchantSurveyAnswers) => boolean
  render: (t: (key: string) => string, isRTL: boolean) => React.ReactNode
}

const WTP_SHOW_KEYS: MerchantWillingToPay[] = ['yes', 'maybe']
const FAIR_SHOW_KEYS: MerchantPricingFair[] = ['fair', 'expensive_but_ok']

export default function StepSurveyMerchant() {
  const { t, isRTL } = useTranslation()
  const {
    language,
    sessionId,
    merchantAnswers,
    currentQuestionIndex,
    isSubmitting,
    setStep,
    resetSession,
    setMerchantAnswer,
    setCurrentQuestionIndex,
    setIsSubmitting,
    testReturnedAt,
    surveyStartedAt,
  } = useTestSession()
  const isAr = language === 'ar'

  const handleBackToHome = () => {
    resetSession()
    setStep('landing')
  }

  const questions: MerchantSurveyQuestion[] = useMemo(() => [
    // M1 — Conversation started (Yes/No, client-only — not persisted)
    {
      id: 'm_conversation_started',
      render: () => (
        <QuestionYesNo
          question={t('survey.merchant.m1_conversationStarted.question')}
          yesLabel={t('survey.merchant.m1_conversationStarted.yes')}
          noLabel={t('survey.merchant.m1_conversationStarted.no')}
          value={merchantAnswers.m_conversation_started}
          onChange={(v) => setMerchantAnswer('m_conversation_started', v)}
        />
      ),
    },
    // M2 — AI response quality (rating 1–5)
    {
      id: 'm_ai_accuracy_rating',
      render: () => (
        <QuestionRating
          question={t('survey.merchant.m2_aiQuality.question')}
          labels={[
            t('survey.merchant.m2_aiQuality.label1'),
            t('survey.merchant.m2_aiQuality.label2'),
            t('survey.merchant.m2_aiQuality.label3'),
            t('survey.merchant.m2_aiQuality.label4'),
            t('survey.merchant.m2_aiQuality.label5'),
          ]}
          value={merchantAnswers.m_ai_accuracy_rating}
          onChange={(v) => setMerchantAnswer('m_ai_accuracy_rating', v)}
        />
      ),
    },
    // M3 — Service value perception (scale 5)
    {
      id: 'm_service_useful',
      render: () => (
        <QuestionScale
          question={t('survey.merchant.m3_serviceUseful.question')}
          options={[
            { key: 'definitely', label: t('survey.merchant.m3_serviceUseful.definitely') },
            { key: 'probably', label: t('survey.merchant.m3_serviceUseful.probably') },
            { key: 'not_sure', label: t('survey.merchant.m3_serviceUseful.notSure') },
            { key: 'probably_not', label: t('survey.merchant.m3_serviceUseful.probablyNot') },
            { key: 'definitely_not', label: t('survey.merchant.m3_serviceUseful.definitelyNot') },
          ]}
          value={merchantAnswers.m_service_useful}
          onChange={(v) => setMerchantAnswer('m_service_useful', v)}
        />
      ),
    },
    // M4 — Top benefit (single select + text for "other")
    {
      id: 'm_top_benefit',
      render: () => (
        <QuestionSelectText
          question={t('survey.merchant.m4_topBenefit.question')}
          selectPlaceholder={t('survey.merchant.m4_topBenefit.selectPlaceholder')}
          options={[
            { key: 'auto_replies', label: t('survey.merchant.m4_topBenefit.autoReplies') },
            { key: 'dm_to_sales', label: t('survey.merchant.m4_topBenefit.dmToSales') },
            { key: 'time_saving', label: t('survey.merchant.m4_topBenefit.timeSaving') },
            { key: 'no_lost_leads', label: t('survey.merchant.m4_topBenefit.noLostLeads') },
            { key: 'inventory_mgmt', label: t('survey.merchant.m4_topBenefit.inventoryMgmt') },
            { key: 'other', label: t('survey.merchant.m4_topBenefit.other') },
          ]}
          textPlaceholder={t('survey.merchant.m4_topBenefit.textPlaceholder')}
          selectedValue={merchantAnswers.m_top_benefit}
          textValue={merchantAnswers.m_top_benefit_text}
          onSelectChange={(v) => setMerchantAnswer('m_top_benefit', v)}
          onTextChange={(v) => setMerchantAnswer('m_top_benefit_text', v)}
          showTextFor="other"
        />
      ),
    },
    // M5 — Willingness to pay (scale 3)
    {
      id: 'm_willing_to_pay',
      render: () => (
        <QuestionScale
          question={t('survey.merchant.m5_willingToPay.question')}
          options={[
            { key: 'yes', label: t('survey.merchant.m5_willingToPay.yes') },
            { key: 'maybe', label: t('survey.merchant.m5_willingToPay.maybe') },
            { key: 'no', label: t('survey.merchant.m5_willingToPay.no') },
          ]}
          value={merchantAnswers.m_willing_to_pay}
          onChange={(v) => setMerchantAnswer('m_willing_to_pay', v)}
        />
      ),
    },
    // M6 — Price expectation (conditional: M5 = yes | maybe)
    {
      id: 'm_price_expectation',
      isConditional: (a) => !!a.m_willing_to_pay && WTP_SHOW_KEYS.includes(a.m_willing_to_pay),
      render: () => (
        <QuestionScale
          question={t('survey.merchant.m6_priceExpectation.question')}
          options={[
            { key: 'under_100', label: t('survey.merchant.m6_priceExpectation.under100') },
            { key: '100_300', label: t('survey.merchant.m6_priceExpectation.100to300') },
            { key: '300_600', label: t('survey.merchant.m6_priceExpectation.300to600') },
            { key: '600_1000', label: t('survey.merchant.m6_priceExpectation.600to1000') },
            { key: 'over_1000', label: t('survey.merchant.m6_priceExpectation.over1000') },
          ]}
          value={merchantAnswers.m_price_expectation}
          onChange={(v) => setMerchantAnswer('m_price_expectation', v)}
        />
      ),
    },
    // M7 — Pricing page reaction (conditional: M5 = yes | maybe) + pricing card
    {
      id: 'm_pricing_fair',
      isConditional: (a) => !!a.m_willing_to_pay && WTP_SHOW_KEYS.includes(a.m_willing_to_pay),
      render: () => (
        <div>
          <QuestionPricingCard isAr={isAr} />
          <QuestionScale
            question={t('survey.merchant.m7_pricingFair.question')}
            options={[
              { key: 'too_cheap', label: t('survey.merchant.m7_pricingFair.tooCheap') },
              { key: 'fair', label: t('survey.merchant.m7_pricingFair.fair') },
              { key: 'expensive_but_ok', label: t('survey.merchant.m7_pricingFair.expensiveButOk') },
              { key: 'too_expensive', label: t('survey.merchant.m7_pricingFair.tooExpensive') },
            ]}
            value={merchantAnswers.m_pricing_fair}
            onChange={(v) => setMerchantAnswer('m_pricing_fair', v)}
          />
        </div>
      ),
    },
    // M8 — Adoption timeline (conditional: M7 = fair | expensive_but_ok)
    {
      id: 'm_adoption_timeline',
      isConditional: (a) => !!a.m_pricing_fair && FAIR_SHOW_KEYS.includes(a.m_pricing_fair),
      render: () => (
        <QuestionScale
          question={t('survey.merchant.m8_adoptionTimeline.question')}
          options={[
            { key: 'now', label: t('survey.merchant.m8_adoptionTimeline.now') },
            { key: 'within_month', label: t('survey.merchant.m8_adoptionTimeline.withinMonth') },
            { key: 'within_3months', label: t('survey.merchant.m8_adoptionTimeline.within3months') },
            { key: 'need_more_proof', label: t('survey.merchant.m8_adoptionTimeline.needMoreProof') },
          ]}
          value={merchantAnswers.m_adoption_timeline}
          onChange={(v) => setMerchantAnswer('m_adoption_timeline', v)}
        />
      ),
    },
    // M9 — Adoption blockers (select + always-on optional text)
    {
      id: 'm_blocker',
      render: () => (
        <QuestionSelectText
          question={t('survey.merchant.m9_blocker.question')}
          selectPlaceholder={t('survey.merchant.m9_blocker.selectPlaceholder')}
          options={[
            { key: 'price', label: t('survey.merchant.m9_blocker.price') },
            { key: 'trust_ai', label: t('survey.merchant.m9_blocker.trustAi') },
            { key: 'need_trial', label: t('survey.merchant.m9_blocker.needTrial') },
            { key: 'incomplete', label: t('survey.merchant.m9_blocker.incomplete') },
            { key: 'not_needed', label: t('survey.merchant.m9_blocker.notNeeded') },
            { key: 'other', label: t('survey.merchant.m9_blocker.other') },
          ]}
          textPlaceholder={t('survey.merchant.m9_blocker.textPlaceholder')}
          selectedValue={merchantAnswers.m_blocker}
          textValue={merchantAnswers.m_blocker_text}
          onSelectChange={(v) => setMerchantAnswer('m_blocker', v)}
          onTextChange={(v) => setMerchantAnswer('m_blocker_text', v)}
          alwaysShowText
        />
      ),
    },
    // M10 — Merchant NPS (0–10)
    {
      id: 'm_merchant_nps',
      render: () => (
        <QuestionNPS
          question={t('survey.merchant.m10_nps.question')}
          lowLabel={t('survey.merchant.m10_nps.label0')}
          highLabel={t('survey.merchant.m10_nps.label10')}
          value={merchantAnswers.m_merchant_nps}
          onChange={(v) => setMerchantAnswer('m_merchant_nps', v)}
        />
      ),
    },
    // M11 — Open feedback (optional)
    {
      id: 'm_open_feedback',
      render: () => (
        <QuestionOpen
          question={t('survey.merchant.m11_openFeedback.question')}
          placeholder={t('survey.merchant.m11_openFeedback.placeholder')}
          hint={t('survey.merchant.m11_openFeedback.hint')}
          value={merchantAnswers.m_open_feedback}
          onChange={(v) => setMerchantAnswer('m_open_feedback', v)}
        />
      ),
    },
  ], [merchantAnswers, setMerchantAnswer, t, isAr])

  // Compute visible questions (filter conditionals)
  const visibleQuestions = useMemo(() => {
    return questions.filter(q => !q.isConditional || q.isConditional(merchantAnswers))
  }, [questions, merchantAnswers])

  const totalQuestions = visibleQuestions.length
  const currentQuestion = visibleQuestions[currentQuestionIndex]

  // Check if current question is answered (open feedback is optional)
  const isCurrentAnswered = useMemo(() => {
    if (!currentQuestion) return false
    if (currentQuestion.id === 'm_open_feedback') return true // optional
    const val = merchantAnswers[currentQuestion.id]
    return val !== null && val !== undefined && val !== ''
  }, [currentQuestion, merchantAnswers])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }, [currentQuestionIndex, totalQuestions, setCurrentQuestionIndex])

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex])

  const handleSubmit = useCallback(async () => {
    if (!sessionId) return
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flowType: 'merchant',
          ...merchantAnswers,
          testReturnedAt: testReturnedAt || new Date().toISOString(),
          surveyStartedAt: surveyStartedAt || new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setStep('thank-you')
      } else {
        console.error('Failed to submit merchant survey')
      }
    } catch (e) {
      console.error('Network error submitting merchant survey:', e)
    } finally {
      setIsSubmitting(false)
    }
  }, [sessionId, merchantAnswers, testReturnedAt, surveyStartedAt, setIsSubmitting, setStep])

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <div
      className="min-h-screen bg-[#f8fdf9] text-gray-800 font-sans selection:bg-[#27AE60]/20 flex flex-col"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Progress bar */}
      <SurveyProgress
        current={currentQuestionIndex}
        total={totalQuestions}
        onBack={handleBack}
        showBack={currentQuestionIndex > 0}
      />

      {/* Language switcher + Home floating */}
      <div className="fixed top-20 right-4 z-40 sm:right-6 flex items-center gap-2">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm px-3 py-1.5 rounded-full transition-all"
        >
          <img src="/assets/logo/dark.png" alt="" className="h-4 w-auto" />
          {isAr ? 'الرئيسية' : 'Home'}
        </button>
        <LanguageSwitcher />
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-5 sm:py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {currentQuestion.render(t, isRTL)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 px-4 py-3 safe-bottom">
        <div className="max-w-2xl mx-auto">
          {isLastQuestion ? (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-3 px-5 rounded-xl bg-[#27AE60] hover:bg-[#219a52] text-white font-bold text-sm shadow-[0_4px_20px_rgba(39,174,96,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {t('common.submit')}
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!isCurrentAnswered}
              className="w-full py-3 px-5 rounded-xl bg-[#27AE60] hover:bg-[#219a52] text-white font-bold text-sm shadow-[0_4px_20px_rgba(39,174,96,0.25)] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {t('common.next')}
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
