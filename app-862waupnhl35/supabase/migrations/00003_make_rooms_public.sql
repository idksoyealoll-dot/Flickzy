/*
# Make Rooms Public - Remove Authentication Requirement

## Changes
1. Make host_id nullable in rooms table
2. Make user_id nullable in room_participants table
3. Make user_id nullable in room_messages table
4. Update RLS policies to allow anonymous users
5. Allow anyone to create and join rooms without authentication

## Security
- Rooms are now fully public
- No authentication required for any room operations
- Anonymous users can create and join rooms
- Anonymous users can send messages
*/

-- Make host_id nullable in rooms table
ALTER TABLE rooms ALTER COLUMN host_id DROP NOT NULL;

-- Make user_id nullable in room_participants table
ALTER TABLE room_participants ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable in room_messages table
ALTER TABLE room_messages ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can view active rooms" ON rooms;
DROP POLICY IF EXISTS "Authenticated users can create rooms" ON rooms;
DROP POLICY IF EXISTS "Room hosts can update their rooms" ON rooms;
DROP POLICY IF EXISTS "Room hosts can delete their rooms" ON rooms;
DROP POLICY IF EXISTS "Anyone can view room participants" ON room_participants;
DROP POLICY IF EXISTS "Authenticated users can join rooms" ON room_participants;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_participants;

-- Create new public policies for rooms
CREATE POLICY "Anyone can view rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create rooms" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update rooms" ON rooms
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete rooms" ON rooms
  FOR DELETE USING (true);

-- Create new public policies for room_participants
CREATE POLICY "Anyone can view participants" ON room_participants
  FOR SELECT USING (true);

CREATE POLICY "Anyone can join rooms" ON room_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can leave rooms" ON room_participants
  FOR DELETE USING (true);

-- Create new public policies for room_messages
DROP POLICY IF EXISTS "Anyone can view messages in rooms" ON room_messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON room_messages;

CREATE POLICY "Anyone can view messages" ON room_messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages" ON room_messages
  FOR INSERT WITH CHECK (true);
