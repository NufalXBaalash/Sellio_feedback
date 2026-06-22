-- =============================================
-- MIGRATION: Link feedback (reward claim) back to its test session
-- Run in: Supabase SQL Editor
-- ADDITIVE (IF NOT EXISTS) — safe on a live table.
--
-- Stores the test_sessions.session_id that the claim belongs to, so the
-- admin dashboard can show contact info (name/phone/email) next to the
-- matching merchant/customer session. Existing feedback rows keep NULL.
-- =============================================

ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);

-- Speed up the session_id lookup used by the admin stats join
CREATE INDEX IF NOT EXISTS idx_feedback_session_id ON feedback(session_id);
