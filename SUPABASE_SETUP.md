# Supabase Integration Setup Guide

## 🚀 **What You Need to Connect Supabase**

### 1. **Supabase Project Setup**
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (usually takes 1-2 minutes)

### 2. **Environment Variables**
Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. **Get Your Supabase Credentials**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. **Create the Database Table**
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-schema.sql` (created in your project)
3. Click **Run** to execute the SQL

### 5. **Test the Integration**
1. Start your development server: `npm run dev`
2. Submit a feedback form
3. Check your Supabase dashboard → **Table Editor** → **feedback** table
4. You should see your data there!

## 📊 **Database Schema**

The `feedback` table has these columns:
- `id` (UUID, Primary Key) - Auto-generated unique identifier
- `email` (VARCHAR) - User's email address
- `is_useful` (VARCHAR) - 'yes' or 'no'
- `feedback` (TEXT) - User's feedback text
- `timestamp` (TIMESTAMPTZ) - When feedback was submitted
- `created_at` (TIMESTAMPTZ) - Record creation time
- `updated_at` (TIMESTAMPTZ) - Last update time

## 🔄 **How It Works Now**

### **Data Flow:**
1. **Primary Storage**: Supabase database
2. **Backup Storage**: CSV file (local)
3. **Secondary Backup**: Google Sheets (if configured)

### **APIs Updated:**
- ✅ `/api/feedback` - Saves to Supabase first, then CSV/Sheets as backup
- ✅ `/api/stats` - Reads from Supabase first, falls back to CSV/Sheets
- ✅ `/api/export` - Exports from Supabase first, falls back to CSV/Sheets
- ✅ `/api/reset` - Clears Supabase data and CSV file

### **Benefits:**
- 🚀 **Faster**: Database queries are much faster than file operations
- 🔒 **Reliable**: Database transactions ensure data integrity
- 📈 **Scalable**: Can handle thousands of submissions
- 🔍 **Queryable**: Easy to filter, sort, and analyze data
- 🌐 **Accessible**: Can access data from anywhere via API

## 🛠️ **Optional: Row Level Security (RLS)**

The schema includes RLS policies that allow:
- Public users to insert feedback
- Public users to read feedback (you may want to restrict this)

To restrict reading access, update the RLS policy in Supabase:
```sql
-- Remove public read access
DROP POLICY "Public can read feedback" ON feedback;

-- Add admin-only read access (if you have admin users)
CREATE POLICY "Admin can read feedback" ON feedback
    FOR SELECT USING (auth.role() = 'admin');
```

## 🎯 **Next Steps**

1. **Set up your Supabase project** using the steps above
2. **Add environment variables** to your `.env.local`
3. **Run the SQL schema** in Supabase
4. **Test the integration** by submitting feedback
5. **Deploy to production** with the same environment variables

Your feedback landing page is now powered by Supabase! 🎉
