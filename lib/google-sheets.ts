import { google } from 'googleapis';

interface FeedbackData {
  email: string;
  isUseful: string;
  feedback: string;
  timestamp: string;
}

class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;
  private range: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
    this.range = process.env.GOOGLE_SHEETS_RANGE || 'A:Z';
    
    if (!this.spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID environment variable is required');
    }

    this.initializeSheets();
  }

  private initializeSheets() {
    try {
      // Method 1: Service Account Authentication
      if (process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
        const auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        this.sheets = google.sheets({ version: 'v4', auth });
        return;
      }

      // Method 2: OAuth2 Authentication
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'urn:ietf:wg:oauth:2.0:oob'
        );

        oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });

        this.sheets = google.sheets({ version: 'v4', auth: oauth2Client });
        return;
      }

      throw new Error('No valid Google authentication method configured');
    } catch (error) {
      console.error('Error initializing Google Sheets:', error);
      throw error;
    }
  }

  async appendFeedback(data: FeedbackData): Promise<void> {
    try {
      // Check if headers exist, if not create them
      await this.ensureHeaders();

      // Prepare the row data
      const values = [
        [
          data.email,
          data.isUseful,
          data.feedback,
          data.timestamp
        ]
      ];

      // Append the data to the sheet
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: values,
        },
      });

      console.log('Data appended successfully:', response.data);
    } catch (error) {
      console.error('Error appending data to Google Sheets:', error);
      throw error;
    }
  }

  private async ensureHeaders(): Promise<void> {
    try {
      // Check if the first row has headers
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'A1:D1',
      });

      const existingHeaders = response.data.values?.[0];
      
      // If no headers exist or they don't match our expected headers
      if (!existingHeaders || existingHeaders.length === 0) {
        const headers = ['Email', 'IsUseful', 'Feedback', 'Timestamp'];
        
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: 'A1:D1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [headers],
          },
        });

        console.log('Headers created successfully');
      }
    } catch (error) {
      console.error('Error ensuring headers:', error);
      throw error;
    }
  }

  async getAllFeedback(): Promise<FeedbackData[]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: this.range,
      });

      const rows = response.data.values || [];
      
      // Skip header row and convert to FeedbackData objects
      const feedbackData: FeedbackData[] = rows.slice(1).map((row: any[]) => ({
        email: row[0] || '',
        isUseful: row[1] || '',
        feedback: row[2] || '',
        timestamp: row[3] || '',
      }));

      return feedbackData;
    } catch (error) {
      console.error('Error getting feedback data:', error);
      throw error;
    }
  }
}

export default GoogleSheetsService;
export type { FeedbackData };
