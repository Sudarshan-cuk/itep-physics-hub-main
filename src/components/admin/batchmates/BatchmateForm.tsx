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
  name: z.string().min(2, { message: 'Batchmate name must be at least 2 characters.' }),
  graduation_year: z.number().int().min(1900).max(2100, { message: 'Invalid graduation year.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  social_media_links: z.string().optional(), // Storing as JSON string
});

export const BatchmateForm = ({ batchmate, onSuccess }) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: batchmate?.name || '',
      graduation_year: batchmate?.graduation_year || new Date().getFullYear(),
      email: batchmate?.email || '',
      phone: batchmate?.phone || '',
      social_media_links: batchmate?.social_media_links ? JSON.stringify(batchmate.social_media_links, null, 2) : '',
    },
  });

  useEffect(() => {
    if (batchmate) {
      form.reset({
        name: batchmate.name,
        graduation_year: batchmate.graduation_year,
        email: batchmate.email,
        phone: batchmate.phone || '',
        social_media_links: batchmate.social_media_links ? JSON.stringify(batchmate.social_media_links, null, 2) : '',
      });
    }
  }, [batchmate, form]);

  const onSubmit = async (values) => {
    try {
      let parsedSocialMediaLinks = null;
      if (values.social_media_links) {
        try {
          parsedSocialMediaLinks = JSON.parse(values.social_media_links);
        } catch (parseError) {
          toast({
            title: 'Error',
            description: 'Invalid JSON for social media links.',
            variant: 'destructive',
          });
          return;
        }
      }

      const dataToSubmit = {
        ...values,
        social_media_links: parsedSocialMediaLinks,
      };

      let error = null;
      if (batchmate) {
        // Update existing batchmate
        const { error: updateError } = await supabase
          .from('batchmates')
          .update(dataToSubmit)
          .eq('id', batchmate.id);
        error = updateError;
      } else {
        // Create new batchmate
        const { error: createError } = await supabase
          .from('batchmates')
          .insert(dataToSubmit);
        error = createError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Batchmate ${batchmate ? 'updated' : 'created'} successfully.`,
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter batchmate name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="graduation_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Year</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter graduation year" {...field} onChange={event => field.onChange(Number(event.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social_media_links"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Media Links (JSON, Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder='{"linkedin": "url", "twitter": "url"}' {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{batchmate ? 'Update Batchmate' : 'Create Batchmate'}</Button>
      </form>
    </Form>
  );
};