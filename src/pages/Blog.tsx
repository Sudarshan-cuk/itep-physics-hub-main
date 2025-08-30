import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Newspaper, Search, Calendar, User, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
            profiles: profile || { full_name: 'ITEP Team' }
          };
        })
      );
      
      setPosts(enrichedPosts);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blog posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Sample blog posts for demonstration
  const sampleBlogPosts: BlogPost[] = [
    {
      id: 'sample-1',
      title: 'Career Opportunities After ITEP: Beyond the Classroom',
      excerpt: 'Discover the diverse career paths available to ITEP graduates, from teaching to research, educational technology, and policy-making in education.',
      content: `The Integrated Teacher Education Program (ITEP) opens doors to numerous exciting career opportunities that extend far beyond traditional classroom teaching. Our graduates are uniquely positioned with with strong subject knowledge and pedagogical expertise, making them valuable in various professional domains.

**Teaching Careers:**
- Secondary and Higher Secondary Physics Teacher
- Physics Teacher Trainer and Mentor  
- Curriculum Developer for Physics Education
- Educational Consultant for Schools and Boards

**Research and Development:**
- Physics Education Research
- Educational Technology Development
- Science Communication and Outreach
- Textbook and Learning Material Development

**Administrative Roles:**
- Academic Administrator in Educational Institutions
- Science Education Policy Advisor
- Quality Assurance in Educational Organizations
- Educational Project Coordinator

**Entrepreneurial Opportunities:**
- Science Education Consultancy
- Online Physics Tutoring Platforms
- Educational Content Creation
- Physics Lab Equipment Design

Our alumni have successfully established themselves in prestigious institutions like NCERT, various state education boards, international schools, and leading EdTech companies. The combination of subject expertise and teaching skills makes our graduates highly sought after in the evolving educational landscape.

The program also prepares students for higher studies in Physics Education, Science Communication, or specialized physics fields, enabling them to pursue M.Ed., M.Sc., or research careers in education.`,
      author_id: 'admin',
      published: true,
      published_at: '2024-01-15T00:00:00Z',
      created_at: '2024-01-15T00:00:00Z',
      profiles: { full_name: 'Dr. Rajesh Kumar' }
    },
    {
      id: 'sample-2', 
      title: 'Why Choose Physics? The Foundation of All Sciences',
      excerpt: 'Explore why physics forms the cornerstone of scientific understanding and how it develops critical thinking skills essential for the 21st century.',
      content: `Physics is often called the fundamental science, and for good reason. It seeks to understand how the universe works at the most basic level, from the smallest particles to the largest cosmic structures. But why should you choose physics, especially through our teacher education program?

**Physics Develops Universal Skills:**
- Problem-solving and analytical thinking
- Mathematical modeling and computational skills
- Experimental design and data analysis
- Communication of complex concepts

**Physics is Everywhere:**
Physics principles underlie all other sciences and technologies. From the smartphone in your pocket to the MRI machines in hospitals, from renewable energy systems to space exploration - physics makes it all possible.

**Career Versatility:**
A physics background opens doors to diverse fields:
- Engineering and technology
- Medicine and healthcare technology  
- Finance and data analysis
- Environmental science and policy
- Entertainment and gaming industry

**Teaching Physics - A Noble Calling:**
As a physics teacher, you have the unique opportunity to:
- Inspire the next generation of scientists and innovators
- Make abstract concepts tangible and exciting
- Develop scientific temperament in students
- Contribute to national scientific literacy

**The ITEP Advantage:**
Our program uniquely combines rigorous physics education with proven teaching methodologies, ensuring you not only understand physics deeply but can also make it accessible and engaging for students of all backgrounds.

In an age of rapid technological advancement, subject literacy is becoming increasingly important for informed citizenship. As an ITEP graduate, you become a crucial bridge between complex scientific concepts and public understanding.`,
      author_id: 'admin',
      published: true,
      published_at: '2024-02-01T00:00:00Z',
      created_at: '2024-02-01T00:00:00Z',
      profiles: { full_name: 'Dr. Priya Sharma' }
    },
    {
      id: 'sample-3',
      title: 'Why B.Ed? The Art and Science of Teaching',
      excerpt: 'Understanding the importance of formal teacher education and how B.Ed. transforms subject knowledge into effective teaching practice.',
      content: `Many people wonder why a separate degree in Education (B.Ed.) is necessary when one already has subject expertise. The answer lies in understanding that teaching is both an art and a science that requires specialized knowledge and skills.

**Teaching is a Specialized Profession:**
Just as doctors need medical training beyond biology, teachers need pedagogical training beyond subject knowledge. Effective teaching involves:
- Understanding how students learn
- Designing appropriate learning experiences
- Managing diverse classroom dynamics
- Assessing student progress meaningfully

**The Unique Value of B.Ed.:**

**Educational Psychology:** Understanding cognitive development, learning theories, and motivation helps teachers connect with students at their level and design age-appropriate lessons.

**Curriculum and Instruction:** Learning to plan lessons, sequence topics, choose appropriate teaching methods, and align instruction with learning objectives.

**Assessment and Evaluation:** Developing skills in creating fair assessments, providing constructive feedback, and using evaluation data to improve teaching.

**Inclusive Education:** Preparing to teach students with diverse backgrounds, learning styles, and special needs.

**Classroom Management:** Creating positive learning environments, managing behavior, and building supportive classroom communities.

**ITEP's Integrated Approach:**
Our program integrates B.Ed. components throughout the four years, not as an add-on but as an essential part of physics education. This means:
- Physics concepts are learned alongside teaching methods
- Theory is immediately connected to classroom practice  
- Extended teaching internships provide real experience
- Reflection and improvement are built into the program

**Professional Recognition:**
B.Ed. is legally required for teaching positions and is increasingly valued by:
- Government and private schools
- International schools
- Teacher training institutions
- Educational organizations and NGOs

**Beyond Compliance:**
The B.Ed. component transforms physics graduates from knowledge holders to knowledge facilitators, enabling them to:
- Make physics accessible to all students
- Address common misconceptions effectively
- Use technology appropriately in teaching
- Contribute to educational improvement

Teaching is one of the most impactful professions - teachers shape minds, inspire dreams, and build the future. The B.Ed. ensures you're prepared to do this effectively and professionally.`,
      author_id: 'admin',
      published: true,
      published_at: '2024-02-15T00:00:00Z',
      created_at: '2024-02-15T00:00:00Z',
      profiles: { full_name: 'Dr. Amit Singh' }
    },
    {
      id: 'sample-4',
      title: 'Making Physics Engaging: Modern Teaching Strategies for the Digital Age',
      excerpt: 'Explore innovative teaching methods and technology integration that make physics education more interactive, engaging, and effective for today\'s learners.',
      content: `In today's digital age, traditional chalk-and-talk methods are no longer sufficient to engage students in physics learning. Modern physics education requires innovative approaches that leverage technology, promote active learning, and connect physics concepts to real-world applications.

**Interactive Demonstrations and Simulations:**
- Use PhET simulations for abstract concepts like quantum mechanics
- Smartphone apps for data collection in experiments
- Virtual reality for exploring impossible scenarios (inside atoms, black holes)
- Augmented reality for visualizing magnetic fields and wave patterns

**Inquiry-Based Learning:**
Instead of simply presenting facts, encourage students to:
- Ask questions about natural phenomena
- Design their own experiments  
- Analyze data and draw conclusions
- Defend their reasoning with evidence

**Real-World Applications:**
Connect physics to students' lives through:
- Sports physics (projectile motion in basketball)
- Medical physics (ultrasound, X-rays, MRI)
- Environmental applications (solar panels, wind turbines)
- Technology they use daily (smartphones, GPS, internet)

**Collaborative Learning Strategies:**
- Peer instruction and think-pair-share activities
- Group problem-solving sessions
- Student-led discussions and presentations
- Collaborative laboratory investigations

**Assessment for Learning:**
Move beyond traditional testing to:
- Formative assessment during lessons
- Portfolio-based evaluation
- Performance-based tasks
- Self and peer assessment opportunities

**Differentiated Instruction:**
Recognize that students learn differently:
- Multiple representation of concepts (visual, mathematical, verbal)
- Varied learning activities for different learning styles
- Flexible grouping strategies
- Personalized learning paths

**Professional Development for Teachers:**
Staying current requires:
- Continuous learning of new technologies
- Participation in physics education research
- Collaboration with fellow educators
- Reflection on teaching practices

**The ITEP Preparation:**
Our program ensures graduates are ready for modern classrooms through:
- Training in educational technology tools
- Practice with innovative teaching methods
- Exposure to current physics education research  
- Mentoring by experienced teacher-educators

As an ITEP graduate, you'll be equipped not just to teach physics, but to make it come alive for your students, fostering curiosity, critical thinking, and a lifelong love for learning.

The future of physics education lies in the hands of well-prepared teachers who can bridge the gap between complex scientific concepts and student understanding. Our program ensures you're ready for this exciting challenge.`,
      author_id: 'admin',
      published: true,
      published_at: '2024-03-01T00:00:00Z', 
      created_at: '2024-03-01T00:00:00Z',
      profiles: { full_name: 'Dr. Neha Gupta' }
    }
  ];

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayPosts = posts.length > 0 ? filteredPosts : sampleBlogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPost(null)}
            className="mb-6"
          >
            ← Back to Blog
          </Button>
          
          <article className="bg-card rounded-lg p-8 shadow-lg">
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {selectedPost.title}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedPost.profiles?.full_name || 'ITEP Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedPost.published_at)}</span>
                </div>
              </div>
            </header>
            
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-foreground leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>
          </article>
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
            <Newspaper className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Physics Hub Blog</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Latest insights, research updates, and guidance from the ITEP courses at Central University of Kerala
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

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading articles...</p>
          </div>
        ) : (
          <>
            {displayPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {displayPosts.map((post, index) => (
                  <Card 
                    key={post.id} 
                    className={`hover:shadow-lg transition-all cursor-pointer group ${
                      index === 0 ? 'lg:col-span-2' : ''
                    }`}
                    onClick={() => setSelectedPost(post)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary">Teacher Education</Badge>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(post.published_at)}
                        </div>
                      </div>
                      <CardTitle className={`group-hover:text-primary transition-colors ${
                        index === 0 ? 'text-2xl' : 'text-xl'
                      }`}>
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt || post.content.substring(0, 150) + '...'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{post.profiles?.full_name || 'ITEP Team'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl font-medium text-muted-foreground mb-2">
                  {searchTerm ? 'No articles found' : 'No articles published yet'}
                </p>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Try different search terms' : 'Check back later for the latest updates'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Featured Section */}
        {!searchTerm && displayPosts.length > 0 && (
          <div className="mt-12 bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">About Our Blog</h2>
            <p className="text-muted-foreground leading-relaxed">
              Stay connected with the latest developments in physics teacher education at ITEP. 
              Our blog features insights on career opportunities, teaching methodologies, educational 
              research, and guidance for aspiring physics educators. Whether you're considering 
              joining our program, currently studying, or already working in physics education, 
              you'll find valuable content to support your journey.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}