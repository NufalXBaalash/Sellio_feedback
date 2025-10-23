import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Reset API called')
    
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
    
    return NextResponse.json({ 
      success: true, 
      message: 'CSV file has been reset successfully' 
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
