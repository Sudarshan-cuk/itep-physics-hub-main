import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Award, Beaker, GraduationCap, Globe, Target, Heart, Star, Building } from 'lucide-react';

export default function About() {
  const programStats = [
    { icon: <Users className="h-6 w-6" />, label: "Trained Teachers", value: "1500+" },
    { icon: <GraduationCap className="h-6 w-6" />, label: "Partner Schools", value: "200+" },
    { icon: <Award className="h-6 w-6" />, label: "Teaching Placements", value: "100%" },
    { icon: <Globe className="h-6 w-6" />, label: "Years of Excellence", value: "25+" }
  ];

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              The Integrated Teacher Education Program (ITEP) in Physics is a pioneering 
              initiative that combines comprehensive physics education with specialized 
              teacher training methodologies. Our program has been shaping passionate 
              physics educators for over two decades.
            </p>
            <p className="mb-4">
              We offer a unique dual-degree program (B.Sc. Physics + B.Ed.) designed to 
              develop both subject matter expertise and pedagogical skills. Our curriculum 
              integrates advanced physics concepts with modern teaching methodologies, 
              educational psychology, and classroom management techniques.
            </p>
            <p>
              With cutting-edge laboratory facilities and experienced teacher-educators, 
              we prepare our students to become innovative physics teachers who can inspire 
              the next generation of scientists and engineers.
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
                  Learn from experienced physics educators and researchers with years 
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
    </div>
  );
}