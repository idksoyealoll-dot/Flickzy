export type UserRole = 'user' | 'admin';
export type RoomType = 'movie' | 'music' | 'game';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  type: RoomType;
  host_id: string;
  video_url: string | null;
  is_active: boolean;
  playback_position: number;
  is_playing: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface RoomWithHost extends Room {
  host?: Profile;
}

export interface RoomWithParticipants extends RoomWithHost {
  participants?: (RoomParticipant & { profile?: Profile })[];
  participant_count?: number;
}

export interface RoomMessageWithProfile extends RoomMessage {
  profile?: Profile;
}
