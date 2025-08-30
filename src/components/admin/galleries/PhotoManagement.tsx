import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const PhotoManagement = ({ galleryId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const fetchPhotos = async (currentGalleryId) => {
    if (!currentGalleryId) {
      setPhotos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('gallery_id', currentGalleryId);
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPhotos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos(galleryId);
  }, [galleryId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `gallery_images/${galleryId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery_images')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error uploading image',
        description: uploadError.message,
        variant: 'destructive',
      });
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('gallery_images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase
      .from('photos')
      .insert({ gallery_id: galleryId, image_url: imageUrl, user_id: (await supabase.auth.getUser()).data.user.id });

    if (insertError) {
      toast({
        title: 'Error saving photo to database',
        description: insertError.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Photo uploaded and saved successfully.',
      });
      fetchPhotos(galleryId);
    }
    setUploading(false);
  };

  const handleDeletePhoto = async (photoId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      const filePath = imageUrl.split('gallery_images/')[1];

      const { error: deleteStorageError } = await supabase.storage
        .from('gallery_images')
        .remove([filePath]);

      if (deleteStorageError) {
        toast({
          title: 'Error deleting image from storage',
          description: deleteStorageError.message,
          variant: 'destructive',
        });
        return;
      }

      const { error: deleteDbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (deleteDbError) {
        toast({
          title: 'Error deleting photo from database',
          description: deleteDbError.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Photo deleted successfully.',
        });
        fetchPhotos(galleryId);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos in Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {galleryId ? (
            <>
              <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            </>
          ) : (
            <p className="text-sm text-gray-500">Please select a gallery to upload photos.</p>
          )}
        </div>
        {loading ? (
          <div>Loading photos...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img src={photo.image_url} alt={photo.description || 'Gallery photo'} className="w-full h-32 object-cover rounded-md" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeletePhoto(photo.id, photo.image_url)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};