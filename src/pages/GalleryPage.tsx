import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';
import { Button } from '@/components/ui/button';

export const GalleryPage = () => {
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
    fetchGalleries();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <h1 className="text-3xl font-bold mb-6">Our Galleries</h1>
        <div>Loading galleries...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Our Galleries</h1>
      {galleries.length === 0 ? (
        <p className="text-muted-foreground">No galleries available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {galleries.map((gallery) => (
            <Link to={`/gallery/${gallery.id}`} key={gallery.id} className="block">
              <Card className="h-full flex flex-col overflow-hidden">
                {/* Cover image if available */}
                {gallery.cover_image_url ? (
                  <div className="h-48 w-full bg-muted/20 flex items-center justify-center overflow-hidden">
                    <img src={gallery.cover_image_url} alt={gallery.title} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-muted/30 flex items-center justify-center">
                    <span className="text-muted-foreground">No cover image</span>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{gallery.description || 'No description available.'}</p>
                  <p className="text-xs text-gray-500">Created: {new Date(gallery.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
  </PageContainer>
  );
};