export type SessionStatus = 'landing' | 'testing' | 'survey_started' | 'completed' | 'abandoned'
export type Locale = 'en' | 'ar'

export type HumanLikeness = 'definitely_ai' | 'probably_ai' | 'not_sure' | 'probably_human' | 'definitely_human'
export type TrustLevel = 'yes' | 'maybe' | 'no'
export type BusinessRecommendation = 'definitely' | 'probably' | 'not_sure' | 'probably_not' | 'definitely_not'
export type IssueSeverity = 'minor' | 'moderate' | 'major'
export type ConversationDuration = 'less_than_1min' | '1_to_3min' | '3_to_5min' | 'more_than_5min'

// ----- Dual-flow discriminator -----
export type FlowType = 'customer' | 'merchant'

// ----- Merchant survey value types -----
export type MerchantServiceUseful = 'definitely' | 'probably' | 'not_sure' | 'probably_not' | 'definitely_not'
export type MerchantTopBenefit = 'auto_replies' | 'dm_to_sales' | 'time_saving' | 'no_lost_leads' | 'inventory_mgmt' | 'other'
export type MerchantWillingToPay = 'yes' | 'maybe' | 'no'
export type MerchantPriceExpectation = 'under_2000' | '2000_3000' | '3000_4000' | '4000_5000' | 'over_5000'
export type MerchantPricingFair = 'too_cheap' | 'fair' | 'expensive_but_ok' | 'too_expensive'
export type MerchantAdoptionTimeline = 'now' | 'within_month' | 'within_3months' | 'need_more_proof'
export type MerchantBlocker = 'price' | 'trust_ai' | 'need_trial' | 'incomplete' | 'not_needed' | 'other'

export interface TestSession {
  id?: string
  session_id: string
  language: Locale
  status: SessionStatus
  flow_type?: FlowType

  // Funnel timestamps
  landing_viewed_at?: string | null
  instagram_clicked_at?: string | null
  test_started_at?: string | null
  test_returned_at?: string | null
  survey_started_at?: string | null
  survey_completed_at?: string | null
  total_duration_seconds?: number | null

  // Customer survey answers
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

  // Merchant survey answers (M1–M11)
  m_ai_accuracy_rating?: number | null
  m_service_useful?: MerchantServiceUseful | null
  m_top_benefit?: MerchantTopBenefit | null
  m_top_benefit_text?: string | null
  m_willing_to_pay?: MerchantWillingToPay | null
  m_price_expectation?: MerchantPriceExpectation | null
  m_pricing_fair?: MerchantPricingFair | null
  m_adoption_timeline?: MerchantAdoptionTimeline | null
  m_blocker?: string | null
  m_blocker_text?: string | null
  m_merchant_nps?: number | null
  m_open_feedback?: string | null

  // Metadata
  user_agent?: string | null
  created_at?: string
  updated_at?: string

  // Contact details joined from the feedback (reward-claim) table by session_id.
  // Populated only on the stats payload — not a column on test_sessions itself.
  contact_name?: string | null
  contact_phone?: string | null
  contact_email?: string | null
}

// Customer survey answers (Flow A) — unchanged
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

// Merchant survey answers (Flow B)
export interface MerchantSurveyAnswers {
  // M1 — conversation started. NOTE: not persisted to a dedicated DB column
  // (the migration intentionally omits it); kept in client state so the survey
  // engine can treat M1 uniformly. The PATCH handler ignores unknown fields.
  m_conversation_started?: boolean | null
  m_ai_accuracy_rating?: number | null
  m_service_useful?: MerchantServiceUseful | null
  m_top_benefit?: MerchantTopBenefit | null
  m_top_benefit_text?: string | null
  m_willing_to_pay?: MerchantWillingToPay | null
  m_price_expectation?: MerchantPriceExpectation | null
  m_pricing_fair?: MerchantPricingFair | null
  m_adoption_timeline?: MerchantAdoptionTimeline | null
  m_blocker?: string | null
  m_blocker_text?: string | null
  m_merchant_nps?: number | null
  m_open_feedback?: string | null
}

export type TestStep = 'landing' | 'instagram-cta' | 'instructions' | 'survey' | 'thank-you'

export interface SessionState {
  step: TestStep
  sessionId: string | null
  language: Locale
  flowType: FlowType
  landingViewedAt: string | null
  instagramClickedAt: string | null
  testStartedAt: string | null
  testReturnedAt: string | null
  surveyStartedAt: string | null
  surveyAnswers: SurveyAnswers
  merchantAnswers: MerchantSurveyAnswers
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

// Customer-side session stats (Flow A)
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

// Alias kept for clarity in the dual-flow stats payload.
export type CustomerSessionStats = SessionStats

// Merchant-side session stats (Flow B)
export interface MerchantSessionStats {
  funnel: FunnelStats
  totalMerchants: number
  completedMerchants: number
  abandonedSessions: number
  completionRate: number
  abandonmentRate: number
  serviceUsefulRate: number          // % definitely + probably
  willingToPayRate: number           // % yes + maybe
  avgPriceExpectation: string        // modal bucket label
  pricingFairRate: number            // % fair + expensive_but_ok
  adoptionIntentRate: number         // % now + within_month
  merchantNps: NPSResult
  avgAiAccuracy: number
  serviceUsefulDistribution: Distribution
  topBenefitDistribution: Distribution
  willingToPayDistribution: Distribution
  priceExpectationDistribution: Distribution
  pricingFairDistribution: Distribution
  adoptionTimelineDistribution: Distribution
  blockerDistribution: Distribution
  recentMerchantSessions: TestSession[]
}
