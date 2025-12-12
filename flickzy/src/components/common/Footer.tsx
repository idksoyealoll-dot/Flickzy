import React from "react";
import { Film, Music, Gamepad2, Video } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="gradient-bg-purple border-t border-primary/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold neon-glow mb-4" style={{ fontFamily: 'Lacquer, cursive' }}>
              Flickzy
            </h3>
            <p className="text-muted-foreground max-w-md">
              The ultimate social entertainment platform combining streaming, gaming, and real-time connections. Watch together, play together, stay together.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Features
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Film className="h-4 w-4 text-primary" />
                <span>Movie Streaming</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                <span>Music Player</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-primary" />
                <span>Multiplayer Games</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-primary" />
                <span>Video Calls</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Connect
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Join our community</p>
              <p>Share experiences</p>
              <p>Stay synchronized</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary/20 text-center text-muted-foreground">
          <p>
            {currentYear} Flickzy
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
