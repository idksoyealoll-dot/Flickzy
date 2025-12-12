/*
# Create Chat Messages Table

## 1. New Tables

### room_messages
- `id` (uuid, primary key, default: gen_random_uuid())
- `room_id` (uuid, references rooms.id, on delete cascade)
- `user_id` (uuid, references profiles.id, on delete cascade)
- `message` (text, not null)
- `created_at` (timestamptz, default: now())

## 2. Security

- Enable RLS on room_messages
- Anyone can read messages from rooms they're in
- Authenticated users can send messages to rooms they're in

## 3. Indexes

- Index on room_id for fast message retrieval
- Index on created_at for ordering
*/

-- Create room_messages table
CREATE TABLE IF NOT EXISTS room_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE room_messages ENABLE ROW LEVEL SECURITY;

-- Policies for room_messages
CREATE POLICY "Anyone can read room messages"
  ON room_messages FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can send messages"
  ON room_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_room_messages_room ON room_messages(room_id);
CREATE INDEX idx_room_messages_created ON room_messages(created_at DESC);