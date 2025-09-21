import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Newspaper, Search, Calendar, User, ArrowRight, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/PageContainer';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  published: boolean;
  published_at: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export default function Blog() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      // Fetch author profiles separately
      const enrichedPosts = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', post.author_id)
            .single();
          
          return {
            ...post,
            profiles: profile
          };
        })
      );
      
      setPosts(enrichedPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch blog posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedPost) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
            <Button
              variant="outline"
              onClick={() => setSelectedPost(null)}
              className="mb-6"
            >
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Blog
            </Button>
            
          <article className="prose prose-lg max-w-none">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {selectedPost.title}
                </h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                  <span>{selectedPost.profiles?.full_name || 'Unknown Author'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedPost.published_at)}</span>
                  </div>
                </div>
              </header>
              
                <div
              className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
            </article>
          </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">ITEP Hub Blog</h1>
          </div>
          {user && (
            <Link to="/write-blog">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Write Blog Post
              </Button>
            </Link>
          )}
        </div>
        <p className="text-muted-foreground text-lg">
          Latest insights, research updates, and guidance from ITEP courses at Central University of Kerala
        </p>
      </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

      {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : (
          <>
          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span>{post.profiles?.full_name || 'Unknown Author'}</span>
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at)}</span>
                        </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm ? 'No posts found' : 'No posts available'}
              </h3>
                <p className="text-muted-foreground">
                {searchTerm
                  ? 'Try adjusting your search terms or browse all posts.'
                  : 'Check back later for new blog posts.'
                }
                </p>
              </div>
          )}

          {/* Call to Action */}
          <div className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Stay connected with the latest developments in teacher education at ITEP, Central University of Kerala.
              Our blog features insights on career opportunities, teaching methodologies, educational
              research, and guidance for aspiring educators across all ITEP courses including B.Sc. (Physics, Zoology),
              B.A. (English, Economics), and B.Com. Whether you're considering joining our program, currently studying,
              or already working in education, you'll find valuable content to support your teaching journey.
            </p>
          </div>
        </>
        )}
      </PageContainer>
  );
}