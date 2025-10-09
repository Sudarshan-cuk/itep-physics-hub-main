import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const FooterSection = () => {
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocialAccounts = async () => {
      try {
        const { data, error } = await supabase.from('social_accounts').select('*').order('display_order', { ascending: true });
        if (error) {
          throw error;
        }
        setSocialAccounts(data);
      } catch (error: any) {
        toast({
          title: 'Error fetching social accounts',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSocialAccounts();
  }, [toast]);

  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-lg">ITEP HUB</span>
            </div>
            <p className="text-muted-foreground">
              Empowering student teachers across various disciplines at Central University of Kerala.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/notes" className="hover:text-foreground">Study Notes</Link></li>
              <li><Link to="#" className="hover:text-foreground">Research Papers</Link></li>
              <li><Link to="#" className="hover:text-foreground">Lab Reports</Link></li>
              <li><Link to="#" className="hover:text-foreground">Assignments</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Central University of Kerala</li>
              <li>Tejaswini Hills, Periye</li>
              <li>Kasaragod - 671316</li>
              <li>Kerala, India</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {loading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : (
                socialAccounts.map((account) => {
                  let IconComponent;
                  switch (account.platform.toLowerCase()) {
                    case 'facebook':
                      IconComponent = Facebook;
                      break;
                    case 'twitter':
                      IconComponent = Twitter;
                      break;
                    case 'instagram':
                      IconComponent = Instagram;
                      break;
                    case 'linkedin':
                      IconComponent = Linkedin;
                      break;
                    default:
                      IconComponent = null;
                  }
                  return (
                    IconComponent && (
                      <a key={account.id} href={account.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </a>
                    )
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; 2024 ITEP HUB, Central University of Kerala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};