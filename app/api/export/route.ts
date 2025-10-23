import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'

export async function GET(request: NextRequest) {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'sellio-feedback.csv')
    
    // Check if CSV file exists
    if (!fs.existsSync(csvPath)) {
      // Try to get data from Google Sheets as backup
      try {
        const sheetsService = new GoogleSheetsService()
        const feedbackData = await sheetsService.getAllFeedback()
        
        if (feedbackData.length === 0) {
          return NextResponse.json(
            { error: 'No feedback data found' },
            { status: 404 }
          )
        }

        // Convert Google Sheets data to CSV format
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
        headers_response.set('Content-Disposition', 'attachment; filename="sellio-feedback.csv"')
        headers_response.set('Cache-Control', 'no-cache')
        
        return new NextResponse(csvWithBom, {
          status: 200,
          headers: headers_response
        })
      } catch (sheetsError) {
        console.error('Error getting data from Google Sheets:', sheetsError)
        return NextResponse.json(
          { error: 'No feedback data found in CSV or Google Sheets' },
          { status: 404 }
        )
      }
    }

    // Read CSV file with UTF-8 encoding
    const csvData = fs.readFileSync(csvPath, 'utf8')
    
    // Check if CSV has any data (more than just headers)
    const lines = csvData.trim().split('\n')
    if (lines.length <= 1) {
      return NextResponse.json(
        { error: 'No feedback data found in CSV file' },
        { status: 404 }
      )
    }
    
    // Add BOM (Byte Order Mark) for proper UTF-8 display in Excel
    const bom = '\uFEFF'
    const csvWithBom = bom + csvData
    
    // Set headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'text/csv; charset=utf-8')
    headers.set('Content-Disposition', 'attachment; filename="sellio-feedback.csv"')
    headers.set('Cache-Control', 'no-cache')
    
    return new NextResponse(csvWithBom, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Error exporting data. Please try again.' },
      { status: 500 }
    )
  }
}
