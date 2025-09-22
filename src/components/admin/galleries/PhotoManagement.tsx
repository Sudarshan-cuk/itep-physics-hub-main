import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Upload as UploadIcon, X as XIcon } from 'lucide-react';

export const PhotoManagement = ({ galleryId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [shouldCropSquare, setShouldCropSquare] = useState(false);
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

  const onFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!galleryId) {
      toast({ title: 'No gallery selected', description: 'Please select a gallery first.', variant: 'destructive' });
      return;
    }
    if (!selectedFile) {
      toast({ title: 'No file selected', description: 'Choose an image to upload.', variant: 'destructive' });
      return;
    }

    setUploading(true);

    // Optionally crop to square using a canvas (center-crop)
    let fileToUpload: File | Blob = selectedFile;
    if (shouldCropSquare) {
      try {
        setStatusMessage('Processing image (crop to square)...');
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = reject;
          image.src = URL.createObjectURL(selectedFile!);
        });

        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = Math.floor((img.naturalWidth - side) / 2);
        const sy = Math.floor((img.naturalHeight - side) / 2);

        const canvas = document.createElement('canvas');
        canvas.width = side;
        canvas.height = side;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side);
        fileToUpload = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b as Blob), selectedFile!.type || 'image/jpeg', 0.92));
        URL.revokeObjectURL(img.src);
      } catch (err: any) {
        toast({ title: 'Image processing failed', description: err.message || String(err), variant: 'destructive' });
        setUploading(false);
        setStatusMessage(null);
        return;
      }
    }

    setStatusMessage('Uploading image to storage...');

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    // Path should be relative to the bucket (do not prefix with bucket name)
    const objectPath = `${galleryId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery_images')
      .upload(objectPath, fileToUpload);

    if (uploadError) {
      toast({
        title: 'Error uploading image',
        description: uploadError.message,
        variant: 'destructive',
      });
      setUploading(false);
      setStatusMessage(null);
      return;
    }

    setStatusMessage('Generating public URL...');
    const { data: publicUrlData } = supabase.storage
      .from('gallery_images')
      .getPublicUrl(objectPath);

    const imageUrl = publicUrlData.publicUrl;

    setStatusMessage('Saving photo record...');
    const { error: insertError } = await supabase
      .from('photos')
      .insert({ gallery_id: galleryId, image_url: imageUrl });

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
      setSelectedFile(null);
      setShouldCropSquare(false);
      fetchPhotos(galleryId);
    }
    setUploading(false);
    setStatusMessage(null);
  };

  const handleDeletePhoto = async (photoId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      // Derive object path relative to bucket. Public URL usually contains
      // "/object/public/gallery_images/<objectPath>". Fallback to splitting by bucket id.
      let objectPath = '';
      const marker = '/object/public/gallery_images/';
      const idx = imageUrl.indexOf(marker);
      if (idx !== -1) {
        objectPath = imageUrl.substring(idx + marker.length);
      } else {
        const parts = imageUrl.split('gallery_images/');
        objectPath = parts[1] || '';
      }

      const { error: deleteStorageError } = await supabase.storage
        .from('gallery_images')
        .remove([objectPath]);

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
              <div className="flex items-center gap-3">
                <Input type="file" accept="image/*" onChange={onFileChange} disabled={uploading} />
                <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="flex items-center gap-2">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                {selectedFile && !uploading && (
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)} title="Clear selection">
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="accent-primary" checked={shouldCropSquare} onChange={(e) => setShouldCropSquare(e.target.checked)} />
                  Crop to square before upload
                </label>
              </div>
              {selectedFile && !uploading && (
                <p className="text-sm text-muted-foreground mt-2">Selected: {selectedFile.name}</p>
              )}
              {uploading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{statusMessage || 'Uploading...'}</span>
                </div>
              )}
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
                <img src={photo.image_url} alt={photo.caption || 'Gallery photo'} className="w-full h-32 object-cover rounded-md" />
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