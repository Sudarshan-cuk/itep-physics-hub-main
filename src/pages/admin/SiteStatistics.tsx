import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { toast } from '../../components/ui/use-toast';
import { SiteStatistic } from '../../integrations/supabase/types'; // Will be created later
import { SiteStatisticsForm } from '../../components/admin/SiteStatisticsForm.tsx'; // Will be created next

export const SiteStatistics = () => {
  const [statistics, setStatistics] = useState<SiteStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<SiteStatistic | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('site_statistics').select('*');
    if (error) {
      toast({
        title: 'Error fetching statistics',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setStatistics(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statistic?')) return;
    const { error } = await supabase.from('site_statistics').delete().eq('id', id);
    if (error) {
      toast({
        title: 'Error deleting statistic',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Statistic deleted',
        description: 'The site statistic has been successfully deleted.',
      });
      fetchStatistics();
    }
  };

  const handleEdit = (statistic: SiteStatistic) => {
    setEditingStatistic(statistic);
    setIsFormOpen(true);
  };

  const handleNewStatistic = () => {
    setEditingStatistic(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchStatistics();
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Site Statistics Management</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewStatistic}>Add New Statistic</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStatistic ? 'Edit Statistic' : 'Add New Statistic'}</DialogTitle>
            </DialogHeader>
            <SiteStatisticsForm
              statistic={editingStatistic}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead>Display Value</TableHead>
            <TableHead>Icon Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statistics.map((statistic) => (
            <TableRow key={statistic.id}>
              <TableCell>{statistic.label}</TableCell>
              <TableCell>{statistic.display_value}</TableCell>
              <TableCell>{statistic.icon_name}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(statistic)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(statistic.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};