/*
# Create Profiles and Rooms Tables

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `username` (text, unique, not null)
- `display_name` (text)
- `avatar_url` (text)
- `role` (user_role enum: 'user', 'admin')
- `created_at` (timestamptz, default: now())

### rooms
- `id` (uuid, primary key, default: gen_random_uuid())
- `code` (text, unique, not null) - 6-character room code
- `name` (text, not null)
- `type` (room_type enum: 'movie', 'music', 'game')
- `host_id` (uuid, references profiles.id)
- `video_url` (text) - YouTube or direct video URL
- `is_active` (boolean, default: true)
- `current_time` (numeric, default: 0) - playback position in seconds
- `is_playing` (boolean, default: false)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### room_participants
- `id` (uuid, primary key, default: gen_random_uuid())
- `room_id` (uuid, references rooms.id, on delete cascade)
- `user_id` (uuid, references profiles.id, on delete cascade)
- `joined_at` (timestamptz, default: now())
- Unique constraint on (room_id, user_id)

## 2. Security

- Enable RLS on all tables
- Profiles: Public read access, users can update own profile (except role)
- Rooms: Public read for active rooms, authenticated users can create
- Room participants: Users can join/leave rooms, view participants

## 3. Functions

- `handle_new_user()`: Auto-create profile on user confirmation
- `generate_room_code()`: Generate unique 6-character room codes
- `is_admin()`: Check if user is admin
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE room_type AS ENUM ('movie', 'music', 'game');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  type room_type NOT NULL,
  host_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  video_url text,
  is_active boolean DEFAULT true,
  current_time numeric DEFAULT 0,
  is_playing boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room_participants table
CREATE TABLE IF NOT EXISTS room_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Function to generate unique room code
CREATE OR REPLACE FUNCTION generate_room_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
  code_exists boolean;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM rooms WHERE code = result) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  new_username text;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract username from email (before @)
  new_username := split_part(NEW.email, '@', 1);
  
  INSERT INTO profiles (id, username, display_name, role)
  VALUES (
    NEW.id,
    new_username,
    new_username,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_participants ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update any profile"
  ON profiles FOR ALL
  USING (is_admin(auth.uid()));

-- Rooms policies
CREATE POLICY "Active rooms are viewable by everyone"
  ON rooms FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can create rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Room hosts can update their rooms"
  ON rooms FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Room hosts can delete their rooms"
  ON rooms FOR DELETE
  USING (auth.uid() = host_id);

-- Room participants policies
CREATE POLICY "Room participants are viewable by everyone"
  ON room_participants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join rooms"
  ON room_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms"
  ON room_participants FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_rooms_code ON rooms(code);
CREATE INDEX idx_rooms_host ON rooms(host_id);
CREATE INDEX idx_room_participants_room ON room_participants(room_id);
CREATE INDEX idx_room_participants_user ON room_participants(user_id);

-- Create updated_at trigger for rooms
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();