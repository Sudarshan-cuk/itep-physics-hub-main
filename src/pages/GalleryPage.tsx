import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const GalleryPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGalleries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setGalleries(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchGalleries();
    } else if (!authLoading && !user) {
      setLoading(false); // Stop loading if no user and auth is done
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">Our Galleries</h1>
        <div>Loading galleries...</div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">Our Galleries</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Please log in to view the galleries.
        </p>
        <Link to="/auth">
          <Button>Login</Button>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Our Galleries</h1>
      {galleries.length === 0 ? (
        <p className="text-muted-foreground">No galleries available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Link to={`/gallery/${gallery.id}`} key={gallery.id}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{gallery.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600">{gallery.description || 'No description available.'}</p>
                  <p className="text-xs text-gray-500 mt-2">Created: {new Date(gallery.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
  </PageContainer>
  );
};