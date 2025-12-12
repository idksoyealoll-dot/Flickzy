import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Film, Play, Video, MessageCircle, Users, Copy, Share2, LogOut, Maximize, Minimize, Send, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/db/supabase";
import * as api from "@/db/api";
import type { RoomWithParticipants, RoomMessageWithProfile } from "@/types/types";

const Movies: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState<RoomWithParticipants | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [roomName, setRoomName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<RoomMessageWithProfile[]>([]);
  const [cameraError, setCameraError] = useState<string>("");

  useEffect(() => {
    checkUser();
    const roomCode = searchParams.get('room');
    if (roomCode) {
      handleJoinByCode(roomCode);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!room) return;

    loadMessages();

    const roomChannel = supabase
      .channel(`room:${room.id}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${room.id}`
      }, (payload) => {
        console.log('Room update received:', payload);
        if (payload.eventType === 'UPDATE') {
          setRoom(prev => prev ? { ...prev, ...payload.new } : null);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${room.id}`
      }, (payload) => {
        console.log('Participant update received:', payload);
        refreshRoom();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'room_messages',
        filter: `room_id=eq.${room.id}`
      }, (payload) => {
        console.log('New message received via realtime:', payload);
        loadMessages();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to room:', room.id);
        }
      });

    // Polling as fallback - check for new messages every 2 seconds
    const pollingInterval = setInterval(() => {
      loadMessages();
    }, 2000);

    return () => {
      console.log('Unsubscribing from room:', room.id);
      supabase.removeChannel(roomChannel);
      clearInterval(pollingInterval);
    };
  }, [room?.id]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (showVideoCall && isVideoOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [showVideoCall, isVideoOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.volume = 1.0;
      }
      
      setIsMicOn(true);
      setCameraError("");
      toast({
        title: "Camera & Mic started",
        description: "Your camera and microphone are now active",
      });
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setCameraError(error.message || "Could not access camera/microphone");
      setIsVideoOn(false);
      toast({
        title: "Camera/Mic access denied",
        description: "Please allow camera and microphone access in your browser settings",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleMic = async () => {
    if (!localStreamRef.current) {
      setIsMicOn(!isMicOn);
      return;
    }

    const audioTracks = localStreamRef.current.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !isMicOn;
      setIsMicOn(!isMicOn);
    } else if (!isMicOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioTrack = stream.getAudioTracks()[0];
        localStreamRef.current.addTrack(audioTrack);
        setIsMicOn(true);
      } catch (error) {
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access",
          variant: "destructive",
        });
      }
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
  };

  const loadMessages = async () => {
    if (!room) return;
    try {
      console.log('Loading messages for room:', room.id);
      const msgs = await api.getRoomMessages(room.id);
      console.log('Loaded messages:', msgs.length, msgs);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error loading messages",
        description: "Could not load chat messages",
        variant: "destructive",
      });
    }
  };

  const refreshRoom = async () => {
    if (!room) return;
    try {
      const updated = await api.getRoomWithParticipants(room.id);
      setRoom(updated);
    } catch (error) {
      console.error('Error refreshing room:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a name for your room",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingRoom(true);
    try {
      const newRoom = await api.createRoom(roomName, 'movie', videoUrl || undefined);
      const roomWithParticipants = await api.getRoomWithParticipants(newRoom.id);
      setRoom(roomWithParticipants);
      setRoomName("");
      
      toast({
        title: "Room created!",
        description: `Room code: ${newRoom.code}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to create room",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinByCode = async (code: string) => {
    setIsJoiningRoom(true);
    try {
      const foundRoom = await api.getRoomByCode(code);
      if (!foundRoom) {
        toast({
          title: "Room not found",
          description: "Invalid room code",
          variant: "destructive",
        });
        return;
      }

      await api.joinRoom(foundRoom.id);
      const roomWithParticipants = await api.getRoomWithParticipants(foundRoom.id);
      setRoom(roomWithParticipants);
      setJoinCode("");
      
      toast({
        title: "Joined room!",
        description: `Welcome to ${foundRoom.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to join room",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!room) return;
    
    try {
      await api.leaveRoom(room.id);
      stopCamera();
      setRoom(null);
      setMessages([]);
      setShowVideoCall(false);
      toast({
        title: "Left room",
        description: "You have left the room",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateVideo = async () => {
    if (!room || !videoUrl.trim()) return;
    
    try {
      await api.updateRoom(room.id, { video_url: videoUrl });
      toast({
        title: "Video updated",
        description: "Video URL has been updated for all participants",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!room || !chatMessage.trim()) return;
    
    try {
      console.log('Sending message:', chatMessage, 'to room:', room.id);
      await api.sendMessage(room.id, chatMessage);
      setChatMessage("");
      
      // Immediately reload messages
      await loadMessages();
      
      console.log('Message sent and messages reloaded');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const copyRoomLink = () => {
    if (!room) return;
    const link = `${window.location.origin}/movies?room=${room.code}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Room link copied to clipboard",
    });
  };

  const copyRoomCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    toast({
      title: "Code copied!",
      description: "Room code copied to clipboard",
    });
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&controls=1`;
      }
    }
    
    return null;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!room) {
    return (
      <div className="min-h-screen gradient-bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold mb-2 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
              Movie Streaming
            </h1>
            <p className="text-muted-foreground">Create or join a room to watch together</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  Create Room
                </CardTitle>
                <CardDescription>Start a new watch party</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    placeholder="Movie Night"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-url-create">Video URL (Optional)</Label>
                  <Input
                    id="video-url-create"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleCreateRoom} 
                  className="w-full"
                  disabled={isCreatingRoom}
                >
                  {isCreatingRoom ? "Creating..." : "Create Room"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Join Room
                </CardTitle>
                <CardDescription>Enter a room code to join</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="join-code">Room Code</Label>
                  <Input
                    id="join-code"
                    placeholder="ABC123"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </div>

                <Button 
                  onClick={() => handleJoinByCode(joinCode)} 
                  className="w-full"
                  disabled={isJoiningRoom || joinCode.length !== 6}
                >
                  {isJoiningRoom ? "Joining..." : "Join Room"}
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    Ask your friend for their room code or link
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = room.video_url ? getYouTubeEmbedUrl(room.video_url) : null;

  return (
    <div className="min-h-screen gradient-bg-dark">
      {/* Fullscreen Video Player */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex-1 relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Player"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="text-center">
                  <Film className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="text-xl text-muted-foreground">No video loaded</p>
                </div>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Normal View */}
      {!isFullscreen && (
        <div className="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
          {/* Header */}
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl xl:text-3xl font-bold mb-1 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
                {room.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {room.code}
                </Badge>
                <Button variant="ghost" size="sm" onClick={copyRoomCode}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
                </Button>
                <Button variant="ghost" size="sm" onClick={copyRoomLink}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showVideoCall ? "default" : "outline"} 
                size="sm"
                onClick={() => setShowVideoCall(!showVideoCall)}
              >
                <Video className="h-4 w-4 mr-2" />
                Video Call
              </Button>
              <Button variant="outline" size="sm" onClick={handleLeaveRoom}>
                <LogOut className="h-4 w-4 mr-2" />
                Leave
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Video Player - Takes 3 columns on xl screens */}
            <div className="xl:col-span-3 space-y-4">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-3 sm:p-4">
                  {embedUrl ? (
                    <div className="space-y-3">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video Player"
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsFullscreen(true)}
                        >
                          <Maximize className="h-4 w-4 mr-2" />
                          Fullscreen
                        </Button>
                        {room.host_id === user?.id && (
                          <>
                            <Input
                              placeholder="Update video URL..."
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={handleUpdateVideo} size="sm">
                              Update
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <Film className="h-16 w-16 text-primary mx-auto mb-4" />
                          <p className="text-lg text-muted-foreground mb-2">No video loaded</p>
                          {room.host_id === user?.id && (
                            <p className="text-sm text-muted-foreground">Add a YouTube URL below to start</p>
                          )}
                        </div>
                      </div>
                      
                      {room.host_id === user?.id && (
                        <div className="space-y-2">
                          <Label>YouTube Video URL</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                            />
                            <Button onClick={handleUpdateVideo}>
                              <Play className="mr-2 h-4 w-4" />
                              Load
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Video Call Section */}
              {showVideoCall && (
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Video className="h-5 w-5 text-primary" />
                      Video Call
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {/* Local Video */}
                      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                        {isVideoOn ? (
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center mx-auto mb-2">
                                <span className="text-lg font-bold text-primary">
                                  {user?.email?.[0]?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <p className="text-xs text-foreground font-medium">You</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                          <span className="text-xs bg-black/70 px-2 py-1 rounded text-white">You</span>
                          <div className="flex gap-1">
                            {!isVideoOn && (
                              <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                                <VideoOff className="h-3 w-3 text-white" />
                              </div>
                            )}
                            {!isMicOn && (
                              <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                                <MicOff className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Other Participants */}
                      {room.participants?.filter(p => p.user_id !== user?.id).slice(0, 7).map((participant) => (
                        <div key={participant.id} className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg font-bold text-primary">
                                {participant.profile?.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <p className="text-xs text-foreground font-medium">
                              {participant.profile?.display_name || participant.profile?.username || 'Unknown'}
                            </p>
                          </div>
                          <div className="absolute bottom-2 left-2">
                            <span className="text-xs bg-black/70 px-2 py-1 rounded text-white">
                              {participant.profile?.username || 'User'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {cameraError && (
                      <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                        {cameraError}
                      </div>
                    )}

                    <div className="flex justify-center gap-2 pt-2">
                      <Button
                        variant={isMicOn ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleMic}
                      >
                        {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={isVideoOn ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleVideo}
                      >
                        {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setShowVideoCall(false);
                          stopCamera();
                        }}
                      >
                        <PhoneOff className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Participants and Chat */}
            <div className="xl:col-span-1 space-y-4">
              {/* Participants */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Participants ({room.participant_count || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 xl:h-48">
                    <div className="space-y-2">
                      {room.participants?.map((participant) => (
                        <div key={participant.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-primary">
                              {participant.profile?.username?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {participant.profile?.display_name || participant.profile?.username || 'Unknown'}
                            </p>
                            {participant.user_id === room.host_id && (
                              <Badge variant="outline" className="text-xs">Host</Badge>
                            )}
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ScrollArea className="h-64 xl:h-96 pr-3" ref={chatScrollRef}>
                    <div className="space-y-3">
                      {messages.length === 0 ? (
                        <div className="text-center text-sm text-muted-foreground py-8">
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-semibold text-primary truncate">
                                {msg.profile?.display_name || msg.profile?.username || 'Unknown'}
                              </span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatTime(msg.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground bg-muted/30 rounded-lg px-3 py-2 break-words">
                              {msg.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
