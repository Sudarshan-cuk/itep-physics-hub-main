
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PageContainer } from '@/components/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ResearchPaper {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  file_url: string;
  user_id: string;
}

export function ResearchPapers() {
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResearchPapers();
  }, []);

  const fetchResearchPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('research_papers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching research papers:', error);
      toast.error(`Error fetching research papers: ${error.message}`);
    } else {
      setResearchPapers(data);
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Research Papers</h1>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading research papers...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchPapers.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">No research papers available yet.</p>
          ) : (
            researchPapers.map((paper) => (
              <Card key={paper.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{paper.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-sm text-gray-600 mb-4">{paper.description || 'No description provided.'}</p>
                  <div className="mt-auto">
                    <a href={paper.file_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">View Paper</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </PageContainer>
  );
}