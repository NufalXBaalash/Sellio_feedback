-- Supabase Feedback Table Schema
-- Run this SQL in your Supabase SQL Editor

-- Create the feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  is_useful VARCHAR(10) NOT NULL CHECK (is_useful IN ('yes', 'no')),
  feedback TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_email ON feedback(email);
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_is_useful ON feedback(is_useful);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_feedback_updated_at 
    BEFORE UPDATE ON feedback 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your needs)
-- Policy for inserting feedback (public can insert)
CREATE POLICY "Public can insert feedback" ON feedback
    FOR INSERT WITH CHECK (true);

-- Policy for reading feedback (you might want to restrict this)
CREATE POLICY "Public can read feedback" ON feedback
    FOR SELECT USING (true);

-- Optional: Policy for admin operations (if you have admin users)
-- CREATE POLICY "Admin can manage feedback" ON feedback
--     FOR ALL USING (auth.role() = 'admin');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON feedback TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
