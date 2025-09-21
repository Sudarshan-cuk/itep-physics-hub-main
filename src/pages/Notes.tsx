import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, BookOpen, Paperclip, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PageContainer } from '@/components/PageContainer';


// The Note interface now includes an optional attachment UR
interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
  attachment_url?: string;
}

function NotesContent() {
  // We get the 'profile' object to check if the user is an admin
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  const categories = ['All', 'General', 'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Physics', 'Laboratory'];

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch notes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // This function now handles uploading the file to Supabase Storage
  const saveNote = async () => {
    if (!user || !formData.title.trim()) return;
    try {
      let attachmentUrl = editingNote?.attachment_url || null;

      if (selectedFile) {
        const filePath = `${user.id}/${Date.now()}-${selectedFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('note_attachments')
          .upload(filePath, selectedFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('note_attachments')
          .getPublicUrl(filePath);
        attachmentUrl = urlData.publicUrl;
      }
      
      const noteData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        attachment_url: attachmentUrl,
      };

      if (editingNote) {
        const { error } = await supabase
          .from('notes')
          .update(noteData)
          .eq('id', editingNote.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Note updated successfully' });
      } else {
        const { error } = await supabase
          .from('notes')
          .insert({ user_id: user.id, ...noteData });
        if (error) throw error;
        toast({ title: 'Success', description: 'Note created successfully' });
      }

      setFormData({ title: '', content: '', category: 'General' });
      setShowForm(false);
      setEditingNote(null);
      setSelectedFile(null);
      fetchNotes();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save note',
        variant: 'destructive'
      });
    }
  };

  // This function now also deletes the file from Supabase Storage
  const deleteNote = async (noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    if (!noteToDelete) return;
    try {
      if (noteToDelete.attachment_url) {
        const filePath = noteToDelete.attachment_url.split('/note_attachments/')[1];
        await supabase.storage.from('note_attachments').remove([filePath]);
      }
      const { error } = await supabase.from('notes').delete().eq('id', noteId);
      if (error) throw error;
      toast({ title: 'Success', description: 'Note deleted successfully' });
      fetchNotes();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive'
      });
    }
  };
  
  const startEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category
    });
    setSelectedFile(null);
    setShowForm(true);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
      <PageContainer>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">My Notes</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Organize your physics notes and study materials
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Note title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Textarea
                placeholder="Note content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
              />
              
              {/* THIS IS THE UPLOAD SECTION. 
                It will only appear if the logged-in user's profile role is 'admin'.
                If you can't see this, check your user's role in the Supabase database.
              */}
              {profile?.role === 'admin' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Attachment (Admin Only)</label>
                  <Input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Paperclip className="h-4 w-4" />
                      <span>{selectedFile.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {editingNote?.attachment_url && !selectedFile && (
                     <div className="flex items-center gap-2 text-sm">
                        <Paperclip className="h-4 w-4" />
                        <a href={editingNote.attachment_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View current attachment
                        </a>
                      </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={saveNote}>
                  {editingNote ? 'Update' : 'Create'} Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingNote(null);
                    setSelectedFile(null);
                    setFormData({ title: '', content: '', category: 'General' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading notes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(note)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge variant="secondary">{note.category}</Badge>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground line-clamp-3 mb-3">
                    {note.content || 'No content'}
                  </p>
                  <div>
                    {/* This will display a link to the attachment if one exists */}
                    {note.attachment_url && (
                      <a href={note.attachment_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
                        <Paperclip className="h-4 w-4" />
                        View Attachment
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-medium text-muted-foreground mb-2">
              {searchTerm || selectedCategory !== 'All' ? 'No notes found' : 'No notes yet'}
            </p>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter' 
                : 'Create your first note to get started'}
            </p>
            {!searchTerm && selectedCategory === 'All' && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Note
              </Button>
            )}
          </div>
        )}
  </PageContainer>
  );
}

export default function Notes() {
  return (
    <ProtectedRoute>
      <NotesContent />
    </ProtectedRoute>
  );
}
