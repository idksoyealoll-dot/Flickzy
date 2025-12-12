import React, { useState, useEffect, useCallback } from "react";
import { Music, Search, Play, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  previewUrl: string | null;
  externalUrl: string;
  duration: number;
  uri: string;
}

interface LocalSong {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  category: string;
}

const popularSongs: LocalSong[] = [
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", videoId: "4NRXx6U8ABQ", thumbnail: "https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg", category: "Pop" },
  { id: "2", title: "Shape of You", artist: "Ed Sheeran", videoId: "JGwWNGJdvx8", thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg", category: "Pop" },
  { id: "3", title: "Levitating", artist: "Dua Lipa", videoId: "TUVcZfQe-Kw", thumbnail: "https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg", category: "Pop" },
  { id: "4", title: "Anti-Hero", artist: "Taylor Swift", videoId: "b1kbLwvqugk", thumbnail: "https://i.ytimg.com/vi/b1kbLwvqugk/mqdefault.jpg", category: "Pop" },
  { id: "5", title: "Bohemian Rhapsody", artist: "Queen", videoId: "fJ9rUzIMcZQ", thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg", category: "Rock" },
  { id: "6", title: "God's Plan", artist: "Drake", videoId: "xpVfcZ0ZcFM", thumbnail: "https://i.ytimg.com/vi/xpVfcZ0ZcFM/mqdefault.jpg", category: "Hip Hop" },
];

const API_BASE = window.location.origin.replace(':5000', ':3001');

const MusicPage: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [currentLocalSong, setCurrentLocalSong] = useState<LocalSong | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"spotify" | "local">("spotify");

  const searchSpotify = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${API_BASE}/api/spotify/search?q=${encodeURIComponent(query)}&limit=30`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setSearchResults(data.tracks || []);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Could not search Spotify. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === "spotify") {
        searchSpotify(searchQuery);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab, searchSpotify]);

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlaySpotifyTrack = (track: SpotifyTrack) => {
    if (audioRef) {
      audioRef.pause();
    }

    setCurrentLocalSong(null);
    setCurrentTrack(track);

    if (track.previewUrl) {
      const audio = new Audio(track.previewUrl);
      audio.play();
      setAudioRef(audio);
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
      };

      toast({
        title: "Now Playing (Preview)",
        description: `${track.name} - ${track.artist}`,
      });
    } else {
      toast({
        title: "No preview available",
        description: "Opening in Spotify...",
      });
      window.open(track.externalUrl, '_blank');
    }
  };

  const handlePlayLocalSong = (song: LocalSong) => {
    if (audioRef) {
      audioRef.pause();
      setAudioRef(null);
    }
    setCurrentTrack(null);
    setCurrentLocalSong(song);
    setIsPlaying(false);
    toast({
      title: "Now Playing",
      description: `${song.title} - ${song.artist}`,
    });
  };

  const handleOpenInSpotify = (track: SpotifyTrack) => {
    window.open(track.externalUrl, '_blank');
  };

  return (
    <div className="min-h-screen gradient-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
            Music Player
          </h1>
          <p className="text-muted-foreground">Search millions of songs from Spotify</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  {currentTrack ? `${currentTrack.name} - ${currentTrack.artist}` : 
                   currentLocalSong ? `${currentLocalSong.title} - ${currentLocalSong.artist}` : 
                   "Music Player"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentTrack ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center relative">
                      <img 
                        src={currentTrack.image} 
                        alt={currentTrack.name}
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <img 
                          src={currentTrack.image} 
                          alt={currentTrack.name}
                          className="w-48 h-48 rounded-lg shadow-2xl mb-4"
                        />
                        <h3 className="text-xl font-bold text-white">{currentTrack.name}</h3>
                        <p className="text-muted-foreground">{currentTrack.artist}</p>
                        <p className="text-sm text-muted-foreground mt-1">{currentTrack.album}</p>
                        {currentTrack.previewUrl && (
                          <p className="text-xs text-primary mt-2">Playing 30-second preview</p>
                        )}
                        <Button 
                          className="mt-4 gap-2" 
                          onClick={() => handleOpenInSpotify(currentTrack)}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Full Song in Spotify
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : currentLocalSong ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentLocalSong.videoId}?autoplay=1&enablejsapi=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No music playing</p>
                      <p className="text-sm text-muted-foreground mt-2">Search for a song to start</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "spotify" | "local")}>
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="spotify" className="gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Spotify
                    </TabsTrigger>
                    <TabsTrigger value="local">Local</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={activeTab === "spotify" ? "Search any song on Spotify..." : "Search local songs..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {activeTab === "spotify" ? (
                    <div className="space-y-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((track) => (
                          <Card
                            key={track.id}
                            className={`cursor-pointer hover:bg-primary/10 transition-colors ${
                              currentTrack?.id === track.id ? 'bg-primary/20 border-primary' : ''
                            }`}
                            onClick={() => handlePlaySpotifyTrack(track)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={track.image || '/placeholder.png'}
                                  alt={track.name}
                                  className="w-14 h-14 rounded object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm truncate">{track.name}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">{formatDuration(track.duration)}</span>
                                    {track.previewUrl && (
                                      <span className="text-xs text-primary">Preview available</span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlaySpotifyTrack(track);
                                    }}
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenInSpotify(track);
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : searchQuery ? (
                        <div className="text-center py-8">
                          <Music className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {isSearching ? "Searching..." : "No songs found"}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Search className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">Search for any song</p>
                          <p className="text-sm text-muted-foreground mt-1">Type to search Spotify's catalog</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {popularSongs
                        .filter(song => 
                          !searchQuery || 
                          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          song.artist.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((song) => (
                          <Card
                            key={song.id}
                            className={`cursor-pointer hover:bg-primary/10 transition-colors ${
                              currentLocalSong?.id === song.id ? 'bg-primary/20 border-primary' : ''
                            }`}
                            onClick={() => handlePlayLocalSong(song)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={song.thumbnail}
                                  alt={song.title}
                                  className="w-14 h-14 rounded object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm truncate">{song.title}</h4>
                                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{song.category}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayLocalSong(song);
                                  }}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
