import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'

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

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // CSV file path
    const csvPath = path.join(dataDir, 'sellio-feedback.csv')
    
    // Check if file exists, if not create with headers
    const fileExists = fs.existsSync(csvPath)
    
    if (!fileExists) {
      const headers = 'Email,IsUseful,Feedback,Timestamp\n'
      fs.writeFileSync(csvPath, headers)
    }

    // Prepare data for CSV with proper encoding
    const timestamp = new Date().toISOString()
    
    // Clean and escape data for CSV
    const cleanEmail = email.replace(/"/g, '""')
    const cleanIsUseful = isUseful.replace(/"/g, '""')
    const cleanFeedback = (feedback || '').replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')
    
    const csvRow = `"${cleanEmail}","${cleanIsUseful}","${cleanFeedback}","${timestamp}"\n`
    
    // Append to CSV file with UTF-8 encoding
    fs.appendFileSync(csvPath, csvRow, 'utf8')

    // Also sync to Google Sheets
    try {
      const sheetsService = new GoogleSheetsService()
      await sheetsService.appendFeedback({
        email: cleanEmail,
        isUseful: cleanIsUseful,
        feedback: cleanFeedback,
        timestamp: timestamp
      })
      console.log('Data synced to Google Sheets successfully')
    } catch (sheetsError) {
      console.error('Error syncing to Google Sheets:', sheetsError)
      // Don't fail the request if Google Sheets sync fails
      // The data is still saved locally in CSV
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
