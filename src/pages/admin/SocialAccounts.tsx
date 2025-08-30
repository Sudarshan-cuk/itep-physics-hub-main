import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SocialAccountForm } from '@/components/admin/social-accounts/SocialAccountForm';

export const SocialAccounts = () => {
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchSocialAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('social_accounts').select('*').order('display_order', { ascending: true });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setSocialAccounts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this social account?')) {
      const { error } = await supabase.from('social_accounts').delete().eq('id', id);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Social account deleted successfully.',
        });
        fetchSocialAccounts();
      }
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const handleNewAccount = () => {
    setSelectedAccount(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedAccount(null);
    fetchSocialAccounts();
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Social Account Management</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewAccount}>Add New Social Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedAccount ? 'Edit Social Account' : 'Create New Social Account'}</DialogTitle>
              </DialogHeader>
              <SocialAccountForm socialAccount={selectedAccount} onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading social accounts...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Display Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.platform}</TableCell>
                    <TableCell><a href={account.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{account.url}</a></TableCell>
                    <TableCell>{account.icon || 'N/A'}</TableCell>
                    <TableCell>{account.display_order || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(account)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(account.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};