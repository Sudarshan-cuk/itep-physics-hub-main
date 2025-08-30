import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

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

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Our Galleries</h1>
      {loading ? (
        <div>Loading galleries...</div>
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
    </div>
  );
};