import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, language, userAgent, landingViewedAt, instagramClickedAt } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    if (!supabase) {
      console.warn('Supabase not configured')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('test_sessions')
      .insert([{
        session_id: sessionId,
        language: language || 'en',
        status: 'testing',
        landing_viewed_at: landingViewedAt || null,
        instagram_clicked_at: instagramClickedAt || new Date().toISOString(),
        test_started_at: new Date().toISOString(),
        user_agent: userAgent || null,
      }])
      .select()
      .single()

    if (error) {
      // Handle duplicate session_id — update instead
      if (error.code === '23505') {
        const { data: updated, error: updateError } = await supabase
          .from('test_sessions')
          .update({
            status: 'testing',
            instagram_clicked_at: instagramClickedAt || new Date().toISOString(),
            test_started_at: new Date().toISOString(),
          })
          .eq('session_id', sessionId)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating existing session:', updateError)
          return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
        }
        return NextResponse.json({ session: updated }, { status: 200 })
      }
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    return NextResponse.json({ session: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
