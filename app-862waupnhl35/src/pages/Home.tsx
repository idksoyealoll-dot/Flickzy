import React from "react";
import { Link } from "react-router-dom";
import { Film, Music, Gamepad2, Video, MessageCircle, Users, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Home: React.FC = () => {
  const features = [
    {
      icon: <Film className="h-12 w-12 text-primary" />,
      title: "Movie Streaming",
      description: "Stream movies together with friends via YouTube links, direct uploads, or other sources. Synchronized playback keeps everyone in sync.",
      link: "/movies"
    },
    {
      icon: <Music className="h-12 w-12 text-primary" />,
      title: "Music Together",
      description: "Listen to your favorite songs with friends in real-time. Share the vibe and enjoy music as one.",
      link: "/music"
    },
    {
      icon: <Gamepad2 className="h-12 w-12 text-primary" />,
      title: "Multiplayer Games",
      description: "Play exciting multiplayer games with your squad. Compete, collaborate, and have fun together.",
      link: "/games"
    },
    {
      icon: <Video className="h-12 w-12 text-primary" />,
      title: "Video Calls",
      description: "See your friends while watching, listening, or playing. Real-time video calls integrated seamlessly.",
      link: "/movies"
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-primary" />,
      title: "Live Chat",
      description: "Chat with your group in real-time. Share reactions, jokes, and moments as they happen.",
      link: "/movies"
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Social Rooms",
      description: "Create private rooms for your friends and family. Your space, your rules, your entertainment.",
      link: "/movies"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg-dark">
      <section className="relative overflow-hidden py-20 xl:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">The Future of Social Entertainment</span>
            </div>
            
            <h1 className="text-5xl xl:text-7xl font-bold tracking-tight">
              <span className="neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
                Flickzy
              </span>
            </h1>
            
            <p className="text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Watch movies, play games, and listen to music together with friends and family in real-time. 
              The perfect blend of Discord, Netflix, and Spotify.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/movies">
                <Button size="lg" className="text-lg px-8 py-6 card-glow">
                  <Play className="mr-2 h-5 w-5" />
                  Start Watching
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl xl:text-5xl font-bold mb-4 text-foreground">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All your favorite entertainment features in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300 hover:card-glow cursor-pointer group">
                  <CardHeader>
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 gradient-bg-purple">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl xl:text-5xl font-bold mb-6 text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users already enjoying synchronized entertainment experiences
          </p>
          <Link to="/movies">
            <Button size="lg" className="text-lg px-8 py-6 card-glow">
              <Play className="mr-2 h-5 w-5" />
              Launch Flickzy
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
