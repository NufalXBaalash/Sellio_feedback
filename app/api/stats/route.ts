import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import GoogleSheetsService from '../../../lib/google-sheets'
import { supabase, FeedbackStats } from '../../../lib/supabase'

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
        console.log('Data loaded from Supabase successfully')
      }
    } catch (supabaseError) {
      console.error('Error getting data from Supabase:', supabaseError)
      
      // Fallback to CSV file
      const csvPath = path.join(process.cwd(), 'data', 'SELLIOai-feedback.csv')
      if (fs.existsSync(csvPath)) {
        try {
          const csvData = fs.readFileSync(csvPath, 'utf8')
          const lines = csvData.trim().split('\n')
          
          // Skip header row and parse data
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i]
            if (line.trim()) {
              // Simple CSV parsing (assuming no commas in the actual data due to quotes)
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
          console.log('Data loaded from CSV fallback successfully')
        } catch (csvError) {
          console.error('Error reading CSV file:', csvError)
        }
      }
      
      // If still no data, try Google Sheets as last resort
      if (feedbackData.length === 0) {
        try {
          const sheetsService = new GoogleSheetsService()
          feedbackData = await sheetsService.getAllFeedback()
          console.log('Data loaded from Google Sheets fallback successfully')
        } catch (sheetsError) {
          console.error('Error getting data from Google Sheets:', sheetsError)
        }
      }
    }
    
    // Calculate statistics
    const totalSubmissions = feedbackData.length
    const usefulCount = feedbackData.filter(item => item.isUseful === 'yes').length
    const notUsefulCount = feedbackData.filter(item => item.isUseful === 'no').length
    const usefulPercentage = totalSubmissions > 0 ? Math.round((usefulCount / totalSubmissions) * 100) : 0
    
    // Get recent submissions (last 10)
    const recentSubmissions = feedbackData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
    
    const stats = {
      totalSubmissions,
      usefulCount,
      notUsefulCount,
      usefulPercentage,
      recentSubmissions,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error getting statistics:', error)
    return NextResponse.json(
      { error: 'Error getting statistics' },
      { status: 500 }
    )
  }
}
