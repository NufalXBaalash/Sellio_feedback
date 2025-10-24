import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { supabase } from '../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Reset API called')
    
    // Reset Supabase data (primary storage)
    try {
      if (!supabase) {
        throw new Error('Supabase not configured - missing environment variables')
      }

      const { error } = await supabase
        .from('feedback')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) {
        console.error('Supabase reset error:', error)
        throw new Error(`Supabase reset error: ${error.message}`)
      }

      console.log('Supabase data reset successfully')
    } catch (supabaseError) {
      console.error('Error resetting Supabase data:', supabaseError)
      return NextResponse.json(
        { 
          success: false, 
          message: `Failed to reset Supabase data: ${supabaseError instanceof Error ? supabaseError.message : 'Unknown error'}` 
        },
        { status: 500 }
      )
    }
    
    // Also reset CSV file (backup)
    try {
      const dataDir = path.join(process.cwd(), 'data')
      const csvPath = path.join(dataDir, 'sellio-feedback.csv')
      
      console.log('Data directory:', dataDir)
      console.log('CSV path:', csvPath)
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dataDir)) {
        console.log('Creating data directory...')
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      // Delete old file if exists
      if (fs.existsSync(csvPath)) {
        console.log('Deleting old CSV file...')
        fs.unlinkSync(csvPath)
      }
      
      // Create empty CSV with headers only and BOM for UTF-8
      const bom = '\uFEFF'
      const headers = 'Email,IsUseful,Feedback,Timestamp\n'
      fs.writeFileSync(csvPath, bom + headers, 'utf8')
      
      console.log('CSV file reset successfully')
    } catch (csvError) {
      console.error('Error resetting CSV file:', csvError)
      // Don't fail the request if CSV reset fails
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'All feedback data has been reset successfully' 
    })
  } catch (error) {
    console.error('Error resetting CSV:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to reset CSV file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
}
