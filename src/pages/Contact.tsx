import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Building, 
  Users, 
  GraduationCap,
  MessageCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [facultyMembers, setFacultyMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchContactInfo();
    fetchFacultyMembers();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();
      
      if (error) throw error;
      setContactInfo(data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const fetchFacultyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setFacultyMembers(data || []);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: 'Message Sent',
        description: 'Thank you for your message! We\'ll get back to you soon.'
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {contactInfo ? `Get in touch with the ${contactInfo.program_name}` : 'Get in touch with the Department of Education'}
          </p>
          
          {/* Disclaimer */}
          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> This is an unofficial website created to help students and approved by faculty members. 
              For official information, please visit the Kerala University official website.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Message subject"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Your message..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Department Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {contactInfo?.department_name || 'Department Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {contactInfo?.address || 'Loading...'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">{contactInfo?.phone || 'Loading...'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">{contactInfo?.email || 'Loading...'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Office Hours</p>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {contactInfo?.office_hours || 'Loading...'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Teacher Training</Badge>
                  <Badge variant="outline">Academic Calendar</Badge>
                  <Badge variant="outline">Research</Badge>
                  <Badge variant="outline">Faculty</Badge>
                  <Badge variant="outline">Student Services</Badge>
                  <Badge variant="outline">ITEP Programs</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  For specific inquiries about teacher training admissions, research opportunities, 
                  or academic programs, please mention it in your message for faster assistance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Faculty Directory */}
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Faculty Directory
            </h2>
            <p className="text-muted-foreground">
              Connect directly with our faculty members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facultyMembers.map((faculty, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faculty.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{faculty.position}</Badge>
                    <Badge variant="outline">{faculty.specialization}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${faculty.email}`} className="text-primary hover:underline">
                      {faculty.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{faculty.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{faculty.office}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Find Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Campus Location</h3>
                <p className="text-muted-foreground mb-4">
                  Located in Tejaswini Hills, Kasaragod, Kerala, part of the Central University of Kerala.
                </p>
                <p className="text-sm text-muted-foreground">
                  Interactive campus map and directions available on the Central University of Kerala's official website.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}