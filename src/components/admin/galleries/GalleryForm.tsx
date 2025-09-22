import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Upload as UploadIcon, X as XIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  title: z.string().min(2, { message: 'Gallery title must be at least 2 characters.' }),
  description: z.string().optional(),
});

export const GalleryForm = ({ gallery, onSuccess }) => {
  const { toast } = useToast();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallery?.title || '',
      description: gallery?.description || '',
    },
  });

  useEffect(() => {
    if (gallery) {
      form.reset({
        title: gallery.title,
        description: gallery.description || '',
      });
    }
  }, [gallery, form]);

  const onSubmit = async (values) => {
    try {
      let targetGalleryId = gallery?.id as string | undefined;
      if (gallery) {
        const { error } = await supabase
          .from('galleries')
          .update(values)
          .eq('id', gallery.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('galleries')
          .insert(values)
          .select('id')
          .single();
        if (error) throw error;
        targetGalleryId = data.id;
      }

      toast({
        title: 'Success',
        description: `Gallery ${gallery ? 'updated' : 'created'} successfully.`,
      });

      if (coverFile && targetGalleryId) {
        await uploadCoverForGallery(targetGalleryId, coverFile);
      }

      onSuccess();
      form.reset();
      setCoverFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const uploadCoverForGallery = async (galleryId: string, file: File) => {
    try {
      setUploadingCover(true);
      setUploadStatus('Uploading cover image to storage...');

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const objectPath = `covers/${galleryId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery_images')
        .upload(objectPath, file);
      if (uploadError) throw uploadError;

      setUploadStatus('Generating public URL...');
      const { data: publicUrlData } = supabase.storage
        .from('gallery_images')
        .getPublicUrl(objectPath);
      const coverUrl = publicUrlData.publicUrl;

      setUploadStatus('Saving cover image URL...');
      const { error: updateError } = await supabase
        .from('galleries')
        .update({ cover_image_url: coverUrl })
        .eq('id', galleryId);
      if (updateError) throw updateError;

      toast({ title: 'Cover image updated', description: 'Cover image set successfully.' });
    } catch (err) {
      toast({ title: 'Cover upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingCover(false);
      setUploadStatus(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter gallery title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter gallery description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Cover image uploader */}
        <div className="space-y-2">
          <FormLabel>Cover Image</FormLabel>
          <div className="flex items-center gap-3">
            <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} disabled={uploadingCover} />
            <Button
              type="button"
              onClick={async () => {
                if (!coverFile) {
                  toast({ title: 'No file selected', description: 'Choose an image to upload.', variant: 'destructive' });
                  return;
                }
                if (gallery?.id) {
                  await uploadCoverForGallery(gallery.id, coverFile);
                  setCoverFile(null);
                } else {
                  toast({ title: 'Save gallery first', description: 'Create the gallery, then upload a cover.', variant: 'destructive' });
                }
              }}
              disabled={uploadingCover || (!gallery?.id)}
              className="flex items-center gap-2"
            >
              {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadIcon className="h-4 w-4" />}
              {uploadingCover ? 'Uploading...' : 'Upload Cover'}
            </Button>
            {coverFile && !uploadingCover && (
              <Button variant="ghost" size="icon" type="button" onClick={() => setCoverFile(null)} title="Clear selection">
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          {coverFile && !uploadingCover && (
            <p className="text-sm text-muted-foreground">Selected: {coverFile.name}</p>
          )}
          {uploadingCover && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{uploadStatus || 'Uploading...'}</span>
            </div>
          )}
          {gallery?.cover_image_url && (
            <div className="mt-2">
              <FormLabel className="text-xs text-muted-foreground">Current cover preview</FormLabel>
              <img src={gallery.cover_image_url} alt="Cover preview" className="mt-1 h-24 w-24 object-cover rounded" />
            </div>
          )}
        </div>

        <Button type="submit">{gallery ? 'Update Gallery' : 'Create Gallery'}</Button>
      </form>
    </Form>
  );
};