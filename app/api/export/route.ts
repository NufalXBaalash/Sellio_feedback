import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'feedback'

    // Sessions export
    if (type === 'sessions') {
      return exportSessions()
    }

    // Legacy feedback export (unchanged)
    return exportFeedback()
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Error exporting data. Please try again.' }, { status: 500 })
  }
}

async function exportFeedback() {
  let feedbackData: any[] = []

  try {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.from('feedback').select('*').order('timestamp', { ascending: false })
    if (error) throw new Error(`Supabase error: ${error.message}`)
    if (data && data.length > 0) {
      feedbackData = data.map(item => ({
        name: item.name || '', phone: item.phone || '', email: item.email, isUseful: item.is_useful, feedback: item.feedback || '', timestamp: item.timestamp
      }))
    }
  } catch (supabaseError) {
    console.error('Error getting data from Supabase:', supabaseError)
    const csvPath = path.join(process.cwd(), 'data', 'SellioAI-feedback.csv')
    if (fs.existsSync(csvPath)) {
      try {
        const csvData = fs.readFileSync(csvPath, 'utf8')
        const lines = csvData.trim().split('\n')
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i]
          if (line.trim()) {
            const matches = line.match(/"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"/)
            if (matches) feedbackData.push({ name: matches[1], phone: matches[2], email: matches[3], isUseful: matches[4], feedback: matches[5], timestamp: matches[6] })
          }
        }
      } catch (csvError) { console.error('Error reading CSV:', csvError) }
    }
    if (feedbackData.length === 0) {
      try { const s = new GoogleSheetsService(); feedbackData = await s.getAllFeedback() } catch (e) { /* ignore */ }
    }
  }

  if (feedbackData.length === 0) {
    return NextResponse.json({ error: 'No feedback data found' }, { status: 404 })
  }

  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const headers = 'Name,Phone,Email,IsUseful,Feedback,Timestamp\n'
  const csvRows = feedbackData.map(d => `${esc(d.name)}},${esc(d.phone)}},${esc(d.email)}},${esc(d.isUseful)}},${esc(d.feedback)}},${esc(d.timestamp)}`).join('\n')
  const bom = '﻿'
  const respHeaders = new Headers()
  respHeaders.set('Content-Type', 'text/csv; charset=utf-8')
  respHeaders.set('Content-Disposition', 'attachment; filename="SellioAI-feedback.csv"')
  respHeaders.set('Cache-Control', 'no-cache')
  return new NextResponse(bom + headers + csvRows, { status: 200, headers: respHeaders })
}

async function exportSessions() {
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const { data, error } = await supabase.from('test_sessions').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }

  const sessions = data || []
  if (sessions.length === 0) {
    return NextResponse.json({ error: 'No session data found' }, { status: 404 })
  }

  const columns = [
    'session_id', 'language', 'status', 'flow_type',
    'landing_viewed_at', 'instagram_clicked_at', 'test_started_at', 'test_returned_at',
    'survey_started_at', 'survey_completed_at', 'total_duration_seconds',
    // Customer survey answers
    'conversation_started', 'ai_accuracy_rating', 'order_completed',
    'order_prevented_reason', 'order_prevented_text', 'issue_severity',
    'conversation_duration_estimate', 'overall_rating', 'human_likeness',
    'trust_level', 'business_recommendation', 'nps_score', 'open_feedback',
    // Merchant survey answers (M2–M11)
    'm_ai_accuracy_rating', 'm_service_useful', 'm_top_benefit', 'm_top_benefit_text',
    'm_willing_to_pay', 'm_price_expectation', 'm_pricing_fair', 'm_adoption_timeline',
    'm_blocker', 'm_blocker_text', 'm_merchant_nps', 'm_open_feedback',
    'created_at',
  ]

  const csvEscape = (val: any) => {
    if (val === null || val === undefined) return '""'
    const s = String(val).replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')
    return `"${s}"`
  }

  const headerRow = columns.join(',')
  const dataRows = sessions.map((s: any) => columns.map(c => csvEscape(s[c])).join(',')).join('\n')

  const bom = '﻿'
  const respHeaders = new Headers()
  respHeaders.set('Content-Type', 'text/csv; charset=utf-8')
  respHeaders.set('Content-Disposition', 'attachment; filename="SellioAI-test-sessions.csv"')
  respHeaders.set('Cache-Control', 'no-cache')
  return new NextResponse(bom + headerRow + '\n' + dataRows, { status: 200, headers: respHeaders })
}
