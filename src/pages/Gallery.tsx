import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Search, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types'; // Import Tables type

// Define a base Photo type from the Supabase schema
type BasePhoto = Tables<'photos'>;
type GalleryTable = Tables<'galleries'>;

// Extend the base Photo type with enriched data
interface Photo extends BasePhoto {
  // Fields from galleries table (via join)
  gallery_title?: string; // Assuming title comes from the linked gallery
  gallery_description?: string; // Assuming description comes from the linked gallery
  // Fields from profiles table (via join)
  profiles?: {
    full_name: string;
  };
  // Other fields used for filtering/display, but not directly from DB tables
  // These fields are not in the 'photos' or 'galleries' table directly,
  // so they need to be derived or added to the schema if they are truly photo-specific.
  // For now, making them optional and will need to be handled in the fetching logic.
  category?: string;
  batch_year?: number;
  uploaded_by?: string; // This is the user_id, if photos had an uploader_id column
}

export default function Gallery() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBatch, setSelectedBatch] = useState('All');

  const categories = ['All', 'General', 'Laboratory', 'Seminars', 'Events', 'Graduation', 'Campus Life'];
  const batchYears = ['All', '2020', '2021', '2022', '2023', '2024', '2025'];

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      // Fetch photos and join with galleries to get title and description
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select(`
          *,
          galleries (
            title,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;

      // Since 'photos' table does not have 'uploaded_by' column,
      // the current logic for fetching profiles based on photo.uploaded_by is flawed.
      // For now, we will assume 'uploaded_by' is not directly available from the photo itself
      // and will use a placeholder or derive it if possible from the gallery or a new column.
      // If photos are meant to be uploaded by users, the 'photos' table needs an 'uploader_id' column.

      const enrichedPhotos: Photo[] = (photosData || []).map((photo: any) => { // Use 'any' temporarily for the raw photo data
          let profileFullName = 'ITEP Team';
          // If the photos table had an 'uploaded_by' column, we would fetch the profile here.
          // For now, we'll use a placeholder or assume the gallery has an uploader.
          // Since the schema doesn't have it, we'll skip fetching profile based on photo.uploaded_by
          // and just use the default 'ITEP Team' or derive it from the gallery if available.

          // Assuming 'title' and 'description' come from the joined 'galleries' table
          const gallery = photo.galleries as GalleryTable | null;

          return {
            ...photo,
            gallery_title: gallery?.title || undefined,
            gallery_description: gallery?.description || undefined,
            profiles: { full_name: profileFullName },
            // Provide default undefined for fields not directly from DB or derived yet
            category: undefined, // Not available from DB directly
            batch_year: undefined, // Not available from DB directly
            uploaded_by: undefined, // Not available from DB directly
          };
        }) as Photo[]; // Explicitly cast to Photo[]

      setPhotos(enrichedPhotos);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch photos: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = photos.filter(photo => {
    // Use gallery_title and gallery_description for filtering if available, otherwise fallback to photo.caption
    const photoTitle = photo.gallery_title || photo.caption || '';
    const photoDescription = photo.gallery_description || photo.caption || '';

    const matchesSearch = photoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photoDescription.toLowerCase().includes(searchTerm.toLowerCase());
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
  const samplePhotos: Photo[] = [ // Ensure samplePhotos also conform to the Photo interface
    {
      id: '1',
      gallery_id: 'gallery-1',
      image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop',
      caption: 'Physics Laboratory Session',
      order_index: 1,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
      gallery_title: 'Physics Lab',
      gallery_description: 'Students conducting experiments in the modern physics lab',
      category: 'Laboratory',
      batch_year: 2024,
      uploaded_by: 'admin',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '2',
      gallery_id: 'gallery-2',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
      caption: 'Quantum Physics Seminar',
      order_index: 2,
      created_at: '2024-02-10T00:00:00Z',
      updated_at: '2024-02-10T00:00:00Z',
      gallery_title: 'Quantum Seminar',
      gallery_description: 'Guest lecture on quantum mechanics by renowned physicist',
      category: 'Seminars',
      batch_year: 2024,
      uploaded_by: 'admin',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '3',
      gallery_id: 'gallery-3',
      image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=800&h=600&fit=crop',
      caption: 'Graduation Ceremony 2023',
      order_index: 3,
      created_at: '2023-12-15T00:00:00Z',
      updated_at: '2023-12-15T00:00:00Z',
      gallery_title: 'Graduation 2023',
      gallery_description: 'Physics department graduates celebrating their achievement',
      category: 'Graduation',
      batch_year: 2023,
      uploaded_by: 'admin',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '4',
      gallery_id: 'gallery-4',
      image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop',
      caption: 'Campus Physics Building',
      order_index: 4,
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      gallery_title: 'Campus Life',
      gallery_description: 'The beautiful ITEP physics department building',
      category: 'Campus Life',
      batch_year: 2024,
      uploaded_by: 'admin',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '5',
      gallery_id: 'gallery-5',
      image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
      caption: 'Student Research Presentation',
      order_index: 5,
      created_at: '2024-01-20T00:00:00Z',
      updated_at: '2024-01-20T00:00:00Z',
      gallery_title: 'Research Presentation',
      gallery_description: 'Undergraduate students presenting their research projects',
      category: 'Events',
      batch_year: 2024,
      uploaded_by: 'admin',
      profiles: { full_name: 'Dr. Physics' }
    },
    {
      id: '6',
      gallery_id: 'gallery-6',
      image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      caption: 'Telescope Observation Night',
      order_index: 6,
      created_at: '2024-02-25T00:00:00Z',
      updated_at: '2024-02-25T00:00:00Z',
      gallery_title: 'Astronomy Night',
      gallery_description: 'Astronomy club organizing stargazing session for students',
      category: 'Events',
      batch_year: 2024,
      uploaded_by: 'admin',
      profiles: { full_name: 'Dr. Physics' }
    }
  ];

  const displayPhotos = photos.length > 0 ? filteredPhotos : samplePhotos.filter(photo => {
    const photoTitle = photo.gallery_title || photo.caption || '';
    const photoDescription = photo.gallery_description || photo.caption || '';

    const matchesSearch = photoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photoDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory;
    const matchesBatch = selectedBatch === 'All' || photo.batch_year?.toString() === selectedBatch;
    
    return matchesSearch && matchesCategory && matchesBatch;
  });


  return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Photo Gallery</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Memories and moments from the ITEP courses at Central University of Kerala
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
                  <a
                    key={photo.id}
                    href={photo.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group block"
                  >
                    <Card>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={photo.image_url}
                          alt={photo.gallery_title || photo.caption || 'Gallery Image'} // Use gallery_title or caption
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {photo.category && <Badge variant="secondary">{photo.category}</Badge>}
                        {photo.batch_year && (
                          <Badge variant="outline">Batch {photo.batch_year}</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {photo.gallery_title || photo.caption} {/* Use gallery_title or caption */}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {photo.gallery_description || photo.caption} {/* Use gallery_description or caption */}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{photo.profiles?.full_name || 'ITEP Team'}</span>
                        <span>•</span>
                        <span>{formatDate(photo.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
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
              Each image tells a story of discovery, learning, and community within the ITEP courses.
            </p>
          </div>
        )}
      </div>
  );
}