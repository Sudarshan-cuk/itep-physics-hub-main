import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Building, Users, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function ContactManagement() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [facultyMembers, setFacultyMembers] = useState<any[]>([]);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isFacultyFormOpen, setIsFacultyFormOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);

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
    const { data, error } = await supabase.from('contact_info').select('*').single();
    if (data) {
      setContactInfo(data);
      setContactForm(data);
    }
  };

  const fetchFacultyMembers = async () => {
    const { data, error } = await supabase.from('faculty_members').select('*').order('display_order', { ascending: true });
    if (data) setFacultyMembers(data);
  };

  const handleSaveContact = async () => {
    const { error } = await supabase.from('contact_info').update(contactForm).eq('id', contactInfo.id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update contact information.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Contact information updated.' });
      setIsContactFormOpen(false);
      fetchContactInfo();
    }
  };

  const handleSaveFaculty = async () => {
    const { error } = selectedFaculty
      ? await supabase.from('faculty_members').update(facultyForm).eq('id', selectedFaculty.id)
      : await supabase.from('faculty_members').insert([facultyForm]);

    if (error) {
      toast({ title: 'Error', description: 'Failed to save faculty member.', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Faculty member saved.' });
      setIsFacultyFormOpen(false);
      setSelectedFaculty(null);
      fetchFacultyMembers();
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      const { error } = await supabase.from('faculty_members').delete().eq('id', id);
      if (error) {
        toast({ title: 'Error', description: 'Failed to delete faculty member.', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Faculty member deleted.' });
        fetchFacultyMembers();
      }
    }
  };

  const openFacultyForm = (faculty: any | null) => {
    setSelectedFaculty(faculty);
    setFacultyForm(faculty || { name: '', position: '', specialization: '', email: '', phone: '', office: '', display_order: 0 });
    setIsFacultyFormOpen(true);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" /> Contact Information</CardTitle>
          <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" /> Edit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Edit Contact Information</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                {Object.entries(contactForm).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1 capitalize">{key.replace('_', ' ')}</label>
                    <Input value={value} onChange={(e) => setContactForm({ ...contactForm, [key]: e.target.value })} />
                  </div>
                ))}
                <Button onClick={handleSaveContact}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {contactInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<Building />} label="Department" value={contactInfo.department_name} />
              <InfoItem icon={<Phone />} label="Phone" value={contactInfo.phone} />
              <InfoItem icon={<Mail />} label="Email" value={contactInfo.email} />
              <InfoItem icon={<Clock />} label="Office Hours" value={contactInfo.office_hours} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Faculty Members</CardTitle>
          <Button onClick={() => openFacultyForm(null)}><Plus className="h-4 w-4 mr-2" /> Add Faculty</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {facultyMembers.map((faculty) => (
              <Card key={faculty.id}>
                <CardContent className="pt-6 flex justify-between items-start">
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
                    <Button variant="outline" size="sm" onClick={() => openFacultyForm(faculty)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteFaculty(faculty.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFacultyFormOpen} onOpenChange={setIsFacultyFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedFaculty ? 'Edit' : 'Add'} Faculty Member</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            {Object.entries(facultyForm).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 capitalize">{key.replace('_', ' ')}</label>
                <Input
                  type={key === 'display_order' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setFacultyForm({ ...facultyForm, [key]: e.target.value })}
                />
              </div>
            ))}
            <Button onClick={handleSaveFaculty}>Save Faculty Member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-3">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="font-medium">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);