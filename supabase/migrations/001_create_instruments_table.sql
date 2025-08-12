-- Create the instruments table
CREATE TABLE IF NOT EXISTS public.instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access (anyone can view instruments)
CREATE POLICY "Anyone can view instruments"
  ON public.instruments
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Create RLS policy for anyone to insert instruments (including anonymous users)
CREATE POLICY "Anyone can insert instruments"
  ON public.instruments
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create RLS policy for anyone to update instruments (including anonymous users)
CREATE POLICY "Anyone can update instruments"
  ON public.instruments
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create RLS policy for anyone to delete instruments (including anonymous users)
CREATE POLICY "Anyone can delete instruments"
  ON public.instruments
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Enable realtime for the instruments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.instruments;

-- Insert some sample data to get started
INSERT INTO public.instruments (name, type) 
VALUES
  ('Electric Guitar', 'String'),
  ('Piano', 'Keyboard'),
  ('Drums', 'Percussion'),
  ('Violin', 'String'),
  ('Trumpet', 'Brass'),
  ('Saxophone', 'Woodwind'),
  ('Bass Guitar', 'String'),
  ('Flute', 'Woodwind')
ON CONFLICT DO NOTHING;

-- Add a comment to the table for documentation
COMMENT ON TABLE public.instruments IS 'Musical instruments with real-time updates enabled';
COMMENT ON COLUMN public.instruments.id IS 'Unique identifier for each instrument';
COMMENT ON COLUMN public.instruments.name IS 'Name of the musical instrument';
COMMENT ON COLUMN public.instruments.type IS 'Category/type of the instrument (String, Keyboard, Percussion, etc.)';
COMMENT ON COLUMN public.instruments.created_at IS 'Timestamp when the instrument was added';
