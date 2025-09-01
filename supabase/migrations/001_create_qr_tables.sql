-- Create QR codes table
CREATE TABLE public.qr_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  category CHAR(1) NOT NULL CHECK (category IN ('C','W','P','E','R','S','T','A','M')),
  base58_id VARCHAR(8) NOT NULL,
  name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  scan_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMPTZ,
  metadata JSONB,
  UNIQUE(category, base58_id)
);

-- Create QR actions table
CREATE TABLE public.qr_actions (
  id SERIAL PRIMARY KEY,
  qr_code_id INTEGER REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  action_type VARCHAR(30) NOT NULL,
  action_data JSONB NOT NULL,
  priority INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  max_scans INTEGER,
  requires_auth BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scan analytics table
CREATE TABLE public.qr_scans (
  id SERIAL PRIMARY KEY,
  qr_code_id INTEGER REFERENCES public.qr_codes(id),
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  user_agent TEXT,
  ip_address INET,
  action_taken VARCHAR(30),
  success BOOLEAN DEFAULT TRUE
);

-- Create catalogue items table
CREATE TABLE public.catalogue_items (
  id SERIAL PRIMARY KEY,
  qr_code_id INTEGER REFERENCES public.qr_codes(id) UNIQUE,
  item_type VARCHAR(50),
  title VARCHAR(200),
  artist_creator VARCHAR(200),
  year INTEGER,
  description TEXT,
  location VARCHAR(100),
  purchase_info JSONB,
  images TEXT[],
  tags TEXT[]
);

-- Create indexes for performance
CREATE INDEX idx_qr_codes_category ON public.qr_codes(category);
CREATE INDEX idx_qr_codes_code ON public.qr_codes(code);
CREATE INDEX idx_qr_codes_is_active ON public.qr_codes(is_active);
CREATE INDEX idx_qr_actions_qr_code_id ON public.qr_actions(qr_code_id);
CREATE INDEX idx_qr_scans_qr_code_id ON public.qr_scans(qr_code_id);
CREATE INDEX idx_qr_scans_user_id ON public.qr_scans(user_id);
CREATE INDEX idx_qr_scans_scanned_at ON public.qr_scans(scanned_at DESC);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalogue_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read active QR codes
CREATE POLICY "Public can read active QR codes" ON public.qr_codes
  FOR SELECT USING (is_active = TRUE);

-- Admins can manage all QR codes
CREATE POLICY "Admins can manage QR codes" ON public.qr_codes
  FOR ALL USING (is_admin(auth.uid()));

-- Public can read QR actions for active codes
CREATE POLICY "Public can read QR actions" ON public.qr_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.qr_codes 
      WHERE qr_codes.id = qr_actions.qr_code_id 
      AND qr_codes.is_active = TRUE
    )
  );

-- Admins can manage all QR actions
CREATE POLICY "Admins can manage QR actions" ON public.qr_actions
  FOR ALL USING (is_admin(auth.uid()));

-- Public can insert scans (for analytics)
CREATE POLICY "Public can insert scans" ON public.qr_scans
  FOR INSERT WITH CHECK (TRUE);

-- Admins can read all scans
CREATE POLICY "Admins can read all scans" ON public.qr_scans
  FOR SELECT USING (is_admin(auth.uid()));

-- Users can read their own scans
CREATE POLICY "Users can read own scans" ON public.qr_scans
  FOR SELECT USING (auth.uid() = user_id);

-- Public can read catalogue items
CREATE POLICY "Public can read catalogue items" ON public.catalogue_items
  FOR SELECT USING (TRUE);

-- Admins can manage catalogue items
CREATE POLICY "Admins can manage catalogue items" ON public.catalogue_items
  FOR ALL USING (is_admin(auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qr_actions_updated_at BEFORE UPDATE ON public.qr_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();