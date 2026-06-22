'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Locale, TestStep, SessionState, SurveyAnswers, MerchantSurveyAnswers, FlowType } from '@/lib/types/session'
import { TranslationContext, getTranslationHook } from '@/lib/i18n'

const STORAGE_KEY = 'sellio_test_session'
const LANG_KEY = 'sellio_test_lang'

const initialState: SessionState = {
  step: 'landing',
  sessionId: null,
  language: 'en',
  flowType: 'customer',
  landingViewedAt: null,
  instagramClickedAt: null,
  testStartedAt: null,
  testReturnedAt: null,
  surveyStartedAt: null,
  surveyAnswers: {},
  merchantAnswers: {},
  currentQuestionIndex: 0,
  isSubmitting: false,
}

interface SessionContextValue extends SessionState {
  setStep: (step: TestStep) => void
  setLanguage: (lang: Locale) => void
  setSessionId: (id: string) => void
  setFlowType: (flow: FlowType) => void
  setSurveyAnswer: (key: keyof SurveyAnswers, value: unknown) => void
  setMerchantAnswer: (key: keyof MerchantSurveyAnswers, value: unknown) => void
  setCurrentQuestionIndex: (index: number) => void
  setIsSubmitting: (v: boolean) => void
  resetSession: () => void
}

const SessionContext = createContext<SessionContextValue>({
  ...initialState,
  setStep: () => {},
  setLanguage: () => {},
  setSessionId: () => {},
  setFlowType: () => {},
  setSurveyAnswer: () => {},
  setMerchantAnswer: () => {},
  setCurrentQuestionIndex: () => {},
  setIsSubmitting: () => {},
  resetSession: () => {},
})

export function useTestSession() {
  return useContext(SessionContext)
}

export function TestSessionProvider({ children }: { children: ReactNode }) {
  // Start from initialState on BOTH server and first client render, then
  // restore the saved session AFTER mount. Reading localStorage in the
  // initializer would make the first client render differ from the server
  // (different step/language) and cause a hydration mismatch.
  const [state, setState] = useState<SessionState>(initialState)
  const [hydrated, setHydrated] = useState(false)

  // Restore saved session from localStorage after mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedLang = localStorage.getItem(LANG_KEY) as Locale | null
      if (saved) {
        const parsed = JSON.parse(saved)
        setState({
          ...initialState,
          ...parsed,
          surveyAnswers: { ...(parsed.surveyAnswers || {}) },
          merchantAnswers: { ...(parsed.merchantAnswers || {}) },
          language: savedLang || parsed.language || 'en',
          flowType: parsed.flowType === 'merchant' ? 'merchant' : 'customer',
          isSubmitting: false,
        })
      } else if (savedLang) {
        setState(prev => ({ ...prev, language: savedLang }))
      }
    } catch { /* ignore corrupt storage */ }
    setHydrated(true)
  }, [])

  // Persist to localStorage (only after hydration, so we don't clobber the
  // saved state with initialState before it has been restored).
  useEffect(() => {
    if (!hydrated) return
    try {
      const { isSubmitting: _, ...toSave } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
      localStorage.setItem(LANG_KEY, state.language)
    } catch { /* ignore quota errors */ }
  }, [state, hydrated])

  // Set document direction
  useEffect(() => {
    const isRTL = state.language === 'ar'
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = state.language
  }, [state.language])

  const setStep = useCallback((step: TestStep) => {
    setState(prev => ({ ...prev, step }))
  }, [])

  const setLanguage = useCallback((language: Locale) => {
    setState(prev => ({ ...prev, language }))
  }, [])

  const setSessionId = useCallback((sessionId: string) => {
    setState(prev => ({ ...prev, sessionId }))
  }, [])

  const setFlowType = useCallback((flowType: FlowType) => {
    setState(prev => ({ ...prev, flowType }))
  }, [])

  const setSurveyAnswer = useCallback((key: keyof SurveyAnswers, value: unknown) => {
    setState(prev => ({
      ...prev,
      surveyAnswers: { ...prev.surveyAnswers, [key]: value },
    }))
  }, [])

  const setMerchantAnswer = useCallback((key: keyof MerchantSurveyAnswers, value: unknown) => {
    setState(prev => ({
      ...prev,
      merchantAnswers: { ...prev.merchantAnswers, [key]: value },
    }))
  }, [])

  const setCurrentQuestionIndex = useCallback((currentQuestionIndex: number) => {
    setState(prev => ({ ...prev, currentQuestionIndex }))
  }, [])

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setState(prev => ({ ...prev, isSubmitting }))
  }, [])

  const resetSession = useCallback(() => {
    setState({ ...initialState, language: state.language })
    localStorage.removeItem(STORAGE_KEY)
  }, [state.language])

  // Translation context value
  const i18n = getTranslationHook(state.language)
  const translationValue = {
    ...i18n,
    setLocale: setLanguage,
  }

  return (
    <SessionContext.Provider
      value={{
        ...state,
        setStep,
        setLanguage,
        setSessionId,
        setFlowType,
        setSurveyAnswer,
        setMerchantAnswer,
        setCurrentQuestionIndex,
        setIsSubmitting,
        resetSession,
      }}
    >
      <TranslationContext.Provider value={translationValue}>
        {children}
      </TranslationContext.Provider>
    </SessionContext.Provider>
  )
}
