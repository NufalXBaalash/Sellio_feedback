import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'
import { supabase, FeedbackData } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, isUseful, feedback } = body

    // Validate required fields
    if (!email || !isUseful) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني والرأي مطلوبان' },
        { status: 400 }
      )
    }

    // Prepare data for Supabase
    const timestamp = new Date().toISOString()
    const feedbackData: FeedbackData = {
      email: email.trim(),
      is_useful: isUseful as 'yes' | 'no',
      feedback: feedback?.trim() || '',
      timestamp: timestamp
    }

    // Save to Supabase (primary storage)
    try {
      if (!supabase) {
        throw new Error('Supabase not configured - missing environment variables')
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert([feedbackData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Supabase error: ${error.message}`)
      }

      console.log('Data saved to Supabase successfully:', data)
    } catch (supabaseError) {
      console.error('Error saving to Supabase:', supabaseError)
      return NextResponse.json(
        { error: 'حدث خطأ في حفظ البيانات' },
        { status: 500 }
      )
    }

    // Backup to CSV file (optional)
    try {
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      const csvPath = path.join(dataDir, 'sellio-feedback.csv')
      const fileExists = fs.existsSync(csvPath)
      
      if (!fileExists) {
        const headers = 'Email,IsUseful,Feedback,Timestamp\n'
        fs.writeFileSync(csvPath, headers)
      }

      // Clean and escape data for CSV
      const cleanEmail = email.replace(/"/g, '""')
      const cleanIsUseful = isUseful.replace(/"/g, '""')
      const cleanFeedback = (feedback || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')
      
      const csvRow = `"${cleanEmail}","${cleanIsUseful}","${cleanFeedback}","${timestamp}"\n`
      fs.appendFileSync(csvPath, csvRow, 'utf8')
      
      console.log('Data backed up to CSV successfully')
    } catch (csvError) {
      console.error('Error backing up to CSV:', csvError)
      // Don't fail the request if CSV backup fails
    }

    // Also sync to Google Sheets (optional backup)
    try {
      const sheetsService = new GoogleSheetsService()
      await sheetsService.appendFeedback({
        email: email.trim(),
        isUseful: isUseful,
        feedback: feedback?.trim() || '',
        timestamp: timestamp
      })
      console.log('Data synced to Google Sheets successfully')
    } catch (sheetsError) {
      console.error('Error syncing to Google Sheets:', sheetsError)
      // Don't fail the request if Google Sheets sync fails
    }

    return NextResponse.json(
      { message: 'تم حفظ رأيك بنجاح' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error saving feedback:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
