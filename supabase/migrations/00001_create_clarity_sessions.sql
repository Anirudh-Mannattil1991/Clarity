-- Create sessions table for tracking clarity sessions
CREATE TABLE IF NOT EXISTS clarity_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  original_thoughts TEXT NOT NULL,
  clarity_index_before INT NOT NULL CHECK (clarity_index_before >= 0 AND clarity_index_before <= 100),
  clarity_index_after INT NOT NULL CHECK (clarity_index_after >= 0 AND clarity_index_after <= 100),
  dominant_mood TEXT,
  task_count_do_today INT DEFAULT 0,
  task_count_schedule_soon INT DEFAULT 0,
  task_count_delegate INT DEFAULT 0,
  task_count_let_go INT DEFAULT 0
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_clarity_sessions_created_at ON clarity_sessions(created_at DESC);

-- Enable RLS (but allow all operations since no auth required)
ALTER TABLE clarity_sessions ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anonymous users
CREATE POLICY "Allow all operations for clarity sessions"
  ON clarity_sessions
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);