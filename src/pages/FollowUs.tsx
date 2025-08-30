import { Layout } from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type SocialAccount = Tables<'social_accounts'>;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getIconComponent = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-10 w-10 text-blue-600 mx-auto mb-4" />;
    case 'twitter':
      return <Twitter className="h-10 w-10 text-blue-400 mx-auto mb-4" />;
    case 'instagram':
      return <Instagram className="h-10 w-10 text-pink-500 mx-auto mb-4" />;
    case 'linkedin':
      return <Linkedin className="h-10 w-10 text-blue-700 mx-auto mb-4" />;
    default:
      return <Globe className="h-10 w-10 text-gray-500 mx-auto mb-4" />;
  }
};

export function FollowUs() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocialAccounts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('social_accounts').select('*').order('display_order', { ascending: true });
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setSocialAccounts(data);
      }
      setLoading(false);
    };

    fetchSocialAccounts();
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Follow Us</h1>
        <p className="text-center text-muted-foreground mb-8">
          Stay connected with ITEP Physics Hub on our social media channels!
        </p>

        {loading ? (
          <div className="text-center">Loading social accounts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialAccounts.map((account) => (
              <Card key={account.id} className="text-center">
                <CardHeader>
                  {getIconComponent(account.platform)}
                  <CardTitle>{capitalize(account.platform)}</CardTitle>
                  <CardDescription>{account.url}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <a href={account.url} target="_blank" rel="noopener noreferrer">
                      Follow on {capitalize(account.platform)}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}