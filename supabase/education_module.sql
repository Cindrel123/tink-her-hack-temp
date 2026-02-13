-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  level_required INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of strings
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies
-- Lessons are readable by everyone
CREATE POLICY "Lessons are public" ON lessons FOR SELECT USING (true);

-- Quizzes are readable by everyone
CREATE POLICY "Quizzes are public" ON quizzes FOR SELECT USING (true);

-- Progress is private to the user
CREATE POLICY "Users can view own progress" ON lesson_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON lesson_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON lesson_progress 
  FOR UPDATE USING (auth.uid() = user_id);

-- SEED DATA
-- Insert basic lessons
INSERT INTO lessons (title, description, content, level_required, xp_reward) VALUES
(
  'Budgeting 101', 
  'Master the 50/30/20 rule and take control of your cash flow.', 
  '## Why Budget?\n\nBudgeting isn''t about restriction; it''s about permission. It tells your money where to go instead of wondering where it went.\n\n### The 50/30/20 Rule\n\n- **50% Needs**: Essential costs like rent, groceries, and utilities.\n- **30% Wants**: Dining out, entertainment, hobbies.\n- **20% Savings**: Emergency fund, investments, debt repayment.\n\nStart by tracking your expenses for one month to see where you stand!',
  1, 
  150
),
(
  'Emergency Funds', 
  'Why you need a financial safety net and how to build one.', 
  '## Expect the Unexpected\n\nAn emergency fund is money set aside for unforeseen expenses like car repairs or medical bills. It fills the gap between your income and unexpected costs so you don''t have to rely on credit cards.\n\n### How much do you need?\n\nAim for **3 to 6 months** of living expenses. Start small with a goal of $1,000.',
  1, 
  200
),
(
  'The Magic of Compound Interest', 
  'Learn how to make your money work for you over time.', 
  '## Albert Einstein called it the "Eighth Wonder of the World"\n\nCompound interest is interest calculated on the initial principal, which also includes all of the accumulated interest from previous periods.\n\n### Example\n\nIf you invest **$100** at **10%** interest:\n- Year 1: $110\n- Year 2: $121 (You earned interest on your interest!)\n- Year 3: $133.10\n\nTime is your best friend when investing.',
  2, 
  300
),
(
  'Understanding Credit Scores', 
  'What affects your score and how to improve it.', 
  '## Your Financial Report Card\n\nA credit score is a number between 300 and 850 that depicts a consumer''s creditworthiness.\n\n### Key Factors:\n1. **Payment History (35%)**: Do you pay on time?\n2. **Amounts Owed (30%)**: Credit utilization ratio.\n3. **Length of History (15%)**: Longer is better.\n4. **New Credit (10%)**: Don''t open too many accounts at once.\n5. **Credit Mix (10%)**: diverse types of credit.',
  3, 
  500
),
(
  'Intro to Investing', 
  'Stocks, Bonds, and ETFs explained simply.', 
  '## Putting Money to Work\n\nInvesting is how you build wealth. \n\n- **Stocks**: Ownership in a company. High risk, high reward.\n- **Bonds**: Loans to a company or government. Lower risk, lower reward.\n- **ETFs (Exchange Traded Funds)**: A basket of stocks/bonds. Great for diversification.\n\nStart early and stay consistent!',
  5, 
  1000
);

-- Seed Quizzes (We need to fetch lesson IDs dynamically ideally, but for this mock we will assume order or rely on app logic if we were running a script. Since this is raw SQL, we use a DO block or just generic insert for demonstration if UUIDs not known. 
-- Ideally, the app would seed this via a script. For this files content, I will use a CTE to map them safely).

WITH budget_lesson AS (SELECT id FROM lessons WHERE title = 'Budgeting 101' LIMIT 1),
     emergency_lesson AS (SELECT id FROM lessons WHERE title = 'Emergency Funds' LIMIT 1),
     compound_lesson AS (SELECT id FROM lessons WHERE title = 'The Magic of Compound Interest' LIMIT 1)

INSERT INTO quizzes (lesson_id, question, options, correct_answer) 
SELECT id, 'What percentage of income goes to "Needs" in the 50/30/20 rule?', '["20%", "30%", "50%", "10%"]'::jsonb, '50%' FROM budget_lesson
UNION ALL
SELECT id, 'Which of these is considered a "Want"?', '["Rent", "Groceries", "Netflix Subscription", "Electricity Bill"]'::jsonb, 'Netflix Subscription' FROM budget_lesson
UNION ALL
SELECT id, 'What is the recommended size of an emergency fund?', '["1 week of expenses", "3-6 months of expenses", "1 year of income", "USD 100"]'::jsonb, '3-6 months of expenses' FROM emergency_lesson
UNION ALL
SELECT id, 'Compound interest is calculated on:', '["Principal only", "Interest only", "Principal and accumulated interest", "Your annual income"]'::jsonb, 'Principal and accumulated interest' FROM compound_lesson;
