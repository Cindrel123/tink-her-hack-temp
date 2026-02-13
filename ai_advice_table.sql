-- Create a new table 'ai_advice' for storing AI financial advice
CREATE TABLE IF NOT EXISTS public.ai_advice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  advice_text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_advice ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own advice (if client-side generation)
CREATE POLICY "Users can insert their own advice"
ON public.ai_advice FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create policy to allow users to view their own advice
CREATE POLICY "Users can view their own advice"
ON public.ai_advice FOR SELECT
TO authenticated
USING (user_id = auth.uid());
