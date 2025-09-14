import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { BlogForm } from '@/components/admin/BlogForm';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WriteBlog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to write blog posts.
            </p>
            <Link to="/auth">
              <Button>Login to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Blog Post Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your blog post has been submitted successfully. It will be reviewed by administrators 
              before being published. You'll be notified once it's approved.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/blog">
                <Button variant="outline">View All Posts</Button>
              </Link>
              <Button onClick={() => setSubmitted(false)}>
                Write Another Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/blog">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Write a Blog Post</h1>
        <p className="text-muted-foreground">
          Share your thoughts, experiences, or insights with the ITEP community across all courses. 
          Your post will be reviewed before publication.
        </p>
      </div>

      <BlogForm
        onSuccess={handleSuccess}
        onCancel={() => window.history.back()}
      />

      {/* Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Blog Post Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Content Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Write about education, teaching experiences, or academic insights</li>
                <li>• Keep content relevant to ITEP courses (Physics, Zoology, English, Economics, Commerce)</li>
                <li>• Use clear, professional language</li>
                <li>• Include proper citations when referencing sources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Review Process</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All posts are reviewed by administrators</li>
                <li>• Review typically takes 1-3 business days</li>
                <li>• You'll be notified of approval or feedback</li>
                <li>• You can edit drafts before submission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
