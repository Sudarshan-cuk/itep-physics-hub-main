import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  platform: z.string().min(2, { message: 'Platform name must be at least 2 characters.' }),
  url: z.string().url({ message: 'Invalid URL format.' }),
  icon: z.string().optional(),
  display_order: z.number().int().optional(),
});

export const SocialAccountForm = ({ socialAccount, onSuccess }) => {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: socialAccount?.platform || '',
      url: socialAccount?.url || '',
      icon: socialAccount?.icon || '',
      display_order: socialAccount?.display_order || 0,
    },
  });

  useEffect(() => {
    if (socialAccount) {
      form.reset({
        platform: socialAccount.platform,
        url: socialAccount.url,
        icon: socialAccount.icon || '',
        display_order: socialAccount.display_order || 0,
      });
    }
  }, [socialAccount, form]);

  const onSubmit = async (values) => {
    try {
      const dataToSubmit = {
        ...values,
        display_order: values.display_order || null, // Ensure null for optional integer
      };

      let error = null;
      if (socialAccount) {
        // Update existing social account
        const { error: updateError } = await supabase
          .from('social_accounts')
          .update(dataToSubmit)
          .eq('id', socialAccount.id);
        error = updateError;
      } else {
        // Create new social account
        const { error: createError } = await supabase
          .from('social_accounts')
          .insert(dataToSubmit);
        error = createError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: `Social account ${socialAccount ? 'updated' : 'created'} successfully.`,
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
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Facebook, Twitter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter full URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., fab fa-facebook or image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter display order" {...field} onChange={event => field.onChange(Number(event.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{socialAccount ? 'Update Social Account' : 'Create Social Account'}</Button>
      </form>
    </Form>
  );
};