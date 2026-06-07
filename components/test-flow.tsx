'use client'

import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTestSession } from '@/components/test-session-provider'
import StepLanding from '@/components/steps/step-landing'
import StepInstagramCta from '@/components/steps/step-instagram-cta'
import StepInstructions from '@/components/steps/step-instructions'
import StepSurvey from '@/components/steps/step-survey'
import StepThankYou from '@/components/steps/step-thank-you'

export default function TestFlow() {
  const { step, sessionId, setStep, landingViewedAt, instagramClickedAt } = useTestSession()

  // Record landing_viewed_at on first render
  useEffect(() => {
    if (!landingViewedAt && step === 'landing') {
      // We just need to track that the page was viewed; the actual DB write
      // happens when the user clicks the Instagram CTA (to avoid creating
      // rows for every bot/visitor that never proceeds).
      // For now, we store it in context only.
    }
  }, [step, landingViewedAt])

  // Resume: if user has a session with sessionId and was at instructions/survey, advance
  useEffect(() => {
    if (sessionId && instagramClickedAt && step === 'instagram-cta') {
      setStep('instructions')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only on mount

  return (
    <AnimatePresence mode="wait">
      {step === 'landing' && <StepLanding key="landing" />}
      {step === 'instagram-cta' && <StepInstagramCta key="instagram-cta" />}
      {step === 'instructions' && <StepInstructions key="instructions" />}
      {step === 'survey' && <StepSurvey key="survey" />}
      {step === 'thank-you' && <StepThankYou key="thank-you" />}
    </AnimatePresence>
  )
}
