import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      
      {/* Hero Section */}
    </div>
  );
};

export default Index;