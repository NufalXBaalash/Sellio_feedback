import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { SessionStats, TestSession } from '@/lib/types/session'

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

    // Funnel counts
    const landingViews = sessions.filter(s => s.landing_viewed_at).length
    const instagramClicks = sessions.filter(s => s.instagram_clicked_at).length
    const testReturns = sessions.filter(s => s.test_returned_at).length
    const surveyStarts = sessions.filter(s => s.survey_started_at).length
    const surveyCompletions = sessions.filter(s => s.status === 'completed').length

    const completedSessions = sessions.filter(s => s.status === 'completed')
    const abandonedSessions = sessions.filter(s => s.status === 'abandoned')
    const totalSessions = sessions.length

    // NPS calculation
    const npsScores = completedSessions.filter(s => s.nps_score != null).map(s => s.nps_score!)
    const promoters = npsScores.filter(s => s >= 9).length
    const passives = npsScores.filter(s => s >= 7 && s <= 8).length
    const detractors = npsScores.filter(s => s <= 6).length
    const npsTotal = npsScores.length
    const npsScore = npsTotal > 0
      ? Math.round(((promoters - detractors) / npsTotal) * 100)
      : 0

    // Averages
    const completedWithRatings = completedSessions.filter(s => s.ai_accuracy_rating != null)
    const avgAiAccuracy = completedWithRatings.length > 0
      ? Number((completedWithRatings.reduce((sum, s) => sum + (s.ai_accuracy_rating || 0), 0) / completedWithRatings.length).toFixed(2))
      : 0

    const completedWithOverall = completedSessions.filter(s => s.overall_rating != null)
    const avgOverallRating = completedWithOverall.length > 0
      ? Number((completedWithOverall.reduce((sum, s) => sum + (s.overall_rating || 0), 0) / completedWithOverall.length).toFixed(2))
      : 0

    // Distribution helpers
    const countDist = (arr: TestSession[], key: keyof TestSession): Record<string, number> => {
      const dist: Record<string, number> = {}
      arr.forEach(s => {
        const val = s[key] as string | null | undefined
        if (val) dist[val] = (dist[val] || 0) + 1
      })
      return dist
    }

    // Conversation start rate
    const completedWithConv = completedSessions.filter(s => s.conversation_started != null)
    const conversationStartRate = completedWithConv.length > 0
      ? Number((completedWithConv.filter(s => s.conversation_started).length / completedWithConv.length * 100).toFixed(1))
      : 0

    // Order completion rate
    const completedWithOrder = completedSessions.filter(s => s.order_completed != null)
    const orderCompletionRate = completedWithOrder.length > 0
      ? Number((completedWithOrder.filter(s => s.order_completed).length / completedWithOrder.length * 100).toFixed(1))
      : 0

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
      avgAiAccuracy,
      avgOverallRating,
      trustDistribution: countDist(completedSessions, 'trust_level'),
      humanLikenessDistribution: countDist(completedSessions, 'human_likeness'),
      nps: {
        score: npsScore,
        promoters,
        passives,
        detractors,
        promoterPercent: npsTotal > 0 ? Number((promoters / npsTotal * 100).toFixed(1)) : 0,
        passivePercent: npsTotal > 0 ? Number((passives / npsTotal * 100).toFixed(1)) : 0,
        detractorPercent: npsTotal > 0 ? Number((detractors / npsTotal * 100).toFixed(1)) : 0,
      },
      businessRecommendationDistribution: countDist(completedSessions, 'business_recommendation'),
      issueSeverityDistribution: countDist(completedSessions.filter(s => s.issue_severity), 'issue_severity'),
      conversationDurationDistribution: countDist(completedSessions, 'conversation_duration_estimate'),
      failureReasonsDistribution: countDist(completedSessions.filter(s => s.order_prevented_reason), 'order_prevented_reason'),
      recentSessions: sessions.slice(0, 20),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching session stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
