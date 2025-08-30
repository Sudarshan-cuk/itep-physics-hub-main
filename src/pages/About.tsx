import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
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
      description: "Focus on developing exceptional educators who inspire students across all subjects.",
      icon: <BookOpen className="h-8 w-8 text-primary" />
    },
    {
      title: "Practical Training", 
      description: "Extensive classroom experience through teaching internships and micro-teaching sessions.",
      icon: <Star className="h-8 w-8 text-primary" />
    },
    {
      title: "Dual Certification",
      description: "Graduates earn both subject degree and B.Ed. degrees preparing them for teaching careers.",
      icon: <Award className="h-8 w-8 text-primary" />
    }
  ];

  const facultyHighlights = [
    {
      name: "Dr. Rajesh Kumar",
      position: "Head of Department & Teacher Educator",
      specialization: "Physics Education & Curriculum Development",
      achievements: "Expert in physics pedagogy, 20+ years teaching experience"
    },
    {
      name: "Dr. Priya Sharma", 
      position: "Associate Professor",
      specialization: "Educational Psychology & Science Teaching",
      achievements: "Research in student learning, international teaching awards"
    },
    {
      name: "Dr. Amit Singh",
      position: "Assistant Professor", 
      specialization: "Laboratory Teaching & Assessment",
      achievements: "Innovation in physics lab instruction, digital assessment expert"
    },
    {
      name: "Dr. Neha Gupta",
      position: "Assistant Professor",
      specialization: "Educational Technology & E-Learning", 
      achievements: "Pioneer in online physics education, EdTech consultant"
    }
  ];

  const coreValues = [
    {
      icon: <Target className="h-8 w-8 text-accent" />,
      title: "Excellence in Teaching",
      description: "Preparing passionate teachers who make education accessible and inspiring for all students."
    },
    {
      icon: <Beaker className="h-8 w-8 text-accent" />,
      title: "Practical Learning",
      description: "Hands-on experience through classroom teaching, practicum, and real-world applications."
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Student-Centered Approach",
      description: "Nurturing future educators with personalized mentoring and comprehensive pedagogical training."
    },
    {
      icon: <Globe className="h-8 w-8 text-accent" />,
      title: "Educational Innovation",
      description: "Embracing modern teaching technologies and research-based instructional methods."
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
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
                we prepare graduates to become inspiring physics teachers who can make 
                science accessible and exciting for students across all educational levels.
              </p>
            </div>
          </div>

          {/* Program Features */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">Integrated Learning</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our unique curriculum seamlessly integrates physics content knowledge 
                    with pedagogical content knowledge, preparing effective science educators.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">Teaching Excellence</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our faculty are experienced teacher-educators who combine subject 
                    expertise with proven pedagogical methods and classroom experience.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Beaker className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">Practical Training</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Extensive practical training through teaching internships, micro-teaching 
                    sessions, and real classroom experiences in partner schools.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-semibold text-foreground">Dual Certification</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Graduates earn both B.Sc. Physics and B.Ed. degrees, making them 
                    qualified to teach physics at secondary and higher secondary levels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="mb-16 bg-muted/50 rounded-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Vision</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                To be a premier institution for integrated teacher education in physics, 
                developing passionate and competent physics teachers who will inspire 
                the next generation of scientists and create a scientifically literate society.
              </p>
              
              <h3 className="text-2xl font-bold text-foreground mb-6">Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide comprehensive teacher education that combines deep physics 
                content knowledge with innovative pedagogical methods, preparing graduates 
                to make physics engaging, accessible, and meaningful for all learners.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">Why Choose ITEP Physics?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span>Dual degree program (B.Sc. Physics + B.Ed.) in just 4 years</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span>Extensive teaching practice in real classroom settings</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span>Modern physics labs with teacher training facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span>Strong partnerships with schools and educational institutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span>100% placement in teaching positions and further studies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <span>Mentorship by experienced physics educators</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">1500+</div>
                <p className="text-muted-foreground">Trained Physics Teachers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground">Partner Schools</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Teaching Placement</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">25+</div>
                <p className="text-muted-foreground">Years of Excellence</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Faculty Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Faculty</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Our distinguished faculty members are experienced teacher-educators who combine 
            deep physics knowledge with proven pedagogical expertise.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facultyHighlights.map((faculty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-foreground">{faculty.name}</CardTitle>
                      <p className="text-primary font-medium">{faculty.position}</p>
                      <p className="text-muted-foreground text-sm">{faculty.specialization}</p>
                    </div>
                    <GraduationCap className="h-8 w-8 text-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faculty.achievements}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Program History */}
        <div className="mb-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Integrated Teacher Education Program (ITEP) was established in 1995 
              with the vision of revolutionizing science teacher education in India. 
              Our program was designed to address the critical shortage of well-trained 
              physics teachers in secondary education.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              The Physics ITEP was launched in 1998 as a flagship program, pioneering 
              the integration of rigorous physics education with comprehensive teacher 
              training. We recognized that effective physics teaching requires both 
              deep content knowledge and specialized pedagogical skills.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              Today, ITEP stands as a model for teacher education institutions across 
              the country. Our graduates serve as physics teachers, teacher trainers, 
              and educational leaders, making significant contributions to science 
              education at all levels.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}