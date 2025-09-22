import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Upload as UploadIcon, X as XIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const PhotoManagement = ({ galleryId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  // Manual crop state
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffsetX, setCropOffsetX] = useState(0); // -1..1 range
  const [cropOffsetY, setCropOffsetY] = useState(0); // -1..1 range
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
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
    setCroppedBlob(null);
    setCropPreviewUrl(file ? URL.createObjectURL(file) : null);
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

    // Use cropped blob if user applied crop; else original file
    let fileToUpload: File | Blob = croppedBlob || selectedFile!;

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
      setCroppedBlob(null);
      if (cropPreviewUrl) URL.revokeObjectURL(cropPreviewUrl);
      setCropPreviewUrl(null);
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
              {selectedFile && (
                <div className="mt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsCropOpen(true)}>
                    Open Crop Tool
                  </Button>
                </div>
              )}
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

    {/* Crop Modal */}
    <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cropPreviewUrl ? (
            <div className="w-full bg-muted/20 rounded flex items-center justify-center overflow-hidden">
              <img
                src={cropPreviewUrl}
                alt="Crop preview"
                className="max-h-[24rem] w-auto object-contain"
                style={{ transform: `translate(${cropOffsetX * 10}%, ${cropOffsetY * 10}%) scale(${cropZoom})` }}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a file to crop.</p>
          )}

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Zoom</label>
            <input type="range" min="1" max="3" step="0.01" value={cropZoom} onChange={(e) => setCropZoom(parseFloat(e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Horizontal</label>
              <input type="range" min="-1" max="1" step="0.01" value={cropOffsetX} onChange={(e) => setCropOffsetX(parseFloat(e.target.value))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Vertical</label>
              <input type="range" min="-1" max="1" step="0.01" value={cropOffsetY} onChange={(e) => setCropOffsetY(parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsCropOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!selectedFile) return;
                // Produce cropped square using zoom and offsets
                const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                  const image = new Image();
                  image.onload = () => resolve(image);
                  image.onerror = reject;
                  image.src = URL.createObjectURL(selectedFile);
                });

                const side = Math.min(img.naturalWidth, img.naturalHeight);
                const canvas = document.createElement('canvas');
                canvas.width = side;
                canvas.height = side;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Compute source rect based on zoom and offsets
                const visibleSide = side / cropZoom;
                const centerX = img.naturalWidth / 2 + cropOffsetX * (img.naturalWidth - visibleSide) / 2;
                const centerY = img.naturalHeight / 2 + cropOffsetY * (img.naturalHeight - visibleSide) / 2;
                const sx = Math.max(0, Math.min(img.naturalWidth - visibleSide, centerX - visibleSide / 2));
                const sy = Math.max(0, Math.min(img.naturalHeight - visibleSide, centerY - visibleSide / 2));

                ctx.drawImage(img, sx, sy, visibleSide, visibleSide, 0, 0, side, side);
                const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), selectedFile.type || 'image/jpeg', 0.92));
                if (blob) {
                  setCroppedBlob(blob);
                  toast({ title: 'Crop applied', description: 'Ready to upload cropped image.' });
                }
                URL.revokeObjectURL(img.src);
                setIsCropOpen(false);
              }}
            >
              Apply Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};