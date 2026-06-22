import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Types for our feedback data
export interface FeedbackData {
  id?: string
  session_id?: string
  name?: string
  phone?: string
  email: string
  is_useful: 'yes' | 'no'
  feedback?: string
  timestamp?: string
  created_at?: string
  updated_at?: string
}

export interface FeedbackStats {
  totalSubmissions: number
  usefulCount: number
  notUsefulCount: number
  usefulPercentage: number
  recentSubmissions: Array<{
    email: string
    isUseful: string
    feedback: string
    timestamp: string
  }>
  lastUpdated: string
}

export interface TestSessionRow {
  id?: string
  session_id: string
  language: string
  status: string
  flow_type?: string
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
  issue_severity?: string | null
  conversation_duration_estimate?: string | null
  overall_rating?: number | null
  human_likeness?: string | null
  trust_level?: string | null
  business_recommendation?: string | null
  nps_score?: number | null
  open_feedback?: string | null
  // Merchant survey answers (M1–M11)
  m_ai_accuracy_rating?: number | null
  m_service_useful?: string | null
  m_top_benefit?: string | null
  m_top_benefit_text?: string | null
  m_willing_to_pay?: string | null
  m_price_expectation?: string | null
  m_pricing_fair?: string | null
  m_adoption_timeline?: string | null
  m_blocker?: string | null
  m_blocker_text?: string | null
  m_merchant_nps?: number | null
  m_open_feedback?: string | null
  user_agent?: string | null
  created_at?: string
  updated_at?: string
}
