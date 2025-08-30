import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download } from 'lucide-react';

interface StudyMaterial {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  category: string;
}

export function Assignments() {
  const [assignments, setAssignments] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .eq('category', 'Assignments') // Filter by 'Assignments' category
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setAssignments(data || []);
      }
      setLoading(false);
    };

    fetchAssignments();
  }, [toast]);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Assignments</h1>
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading assignments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.length === 0 ? (
              <p className="text-muted-foreground col-span-full text-center">No assignments available yet.</p>
            ) : (
              assignments.map((assignment) => (
                <Card key={assignment.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground mt-2">{assignment.description}</p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow flex items-end">
                    <Button asChild>
                      <a href={assignment.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <Download className="h-4 w-4 mr-2" /> Download {assignment.file_name}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}