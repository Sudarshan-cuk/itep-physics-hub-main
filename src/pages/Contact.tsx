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
import { PageContainer } from '@/components/PageContainer';

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
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: 'Message Sent',
        description: 'Your message has been sent successfully. We\'ll get back to you soon!',
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
        </div>
        <p className="text-muted-foreground text-lg">
        Get in touch with us for any questions about our programs, admissions, or general inquiries.
      </p>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                    id="name"
                      type="text"
                    required
                      value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                    id="email"
                      type="email"
                    required
                      value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject *
                  </label>
                  <Input
                  id="subject"
                    type="text"
                  required
                    value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What's this about?"
                  />
                </div>
                
                <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                  id="message"
                  required
                    value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Message'}
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
              Department Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            {contactInfo ? (
              <>
              <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                    <p className="font-medium">{contactInfo.department_name}</p>
                    <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
              </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
              </div>
                </div>
              <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-sm text-muted-foreground">{contactInfo.office_hours}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading contact information...</p>
              </div>
            )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">Program Information</span>
                </div>
                <Badge variant="secondary">Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Admissions</span>
                </div>
                <Badge variant="secondary">Available</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary" />
                <span className="font-medium">Campus Tours</span>
              </div>
              <Badge variant="secondary">Available</Badge>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Faculty Directory */}
    {facultyMembers.length > 0 && (
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Meet Our Faculty</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-primary font-medium">{member.position}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{member.office}</span>
                </div>
                <div className="mt-3">
                  <Badge variant="outline">{member.specialization}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )}

      {/* Map Section */}
      <div className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
            Campus Location
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
    </PageContainer>
  );
}