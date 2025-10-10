import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Beaker, GraduationCap, Globe, Target, Heart, Star, Building, Loader2, icons } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SiteStatistic {
  id: string;
  label: string;
  display_value: string;
  icon_name: string;
}

export default function About() {
  const { data: siteStatistics, isLoading, error } = useQuery<SiteStatistic[]>({
    queryKey: ['siteStatistics'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_statistics').select('*');
      if (error) throw error;
      return data;
    },
  });

  const programStats = siteStatistics?.map(stat => {
    const IconComponent = icons[stat.icon_name as keyof typeof icons];
    return {
      icon: IconComponent ? <IconComponent className="h-6 w-6" /> : null,
      label: stat.label,
      value: stat.display_value,
    };
  }) || [];

  const programFeatures = [
    {
      title: "Integrated Learning",
      description: "Seamlessly combines subject content knowledge with pedagogical methods for effective teaching across disciplines.",
      icon: <Beaker className="h-8 w-8 text-primary" />
    },
    {
      title: "Teaching Excellence",
      description: "Comprehensive training in modern teaching methodologies, classroom management, and student engagement techniques.",
      icon: <Target className="h-8 w-8 text-primary" />
    },
    {
      title: "Research Integration",
      description: "Incorporates latest educational research and physics pedagogy to ensure evidence-based teaching practices.",
      icon: <BookOpen className="h-8 w-8 text-primary" />
    },
    {
      title: "Practical Experience",
      description: "Extensive hands-on teaching practice in real classroom settings with mentorship from experienced educators.",
      icon: <Heart className="h-8 w-8 text-primary" />
    },
    {
      title: "Technology Integration",
      description: "Training in modern educational technologies and digital tools for enhanced physics education delivery.",
      icon: <Star className="h-8 w-8 text-primary" />
    },
    {
      title: "Educational Innovation",
      description: "Embracing modern teaching technologies and research-based instructional methods."
    }
  ];

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading program impact data...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center py-12 text-red-500">
          <p>Error loading program impact data: {error.message}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">About ITEP</h1>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Welcome to the Integrated Teacher Education Program (ITEP) at the Department of Education, Kerala University.
          This is an unofficial website created by students and approved by faculty to help fellow students
          and provide information about our teacher training programs.
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This is an unofficial website. For official information,
            please visit the Kerala University official website.
          </p>
        </div>
      </div>

      {/* Program Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Program</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-4">
              The Integrated Teacher Education Program (ITEP) at Central University of Kerala is a pioneering
              initiative that combines comprehensive subject education with specialized
              teacher training methodologies. Our program has been shaping passionate
              educators across multiple disciplines for over two decades.
            </p>
            <p className="mb-4">
              We offer unique dual-degree programs including B.Sc. (Physics, Zoology) + B.Ed.,
              B.A. (English, Economics) + B.Ed., and B.Com + B.Ed. designed to
              develop both subject matter expertise and pedagogical skills. Our curriculum
              integrates advanced subject concepts with modern teaching methodologies,
              educational psychology, and classroom management techniques.
            </p>
            <p>
              With cutting-edge facilities and experienced teacher-educators,
              we prepare our students to become innovative teachers who can inspire
              the next generation of learners across all subjects.
            </p>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-6">Why Choose ITEP?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">University Affiliation</h3>
                <p className="text-muted-foreground">
                  Directly affiliated with Kerala University, ensuring quality education
                  and recognized degrees.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Expert Faculty</h3>
                <p className="text-muted-foreground">
                  Learn from experienced educators and researchers across all subjects with years
                  of teaching and industry experience.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Career Opportunities</h3>
                <p className="text-muted-foreground">
                  Excellent placement record with opportunities in schools, colleges,
                  and educational institutions across Kerala and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program Statistics */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Program Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {programStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Program Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Program Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Teaching Journey?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join our community of passionate physics educators and make a difference in the lives of students.
          Apply now to become part of the next generation of innovative teachers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Learn More About Admissions
          </button>
          <button className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </PageContainer>
  );
}