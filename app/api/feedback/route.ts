import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'
import { supabase, FeedbackData } from '../../../lib/supabase'
import { sendWaitlistEmail, sendTesterThankYouEmail } from '../../../lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, isUseful, feedback } = body

    // Validate required fields: name, email + opinion (phone is optional)
    if (!name || !email || !isUseful) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والرأي مطلوبة' },
        { status: 400 }
      )
    }

    // Prepare data for Supabase
    const timestamp = new Date().toISOString()
    const feedbackData: FeedbackData = {
      name: (name as string).trim(),
      phone: (phone as string)?.trim() || '',
      email: email.trim(),
      is_useful: isUseful as 'yes' | 'no',
      feedback: feedback?.trim() || '',
      timestamp: timestamp
    }

    // Save to Supabase (primary storage)
    try {
      if (!supabase) {
        console.warn('Supabase not configured - skipping Supabase save. Falling back to CSV.')
      } else {
        const { data, error } = await supabase
          .from('feedback')
          .insert([feedbackData])
          .select()

        if (error) {
          console.error('Supabase error:', error)
          // We don't throw here either so we can still save to CSV and send email
        } else {
          console.log('Data saved to Supabase successfully:', data)
        }
      }
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

      const csvPath = path.join(dataDir, 'SellioAI-feedback.csv')
      const fileExists = fs.existsSync(csvPath)
      
      if (!fileExists) {
        const headers = 'Name,Phone,Email,IsUseful,Feedback,Timestamp\n'
        fs.writeFileSync(csvPath, headers)
      }

      // Clean and escape data for CSV
      const cleanName = (name || '').replace(/"/g, '""')
      const cleanPhone = (phone || '').replace(/"/g, '""')
      const cleanEmail = email.replace(/"/g, '""')
      const cleanIsUseful = isUseful.replace(/"/g, '""')
      const cleanFeedback = (feedback || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')

      const csvRow = `"${cleanName}","${cleanPhone}","${cleanEmail}","${cleanIsUseful}","${cleanFeedback}","${timestamp}"\n`
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
        name: (name || '').trim(),
        phone: (phone || '').trim(),
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

    // Send the Thank You Email with free access code
    try {
      await sendTesterThankYouEmail(email.trim(), (name || '').trim());
      console.log('Tester thank-you email sent to:', email);
    } catch (emailError) {
      console.error('Error sending thank-you email:', emailError);
      // Don't fail the request if email sending fails, the user is still registered
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
