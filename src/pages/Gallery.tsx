import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  batch_year: number;
  uploaded_by: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export default function Gallery() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const categories = ['All', 'General', 'Laboratory', 'Seminars', 'Events', 'Graduation', 'Campus Life'];
  const batchYears = ['All', '2020', '2021', '2022', '2023', '2024', '2025'];

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch uploader profiles separately
      const enrichedPhotos = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', photo.uploaded_by)
            .single();
          
          return {
            ...photo,
            profiles: profile || { full_name: 'ITEP Team' }
          };
        })
      );
      
      setPhotos(enrichedPhotos);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch photos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesBatch = selectedBatch === 'All' || photo.batch_year?.toString() === selectedBatch;
    
    return matchesSearch && matchesCategory && matchesBatch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sample photos for demonstration
  const samplePhotos = [
    {
      id: '1',
      title: 'Physics Laboratory Session',
      description: 'Students conducting experiments in the modern physics lab',
      image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
      category: 'Laboratory',
      batch_year: 2024,
      uploaded_by: 'admin',
      created_at: '2024-01-15T00:00:00Z',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '2',
      title: 'Quantum Physics Seminar',
      description: 'Guest lecture on quantum mechanics by renowned physicist',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      category: 'Seminars',
      batch_year: 2024,
      uploaded_by: 'admin',
      created_at: '2024-02-10T00:00:00Z',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '3',
      title: 'Graduation Ceremony 2023',
      description: 'Physics department graduates celebrating their achievement',
      image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop',
      category: 'Graduation',
      batch_year: 2023,
      uploaded_by: 'admin',
      created_at: '2023-12-15T00:00:00Z',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '4',
      title: 'Campus Physics Building',
      description: 'The beautiful ITEP physics department building',
      image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      category: 'Campus Life',
      batch_year: 2024,
      uploaded_by: 'admin',
      created_at: '2024-03-01T00:00:00Z',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '5',
      title: 'Student Research Presentation',
      description: 'Undergraduate students presenting their research projects',
      image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      category: 'Events',
      batch_year: 2024,
      uploaded_by: 'admin',
      created_at: '2024-01-20T00:00:00Z',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '6',
      title: 'Telescope Observation Night',
      description: 'Astronomy club organizing stargazing session for students',
      image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      category: 'Events',
      batch_year: 2024,
      uploaded_by: 'admin',
      created_at: '2024-02-25T00:00:00Z',
      profiles: { full_name: 'Dr. Physics' }
    }
  ];

  const displayPhotos = photos.length > 0 ? filteredPhotos : samplePhotos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesBatch = selectedBatch === 'All' || photo.batch_year?.toString() === selectedBatch;
    
    return matchesSearch && matchesCategory && matchesBatch;
  });

  if (selectedPhoto) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPhoto(null)}
            className="mb-6"
          >
            ← Back to Gallery
          </Button>
          
          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <img 
              src={selectedPhoto.image_url} 
              alt={selectedPhoto.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{selectedPhoto.category}</Badge>
                {selectedPhoto.batch_year && (
                  <Badge variant="outline">Batch {selectedPhoto.batch_year}</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {selectedPhoto.title}
              </h1>
              <p className="text-muted-foreground mb-6">
                {selectedPhoto.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedPhoto.profiles?.full_name || 'ITEP Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedPhoto.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Photo Gallery</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Memories and moments from the ITEP Physics Department
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Category:</span>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-muted-foreground self-center">Batch:</span>
              {batchYears.map((batch) => (
                <Button
                  key={batch}
                  variant={selectedBatch === batch ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBatch(batch)}
                >
                  {batch === 'All' ? 'All Years' : batch}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading photos...</p>
          </div>
        ) : (
          <>
            {displayPhotos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPhotos.map((photo) => (
                  <Card 
                    key={photo.id} 
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={photo.image_url} 
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{photo.category}</Badge>
                        {photo.batch_year && (
                          <Badge variant="outline">Batch {photo.batch_year}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {photo.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {photo.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{photo.profiles?.full_name || 'ITEP Team'}</span>
                        <span>•</span>
                        <span>{formatDate(photo.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-medium text-muted-foreground mb-2">
                  {searchTerm || selectedCategory !== 'All' || selectedBatch !== 'All' 
                    ? 'No photos found' 
                    : 'No photos uploaded yet'}
                </p>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== 'All' || selectedBatch !== 'All'
                    ? 'Try adjusting your search or filters' 
                    : 'Photos will appear here once uploaded by department members'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Gallery Info */}
        {!searchTerm && selectedCategory === 'All' && selectedBatch === 'All' && displayPhotos.length > 0 && (
          <div className="mt-12 bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">About Our Gallery</h2>
            <p className="text-muted-foreground leading-relaxed">
              Explore the visual journey of our physics department through the years. From laboratory 
              sessions and research presentations to graduation ceremonies and campus events, these 
              photos capture the vibrant academic life and achievements of our students and faculty. 
              Each image tells a story of discovery, learning, and community within the ITEP Physics Department.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}