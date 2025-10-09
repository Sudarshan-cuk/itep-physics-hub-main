import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { FileText, Users, Image, Mail } from 'lucide-react';

export const FeaturesSection = () => {
  const { user, isApproved } = useAuth();

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

  return (
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
  );
};