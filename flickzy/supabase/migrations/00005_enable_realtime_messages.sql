/*
# Enable Realtime for Room Messages

## Purpose
Enable Supabase Realtime for the room_messages table to ensure instant message delivery.

## Changes
1. Enable realtime replication for room_messages table
2. This allows real-time subscriptions to receive INSERT events immediately

## Why This Fixes the Issue
Without explicit realtime enablement, Supabase may not broadcast database changes
to subscribed clients, causing messages to only appear when the page refreshes or
when another action triggers a reload.
*/

-- Enable realtime for room_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE room_messages;

-- Also ensure realtime is enabled for rooms and room_participants
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
