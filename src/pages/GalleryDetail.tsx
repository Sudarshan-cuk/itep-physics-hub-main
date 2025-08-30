import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const GalleryDetail = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGalleryDetails = async () => {
      setLoading(true);
      const { data: galleryData, error: galleryError } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single();

      if (galleryError) {
        toast({
          title: 'Error',
          description: galleryError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      setGallery(galleryData);

      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', id)
        .order('created_at', { ascending: false });

      if (photosError) {
        toast({
          title: 'Error',
          description: photosError.message,
          variant: 'destructive',
        });
      } else {
        setPhotos(photosData);
      }
      setLoading(false);
    };

    fetchGalleryDetails();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto py-10">Loading gallery...</div>;
  }

  if (!gallery) {
    return <div className="container mx-auto py-10">Gallery not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">{gallery.name}</h1>
      <p className="text-lg text-gray-700 mb-6">{gallery.description}</p>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <p>No photos in this gallery yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img src={photo.image_url} alt={photo.description || 'Gallery photo'} className="w-full h-48 object-cover rounded-md" />
                  {photo.description && <p className="mt-2 text-sm text-gray-600">{photo.description}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};