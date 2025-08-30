import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { PlusCircle, Trash2 } from 'lucide-react';

type SocialAccount = Tables<'social_accounts'>;

interface SocialAccountsFormProps {
  userId: string;
}

const formSchema = z.object({
  platform: z.string().min(1, { message: 'Platform is required.' }),
  url: z.string().url({ message: 'Invalid URL.' }),
  icon_name: z.string().optional(),
  display_order: z.number().optional(),
});

export const SocialAccountsForm = ({ userId }: SocialAccountsFormProps) => {
  const { toast } = useToast();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platform: '',
      url: '',
      icon_name: '',
      display_order: undefined,
    },
  });

  useEffect(() => {
    fetchSocialAccounts();
  }, [userId]);

  const fetchSocialAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('user_id', userId) // Assuming social_accounts table has a user_id column
      .order('display_order', { ascending: true });

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to fetch social accounts: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      setSocialAccounts(data || []);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase
      .from('social_accounts')
      .insert({
        user_id: userId,
        platform: values.platform,
        url: values.url,
        icon_name: values.icon_name,
        display_order: values.display_order,
      });

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to add social account: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Social account added successfully.',
      });
      form.reset();
      fetchSocialAccounts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this social account?')) {
      return;
    }

    const { error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: `Failed to delete social account: ${error.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Social account deleted successfully.',
      });
      fetchSocialAccounts();
    }
  };

  if (loading) {
    return <div>Loading social accounts...</div>;
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <FormLabel>Icon Name (e.g., 'github', 'linkedin')</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add Social Account
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Social Accounts</h3>
        {socialAccounts.length === 0 ? (
          <p className="text-muted-foreground">No social accounts added yet.</p>
        ) : (
          socialAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">{account.platform}</p>
                <a href={account.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                  {account.url}
                </a>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(account.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};