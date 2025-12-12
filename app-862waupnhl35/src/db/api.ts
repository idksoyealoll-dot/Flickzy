import { supabase } from './supabase';
import type { Room, RoomWithHost, RoomWithParticipants, Profile, RoomType, RoomMessageWithProfile } from '@/types/types';

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getProfile(user.id);
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Room APIs
export const createRoom = async (name: string, type: RoomType, videoUrl?: string): Promise<RoomWithParticipants> => {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: codeData, error: codeError } = await supabase.rpc('generate_room_code');
  if (codeError) throw codeError;

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      code: codeData,
      name,
      type,
      host_id: user?.id || null,
      video_url: videoUrl || null,
    })
    .select()
    .single();

  if (error) throw error;

  // Auto-join the host to the room
  await joinRoom(data.id);

  // Return the room with participants
  const roomWithParticipants = await getRoomWithParticipants(data.id);
  return roomWithParticipants;
};

export const getRoom = async (roomId: string): Promise<RoomWithHost | null> => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      host:profiles!rooms_host_id_fkey(*)
    `)
    .eq('id', roomId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getRoomByCode = async (code: string): Promise<RoomWithHost | null> => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      host:profiles!rooms_host_id_fkey(*)
    `)
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getRoomWithParticipants = async (roomId: string): Promise<RoomWithParticipants | null> => {
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      host:profiles!rooms_host_id_fkey(*),
      room_participants(
        *,
        profile:profiles(*)
      )
    `)
    .eq('id', roomId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    participants: data.room_participants || [],
    participant_count: data.room_participants?.length || 0,
  };
};

export const getActiveRooms = async (type?: RoomType): Promise<RoomWithHost[]> => {
  let query = supabase
    .from('rooms')
    .select(`
      *,
      host:profiles!rooms_host_id_fkey(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateRoom = async (roomId: string, updates: Partial<Room>): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRoomPlayback = async (
  roomId: string,
  isPlaying: boolean,
  position: number
): Promise<Room> => {
  return updateRoom(roomId, {
    is_playing: isPlaying,
    playback_position: position,
  });
};

export const deleteRoom = async (roomId: string): Promise<void> => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);

  if (error) throw error;
};

// Room Participant APIs
export const joinRoom = async (roomId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Only add to participants if user is authenticated
  if (!user) return;

  const { error } = await supabase
    .from('room_participants')
    .insert({
      room_id: roomId,
      user_id: user.id,
    });

  if (error && error.code !== '23505') {
    throw error;
  }
};

export const joinRoomByCode = async (roomCode: string): Promise<RoomWithParticipants> => {
  // First, find the room by code
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('id')
    .eq('code', roomCode)
    .maybeSingle();

  if (roomError) throw roomError;
  if (!room) throw new Error('Room not found');

  // Join the room
  await joinRoom(room.id);

  // Return the room with participants
  const roomWithParticipants = await getRoomWithParticipants(room.id);
  return roomWithParticipants;
};

export const leaveRoom = async (roomId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Only remove from participants if user is authenticated
  if (!user) return;

  const { error } = await supabase
    .from('room_participants')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const getRoomParticipants = async (roomId: string) => {
  const { data, error } = await supabase
    .from('room_participants')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const isUserInRoom = async (roomId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('room_participants')
    .select('id')
    .eq('room_id', roomId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) return false;
  return !!data;
};

// Chat Message APIs
export const sendMessage = async (roomId: string, message: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // For anonymous users, we'll still allow sending messages but with null user_id
  const { error } = await supabase
    .from('room_messages')
    .insert({
      room_id: roomId,
      user_id: user?.id || null,
      message: message.trim(),
    });

  if (error) throw error;
};

export const getRoomMessages = async (roomId: string, limit: number = 50): Promise<RoomMessageWithProfile[]> => {
  const { data, error } = await supabase
    .from('room_messages')
    .select(`
      *,
      profile:profiles!user_id(*)
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
  
  console.log('getRoomMessages raw data:', data);
  return Array.isArray(data) ? data : [];
};
