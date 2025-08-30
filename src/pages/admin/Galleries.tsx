import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GalleryForm } from '@/components/admin/galleries/GalleryForm';
import { PhotoManagement } from '@/components/admin/galleries/PhotoManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tables } from '@/integrations/supabase/types'; // Import Tables type

// Define Gallery type based on Supabase schema
type Gallery = Tables<'galleries'>;

export const Galleries = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('galleries');
  const { toast } = useToast();

  const fetchGalleries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('galleries').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setGalleries(data || []); // Ensure data is an array
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleDelete = async (id: string) => { // Add type for id
    if (window.confirm('Are you sure you want to delete this gallery? This will also delete all associated photos.')) {
      const { error } = await supabase.from('galleries').delete().eq('id', id);
      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Gallery deleted successfully.',
        });
        fetchGalleries();
      }
    }
  };

  const handleEdit = (gallery: Gallery) => { // Add type for gallery
    setSelectedGallery(gallery);
    setIsFormOpen(true);
  };

  const handleNewGallery = () => {
    setSelectedGallery(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedGallery(null);
    fetchGalleries();
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gallery Management</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewGallery}>Add New Gallery</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedGallery ? 'Edit Gallery' : 'Create New Gallery'}</DialogTitle>
              </DialogHeader>
              <GalleryForm gallery={selectedGallery} onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="galleries">Galleries</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>
            <TabsContent value="galleries">
              {loading ? (
                <div>Loading galleries...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead> {/* Changed Name to Title */}
                      <TableHead>Description</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {galleries.map((gallery) => (
                      <TableRow key={gallery.id} onClick={() => setSelectedGallery(gallery)} className={selectedGallery?.id === gallery.id ? 'bg-muted' : ''}>
                        <TableCell className="font-medium">{gallery.title}</TableCell> {/* Changed gallery.name to gallery.title */}
                        <TableCell>{gallery.description}</TableCell>
                        <TableCell>{new Date(gallery.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(gallery); }} className="mr-2">
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(gallery.id); }}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="photos">
              <PhotoManagement galleryId={selectedGallery?.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};