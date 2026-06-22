import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type {
  SessionStats,
  MerchantSessionStats,
  CustomerSessionStats,
  TestSession,
  NPSResult,
  Distribution,
} from '@/lib/types/session'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data: allSessions, error } = await supabase
      .from('test_sessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sessions:', error)
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    const sessions = (allSessions || []) as TestSession[]

    // Pull reward-claim contacts and attach them to their sessions by session_id.
    // The column was added by supabase-migration-feedback-session-id.sql; if the
    // migration hasn't been run yet the select still succeeds (Supabase ignores
    // unknown columns gracefully only on select(*) — selecting a missing column
    // errors, so we guard with try/catch and fall back to no contacts).
    const contacts = await fetchContactsBySession(supabase)
    sessions.forEach(s => {
      const c = contacts.get(s.session_id)
      if (c) {
        s.contact_name = c.name
        s.contact_phone = c.phone
        s.contact_email = c.email
      }
    })

    // Split by flow_type (rows created before the migration default to 'customer')
    const customerSessions = sessions.filter(s => (s.flow_type || 'customer') === 'customer')
    const merchantSessions = sessions.filter(s => s.flow_type === 'merchant')

    const customerStats = computeCustomerStats(customerSessions)
    const merchantStats = computeMerchantStats(merchantSessions)

    return NextResponse.json({ customerStats, merchantStats })
  } catch (error) {
    console.error('Error fetching session stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------- shared helpers ----------

/**
 * Fetch reward-claim contacts (name/phone/email) keyed by their session_id.
 * Returns the latest claim per session when several exist. If the feedback
 * table lacks the session_id column (migration not yet applied) it logs and
 * returns an empty map so the dashboard still works — just without contacts.
 */
async function fetchContactsBySession(
  client: NonNullable<typeof supabase>
): Promise<Map<string, { name: string; phone: string; email: string }>> {
  const map = new Map<string, { name: string; phone: string; email: string }>()
  try {
    const { data, error } = await client
      .from('feedback')
      .select('session_id, name, phone, email, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('feedback contact lookup failed:', error.message)
      return map
    }
    for (const row of (data || []) as Array<{ session_id: string | null; name?: string | null; phone?: string | null; email?: string | null }>) {
      if (!row.session_id) continue
      // First seen wins because rows are newest-first → keeps the latest claim.
      if (map.has(row.session_id)) continue
      map.set(row.session_id, {
        name: (row.name || '').trim(),
        phone: (row.phone || '').trim(),
        email: (row.email || '').trim(),
      })
    }
  } catch (e) {
    console.warn('feedback contact lookup threw:', e)
  }
  return map
}

function countDist(arr: TestSession[], key: keyof TestSession): Distribution {
  const dist: Distribution = {}
  arr.forEach(s => {
    const val = s[key] as string | null | undefined
    if (val) dist[val] = (dist[val] || 0) + 1
  })
  return dist
}

function computeNPS(scores: number[]): NPSResult {
  const promoters = scores.filter(s => s >= 9).length
  const passives = scores.filter(s => s >= 7 && s <= 8).length
  const detractors = scores.filter(s => s <= 6).length
  const npsTotal = scores.length
  const score = npsTotal > 0 ? Math.round(((promoters - detractors) / npsTotal) * 100) : 0
  return {
    score,
    promoters,
    passives,
    detractors,
    promoterPercent: npsTotal > 0 ? Number((promoters / npsTotal * 100).toFixed(1)) : 0,
    passivePercent: npsTotal > 0 ? Number((passives / npsTotal * 100).toFixed(1)) : 0,
    detractorPercent: npsTotal > 0 ? Number((detractors / npsTotal * 100).toFixed(1)) : 0,
  }
}

function pctOf(matches: number, total: number): number {
  return total > 0 ? Number((matches / total * 100).toFixed(1)) : 0
}

function avgRating(sessions: TestSession[], key: 'ai_accuracy_rating' | 'overall_rating' | 'm_ai_accuracy_rating'): number {
  const withRating = sessions.filter(s => s[key] != null)
  if (withRating.length === 0) return 0
  return Number((withRating.reduce((sum, s) => sum + (s[key] as number || 0), 0) / withRating.length).toFixed(2))
}

// ---------- customer pipeline ----------

function computeCustomerStats(sessions: TestSession[]): CustomerSessionStats {
  const landingViews = sessions.filter(s => s.landing_viewed_at).length
  const instagramClicks = sessions.filter(s => s.instagram_clicked_at).length
  const testReturns = sessions.filter(s => s.test_returned_at).length
  const surveyStarts = sessions.filter(s => s.survey_started_at).length
  const surveyCompletions = sessions.filter(s => s.status === 'completed').length

  const completedSessions = sessions.filter(s => s.status === 'completed')
  const abandonedSessions = sessions.filter(s => s.status === 'abandoned')
  const totalSessions = sessions.length

  const nps = computeNPS(completedSessions.filter(s => s.nps_score != null).map(s => s.nps_score!))

  const completedWithConv = completedSessions.filter(s => s.conversation_started != null)
  const conversationStartRate = pctOf(completedWithConv.filter(s => s.conversation_started).length, completedWithConv.length)

  const completedWithOrder = completedSessions.filter(s => s.order_completed != null)
  const orderCompletionRate = pctOf(completedWithOrder.filter(s => s.order_completed).length, completedWithOrder.length)

  const stats: SessionStats = {
    funnel: {
      landingViews,
      instagramClicks,
      testReturns,
      surveyStarts,
      surveyCompletions,
      landingToInstagramCTR: landingViews > 0 ? Number((instagramClicks / landingViews * 100).toFixed(1)) : 0,
      instagramToReturnRate: instagramClicks > 0 ? Number((testReturns / instagramClicks * 100).toFixed(1)) : 0,
      returnToCompletionRate: testReturns > 0 ? Number((surveyCompletions / testReturns * 100).toFixed(1)) : 0,
      overallCompletionRate: landingViews > 0 ? Number((surveyCompletions / landingViews * 100).toFixed(1)) : 0,
    },
    totalSessions,
    completedSessions: completedSessions.length,
    abandonedSessions: abandonedSessions.length,
    completionRate: totalSessions > 0 ? Number((completedSessions.length / totalSessions * 100).toFixed(1)) : 0,
    abandonmentRate: totalSessions > 0 ? Number((abandonedSessions.length / totalSessions * 100).toFixed(1)) : 0,
    conversationStartRate,
    orderCompletionRate,
    avgAiAccuracy: avgRating(completedSessions, 'ai_accuracy_rating'),
    avgOverallRating: avgRating(completedSessions, 'overall_rating'),
    trustDistribution: countDist(completedSessions, 'trust_level'),
    humanLikenessDistribution: countDist(completedSessions, 'human_likeness'),
    nps,
    businessRecommendationDistribution: countDist(completedSessions, 'business_recommendation'),
    issueSeverityDistribution: countDist(completedSessions.filter(s => s.issue_severity), 'issue_severity'),
    conversationDurationDistribution: countDist(completedSessions, 'conversation_duration_estimate'),
    failureReasonsDistribution: countDist(completedSessions.filter(s => s.order_prevented_reason), 'order_prevented_reason'),
    recentSessions: sessions.slice(0, 20),
  }

  return stats
}

// ---------- merchant pipeline ----------

const PRICE_BUCKET_LABELS: Record<string, { en: string; ar: string }> = {
  under_2000: { en: 'Under 2,000 EGP', ar: 'أقل من ٢٠٠٠ جنيه' },
  '2000_3000': { en: '2,000–3,000 EGP', ar: '٢٠٠٠–٣٠٠٠ جنيه' },
  '3000_4000': { en: '3,000–4,000 EGP', ar: '٣٠٠٠–٤٠٠٠ جنيه' },
  '4000_5000': { en: '4,000–5,000 EGP', ar: '٤٠٠٠–٥٠٠٠ جنيه' },
  over_5000: { en: 'Over 5,000 EGP', ar: 'أكثر من ٥٠٠٠ جنيه' },
}

function modalBucket(dist: Distribution): string {
  let best: string | null = null
  let bestCount = 0
  for (const [k, v] of Object.entries(dist)) {
    if (v > bestCount) { bestCount = v; best = k }
  }
  return best || ''
}

function computeMerchantStats(sessions: TestSession[]): MerchantSessionStats {
  const landingViews = sessions.filter(s => s.landing_viewed_at).length
  const instagramClicks = sessions.filter(s => s.instagram_clicked_at).length
  const testReturns = sessions.filter(s => s.test_returned_at).length
  const surveyStarts = sessions.filter(s => s.survey_started_at).length
  const surveyCompletions = sessions.filter(s => s.status === 'completed').length

  const completed = sessions.filter(s => s.status === 'completed')
  const abandoned = sessions.filter(s => s.status === 'abandoned')
  const totalMerchants = sessions.length

  // Service useful rate (definitely + probably)
  const withUseful = completed.filter(s => s.m_service_useful)
  const serviceUsefulRate = pctOf(
    withUseful.filter(s => s.m_service_useful === 'definitely' || s.m_service_useful === 'probably').length,
    withUseful.length
  )

  // Willing to pay (yes + maybe)
  const withWtp = completed.filter(s => s.m_willing_to_pay)
  const willingToPayRate = pctOf(
    withWtp.filter(s => s.m_willing_to_pay === 'yes' || s.m_willing_to_pay === 'maybe').length,
    withWtp.length
  )

  // Pricing fair rate (fair + expensive_but_ok)
  const withFair = completed.filter(s => s.m_pricing_fair)
  const pricingFairRate = pctOf(
    withFair.filter(s => s.m_pricing_fair === 'fair' || s.m_pricing_fair === 'expensive_but_ok').length,
    withFair.length
  )

  // Adoption intent (now + within_month)
  const withAdoption = completed.filter(s => s.m_adoption_timeline)
  const adoptionIntentRate = pctOf(
    withAdoption.filter(s => s.m_adoption_timeline === 'now' || s.m_adoption_timeline === 'within_month').length,
    withAdoption.length
  )

  // Modal price expectation bucket
  const priceDist = countDist(completed, 'm_price_expectation')
  const modalPriceKey = modalBucket(priceDist)

  const merchantNps = computeNPS(completed.filter(s => s.m_merchant_nps != null).map(s => s.m_merchant_nps!))

  const stats: MerchantSessionStats = {
    funnel: {
      landingViews,
      instagramClicks,
      testReturns,
      surveyStarts,
      surveyCompletions,
      landingToInstagramCTR: landingViews > 0 ? Number((instagramClicks / landingViews * 100).toFixed(1)) : 0,
      instagramToReturnRate: instagramClicks > 0 ? Number((testReturns / instagramClicks * 100).toFixed(1)) : 0,
      returnToCompletionRate: testReturns > 0 ? Number((surveyCompletions / testReturns * 100).toFixed(1)) : 0,
      overallCompletionRate: landingViews > 0 ? Number((surveyCompletions / landingViews * 100).toFixed(1)) : 0,
    },
    totalMerchants,
    completedMerchants: completed.length,
    abandonedSessions: abandoned.length,
    completionRate: totalMerchants > 0 ? Number((completed.length / totalMerchants * 100).toFixed(1)) : 0,
    abandonmentRate: totalMerchants > 0 ? Number((abandoned.length / totalMerchants * 100).toFixed(1)) : 0,
    serviceUsefulRate,
    willingToPayRate,
    avgPriceExpectation: PRICE_BUCKET_LABELS[modalPriceKey]?.en || modalPriceKey || '—',
    pricingFairRate,
    adoptionIntentRate,
    merchantNps,
    avgAiAccuracy: avgRating(completed, 'm_ai_accuracy_rating'),
    serviceUsefulDistribution: countDist(completed, 'm_service_useful'),
    topBenefitDistribution: countDist(completed, 'm_top_benefit'),
    willingToPayDistribution: countDist(completed, 'm_willing_to_pay'),
    priceExpectationDistribution: priceDist,
    pricingFairDistribution: countDist(completed, 'm_pricing_fair'),
    adoptionTimelineDistribution: countDist(completed, 'm_adoption_timeline'),
    blockerDistribution: countDist(completed.filter(s => s.m_blocker), 'm_blocker'),
    recentMerchantSessions: sessions.slice(0, 20),
  }

  return stats
}
