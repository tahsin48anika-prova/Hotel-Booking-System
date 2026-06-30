-- Create bookings table for Worldora Stay
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  hotel_id TEXT,
  room_id TEXT,
  check_in TEXT,
  check_out TEXT,
  guests JSONB,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  total_amount NUMERIC,
  coupon_used TEXT,
  status TEXT DEFAULT 'confirmed',
  special_requests TEXT,
  created_at TEXT
);

-- Enable row level security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing public read/write or authenticated)
CREATE POLICY "Allow public read access" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON bookings FOR UPDATE USING (true);
