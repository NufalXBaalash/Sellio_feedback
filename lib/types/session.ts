export type SessionStatus = 'landing' | 'testing' | 'survey_started' | 'completed' | 'abandoned'
export type Locale = 'en' | 'ar'

export type HumanLikeness = 'definitely_ai' | 'probably_ai' | 'not_sure' | 'probably_human' | 'definitely_human'
export type TrustLevel = 'yes' | 'maybe' | 'no'
export type BusinessRecommendation = 'definitely' | 'probably' | 'not_sure' | 'probably_not' | 'definitely_not'
export type IssueSeverity = 'minor' | 'moderate' | 'major'
export type ConversationDuration = 'less_than_1min' | '1_to_3min' | '3_to_5min' | 'more_than_5min'

export interface TestSession {
  id?: string
  session_id: string
  language: Locale
  status: SessionStatus

  // Funnel timestamps
  landing_viewed_at?: string | null
  instagram_clicked_at?: string | null
  test_started_at?: string | null
  test_returned_at?: string | null
  survey_started_at?: string | null
  survey_completed_at?: string | null
  total_duration_seconds?: number | null

  // Survey answers
  conversation_started?: boolean | null
  ai_accuracy_rating?: number | null
  order_completed?: boolean | null
  order_prevented_reason?: string | null
  order_prevented_text?: string | null
  issue_severity?: IssueSeverity | null
  conversation_duration_estimate?: ConversationDuration | null
  overall_rating?: number | null
  human_likeness?: HumanLikeness | null
  trust_level?: TrustLevel | null
  business_recommendation?: BusinessRecommendation | null
  nps_score?: number | null
  open_feedback?: string | null

  // Metadata
  user_agent?: string | null
  created_at?: string
  updated_at?: string
}

export interface SurveyAnswers {
  conversation_started?: boolean | null
  ai_accuracy_rating?: number | null
  order_completed?: boolean | null
  order_prevented_reason?: string | null
  order_prevented_text?: string | null
  issue_severity?: IssueSeverity | null
  conversation_duration_estimate?: ConversationDuration | null
  overall_rating?: number | null
  human_likeness?: HumanLikeness | null
  trust_level?: TrustLevel | null
  business_recommendation?: BusinessRecommendation | null
  nps_score?: number | null
  open_feedback?: string | null
}

export type TestStep = 'landing' | 'instagram-cta' | 'instructions' | 'survey' | 'thank-you'

export interface SessionState {
  step: TestStep
  sessionId: string | null
  language: Locale
  landingViewedAt: string | null
  instagramClickedAt: string | null
  testStartedAt: string | null
  testReturnedAt: string | null
  surveyStartedAt: string | null
  surveyAnswers: SurveyAnswers
  currentQuestionIndex: number
  isSubmitting: boolean
}

export interface FunnelStats {
  landingViews: number
  instagramClicks: number
  testReturns: number
  surveyStarts: number
  surveyCompletions: number
  landingToInstagramCTR: number
  instagramToReturnRate: number
  returnToCompletionRate: number
  overallCompletionRate: number
}

export interface NPSResult {
  score: number
  promoters: number
  passives: number
  detractors: number
  promoterPercent: number
  passivePercent: number
  detractorPercent: number
}

export interface Distribution<T extends string = string> {
  [key: string]: number
}

export interface SessionStats {
  funnel: FunnelStats
  totalSessions: number
  completedSessions: number
  abandonedSessions: number
  completionRate: number
  abandonmentRate: number
  conversationStartRate: number
  orderCompletionRate: number
  avgAiAccuracy: number
  avgOverallRating: number
  trustDistribution: Distribution
  humanLikenessDistribution: Distribution
  nps: NPSResult
  businessRecommendationDistribution: Distribution
  issueSeverityDistribution: Distribution
  conversationDurationDistribution: Distribution
  failureReasonsDistribution: Distribution
  recentSessions: TestSession[]
}
