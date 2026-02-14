-- 1. Create Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  type TEXT CHECK (type IN ('daily', 'weekly')) NOT NULL,
  requirement_type TEXT NOT NULL, -- e.g., 'login', 'lesson', 'save', 'budget'
  requirement_value INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create User Challenges Table (Tracking user progress)
CREATE TABLE IF NOT EXISTS user_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, challenge_id) -- Prevent duplicate tracking rows
);

-- 3. Update Gamification Table (Ensure streak tracking exists)
-- Assuming 'gamification' table exists from previous migrations or needs to be created
CREATE TABLE IF NOT EXISTS gamification (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_login_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add column if it doesn't exist (idempotent check manually or just trust CREATE TABLE IF NOT EXISTS handles basic case)
-- In standard SQL, ALTER TABLE IF NOT EXISTS is not standard.
-- We assume the table might exist. Using specific column additions:

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gamification' AND column_name='streak_days') THEN
    ALTER TABLE gamification ADD COLUMN streak_days INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gamification' AND column_name='last_login_date') THEN
    ALTER TABLE gamification ADD COLUMN last_login_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- 4. Seed Initial Challenges (Optional but good for testing)
INSERT INTO challenges (title, description, xp_reward, type, requirement_type, requirement_value)
VALUES
  ('Daily Check-in', 'Log in to the app today.', 10, 'daily', 'login', 1),
  ('Quick Learner', 'Complete 1 lesson.', 20, 'daily', 'lesson_complete', 1),
  ('Financial Wellness', 'Update your financial goals.', 15, 'daily', 'update_finances', 1),
  ('Weekly Saver', 'Save ₹1000 this week.', 50, 'weekly', 'save_amount', 1000),
  ('Knowledge Seeker', 'Complete 3 lessons this week.', 60, 'weekly', 'lesson_complete', 3)
ON CONFLICT DO NOTHING; -- basic conflict avoidance if titles were unique, but they aren't here. Just for initial run.
