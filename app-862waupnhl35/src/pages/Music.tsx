import React, { useState, useMemo } from "react";
import { Music, Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Song {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
  category: string;
}

const popularSongs: Song[] = [
  // Pop
  { id: "1", title: "Blinding Lights", artist: "The Weeknd", videoId: "4NRXx6U8ABQ", thumbnail: "https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg", category: "Pop" },
  { id: "2", title: "Shape of You", artist: "Ed Sheeran", videoId: "JGwWNGJdvx8", thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg", category: "Pop" },
  { id: "3", title: "Levitating", artist: "Dua Lipa", videoId: "TUVcZfQe-Kw", thumbnail: "https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg", category: "Pop" },
  { id: "4", title: "Anti-Hero", artist: "Taylor Swift", videoId: "b1kbLwvqugk", thumbnail: "https://i.ytimg.com/vi/b1kbLwvqugk/mqdefault.jpg", category: "Pop" },
  { id: "5", title: "As It Was", artist: "Harry Styles", videoId: "H5v3kku4y6Q", thumbnail: "https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg", category: "Pop" },
  
  // Rock
  { id: "6", title: "Bohemian Rhapsody", artist: "Queen", videoId: "fJ9rUzIMcZQ", thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg", category: "Rock" },
  { id: "7", title: "Smells Like Teen Spirit", artist: "Nirvana", videoId: "hTWKbfoikeg", thumbnail: "https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg", category: "Rock" },
  { id: "8", title: "Hotel California", artist: "Eagles", videoId: "09839DpTctU", thumbnail: "https://i.ytimg.com/vi/09839DpTctU/mqdefault.jpg", category: "Rock" },
  { id: "9", title: "Sweet Child O' Mine", artist: "Guns N' Roses", videoId: "1w7OgIMMRc4", thumbnail: "https://i.ytimg.com/vi/1w7OgIMMRc4/mqdefault.jpg", category: "Rock" },
  { id: "10", title: "Stairway to Heaven", artist: "Led Zeppelin", videoId: "QkF3oxziUI4", thumbnail: "https://i.ytimg.com/vi/QkF3oxziUI4/mqdefault.jpg", category: "Rock" },
  
  // Hip Hop
  { id: "11", title: "God's Plan", artist: "Drake", videoId: "xpVfcZ0ZcFM", thumbnail: "https://i.ytimg.com/vi/xpVfcZ0ZcFM/mqdefault.jpg", category: "Hip Hop" },
  { id: "12", title: "HUMBLE.", artist: "Kendrick Lamar", videoId: "tvTRZJ-4EyI", thumbnail: "https://i.ytimg.com/vi/tvTRZJ-4EyI/mqdefault.jpg", category: "Hip Hop" },
  { id: "13", title: "Sicko Mode", artist: "Travis Scott", videoId: "6ONRf7h3Mdk", thumbnail: "https://i.ytimg.com/vi/6ONRf7h3Mdk/mqdefault.jpg", category: "Hip Hop" },
  { id: "14", title: "Lose Yourself", artist: "Eminem", videoId: "_Yhyp-_hX2s", thumbnail: "https://i.ytimg.com/vi/_Yhyp-_hX2s/mqdefault.jpg", category: "Hip Hop" },
  { id: "15", title: "In Da Club", artist: "50 Cent", videoId: "5qm8PH4xAss", thumbnail: "https://i.ytimg.com/vi/5qm8PH4xAss/mqdefault.jpg", category: "Hip Hop" },
  
  // Electronic
  { id: "16", title: "Titanium", artist: "David Guetta ft. Sia", videoId: "JRfuAukYTKg", thumbnail: "https://i.ytimg.com/vi/JRfuAukYTKg/mqdefault.jpg", category: "Electronic" },
  { id: "17", title: "Wake Me Up", artist: "Avicii", videoId: "IcrbM1l_BoI", thumbnail: "https://i.ytimg.com/vi/IcrbM1l_BoI/mqdefault.jpg", category: "Electronic" },
  { id: "18", title: "Closer", artist: "The Chainsmokers", videoId: "PT2_F-1esPk", thumbnail: "https://i.ytimg.com/vi/PT2_F-1esPk/mqdefault.jpg", category: "Electronic" },
  { id: "19", title: "Animals", artist: "Martin Garrix", videoId: "gCYcHz2k5x0", thumbnail: "https://i.ytimg.com/vi/gCYcHz2k5x0/mqdefault.jpg", category: "Electronic" },
  { id: "20", title: "Lean On", artist: "Major Lazer", videoId: "YqeW9_5kURI", thumbnail: "https://i.ytimg.com/vi/YqeW9_5kURI/mqdefault.jpg", category: "Electronic" },
  
  // Latin
  { id: "21", title: "Despacito", artist: "Luis Fonsi", videoId: "kJQP7kiw5Fk", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg", category: "Latin" },
  { id: "22", title: "Bailando", artist: "Enrique Iglesias", videoId: "NUsoVlDFqZg", thumbnail: "https://i.ytimg.com/vi/NUsoVlDFqZg/mqdefault.jpg", category: "Latin" },
  { id: "23", title: "Mi Gente", artist: "J Balvin", videoId: "wnJ6LuUFpMo", thumbnail: "https://i.ytimg.com/vi/wnJ6LuUFpMo/mqdefault.jpg", category: "Latin" },
  { id: "24", title: "Taki Taki", artist: "DJ Snake", videoId: "ixkoVwKQaJg", thumbnail: "https://i.ytimg.com/vi/ixkoVwKQaJg/mqdefault.jpg", category: "Latin" },
  { id: "25", title: "Danza Kuduro", artist: "Don Omar", videoId: "7zp1TbLFPp8", thumbnail: "https://i.ytimg.com/vi/7zp1TbLFPp8/mqdefault.jpg", category: "Latin" },
  
  // Classic
  { id: "26", title: "Billie Jean", artist: "Michael Jackson", videoId: "Zi_XLOBDo_Y", thumbnail: "https://i.ytimg.com/vi/Zi_XLOBDo_Y/mqdefault.jpg", category: "Classic" },
  { id: "27", title: "Imagine", artist: "John Lennon", videoId: "YkgkThdzX-8", thumbnail: "https://i.ytimg.com/vi/YkgkThdzX-8/mqdefault.jpg", category: "Classic" },
  { id: "28", title: "What a Wonderful World", artist: "Louis Armstrong", videoId: "VqhCQZaH4Vs", thumbnail: "https://i.ytimg.com/vi/VqhCQZaH4Vs/mqdefault.jpg", category: "Classic" },
  { id: "29", title: "Stand By Me", artist: "Ben E. King", videoId: "hwZNL7QVJjE", thumbnail: "https://i.ytimg.com/vi/hwZNL7QVJjE/mqdefault.jpg", category: "Classic" },
  { id: "30", title: "Yesterday", artist: "The Beatles", videoId: "NrgmdOz227I", thumbnail: "https://i.ytimg.com/vi/NrgmdOz227I/mqdefault.jpg", category: "Classic" },
];

const MusicPage: React.FC = () => {
  const { toast } = useToast();
  const [musicUrl, setMusicUrl] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Pop", "Rock", "Hip Hop", "Electronic", "Latin", "Classic"];

  const filteredSongs = useMemo(() => {
    let filtered = popularSongs;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(song => song.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory]);

  const handlePlaySong = (song: Song) => {
    setCurrentVideoId(song.videoId);
    setCurrentSong(song);
    toast({
      title: "Now Playing",
      description: `${song.title} - ${song.artist}`,
    });
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleLoadCustomMusic = () => {
    if (!musicUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a YouTube music URL",
        variant: "destructive",
      });
      return;
    }

    const videoId = extractYouTubeId(musicUrl);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    setCurrentVideoId(videoId);
    setCurrentSong(null);
    setMusicUrl("");
    toast({
      title: "Music loaded",
      description: "Your custom music is now playing",
    });
  };

  const getYouTubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  };

  return (
    <div className="min-h-screen gradient-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
            Music Player
          </h1>
          <p className="text-muted-foreground">Discover and listen to your favorite music</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  {currentSong ? `${currentSong.title} - ${currentSong.artist}` : "Music Player"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentVideoId ? (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideoId)}
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
                      <p className="text-sm text-muted-foreground mt-2">Select a song to start</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Custom URL Input */}
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Load Custom Music</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste YouTube URL here"
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoadCustomMusic()}
                  />
                  <Button onClick={handleLoadCustomMusic}>
                    Load
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Music Library */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Music Library</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="w-full grid grid-cols-3 mb-4">
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Pop">Pop</TabsTrigger>
                    <TabsTrigger value="Rock">Rock</TabsTrigger>
                  </TabsList>
                  <TabsList className="w-full grid grid-cols-4 mb-4">
                    <TabsTrigger value="Hip Hop">Hip Hop</TabsTrigger>
                    <TabsTrigger value="Electronic">EDM</TabsTrigger>
                    <TabsTrigger value="Latin">Latin</TabsTrigger>
                    <TabsTrigger value="Classic">Classic</TabsTrigger>
                  </TabsList>
                  
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-2">
                      {filteredSongs.length > 0 ? (
                        filteredSongs.map((song) => (
                          <Card
                            key={song.id}
                            className={`cursor-pointer hover:bg-primary/10 transition-colors ${
                              currentVideoId === song.videoId ? 'bg-primary/20 border-primary' : ''
                            }`}
                            onClick={() => handlePlaySong(song)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={song.thumbnail}
                                  alt={song.title}
                                  className="w-16 h-16 rounded object-cover flex-shrink-0"
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
                                    handlePlaySong(song);
                                  }}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Music className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-muted-foreground">No songs found</p>
                          <p className="text-sm text-muted-foreground mt-1">Try a different search</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;
