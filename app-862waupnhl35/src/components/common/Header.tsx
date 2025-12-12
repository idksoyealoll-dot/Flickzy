import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import routes from "../../routes";
import { Button } from "@/components/ui/button";
import { supabase } from "@/db/supabase";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const navigation = routes.filter((route) => route.visible !== false);

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="gradient-bg-purple border-b border-primary/20 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-3xl font-bold neon-glow tracking-wider" style={{ fontFamily: 'Lacquer, cursive' }}>
                Flickzy
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
              >
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={`text-base font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm" className="text-foreground">
                  <User className="h-4 w-4 mr-2" />
                  {user.email?.split('@')[0]}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login" className="ml-4">
                <Button variant="default">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className={`w-full justify-start text-base font-medium ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Logged in as: {user.email?.split('@')[0]}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
