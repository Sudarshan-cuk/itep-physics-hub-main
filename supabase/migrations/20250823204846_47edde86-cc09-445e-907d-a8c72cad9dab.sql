-- Create tables for admin-managed content
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_name TEXT NOT NULL DEFAULT 'Department of Education',
  program_name TEXT NOT NULL DEFAULT 'Integrated Teacher Education Program (ITEP)',
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  office_hours TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.faculty_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  specialization TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  office TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_info
CREATE POLICY "Anyone can view contact info" 
ON public.contact_info 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage contact info" 
ON public.contact_info 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- RLS Policies for faculty_members
CREATE POLICY "Anyone can view faculty members" 
ON public.faculty_members 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage faculty members" 
ON public.faculty_members 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Insert default contact information for Kerala
INSERT INTO public.contact_info (department_name, program_name, address, phone, email, office_hours)
VALUES (
  'Department of Education',
  'Integrated Teacher Education Program (ITEP)',
  'Department of Education
Kerala University
Palayam Campus, Thiruvananthapuram
Kerala - 695034, India',
  '+91 471 2305740',
  'education@keralauniversity.ac.in',
  'Monday - Friday: 9:30 AM - 4:30 PM
Saturday: 9:30 AM - 12:30 PM
Sunday: Closed'
);

-- Insert sample faculty members
INSERT INTO public.faculty_members (name, position, specialization, email, phone, office, display_order)
VALUES 
('Dr. Priya Nair', 'Head of Department', 'Educational Psychology', 'priya.nair@keralauniversity.ac.in', '+91 471 2305741', 'Education Block, Room 101', 1),
('Dr. Ravi Kumar', 'Associate Professor', 'Science Education', 'ravi.kumar@keralauniversity.ac.in', '+91 471 2305742', 'Education Block, Room 205', 2),
('Dr. Meera Pillai', 'Assistant Professor', 'Mathematics Education', 'meera.pillai@keralauniversity.ac.in', '+91 471 2305743', 'Education Block, Room 208', 3),
('Dr. Suresh Menon', 'Assistant Professor', 'Social Science Education', 'suresh.menon@keralauniversity.ac.in', '+91 471 2305744', 'Education Block, Room 210', 4);

-- Create triggers for updated_at
CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_members_updated_at
BEFORE UPDATE ON public.faculty_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();