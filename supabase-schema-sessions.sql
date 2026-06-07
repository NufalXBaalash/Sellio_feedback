-- SellioAI Test Sessions Table
-- Run this against your Supabase database

CREATE TABLE IF NOT EXISTS test_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL UNIQUE,
  language VARCHAR(2) NOT NULL DEFAULT 'en',
  status VARCHAR(20) NOT NULL DEFAULT 'landing'
    CHECK (status IN ('landing','testing','survey_started','completed','abandoned')),

  -- Funnel Timestamps
  landing_viewed_at TIMESTAMPTZ,
  instagram_clicked_at TIMESTAMPTZ,
  test_started_at TIMESTAMPTZ,
  test_returned_at TIMESTAMPTZ,
  survey_started_at TIMESTAMPTZ,
  survey_completed_at TIMESTAMPTZ,
  total_duration_seconds INTEGER,

  -- Survey Answers
  conversation_started BOOLEAN,
  ai_accuracy_rating SMALLINT CHECK (ai_accuracy_rating BETWEEN 1 AND 5),
  order_completed BOOLEAN,
  order_prevented_reason VARCHAR(100),
  order_prevented_text TEXT,
  issue_severity VARCHAR(10) CHECK (issue_severity IN ('minor','moderate','major')),
  conversation_duration_estimate VARCHAR(20)
    CHECK (conversation_duration_estimate IN ('less_than_1min','1_to_3min','3_to_5min','more_than_5min')),
  overall_rating SMALLINT CHECK (overall_rating BETWEEN 1 AND 5),
  human_likeness VARCHAR(20)
    CHECK (human_likeness IN ('definitely_ai','probably_ai','not_sure','probably_human','definitely_human')),
  trust_level VARCHAR(10) CHECK (trust_level IN ('yes','maybe','no')),
  business_recommendation VARCHAR(20)
    CHECK (business_recommendation IN ('definitely','probably','not_sure','probably_not','definitely_not')),
  nps_score SMALLINT CHECK (nps_score BETWEEN 0 AND 10),
  open_feedback TEXT,

  -- Metadata
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_test_sessions_session_id ON test_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_created_at ON test_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_test_sessions_language ON test_sessions(language);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_test_sessions_updated_at ON test_sessions;
CREATE TRIGGER update_test_sessions_updated_at
  BEFORE UPDATE ON test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert test sessions" ON test_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read test sessions" ON test_sessions
  FOR SELECT USING (true);

CREATE POLICY "Public can update test sessions" ON test_sessions
  FOR UPDATE USING (true);
