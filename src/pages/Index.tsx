import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/use-auth';
import { BookOpen, Users, FileText, Image, Mail, ArrowRight, GraduationCap, Microscope, Award, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { user, isApproved } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSocialAccounts = async () => {
      const { data, error } = await supabase.from('social_accounts').select('*').order('display_order', { ascending: true });
      if (error) {
        toast({
          title: 'Error fetching social accounts',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setSocialAccounts(data);
      }
    };
    fetchSocialAccounts();
  }, []);

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Study Materials",
      description: "Access comprehensive notes, PDFs, and study resources curated by faculty.",
      link: user && isApproved ? "/notes" : "/auth"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Student Community",
      description: "Connect with your batchmates and engage in academic discussions.",
      link: "/gallery"
    },
    {
      icon: <Image className="h-8 w-8 text-primary" />,
      title: "Gallery",
      description: "Browse memories and photos organized by batch years and events.",
      link: "/gallery"
    },
    {
      icon: <Mail className="h-8 w-8 text-primary" />,
      title: "Latest Updates",
      description: "Stay informed with department news, events, and announcements.",
      link: "/blog"
    }
  ];

  const stats = [
    { icon: <GraduationCap className="h-6 w-6" />, label: "Students", value: "500+" },
    { icon: <Microscope className="h-6 w-6" />, label: "Research Areas", value: "15+" },
    { icon: <Award className="h-6 w-6" />, label: "Faculty", value: "25+" },
    { icon: <BookOpen className="h-6 w-6" />, label: "Resources", value: "1000+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative physics-pattern py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-academic opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              ITEP HUB
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Integrated Teacher Education Program - Empowering Future Educators Across Disciplines
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {user && isApproved ? (
              <Link to="/notes">
                <Button size="lg" className="w-full sm:w-auto">
                  Access Study Materials <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 subtle-gradient border-t border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex items-center justify-center mb-4 text-primary group-hover:text-accent transition-colors duration-300">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-foreground mb-2 font-serif">{stat.value}</div>
                <div className="text-muted-foreground font-medium uppercase text-sm tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore Our Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the tools and resources designed to enhance your physics education journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="educational-shadow-lg hover:educational-shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer border-l-4 border-l-primary group">
                <Link to={feature.link}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-6 p-4 rounded-full bg-primary/10 w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-serif text-foreground group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 academic-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 font-serif">Ready to Join Our ITEP Community?</h2>
          <p className="text-xl mb-10 opacity-95 leading-relaxed font-light">
            Designed for all student teachers at Central University of Kerala, offering ITEP B.Sc. (Physics, Zoology), ITEP B.A. (English, Economics), and B.Com.
            Get access to exclusive study materials, connect with peers, and stay updated with your chosen discipline.
          </p>
          {!user && (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform">
                Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-lg">ITEP HUB</span>
              </div>
              <p className="text-muted-foreground">
                Empowering student teachers across various disciplines at Central University of Kerala.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/notes" className="hover:text-foreground">Study Notes</Link></li>
                <li><Link to="#" className="hover:text-foreground">Research Papers</Link></li>
                <li><Link to="#" className="hover:text-foreground">Lab Reports</Link></li>
                <li><Link to="#" className="hover:text-foreground">Assignments</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Central University of Kerala</li>
                <li>Tejaswini Hills, Periye</li>
                <li>Kasaragod - 671316</li>
                <li>Kerala, India</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialAccounts.map((account) => {
                  let IconComponent;
                  switch (account.platform.toLowerCase()) {
                    case 'facebook':
                      IconComponent = Facebook;
                      break;
                    case 'twitter':
                      IconComponent = Twitter;
                      break;
                    case 'instagram':
                      IconComponent = Instagram;
                      break;
                    case 'linkedin':
                      IconComponent = Linkedin;
                      break;
                    default:
                      IconComponent = null;
                  }
                  return (
                    IconComponent && (
                      <a key={account.id} href={account.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </a>
                    )
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ITEP HUB, Central University of Kerala. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;