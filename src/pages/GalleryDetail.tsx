import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/PageContainer';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types'; // Import Tables type

// Define types for Gallery and Photo based on Supabase schema
type Gallery = Tables<'galleries'>;
type Photo = Tables<'photos'>;

export const GalleryDetail = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
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
        setPhotos(photosData || []); // Ensure photosData is an array
      }
      setLoading(false);
    };

    fetchGalleryDetails();
  }, [id]);

  if (loading) {
    return <PageContainer>Loading gallery...</PageContainer>;
  }

  if (!gallery) {
    return <PageContainer>Gallery not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-4">{gallery.title}</h1> {/* Changed gallery.name to gallery.title */}
      <p className="text-lg text-gray-700 mb-6">{gallery.description}</p>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length === 0 ? (
            <p>No photos in this gallery yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group block"
                >
                  <div className="w-full bg-muted/20 rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || 'Gallery photo'}
                      className="max-h-[28rem] w-auto h-auto object-contain"
                      loading="lazy"
                    />
                  </div>
                  {photo.caption && <p className="mt-2 text-sm text-gray-600">{photo.caption}</p>} {/* Changed photo.description to photo.caption */}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
  </PageContainer>
  );
};