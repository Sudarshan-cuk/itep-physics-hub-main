import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

interface ResearchPaper {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  file_url: string;
  user_id: string;
}

const ResearchPapersManagement = () => {
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editingPaper, setEditingPaper] = useState<ResearchPaper | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResearchPapers();
  }, []);

  const fetchResearchPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('research_papers').select('*');
    if (error) {
      console.error('Error fetching research papers:', error);
      toast.error(`Error fetching research papers: ${error.message}`);
    } else {
      setResearchPapers(data);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error('Title and file are required.');
      return;
    }

    setLoading(true);
    let fileUrl = editingPaper?.file_url || '';

    if (file) {
      const filePath = `public/${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('research_papers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast.error(`Error uploading file: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/research_papers/${uploadData.path}`;
    }

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      toast.error('User not authenticated.');
      setLoading(false);
      return;
    }

    if (editingPaper) {
      const { error } = await supabase
        .from('research_papers')
        .update({ title, description, file_url: fileUrl, user_id: userId })
        .eq('id', editingPaper.id);

      if (error) {
        console.error('Error updating research paper:', error);
        toast.error(`Error updating research paper: ${error.message}`);
      } else {
        toast.success('Research paper updated successfully!');
        setEditingPaper(null);
        setTitle('');
        setDescription('');
        setFile(null);
        fetchResearchPapers();
      }
    } else {
      const { error } = await supabase
        .from('research_papers')
        .insert([{ title, description, file_url: fileUrl, user_id: userId }]);

      if (error) {
        console.error('Error adding research paper:', error);
        toast.error(`Error adding research paper: ${error.message}`);
      } else {
        toast.success('Research paper added successfully!');
        setTitle('');
        setDescription('');
        setFile(null);
        fetchResearchPapers();
      }
    }
    setLoading(false);
  };

  const handleEdit = (paper: ResearchPaper) => {
    setEditingPaper(paper);
    setTitle(paper.title);
    setDescription(paper.description || '');
    setFile(null); // Clear file input for re-upload if needed
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    setLoading(true);
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      const { error: deleteFileError } = await supabase.storage
        .from('research_papers')
        .remove([`public/${fileName}`]);

      if (deleteFileError) {
        console.error('Error deleting file from storage:', deleteFileError);
        toast.error(`Error deleting file from storage: ${deleteFileError.message}`);
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from('research_papers').delete().eq('id', id);
    if (error) {
      console.error('Error deleting research paper:', error);
      toast.error(`Error deleting research paper: ${error.message}`);
    } else {
      toast.success('Research paper deleted successfully!');
      fetchResearchPapers();
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Research Papers</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingPaper ? 'Edit Research Paper' : 'Add New Research Paper'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="file"
              onChange={handleFileChange}
              required={!editingPaper}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : editingPaper ? 'Update Research Paper' : 'Add Research Paper'}
            </Button>
            {editingPaper && (
              <Button type="button" variant="outline" onClick={() => {
                setEditingPaper(null);
                setTitle('');
                setDescription('');
                setFile(null);
              }}>
                Cancel Edit
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Existing Research Papers</h2>
      {loading ? (
        <p>Loading research papers...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {researchPapers.map((paper) => (
            <Card key={paper.id}>
              <CardHeader>
                <CardTitle>{paper.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{paper.description}</p>
                <a href={paper.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
                  View File
                </a>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" onClick={() => handleEdit(paper)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(paper.id, paper.file_url)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchPapersManagement;