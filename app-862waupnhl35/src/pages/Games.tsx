import React, { useState, useMemo } from "react";
import { Gamepad2, Maximize2, Search, Play, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Game {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  thumbnail: string;
}

const popularGames: Game[] = [
  // Puzzle
  {
    id: "1",
    name: "2048",
    url: "https://play2048.co/",
    description: "Combine numbers to reach 2048",
    category: "Puzzle",
    thumbnail: "https://play2048.co/meta/apple-touch-icon.png"
  },
  {
    id: "2",
    name: "Tetris",
    url: "https://tetris.com/play-tetris",
    description: "Classic block puzzle game",
    category: "Puzzle",
    thumbnail: "https://tetris.com/favicon.ico"
  },
  {
    id: "3",
    name: "Sudoku",
    url: "https://sudoku.com/",
    description: "Number puzzle game",
    category: "Puzzle",
    thumbnail: "https://sudoku.com/favicon.ico"
  },
  {
    id: "4",
    name: "Minesweeper",
    url: "https://minesweeperonline.com/",
    description: "Classic mine detection game",
    category: "Puzzle",
    thumbnail: "https://minesweeperonline.com/favicon.ico"
  },
  {
    id: "5",
    name: "Wordle",
    url: "https://www.nytimes.com/games/wordle/index.html",
    description: "Guess the 5-letter word",
    category: "Puzzle",
    thumbnail: "https://www.nytimes.com/games-assets/v2/metadata/nyt-games-icon.png"
  },
  
  // Arcade
  {
    id: "6",
    name: "Pac-Man",
    url: "https://www.google.com/logos/2010/pacman10-i.html",
    description: "Classic arcade game",
    category: "Arcade",
    thumbnail: "https://www.google.com/favicon.ico"
  },
  {
    id: "7",
    name: "Snake",
    url: "https://www.google.com/fbx?fbx=snake_arcade",
    description: "Classic snake game",
    category: "Arcade",
    thumbnail: "https://www.google.com/favicon.ico"
  },
  {
    id: "8",
    name: "Flappy Bird",
    url: "https://flappybird.io/",
    description: "Tap to fly through pipes",
    category: "Arcade",
    thumbnail: "https://flappybird.io/favicon.ico"
  },
  {
    id: "9",
    name: "Dino Run",
    url: "https://chromedino.com/",
    description: "Chrome's offline dinosaur game",
    category: "Arcade",
    thumbnail: "https://chromedino.com/favicon.ico"
  },
  {
    id: "10",
    name: "Space Invaders",
    url: "https://www.pacman1.net/space-invaders.php",
    description: "Classic space shooter",
    category: "Arcade",
    thumbnail: "https://www.pacman1.net/favicon.ico"
  },
  
  // Strategy
  {
    id: "11",
    name: "Chess",
    url: "https://www.chess.com/play/computer",
    description: "Play chess against AI",
    category: "Strategy",
    thumbnail: "https://www.chess.com/favicon.ico"
  },
  {
    id: "12",
    name: "Checkers",
    url: "https://www.247checkers.com/",
    description: "Classic checkers game",
    category: "Strategy",
    thumbnail: "https://www.247checkers.com/favicon.ico"
  },
  {
    id: "13",
    name: "Tic Tac Toe",
    url: "https://playtictactoe.org/",
    description: "Classic X and O game",
    category: "Strategy",
    thumbnail: "https://playtictactoe.org/favicon.ico"
  },
  {
    id: "14",
    name: "Connect 4",
    url: "https://www.mathsisfun.com/games/connect4.html",
    description: "Connect four in a row",
    category: "Strategy",
    thumbnail: "https://www.mathsisfun.com/favicon.ico"
  },
  {
    id: "15",
    name: "Reversi",
    url: "https://cardgames.io/reversi/",
    description: "Strategy board game",
    category: "Strategy",
    thumbnail: "https://cardgames.io/favicon.ico"
  },
  
  // Action
  {
    id: "16",
    name: "Slope",
    url: "https://slope-game.github.io/",
    description: "Roll down the slope",
    category: "Action",
    thumbnail: "https://slope-game.github.io/favicon.ico"
  },
  {
    id: "17",
    name: "Run 3",
    url: "https://www.coolmathgames.com/0-run-3",
    description: "Run through space tunnels",
    category: "Action",
    thumbnail: "https://www.coolmathgames.com/favicon.ico"
  },
  {
    id: "18",
    name: "Subway Surfers",
    url: "https://poki.com/en/g/subway-surfers",
    description: "Run and dodge trains",
    category: "Action",
    thumbnail: "https://poki.com/favicon.ico"
  },
  {
    id: "19",
    name: "Temple Run 2",
    url: "https://poki.com/en/g/temple-run-2",
    description: "Endless running adventure",
    category: "Action",
    thumbnail: "https://poki.com/favicon.ico"
  },
  {
    id: "20",
    name: "Geometry Dash",
    url: "https://scratch.mit.edu/projects/105500895/",
    description: "Rhythm-based platformer",
    category: "Action",
    thumbnail: "https://scratch.mit.edu/favicon.ico"
  },
  
  // Card
  {
    id: "21",
    name: "Solitaire",
    url: "https://www.solitr.com/",
    description: "Classic card game",
    category: "Card",
    thumbnail: "https://www.solitr.com/favicon.ico"
  },
  {
    id: "22",
    name: "Spider Solitaire",
    url: "https://www.247solitaire.com/spider-solitaire",
    description: "Two-deck solitaire",
    category: "Card",
    thumbnail: "https://www.247solitaire.com/favicon.ico"
  },
  {
    id: "23",
    name: "FreeCell",
    url: "https://www.freecell.net/",
    description: "Strategic solitaire variant",
    category: "Card",
    thumbnail: "https://www.freecell.net/favicon.ico"
  },
  {
    id: "24",
    name: "Poker",
    url: "https://www.247freepoker.com/",
    description: "Texas Hold'em Poker",
    category: "Card",
    thumbnail: "https://www.247freepoker.com/favicon.ico"
  },
  {
    id: "25",
    name: "Blackjack",
    url: "https://www.247blackjack.com/",
    description: "Classic casino card game",
    category: "Card",
    thumbnail: "https://www.247blackjack.com/favicon.ico"
  },
  
  // Sports
  {
    id: "26",
    name: "Basketball Stars",
    url: "https://poki.com/en/g/basketball-stars",
    description: "1v1 basketball game",
    category: "Sports",
    thumbnail: "https://poki.com/favicon.ico"
  },
  {
    id: "27",
    name: "Soccer Skills",
    url: "https://poki.com/en/g/soccer-skills-world-cup",
    description: "Football penalty shootout",
    category: "Sports",
    thumbnail: "https://poki.com/favicon.ico"
  },
  {
    id: "28",
    name: "8 Ball Pool",
    url: "https://www.miniclip.com/games/8-ball-pool-multiplayer/en/",
    description: "Online pool game",
    category: "Sports",
    thumbnail: "https://www.miniclip.com/favicon.ico"
  },
  {
    id: "29",
    name: "Golf Battle",
    url: "https://poki.com/en/g/golf-battle",
    description: "Multiplayer mini golf",
    category: "Sports",
    thumbnail: "https://poki.com/favicon.ico"
  },
  {
    id: "30",
    name: "Bowling",
    url: "https://www.agame.com/game/bowling",
    description: "Strike! Bowling game",
    category: "Sports",
    thumbnail: "https://www.agame.com/favicon.ico"
  },
];

const GamesPage: React.FC = () => {
  const { toast } = useToast();
  const [gameUrl, setGameUrl] = useState("");
  const [currentGameUrl, setCurrentGameUrl] = useState<string | null>(null);
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Puzzle", "Arcade", "Strategy", "Action", "Card", "Sports"];

  const filteredGames = useMemo(() => {
    let filtered = popularGames;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(game => game.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [searchQuery, selectedCategory]);

  const handlePlayGame = (game: Game) => {
    setCurrentGameUrl(game.url);
    setCurrentGame(game);
    toast({
      title: "Game Loaded",
      description: `${game.name} is ready to play`,
    });
  };

  const handleLoadCustomGame = () => {
    if (!gameUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a game URL",
        variant: "destructive",
      });
      return;
    }

    setCurrentGameUrl(gameUrl);
    setCurrentGame(null);
    setGameUrl("");
    toast({
      title: "Game loaded",
      description: "Your custom game is ready to play",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen gradient-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
            Browser Games
          </h1>
          <p className="text-muted-foreground">Play your favorite games instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'lg:col-span-2'}`}>
            <Card className={`${isFullscreen ? 'h-full rounded-none' : 'bg-card/50 backdrop-blur-sm border-primary/20'}`}>
              <CardHeader className={isFullscreen ? 'absolute top-0 left-0 right-0 z-10 bg-black/80' : ''}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5" />
                    {currentGame ? currentGame.name : "Game Player"}
                  </CardTitle>
                  {currentGameUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreen}
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className={isFullscreen ? 'h-full pt-16' : ''}>
                {currentGameUrl ? (
                  <div className={`${isFullscreen ? 'h-full' : 'aspect-video'} bg-black rounded-lg overflow-hidden`}>
                    <iframe
                      src={currentGameUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No game loaded</p>
                      <p className="text-sm text-muted-foreground mt-2">Select a game to start playing</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Custom URL Input */}
            {!isFullscreen && (
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Load Custom Game</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste game URL here"
                      value={gameUrl}
                      onChange={(e) => setGameUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLoadCustomGame()}
                    />
                    <Button onClick={handleLoadCustomGame}>
                      Load
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Library */}
          {!isFullscreen && (
            <div className="lg:col-span-1">
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle>Game Library</CardTitle>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search games..."
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
                      <TabsTrigger value="Puzzle">Puzzle</TabsTrigger>
                      <TabsTrigger value="Arcade">Arcade</TabsTrigger>
                    </TabsList>
                    <TabsList className="w-full grid grid-cols-4 mb-4">
                      <TabsTrigger value="Strategy">Strategy</TabsTrigger>
                      <TabsTrigger value="Action">Action</TabsTrigger>
                      <TabsTrigger value="Card">Card</TabsTrigger>
                      <TabsTrigger value="Sports">Sports</TabsTrigger>
                    </TabsList>
                    
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-2">
                        {filteredGames.length > 0 ? (
                          filteredGames.map((game) => (
                            <Card
                              key={game.id}
                              className={`cursor-pointer hover:bg-primary/10 transition-colors ${
                                currentGameUrl === game.url ? 'bg-primary/20 border-primary' : ''
                              }`}
                              onClick={() => handlePlayGame(game)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
                                    <Gamepad2 className="h-6 w-6 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{game.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">{game.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{game.category}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlayGame(game);
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
                            <Gamepad2 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-muted-foreground">No games found</p>
                            <p className="text-sm text-muted-foreground mt-1">Try a different search</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;
