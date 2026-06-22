import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Check if this is an intermediate status update (funnel tracking)
    if (body.field === 'status' && body.value) {
      const updateData: Record<string, unknown> = {
        status: body.value,
      }
      if (body.surveyStartedAt) updateData.survey_started_at = body.surveyStartedAt
      if (body.testReturnedAt) updateData.test_returned_at = body.testReturnedAt

      const { data, error } = await supabase
        .from('test_sessions')
        .update(updateData)
        .eq('session_id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating session status:', error)
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
      }
      return NextResponse.json({ session: data })
    }

    // Full survey submission
    const {
      // Customer answers
      conversation_started,
      ai_accuracy_rating,
      order_completed,
      order_prevented_reason,
      order_prevented_text,
      issue_severity,
      conversation_duration_estimate,
      overall_rating,
      human_likeness,
      trust_level,
      business_recommendation,
      nps_score,
      open_feedback,
      // Merchant answers (M2–M11; M1 is client-only and intentionally dropped)
      m_ai_accuracy_rating,
      m_service_useful,
      m_top_benefit,
      m_top_benefit_text,
      m_willing_to_pay,
      m_price_expectation,
      m_pricing_fair,
      m_adoption_timeline,
      m_blocker,
      m_blocker_text,
      m_merchant_nps,
      m_open_feedback,
      testReturnedAt,
      surveyStartedAt,
    } = body

    // Compute duration
    let totalDurationSeconds: number | null = null
    if (testReturnedAt) {
      // Fetch the session to get test_started_at
      const { data: existing } = await supabase
        .from('test_sessions')
        .select('test_started_at')
        .eq('session_id', id)
        .single()

      if (existing?.test_started_at) {
        const start = new Date(existing.test_started_at).getTime()
        const end = new Date(testReturnedAt).getTime()
        totalDurationSeconds = Math.round((end - start) / 1000)
      }
    }

    const updateData: Record<string, unknown> = {
      status: 'completed',
      survey_completed_at: new Date().toISOString(),
      test_returned_at: testReturnedAt || null,
      survey_started_at: surveyStartedAt || null,
      total_duration_seconds: totalDurationSeconds,
      // Customer
      conversation_started: conversation_started ?? null,
      ai_accuracy_rating: ai_accuracy_rating ?? null,
      order_completed: order_completed ?? null,
      order_prevented_reason: order_prevented_reason || null,
      order_prevented_text: order_prevented_text || null,
      issue_severity: issue_severity || null,
      conversation_duration_estimate: conversation_duration_estimate || null,
      overall_rating: overall_rating ?? null,
      human_likeness: human_likeness || null,
      trust_level: trust_level || null,
      business_recommendation: business_recommendation || null,
      nps_score: nps_score ?? null,
      open_feedback: open_feedback || null,
      // Merchant (M2–M11)
      m_ai_accuracy_rating: m_ai_accuracy_rating ?? null,
      m_service_useful: m_service_useful || null,
      m_top_benefit: m_top_benefit || null,
      m_top_benefit_text: m_top_benefit_text || null,
      m_willing_to_pay: m_willing_to_pay || null,
      m_price_expectation: m_price_expectation || null,
      m_pricing_fair: m_pricing_fair || null,
      m_adoption_timeline: m_adoption_timeline || null,
      m_blocker: m_blocker || null,
      m_blocker_text: m_blocker_text || null,
      m_merchant_nps: m_merchant_nps ?? null,
      m_open_feedback: m_open_feedback || null,
    }

    const { data, error } = await supabase
      .from('test_sessions')
      .update(updateData)
      .eq('session_id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating session with survey:', error)
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
    }

    return NextResponse.json({ session: data })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
