import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { BookOpen, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, signOut, isAdmin, profile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    ...(user ? [{ name: 'Notes', href: '/notes' }] : []),
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">ITEP Physics Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {profile?.full_name || user.email}
                  </span>
                  {isAdmin && (
                    <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <Button onClick={signOut} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default">Sign In</Button>
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
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center px-3 py-2">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-sm text-muted-foreground">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  <Button 
                    onClick={signOut} 
                    variant="outline" 
                    size="sm" 
                    className="ml-3 mt-2"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border">
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="default" className="ml-3">Sign In</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};