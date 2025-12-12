-- Make user_id nullable in room_messages table
ALTER TABLE room_messages ALTER COLUMN user_id DROP NOT NULL;