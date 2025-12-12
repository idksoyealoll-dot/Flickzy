import React from "react";
import { Heart, Sparkles, Users, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About: React.FC = () => {
  const values = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community First",
      description: "Building connections through shared experiences"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Innovation",
      description: "Pushing boundaries of social entertainment"
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "User Experience",
      description: "Seamless, intuitive, and delightful interactions"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Quality",
      description: "Excellence in every feature we deliver"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl xl:text-6xl font-bold mb-4 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
            About Flickzy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Where entertainment meets connection. Watch, play, and listen together in perfect harmony.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Flickzy reimagines social entertainment by bringing people together through shared experiences. 
                We believe that watching movies, playing games, and listening to music is better when shared with 
                friends and family, no matter where they are in the world.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Heart className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To create the ultimate social entertainment platform that combines the best features of streaming 
                services, gaming platforms, and communication tools into one seamless experience. We're building 
                a space where distance doesn't matter and memories are made together.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 neon-glow" style={{ fontFamily: 'Lacquer, cursive' }}>
            Meet the Co-Founders
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 card-glow overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <img 
                  src="https://miaoda-conversation-file.s3cdn.medo.dev/user-862w0bvndbsw/conv-862waupnhl34/20251212/file-863gb8vvzhts.jpg"
                  alt="Anushka - Co-Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Anushka</CardTitle>
                <CardDescription className="text-base">Co-Founder & Creative Director</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Frontend Development</Badge>
                  <Badge variant="secondary">UI/UX Design</Badge>
                  <Badge variant="secondary">Social Media</Badge>
                  <Badge variant="secondary">Brand Strategy</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Anushka is the creative force behind Flickzy's stunning visual identity and user experience. 
                  As a talented frontend developer and designer, she crafts every pixel with precision and passion. 
                  Beyond coding beautiful interfaces, she manages Flickzy's social media presence, connecting with 
                  our community and building our brand story. Her creative vision and attention to detail ensure 
                  that every interaction on Flickzy feels magical and intuitive.
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-primary font-semibold">
                    "Design is not just what it looks like. Design is how it works and how it makes you feel."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 card-glow overflow-hidden">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <img 
                  src="https://miaoda-conversation-file.s3cdn.medo.dev/user-862w0bvndbsw/conv-862waupnhl34/20251212/file-863gxlwhxpfk.jpg"
                  alt="Varun - Co-Founder"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Varun</CardTitle>
                <CardDescription className="text-base">Co-Founder & Technical Architect</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Backend Development</Badge>
                  <Badge variant="secondary">Database Architecture</Badge>
                  <Badge variant="secondary">System Design</Badge>
                  <Badge variant="secondary">Infrastructure</Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Varun is the technical backbone of Flickzy, architecting the robust infrastructure that powers 
                  our platform. As a skilled backend developer and database expert, he ensures that every feature 
                  runs smoothly and scales effortlessly. From real-time synchronization to secure authentication, 
                  Varun builds the invisible foundation that makes Flickzy reliable and fast. His deep technical 
                  expertise and problem-solving abilities are the pillars that support our entire platform.
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-primary font-semibold">
                    "Great code is invisible. It just works, reliably and efficiently, every single time."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-primary/20 card-glow text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 card-glow">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Join the Flickzy Community</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Be part of the revolution in social entertainment. Create rooms, invite friends, 
              and experience movies, music, and games like never before.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-base px-4 py-2">
                🎬 Watch Together
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                🎮 Play Together
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                🎵 Listen Together
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                💬 Chat Together
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
