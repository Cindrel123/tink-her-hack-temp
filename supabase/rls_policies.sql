-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Lifestyle Finance Mentor - Production Security Setup
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE IF EXISTS gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lesson_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- GAMIFICATION TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own gamification data" ON gamification;
DROP POLICY IF EXISTS "Users can update own gamification data" ON gamification;
DROP POLICY IF EXISTS "Users can insert own gamification data" ON gamification;

-- Create policies
CREATE POLICY "Users can view own gamification data"
  ON gamification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification data"
  ON gamification FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification data"
  ON gamification FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- CHALLENGES TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can view challenges" ON challenges;

-- Create policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- USER_CHALLENGES TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own challenge progress" ON user_challenges;
DROP POLICY IF EXISTS "Users can update own challenge progress" ON user_challenges;
DROP POLICY IF EXISTS "Users can insert own challenge progress" ON user_challenges;

-- Create policies
CREATE POLICY "Users can view own challenge progress"
  ON user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress"
  ON user_challenges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenge progress"
  ON user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- LESSONS TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can view lessons" ON lessons;

-- Create policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- LESSON_PROGRESS TABLE POLICIES
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can delete own lesson progress" ON lesson_progress;

-- Create policies
CREATE POLICY "Users can view own lesson progress"
  ON lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lesson progress"
  ON lesson_progress FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';
