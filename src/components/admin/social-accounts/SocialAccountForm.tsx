import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type SocialAccount = Tables<'social_accounts'>;

const formSchema = z.object({
  platform: z.string().min(2, { message: 'Platform name must be at least 2 characters.' }),
  url: z.string().url({ message: 'Invalid URL format.' }),
  icon_name: z.string().optional(),
  display_order: z.number().int().optional().nullable(),
});

type SocialAccountFormProps = {
  socialAccount: SocialAccount | null;
  onSuccess: () => void;
};

export const SocialAccountForm = ({ socialAccount, onSuccess }: SocialAccountFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: socialAccount?.platform || '',
      url: socialAccount?.url || '',
      icon_name: socialAccount?.icon_name || '',
      display_order: socialAccount?.display_order ?? undefined,
    },
  });

  useEffect(() => {
    if (socialAccount) {
      form.reset({
        platform: socialAccount.platform,
        url: socialAccount.url,
        icon_name: socialAccount.icon_name || '',
        display_order: socialAccount.display_order ?? undefined,
      });
    }
  }, [socialAccount, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const dataToSubmit = {
        ...values,
      };

      if (socialAccount) {
        const { error } = await supabase.from('social_accounts').update({ ...dataToSubmit, user_id: socialAccount.user_id }).eq('id', socialAccount.id);
        if (error) throw error;
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('You must be logged in to create a social account.');
        const { error } = await supabase.from('social_accounts').insert({ ...dataToSubmit, user_id: user.id });
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: `Social account ${socialAccount ? 'updated' : 'created'} successfully.`,
      });
      onSuccess();
      form.reset();
    } catch (error: any) {
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
          name="icon_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon Name (Optional)</FormLabel>
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
                <Input
                  type="number"
                  placeholder="Enter display order"
                  {...field}
                  value={field.value ?? ''}
                  onChange={event => field.onChange(event.target.value === '' ? null : Number(event.target.value))}
                />
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