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
