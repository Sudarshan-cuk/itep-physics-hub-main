import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Calendar } from '../../components/ui/calendar';
import { cn } from '../../lib/utils';

interface Assignment {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  file_url: string;
  due_date: string | null;
  user_id: string;
}

const AssignmentsManagement = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('assignments').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching assignments:', error);
      toast.error(`Error fetching assignments: ${error.message}`);
    } else {
      setAssignments(data);
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
    let fileUrl = editingAssignment?.file_url || '';

    if (file) {
      const filePath = `public/${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignments')
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
      fileUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assignments/${uploadData.path}`;
    }

    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      toast.error('User not authenticated.');
      setLoading(false);
      return;
    }

    const assignmentData = {
      title,
      description,
      file_url: fileUrl,
      due_date: dueDate ? dueDate.toISOString() : null,
      user_id: userId,
    };

    if (editingAssignment) {
      const { error } = await supabase
        .from('assignments')
        .update(assignmentData)
        .eq('id', editingAssignment.id);

      if (error) {
        console.error('Error updating assignment:', error);
        toast.error(`Error updating assignment: ${error.message}`);
      } else {
        toast.success('Assignment updated successfully!');
        setEditingAssignment(null);
        setTitle('');
        setDescription('');
        setFile(null);
        setDueDate(undefined);
        fetchAssignments();
      }
    } else {
      const { error } = await supabase
        .from('assignments')
        .insert([assignmentData]);

      if (error) {
        console.error('Error adding assignment:', error);
        toast.error(`Error adding assignment: ${error.message}`);
      } else {
        toast.success('Assignment added successfully!');
        setTitle('');
        setDescription('');
        setFile(null);
        setDueDate(undefined);
        fetchAssignments();
      }
    }
    setLoading(false);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setTitle(assignment.title);
    setDescription(assignment.description || '');
    setFile(null); // Clear file input for re-upload if needed
    setDueDate(assignment.due_date ? new Date(assignment.due_date) : undefined);
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    setLoading(true);
    const fileName = fileUrl.split('/').pop();
    if (fileName) {
      const { error: deleteFileError } = await supabase.storage
        .from('assignments')
        .remove([`public/${fileName}`]);

      if (deleteFileError) {
        console.error('Error deleting file from storage:', deleteFileError);
        toast.error(`Error deleting file from storage: ${deleteFileError.message}`);
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from('assignments').delete().eq('id', id);
    if (error) {
      console.error('Error deleting assignment:', error);
      toast.error(`Error deleting assignment: ${error.message}`);
    } else {
      toast.success('Assignment deleted successfully!');
      fetchAssignments();
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Assignments</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}</CardTitle>
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="file"
              onChange={handleFileChange}
              required={!editingAssignment}
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : editingAssignment ? 'Update Assignment' : 'Add Assignment'}
            </Button>
            {editingAssignment && (
              <Button type="button" variant="outline" onClick={() => {
                setEditingAssignment(null);
                setTitle('');
                setDescription('');
                setFile(null);
                setDueDate(undefined);
              }}>
                Cancel Edit
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">Existing Assignments</h2>
      {loading ? (
        <p>Loading assignments...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <CardTitle>{assignment.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{assignment.description}</p>
                {assignment.due_date && (
                  <p className="text-sm text-muted-foreground mt-2">Due: {format(new Date(assignment.due_date), "PPP")}</p>
                )}
                <a href={assignment.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
                  View File
                </a>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" onClick={() => handleEdit(assignment)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(assignment.id, assignment.file_url)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsManagement;