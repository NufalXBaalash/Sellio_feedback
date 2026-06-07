import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Mark sessions as abandoned where:
    // - status is 'testing' or 'survey_started'
    // - instagram_clicked_at exists
    // - survey_completed_at is null
    // - instagram_clicked_at is more than 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('test_sessions')
      .update({ status: 'abandoned' })
      .in('status', ['testing', 'survey_started'])
      .not('instagram_clicked_at', 'is', null)
      .is('survey_completed_at', null)
      .lt('instagram_clicked_at', twentyFourHoursAgo)
      .select('id')

    if (error) {
      console.error('Error cleaning up sessions:', error)
      return NextResponse.json({ error: 'Failed to cleanup sessions' }, { status: 500 })
    }

    return NextResponse.json({
      abandonedCount: data?.length || 0,
      message: `${data?.length || 0} sessions marked as abandoned`,
    })
  } catch (error) {
    console.error('Error in cleanup:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
