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

const formSchema = z.object({
  name: z.string().min(2, { message: 'Gallery name must be at least 2 characters.' }),
  description: z.string().optional(),
});

export const GalleryForm = ({ gallery, onSuccess }) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: gallery?.name || '',
      description: gallery?.description || '',
    },
  });

  useEffect(() => {
    if (gallery) {
      form.reset({
        name: gallery.name,
        description: gallery.description || '',
      });
    }
  }, [gallery, form]);

  const onSubmit = async (values) => {
    try {
      let error = null;
      if (gallery) {
        // Update existing gallery
        const { error: updateError } = await supabase
          .from('galleries')
          .update(values)
          .eq('id', gallery.id);
        error = updateError;
      } else {
        // Create new gallery
        const { error: createError } = await supabase
          .from('galleries')
          .insert(values);
        error = createError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Gallery ${gallery ? 'updated' : 'created'} successfully.`,
      });
      onSuccess();
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter gallery name" {...field} />
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
        <Button type="submit">{gallery ? 'Update Gallery' : 'Create Gallery'}</Button>
      </form>
    </Form>
  );
};