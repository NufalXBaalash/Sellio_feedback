-- =============================================
-- MIGRATION: Feedback contact fields (name + phone) for the 100% free claim
-- Run in: Supabase SQL Editor
-- ADDITIVE (IF NOT EXISTS) — safe on a live table.
-- =============================================

ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS name  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS phone VARCHAR(40);

-- Speed up lookups / dedup by phone
CREATE INDEX IF NOT EXISTS idx_feedback_phone ON feedback(phone);
