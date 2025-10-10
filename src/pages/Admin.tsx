import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactManagement } from '@/components/admin/ContactManagement';
import { StudyMaterialUpload } from '@/components/admin/StudyMaterialUpload';
import { UserApprovalManagement } from '@/components/admin/UserApprovalManagement';
import {
  Users,
  MessageSquare,
  FileText,
  Image,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Building,
  UploadCloud,
  Newspaper,
  Share2,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/PageContainer';
import { BlogManagement } from './admin/BlogManagement';
import { Galleries } from './admin/Galleries';
import { SocialAccounts } from './admin/SocialAccounts';
import { Batchmates } from './admin/Batchmates';
import UserManagement from '@/components/admin/UserManagement';
import { SiteStatistics } from './admin/SiteStatistics';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Common animation variants used throughout the page
const pageVariants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
};

const headerVariants = {
	initial: { y: -20, opacity: 0 },
	animate: { y: 0, opacity: 1, transition: { delay: 0.2, duration: 0.5 } }
};

function AdminContent() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    unreadMessages: 0,
    totalMessages: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users for stats
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('is_approved, role');

      if (usersError) throw usersError;

      // Fetch contact messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      setMessages(messagesData || []);

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const pendingApprovals = usersData?.filter(u => !u.is_approved && u.role !== 'admin').length || 0;
      const unreadMessages = messagesData?.filter(m => !m.read).length || 0;
      const totalMessages = messagesData?.length || 0;

      setStats({ totalUsers, pendingApprovals, unreadMessages, totalMessages });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch admin data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update message',
        variant: 'destructive'
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      toast({ title: 'Success', description: 'Message deleted successfully' });
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete message',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PageContainer>
        {/* Loading animation remains */}
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Animated Header */}
      <motion.div variants={headerVariants}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage users, content, and system settings
          </p>
        </div>
      </motion.div>
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold text-foreground">{stats.unreadMessages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalMessages}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Tabs defaultValue="user-management" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Blogs
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Materials
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="site-statistics" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Site Statistics
            </TabsTrigger>
            <TabsTrigger value="batchmates" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Batchmates
            </TabsTrigger>
            <TabsTrigger value="user-management" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>


          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg ${!message.read ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{message.name}</h3>
                            {!message.read && (
                              <Badge variant="destructive" className="text-xs">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{message.email}</p>
                          {message.subject && (
                            <p className="text-sm font-medium text-foreground mt-1">
                              Subject: {message.subject}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!message.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No messages yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <ContactManagement />
          </TabsContent>

          <TabsContent value="blogs">
            <BlogManagement />
          </TabsContent>

          <TabsContent value="gallery">
            <Galleries />
          </TabsContent>

          <TabsContent value="materials">
            <StudyMaterialUpload />
          </TabsContent>

          <TabsContent value="social">
            <SocialAccounts />
          </TabsContent>

          <TabsContent value="site-statistics">
            <SiteStatistics />
          </TabsContent>

          <TabsContent value="batchmates">
            <Batchmates />
          </TabsContent>

          <TabsContent value="user-management">
            <UserApprovalManagement />
          </TabsContent>
        </Tabs>
      </motion.div>
    </PageContainer>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminContent />
    </ProtectedRoute>
  );
}