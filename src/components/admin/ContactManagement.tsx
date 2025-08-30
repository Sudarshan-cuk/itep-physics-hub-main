import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Building, 
  Users,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function ContactManagement() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [facultyMembers, setFacultyMembers] = useState<any[]>([]);
  const [editingContact, setEditingContact] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<string | null>(null);
  const [newFaculty, setNewFaculty] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    department_name: '',
    program_name: '',
    address: '',
    phone: '',
    email: '',
    office_hours: ''
  });

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    position: '',
    specialization: '',
    email: '',
    phone: '',
    office: '',
    display_order: 0
  });

  useEffect(() => {
    fetchContactInfo();
    fetchFacultyMembers();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .single();
      
      if (error) throw error;
      
      setContactInfo(data);
      setContactForm({
        department_name: data.department_name || '',
        program_name: data.program_name || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        office_hours: data.office_hours || ''
      });
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const fetchFacultyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('faculty_members')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setFacultyMembers(data || []);
    } catch (error) {
      console.error('Error fetching faculty members:', error);
    }
  };

  const handleSaveContact = async () => {
    try {
      const { error } = await supabase
        .from('contact_info')
        .update(contactForm)
        .eq('id', contactInfo.id);

      if (error) throw error;

      toast({
        title: 'Contact Information Updated',
        description: 'Contact information has been successfully updated.'
      });

      setEditingContact(false);
      fetchContactInfo();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update contact information.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveFaculty = async (id?: string) => {
    try {
      if (id) {
        // Update existing faculty
        const { error } = await supabase
          .from('faculty_members')
          .update(facultyForm)
          .eq('id', id);

        if (error) throw error;
      } else {
        // Create new faculty
        const { error } = await supabase
          .from('faculty_members')
          .insert([facultyForm]);

        if (error) throw error;
      }

      toast({
        title: 'Faculty Member Saved',
        description: 'Faculty member has been successfully saved.'
      });

      setEditingFaculty(null);
      setNewFaculty(false);
      setFacultyForm({
        name: '',
        position: '',
        specialization: '',
        email: '',
        phone: '',
        office: '',
        display_order: 0
      });
      fetchFacultyMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save faculty member.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faculty_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Faculty Member Deleted',
        description: 'Faculty member has been successfully deleted.'
      });

      fetchFacultyMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete faculty member.',
        variant: 'destructive'
      });
    }
  };

  const startEditFaculty = (faculty: any) => {
    setFacultyForm({
      name: faculty.name,
      position: faculty.position,
      specialization: faculty.specialization,
      email: faculty.email,
      phone: faculty.phone,
      office: faculty.office,
      display_order: faculty.display_order
    });
    setEditingFaculty(faculty.id);
  };

  return (
    <div className="space-y-8">
      {/* Contact Information Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Contact Information Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingContact ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Department Name</label>
                  <Input
                    value={contactForm.department_name}
                    onChange={(e) => setContactForm({...contactForm, department_name: e.target.value})}
                    placeholder="Department of Education"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Program Name</label>
                  <Input
                    value={contactForm.program_name}
                    onChange={(e) => setContactForm({...contactForm, program_name: e.target.value})}
                    placeholder="Integrated Teacher Education Program (ITEP)"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Textarea
                  value={contactForm.address}
                  onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    placeholder="+91 471 2305740"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="education@keralauniversity.ac.in"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Office Hours</label>
                <Textarea
                  value={contactForm.office_hours}
                  onChange={(e) => setContactForm({...contactForm, office_hours: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSaveContact}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingContact(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {contactInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{contactInfo.department_name}</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.program_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{contactInfo.phone}</p>
                      <p className="text-sm text-muted-foreground">Phone</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{contactInfo.email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Office Hours</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{contactInfo.office_hours}</p>
                    </div>
                  </div>
                </div>
              )}
              <Button onClick={() => setEditingContact(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Contact Information
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Faculty Members Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Faculty Members Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setNewFaculty(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty Member
            </Button>
          </div>

          {/* New Faculty Form */}
          {newFaculty && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Add New Faculty Member</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({...facultyForm, name: e.target.value})}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <Input
                      value={facultyForm.position}
                      onChange={(e) => setFacultyForm({...facultyForm, position: e.target.value})}
                      placeholder="Assistant Professor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Specialization</label>
                    <Input
                      value={facultyForm.specialization}
                      onChange={(e) => setFacultyForm({...facultyForm, specialization: e.target.value})}
                      placeholder="Educational Psychology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})}
                      placeholder="john.doe@keralauniversity.ac.in"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={facultyForm.phone}
                      onChange={(e) => setFacultyForm({...facultyForm, phone: e.target.value})}
                      placeholder="+91 471 2305741"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Office</label>
                    <Input
                      value={facultyForm.office}
                      onChange={(e) => setFacultyForm({...facultyForm, office: e.target.value})}
                      placeholder="Education Block, Room 101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Order</label>
                    <Input
                      type="number"
                      value={facultyForm.display_order}
                      onChange={(e) => setFacultyForm({...facultyForm, display_order: parseInt(e.target.value)})}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleSaveFaculty()}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Faculty Member
                  </Button>
                  <Button variant="outline" onClick={() => setNewFaculty(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Faculty Members List */}
          <div className="grid grid-cols-1 gap-4">
            {facultyMembers.map((faculty) => (
              <Card key={faculty.id}>
                <CardContent className="pt-6">
                  {editingFaculty === faculty.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <Input
                            value={facultyForm.name}
                            onChange={(e) => setFacultyForm({...facultyForm, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Position</label>
                          <Input
                            value={facultyForm.position}
                            onChange={(e) => setFacultyForm({...facultyForm, position: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Specialization</label>
                          <Input
                            value={facultyForm.specialization}
                            onChange={(e) => setFacultyForm({...facultyForm, specialization: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input
                            type="email"
                            value={facultyForm.email}
                            onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <Input
                            value={facultyForm.phone}
                            onChange={(e) => setFacultyForm({...facultyForm, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Office</label>
                          <Input
                            value={facultyForm.office}
                            onChange={(e) => setFacultyForm({...facultyForm, office: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Display Order</label>
                          <Input
                            type="number"
                            value={facultyForm.display_order}
                            onChange={(e) => setFacultyForm({...facultyForm, display_order: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleSaveFaculty(faculty.id)}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingFaculty(null)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{faculty.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{faculty.position}</Badge>
                          <Badge variant="outline">{faculty.specialization}</Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>📧 {faculty.email}</p>
                          <p>📞 {faculty.phone}</p>
                          <p>🏢 {faculty.office}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEditFaculty(faculty)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteFaculty(faculty.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}