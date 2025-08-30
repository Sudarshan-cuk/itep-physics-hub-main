import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StudyMaterial {
  id: string;
  created_at: string;
  updated_at: string;
  uploader_id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  file_size: number;
  title: string;
  category: string | null;
  description: string | null;
}

export function StudyMaterialUpload() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  const categories = ['General', 'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Laboratory'];

  const fetchStudyMaterials = async () => {
    try {
      setLoadingMaterials(true);
      const { data, error } = await supabase
        .from('study_materials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudyMaterials(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching materials',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchStudyMaterials();
    refreshProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!user || !file || !title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a title and select a file.',
        variant: 'destructive',
      });
      return;
    }

    await refreshProfile();

    if (profile?.role !== 'admin') {
      toast({
        title: 'Authorization Error',
        description: 'Only administrators can upload study materials.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    const filePath = `public/${fileName}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('study-materials')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('study-materials')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL for the uploaded file.');
      }

      const { error: dbError } = await supabase.from('study_materials').insert({
        uploader_id: user.id,
        file_name: file.name,
        file_path: filePath,
        file_url: publicUrlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        title: title.trim(),
        description: description.trim(),
        category: category,
      });

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Study material uploaded successfully!',
      });

      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('General');
      fetchStudyMaterials(); // Refresh the list of materials
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (material: StudyMaterial) => {
    if (!user || profile?.role !== 'admin') {
      toast({
        title: 'Authorization Error',
        description: 'Only administrators can delete study materials.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('study-materials')
        .remove([material.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', material.id);

      if (dbError) throw dbError;

      toast({
        title: 'Success',
        description: 'Study material deleted successfully!',
      });
      fetchStudyMaterials(); // Refresh the list
    } catch (error: any) {
      toast({
        title: 'Deletion Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-6 w-6" /> Upload Study Materials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter title for the material"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Add a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} disabled={uploading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
        </div>
        <Button onClick={handleUpload} disabled={uploading || !file || !title.trim()}>
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading ({uploadProgress}%)
            </>
          ) : (
            'Upload Material'
          )}
        </Button>

        <h3 className="text-xl font-semibold mt-8 mb-4">Existing Study Materials</h3>
        {loadingMaterials ? (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-muted-foreground mt-2">Loading materials...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {studyMaterials.length === 0 ? (
              <p className="text-muted-foreground">No study materials uploaded yet.</p>
            ) : (
              studyMaterials.map((material) => (
                <Card key={material.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{material.title}</p>
                    <p className="text-sm text-muted-foreground">{material.file_name} ({material.category})</p>
                    <a href={material.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                      View File
                    </a>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(material)}>
                    Delete
                  </Button>
                </Card>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}