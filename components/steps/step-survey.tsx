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
import LanguageSwitcher from '@/components/shared/language-switcher'
import type { SurveyAnswers } from '@/lib/types/session'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface SurveyQuestion {
  id: keyof SurveyAnswers
  isConditional?: (answers: SurveyAnswers) => boolean
  render: (t: (key: string) => string, isRTL: boolean) => React.ReactNode
}

export default function StepSurvey() {
  const { t, isRTL } = useTranslation()
  const {
    language,
    sessionId,
    surveyAnswers,
    currentQuestionIndex,
    isSubmitting,
    setStep,
    resetSession,
    setSurveyAnswer,
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

  const questions: SurveyQuestion[] = useMemo(() => [
    // Q1: Conversation started
    {
      id: 'conversation_started',
      render: () => (
        <QuestionYesNo
          question={t('survey.q1_conversationStarted.question')}
          yesLabel={t('survey.q1_conversationStarted.yes')}
          noLabel={t('survey.q1_conversationStarted.no')}
          value={surveyAnswers.conversation_started}
          onChange={(v) => setSurveyAnswer('conversation_started', v)}
        />
      ),
    },
    // Q2: AI accuracy
    {
      id: 'ai_accuracy_rating',
      render: () => (
        <QuestionRating
          question={t('survey.q2_aiAccuracy.question')}
          labels={[
            t('survey.q2_aiAccuracy.label1'),
            t('survey.q2_aiAccuracy.label2'),
            t('survey.q2_aiAccuracy.label3'),
            t('survey.q2_aiAccuracy.label4'),
            t('survey.q2_aiAccuracy.label5'),
          ]}
          value={surveyAnswers.ai_accuracy_rating}
          onChange={(v) => setSurveyAnswer('ai_accuracy_rating', v)}
        />
      ),
    },
    // Q3: Order completed
    {
      id: 'order_completed',
      render: () => (
        <QuestionYesNo
          question={t('survey.q3_orderCompleted.question')}
          yesLabel={t('survey.q3_orderCompleted.yes')}
          noLabel={t('survey.q3_orderCompleted.no')}
          value={surveyAnswers.order_completed}
          onChange={(v) => setSurveyAnswer('order_completed', v)}
        />
      ),
    },
    // Q4: Order prevented (conditional)
    {
      id: 'order_prevented_reason',
      isConditional: (answers) => answers.order_completed === false,
      render: () => (
        <QuestionSelectText
          question={t('survey.q4_orderPrevented.question')}
          selectPlaceholder={t('survey.q4_orderPrevented.selectPlaceholder')}
          options={[
            { key: 'no_response', label: t('survey.q4_orderPrevented.optionNoResponse') },
            { key: 'wrong_info', label: t('survey.q4_orderPrevented.optionWrongInfo') },
            { key: 'no_payment', label: t('survey.q4_orderPrevented.optionNoPayment') },
            { key: 'confusing', label: t('survey.q4_orderPrevented.optionConfusing') },
            { key: 'no_stock', label: t('survey.q4_orderPrevented.optionNoStock') },
            { key: 'ai_error', label: t('survey.q4_orderPrevented.optionAiError') },
            { key: 'optionOther', label: t('survey.q4_orderPrevented.optionOther') },
          ]}
          textPlaceholder={t('survey.q4_orderPrevented.textPlaceholder')}
          selectedValue={surveyAnswers.order_prevented_reason}
          textValue={surveyAnswers.order_prevented_text}
          onSelectChange={(v) => setSurveyAnswer('order_prevented_reason', v)}
          onTextChange={(v) => setSurveyAnswer('order_prevented_text', v)}
        />
      ),
    },
    // Q5: Issue severity (conditional)
    {
      id: 'issue_severity',
      isConditional: (answers) => answers.order_completed === false,
      render: () => (
        <QuestionScale
          question={t('survey.q5_issueSeverity.question')}
          options={[
            { key: 'minor', label: t('survey.q5_issueSeverity.minor') },
            { key: 'moderate', label: t('survey.q5_issueSeverity.moderate') },
            { key: 'major', label: t('survey.q5_issueSeverity.major') },
          ]}
          value={surveyAnswers.issue_severity}
          onChange={(v) => setSurveyAnswer('issue_severity', v)}
        />
      ),
    },
    // Q6: Conversation duration
    {
      id: 'conversation_duration_estimate',
      render: () => (
        <QuestionScale
          question={t('survey.q6_conversationDuration.question')}
          options={[
            { key: 'less_than_1min', label: t('survey.q6_conversationDuration.lessThan1') },
            { key: '1_to_3min', label: t('survey.q6_conversationDuration.oneTo3') },
            { key: '3_to_5min', label: t('survey.q6_conversationDuration.threeTo5') },
            { key: 'more_than_5min', label: t('survey.q6_conversationDuration.moreThan5') },
          ]}
          value={surveyAnswers.conversation_duration_estimate}
          onChange={(v) => setSurveyAnswer('conversation_duration_estimate', v)}
        />
      ),
    },
    // Q7: Overall rating
    {
      id: 'overall_rating',
      render: () => (
        <QuestionRating
          question={t('survey.q7_overallRating.question')}
          labels={[
            t('survey.q7_overallRating.label1'),
            t('survey.q7_overallRating.label2'),
            t('survey.q7_overallRating.label3'),
            t('survey.q7_overallRating.label4'),
            t('survey.q7_overallRating.label5'),
          ]}
          value={surveyAnswers.overall_rating}
          onChange={(v) => setSurveyAnswer('overall_rating', v)}
        />
      ),
    },
    // Q8: Human likeness
    {
      id: 'human_likeness',
      render: () => (
        <QuestionScale
          question={t('survey.q8_humanLikeness.question')}
          options={[
            { key: 'definitely_ai', label: t('survey.q8_humanLikeness.definitelyAi') },
            { key: 'probably_ai', label: t('survey.q8_humanLikeness.probablyAi') },
            { key: 'not_sure', label: t('survey.q8_humanLikeness.notSure') },
            { key: 'probably_human', label: t('survey.q8_humanLikeness.probablyHuman') },
            { key: 'definitely_human', label: t('survey.q8_humanLikeness.definitelyHuman') },
          ]}
          value={surveyAnswers.human_likeness}
          onChange={(v) => setSurveyAnswer('human_likeness', v)}
        />
      ),
    },
    // Q9: Trust level
    {
      id: 'trust_level',
      render: () => (
        <QuestionScale
          question={t('survey.q9_trustLevel.question')}
          options={[
            { key: 'yes', label: t('survey.q9_trustLevel.yes') },
            { key: 'maybe', label: t('survey.q9_trustLevel.maybe') },
            { key: 'no', label: t('survey.q9_trustLevel.no') },
          ]}
          value={surveyAnswers.trust_level}
          onChange={(v) => setSurveyAnswer('trust_level', v)}
        />
      ),
    },
    // Q10: Business recommendation
    {
      id: 'business_recommendation',
      render: () => (
        <QuestionScale
          question={t('survey.q10_businessRecommendation.question')}
          options={[
            { key: 'definitely', label: t('survey.q10_businessRecommendation.definitely') },
            { key: 'probably', label: t('survey.q10_businessRecommendation.probably') },
            { key: 'not_sure', label: t('survey.q10_businessRecommendation.notSure') },
            { key: 'probably_not', label: t('survey.q10_businessRecommendation.probablyNot') },
            { key: 'definitely_not', label: t('survey.q10_businessRecommendation.definitelyNot') },
          ]}
          value={surveyAnswers.business_recommendation}
          onChange={(v) => setSurveyAnswer('business_recommendation', v)}
        />
      ),
    },
    // Q11: NPS
    {
      id: 'nps_score',
      render: () => (
        <QuestionNPS
          question={t('survey.q11_nps.question')}
          lowLabel={t('survey.q11_nps.label0')}
          highLabel={t('survey.q11_nps.label10')}
          value={surveyAnswers.nps_score}
          onChange={(v) => setSurveyAnswer('nps_score', v)}
        />
      ),
    },
    // Q12: Open feedback
    {
      id: 'open_feedback',
      render: () => (
        <QuestionOpen
          question={t('survey.q12_openFeedback.question')}
          placeholder={t('survey.q12_openFeedback.placeholder')}
          hint={t('survey.q12_openFeedback.hint')}
          value={surveyAnswers.open_feedback}
          onChange={(v) => setSurveyAnswer('open_feedback', v)}
        />
      ),
    },
  ], [surveyAnswers, setSurveyAnswer, t])

  // Compute visible questions (filter conditionals)
  const visibleQuestions = useMemo(() => {
    return questions.filter(q => !q.isConditional || q.isConditional(surveyAnswers))
  }, [questions, surveyAnswers])

  const totalQuestions = visibleQuestions.length
  const currentQuestion = visibleQuestions[currentQuestionIndex]

  // Check if current question is answered
  const isCurrentAnswered = useMemo(() => {
    if (!currentQuestion) return false
    const val = surveyAnswers[currentQuestion.id]
    if (currentQuestion.id === 'open_feedback') return true // optional
    return val !== null && val !== undefined && val !== ''
  }, [currentQuestion, surveyAnswers])

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
          ...surveyAnswers,
          testReturnedAt: testReturnedAt || new Date().toISOString(),
          surveyStartedAt: surveyStartedAt || new Date().toISOString(),
        }),
      })

      if (res.ok) {
        setStep('thank-you')
      } else {
        console.error('Failed to submit survey')
      }
    } catch (e) {
      console.error('Network error submitting survey:', e)
    } finally {
      setIsSubmitting(false)
    }
  }, [sessionId, surveyAnswers, testReturnedAt, surveyStartedAt, setIsSubmitting, setStep])

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
