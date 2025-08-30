import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    }
  };

  const navItems = [
    { name: 'Home', path: '/', public: true },
    { name: 'About Us', path: '/about', public: true },
    { name: 'Blog', path: '/blog', public: true },
    { name: 'Gallery', path: '/gallery', public: true },
    { name: 'Contact', path: '/contact', public: true },
    { name: 'Study Notes', path: '/notes', public: false },
    { name: 'Research Papers', path: '/research-papers', public: false },
    { name: 'Lab Reports', path: '/lab-reports', public: false },
    { name: 'Assignments', path: '/assignments', public: false },
  ];

  // Add "My Account" for logged-in users
  if (user) {
    navItems.push({ name: 'My Account', path: '/my-account', public: false });
  }

  // Add admin dashboard for admin users
  if (profile?.role === 'admin') {
    navItems.splice(3, 0,
      { name: 'Dashboard', path: '/admin', public: false },
      { name: 'Manage Galleries', path: '/admin/galleries', public: false }
    );
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary">ITEP Physics Hub</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (!item.public && !user) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {profile?.full_name} ({profile?.role})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navItems.map((item) => {
                if (!item.public && !user) return null;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {user ? (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="px-3 mb-3">
                    <p className="text-base font-medium text-foreground">
                      {profile?.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.role}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mx-3 w-[calc(100%-1.5rem)]"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border">
                  <Link
                    to="/auth"
                    className="block px-3 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button className="w-full">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}