import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, BookOpen, Paperclip, X, Download, Copy, FileText } from 'lucide-react';
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
  category: 'General',
  attachment_url: ''
  });

  const categories = [
    'All',
    'General',
    'BSc BEd Physics',
    'BSc BEd Zoology',
    'Ba BEd English',
    'Ba BEd Economics',
    'BCom BEd',
    'SHARED BY TEACHERS',
  ];

  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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

  // Convert plain text with URLs into React nodes with hyperlinks
  const linkify = (text: string) => {
    if (!text) return null;
    const urlRegex = /(?:https?:\/\/|www\.)[^\s]+/gi;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(text)) !== null) {
      const url = match[0];
      const index = match.index;
      if (index > lastIndex) {
        parts.push(text.slice(lastIndex, index));
      }
      const href = url.startsWith('http') ? url : `https://${url}`;
      parts.push(
        <a key={`${index}-${url}`} href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {url}
        </a>
      );
      lastIndex = index + url.length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  };

  // This function now handles uploading the file to Supabase Storage
  const saveNote = async () => {
    if (!user || !formData.title.trim()) return;
    try {
      // Start with existing attachment (if editing)
      let attachmentUrl = editingNote?.attachment_url || null;

      // If a file is selected (admin-only UI), upload it and use that URL
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
      } else if (formData.attachment_url && formData.attachment_url.trim()) {
        // If no file, but an attachment URL was provided in the form, use it
        attachmentUrl = formData.attachment_url.trim();
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

      setFormData({ title: '', content: '', category: 'General', attachment_url: '' });
  // reset attachment_url too
  setFormData(prev => ({ ...prev, attachment_url: '' }));
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
        // Only attempt to remove from storage if the URL points to our bucket
        const marker = '/note_attachments/';
        if (noteToDelete.attachment_url.includes(marker)) {
          const filePath = noteToDelete.attachment_url.split(marker)[1];
          if (filePath) {
            await supabase.storage.from('note_attachments').remove([filePath]);
          }
        }
        // if it's an external URL, nothing to remove from storage
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
  category: note.category,
  attachment_url: note.attachment_url || ''
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

  // sort filtered notes according to sortOrder
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const ta = new Date(a.updated_at).getTime();
    const tb = new Date(b.updated_at).getTime();
    return sortOrder === 'newest' ? tb - ta : ta - tb;
  });

  const getFileNameFromUrl = (url: string) => {
    try {
      const parts = url.split('/');
      return parts[parts.length - 1].split('?')[0];
    } catch {
      return url;
    }
  };

  const getFileExtension = (url: string) => {
    const name = getFileNameFromUrl(url);
    const idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: 'Link copied to clipboard' });
    } catch (e) {
      toast({ title: 'Error', description: 'Could not copy link', variant: 'destructive' });
    }
  };

  return (
      <PageContainer>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Study Materials</h1>
          </div>
          <p className="text-muted-foreground text-lg">Shared study materials and resources for courses.</p>
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
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Sort</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="p-2 border rounded-md bg-background">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
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
              
              <div>
                <label className="text-sm font-medium">Attachment URL (optional)</label>
                <Input
                  placeholder="https://example.com/resource.pdf"
                  value={formData.attachment_url}
                  onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                />
              </div>
              
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
                    setFormData({ title: '', content: '', category: 'General', attachment_url: '' });
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
            {sortedNotes.map((note) => (
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
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{note.category}</Badge>
                    {note.category === 'SHARED BY TEACHERS' && (
                      <Badge variant="outline" className="text-xs">Shared by Teacher</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground line-clamp-3 mb-3">
                    {linkify(note.content) || 'No content'}
                  </p>
                  <div>
                    {/* This will display a link to the attachment if one exists */}
                    {note.attachment_url && (
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip className="h-4 w-4" />
                        <a href={note.attachment_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                          {getFileNameFromUrl(note.attachment_url)}
                        </a>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(note.attachment_url)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <a href={note.attachment_url} download className="ml-1">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <span className="text-xs text-muted-foreground">{getFileExtension(note.attachment_url)}</span>
                      </div>
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
