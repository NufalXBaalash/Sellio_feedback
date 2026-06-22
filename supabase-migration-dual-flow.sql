-- =============================================
-- MIGRATION: Dual-Flow Survey System (Customer vs. Merchant)
-- Run in: Supabase SQL Editor
-- This migration is ADDITIVE (uses IF NOT EXISTS) so it is safe
-- to run on a live, populated test_sessions table.
-- =============================================

-- 1. flow_type discriminator column (customer | merchant)
ALTER TABLE test_sessions
  ADD COLUMN IF NOT EXISTS flow_type VARCHAR(10) NOT NULL DEFAULT 'customer'
    CHECK (flow_type IN ('customer', 'merchant'));

-- 2. All merchant survey answer columns (M1–M11)
ALTER TABLE test_sessions
  ADD COLUMN IF NOT EXISTS m_ai_accuracy_rating   SMALLINT     CHECK (m_ai_accuracy_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS m_service_useful        VARCHAR(20)  CHECK (m_service_useful IN ('definitely','probably','not_sure','probably_not','definitely_not')),
  ADD COLUMN IF NOT EXISTS m_top_benefit           VARCHAR(30),
  ADD COLUMN IF NOT EXISTS m_top_benefit_text      TEXT,
  ADD COLUMN IF NOT EXISTS m_willing_to_pay        VARCHAR(10)  CHECK (m_willing_to_pay IN ('yes','maybe','no')),
  ADD COLUMN IF NOT EXISTS m_price_expectation     VARCHAR(20)  CHECK (m_price_expectation IN ('under_100','100_300','300_600','600_1000','over_1000')),
  ADD COLUMN IF NOT EXISTS m_pricing_fair          VARCHAR(30)  CHECK (m_pricing_fair IN ('too_cheap','fair','expensive_but_ok','too_expensive')),
  ADD COLUMN IF NOT EXISTS m_adoption_timeline     VARCHAR(20)  CHECK (m_adoption_timeline IN ('now','within_month','within_3months','need_more_proof')),
  ADD COLUMN IF NOT EXISTS m_blocker               VARCHAR(30),
  ADD COLUMN IF NOT EXISTS m_blocker_text          TEXT,
  ADD COLUMN IF NOT EXISTS m_merchant_nps          SMALLINT     CHECK (m_merchant_nps BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS m_open_feedback         TEXT;

-- 3. Index for dashboard filtering by flow_type
CREATE INDEX IF NOT EXISTS idx_test_sessions_flow_type ON test_sessions(flow_type);
