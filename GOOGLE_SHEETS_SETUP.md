# Google Sheets Integration Setup Guide

## Overview
Your SELLIOai feedback landing page now automatically syncs all collected data to your Google Sheet. Here's how to set it up:

## Step 1: Create a Google Service Account

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

## Step 2: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `SELLIOai-feedback-service`
   - Description: `Service account for SELLIOai feedback data sync`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Download the JSON file

## Step 4: Share Your Google Sheet

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1164uwttfL3RBivYN3a588OX_9DdzjxUW1eH1sSfWFJE/edit
2. Click the "Share" button
3. Add the service account email (from the JSON file) as an editor
4. The email will look like: `SELLIOai-feedback-service@your-project-id.iam.gserviceaccount.com`

## Step 5: Configure Environment Variables

1. Open the downloaded JSON file
2. Copy the entire JSON content
3. In your project root, create/update `.env.local` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=1164uwttfL3RBivYN3a588OX_9DdzjxUW1eH1sSfWFJE
GOOGLE_SHEETS_RANGE=A:Z

# Paste the entire JSON content here as a single line
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project",...}
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Submit a test feedback on your landing page
3. Check your Google Sheet - you should see the data appear automatically!

## Data Structure

The following data will be synced to your Google Sheet:

| Column | Description |
|--------|-------------|
| A | Email Address |
| B | Is Useful (yes/no) |
| C | Feedback Comments |
| D | Timestamp |

## Troubleshooting

### Common Issues:

1. **"Permission denied" error**: Make sure you've shared the Google Sheet with the service account email
2. **"Invalid credentials" error**: Check that the JSON credentials are properly formatted in `.env.local`
3. **"Spreadsheet not found" error**: Verify the spreadsheet ID is correct

### Debug Mode:
Check your server logs for detailed error messages when testing.

## Security Notes

- Never commit the `.env.local` file to version control
- The service account has minimal permissions (only access to your specific sheet)
- Data is still saved locally in CSV as a backup

## Alternative: OAuth2 Setup (Advanced)

If you prefer OAuth2 over service account authentication, you can use these environment variables instead:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

This requires additional setup in Google Cloud Console for OAuth2 credentials.
