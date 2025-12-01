import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { PageContainer } from '@/components/PageContainer';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  updated_at: string;
}

export function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('assignments')
        .select('id, created_at, title, description, due_date, updated_at')
        .order('due_date', { ascending: true });

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
    <PageContainer>
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
                  {assignment.due_date && (
                    <p className="text-sm text-muted-foreground mt-2">Due: {format(new Date(assignment.due_date), "PPP")}</p>
                  )}
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  {/* Download functionality removed as 'file_url' is not part of the assignment schema. */}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </PageContainer>
  );
}