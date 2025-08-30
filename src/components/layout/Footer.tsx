import { Link } from 'react-router-dom';

export function Footer() {
  const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-card border-t border-border mt-8 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">ITEP HUB</h3>
            <p className="text-muted-foreground text-sm">
              Your go-to resource for physics study materials, research, and community.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {publicNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/follow-us"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Follow Us
                </Link>
              </li>
              {/* Add more social media links here */}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} ITEP HUB. All rights reserved.
        </div>
      </div>
    </footer>
  );
}