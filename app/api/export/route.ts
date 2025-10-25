import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'
import { supabase } from '../../../lib/supabase'

export async function GET(request: NextRequest) {
  try {
    let feedbackData: any[] = []
    
    // Try to get data from Supabase first (primary source)
    try {
      if (!supabase) {
        throw new Error('Supabase not configured - missing environment variables')
      }

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (data && data.length > 0) {
        // Transform Supabase data to match expected format
        feedbackData = data.map(item => ({
          email: item.email,
          isUseful: item.is_useful,
          feedback: item.feedback || '',
          timestamp: item.timestamp
        }))
        console.log('Data loaded from Supabase for export successfully')
      }
    } catch (supabaseError) {
      console.error('Error getting data from Supabase:', supabaseError)
      
      // Fallback to CSV file
      const csvPath = path.join(process.cwd(), 'data', 'SellioAI-feedback.csv')
      if (fs.existsSync(csvPath)) {
        try {
          const csvData = fs.readFileSync(csvPath, 'utf8')
          const lines = csvData.trim().split('\n')
          
          // Skip header row and parse data
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i]
            if (line.trim()) {
              const matches = line.match(/"([^"]*)","([^"]*)","([^"]*)","([^"]*)"/)
              if (matches) {
                feedbackData.push({
                  email: matches[1],
                  isUseful: matches[2],
                  feedback: matches[3],
                  timestamp: matches[4]
                })
              }
            }
          }
          console.log('Data loaded from CSV for export successfully')
        } catch (csvError) {
          console.error('Error reading CSV file:', csvError)
        }
      }
      
      // If still no data, try Google Sheets as last resort
      if (feedbackData.length === 0) {
        try {
          const sheetsService = new GoogleSheetsService()
          feedbackData = await sheetsService.getAllFeedback()
          console.log('Data loaded from Google Sheets for export successfully')
        } catch (sheetsError) {
          console.error('Error getting data from Google Sheets:', sheetsError)
        }
      }
    }

    // Check if we have any data to export
    if (feedbackData.length === 0) {
      return NextResponse.json(
        { error: 'No feedback data found' },
        { status: 404 }
      )
    }

    // Convert data to CSV format
    const headers = 'Email,IsUseful,Feedback,Timestamp\n'
    const csvRows = feedbackData.map(data => 
      `"${data.email.replace(/"/g, '""')}","${data.isUseful.replace(/"/g, '""')}","${data.feedback.replace(/"/g, '""')}","${data.timestamp}"`
    ).join('\n')
    
    const csvData = headers + csvRows
    
    // Add BOM (Byte Order Mark) for proper UTF-8 display in Excel
    const bom = '\uFEFF'
    const csvWithBom = bom + csvData
    
    // Set headers for file download
    const headers_response = new Headers()
    headers_response.set('Content-Type', 'text/csv; charset=utf-8')
    headers_response.set('Content-Disposition', 'attachment; filename="SellioAI-feedback.csv"')
    headers_response.set('Cache-Control', 'no-cache')
    
    return new NextResponse(csvWithBom, {
      status: 200,
      headers: headers_response
    })

  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Error exporting data. Please try again.' },
      { status: 500 }
    )
  }
}
