import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BatchmateForm } from '@/components/admin/batchmates/BatchmateForm';
import { PageContainer } from '@/components/PageContainer';
import { Tables } from '@/integrations/supabase/types';

type Batchmate = Tables<'batchmates'>;

export const Batchmates = () => {
  const [batchmates, setBatchmates] = useState<Batchmate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatchmate, setSelectedBatchmate] = useState<Batchmate | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchBatchmates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('batchmates').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setBatchmates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBatchmates();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this batchmate?')) {
      const { error } = await supabase.from('batchmates').delete().eq('id', id);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Batchmate deleted successfully.',
        });
        fetchBatchmates();
      }
    }
  };

  const handleEdit = (batchmate: Batchmate) => {
    setSelectedBatchmate(batchmate);
    setIsFormOpen(true);
  };

  const handleNewBatchmate = () => {
    setSelectedBatchmate(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedBatchmate(null);
    fetchBatchmates();
  };

  return (
    <PageContainer>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Batchmate Management</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewBatchmate}>Add New Batchmate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedBatchmate ? 'Edit Batchmate' : 'Create New Batchmate'}</DialogTitle>
              </DialogHeader>
              <BatchmateForm batchmate={selectedBatchmate} onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading batchmates...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batchmates.map((batchmate) => (
                  <TableRow key={batchmate.id}>
                    <TableCell className="font-medium">{batchmate.name}</TableCell>
                    <TableCell>{batchmate.graduation_year || 'N/A'}</TableCell>
                    <TableCell>{new Date(batchmate.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(batchmate)} className="mr-2">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(batchmate.id)}>
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
    </PageContainer>
  );
};
