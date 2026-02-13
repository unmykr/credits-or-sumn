-- Create enums for user types and complaint reasons
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');

CREATE TYPE public.complaint_reason AS ENUM (
  'verbal_abuse',
  'physical_abuse',
  'disrespectful_behavior',
  'sexual_harassment',
  'unfair_grading',
  'humiliation_in_class',
  'yelling_or_threats',
  'inappropriate_language',
  'ignoring_students',
  'refusing_to_explain',
  'poor_teaching_methods',
  'not_following_curriculum',
  'late_or_absent_frequently',
  'misuse_of_authority',
  'privacy_violation',
  'unprofessional_behavior',
  'academic_dishonesty',
  'retaliation_against_students',
  'unclear_exam_rules',
  'lost_or_altered_grades',
  'lack_of_communication',
  'other'
);

CREATE TYPE public.complaint_status AS ENUM ('pending', 'under_review', 'resolved', 'dismissed');

CREATE TYPE public.grade_level AS ENUM (
  'grade_10_science', 'grade_10_literary',
  'grade_11_science', 'grade_11_literary',
  'grade_12_science', 'grade_12_literary'
);

CREATE TYPE public.division AS ENUM ('A', 'B', 'C', 'D');

-- Create profiles table for all users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT,
  student_code TEXT UNIQUE,
  student_pin TEXT,
  grade_level grade_level,
  division division,
  totp_secret TEXT,
  totp_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create teacher_assignments table (which teachers teach which subjects/grades/divisions)
CREATE TABLE public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  grade_level grade_level NOT NULL,
  division division NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(teacher_id, subject_id, grade_level, division)
);

-- Create student grades table
CREATE TABLE public.student_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  grade DECIMAL(5,2) NOT NULL,
  max_grade DECIMAL(5,2) DEFAULT 100,
  notes TEXT,
  grade_type TEXT DEFAULT 'exam',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create grade disputes table
CREATE TABLE public.grade_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  grade_id UUID REFERENCES public.student_grades(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status complaint_status DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  teacher_name TEXT NOT NULL,
  reason complaint_reason NOT NULL,
  description TEXT NOT NULL,
  is_priority BOOLEAN DEFAULT false,
  status complaint_status DEFAULT 'pending',
  admin_response TEXT,
  admin_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table for admin communications
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create login attempts table for rate limiting
CREATE TABLE public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  ip_address TEXT,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  success BOOLEAN DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Create user_roles table for role management (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user profile id
CREATE OR REPLACE FUNCTION public.get_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Subjects: Everyone can read subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Teacher assignments: Teachers see their own, admins see all
CREATE POLICY "Teachers view own assignments" ON public.teacher_assignments
  FOR SELECT USING (
    teacher_id = public.get_profile_id(auth.uid()) 
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins manage assignments" ON public.teacher_assignments
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Student grades: Students see their own, teachers see students in their classes, admins see all
CREATE POLICY "Students view own grades" ON public.student_grades
  FOR SELECT USING (
    student_id = public.get_profile_id(auth.uid())
    OR teacher_id = public.get_profile_id(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers insert grades for their classes" ON public.student_grades
  FOR INSERT WITH CHECK (
    teacher_id = public.get_profile_id(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Teachers update their grades" ON public.student_grades
  FOR UPDATE USING (
    teacher_id = public.get_profile_id(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

-- Grade disputes
CREATE POLICY "Students view own disputes" ON public.grade_disputes
  FOR SELECT USING (
    student_id = public.get_profile_id(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Students create disputes" ON public.grade_disputes
  FOR INSERT WITH CHECK (student_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins update disputes" ON public.grade_disputes
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Complaints
CREATE POLICY "Students view own complaints" ON public.complaints
  FOR SELECT USING (
    student_id = public.get_profile_id(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Students create complaints" ON public.complaints
  FOR INSERT WITH CHECK (student_id = public.get_profile_id(auth.uid()));

CREATE POLICY "Admins update complaints" ON public.complaints
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Messages
CREATE POLICY "Users view own messages" ON public.messages
  FOR SELECT USING (
    recipient_id = public.get_profile_id(auth.uid())
    OR sender_id = public.get_profile_id(auth.uid())
  );

CREATE POLICY "Admins send messages" ON public.messages
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recipients update read status" ON public.messages
  FOR UPDATE USING (recipient_id = public.get_profile_id(auth.uid()));

-- User roles
CREATE POLICY "Users view own role" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Login attempts (public insert for rate limiting, admin read)
CREATE POLICY "Anyone can log attempts" ON public.login_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view attempts" ON public.login_attempts
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_grades_updated_at
  BEFORE UPDATE ON public.student_grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grade_disputes_updated_at
  BEFORE UPDATE ON public.grade_disputes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subjects
INSERT INTO public.subjects (name, name_ar) VALUES
  ('Mathematics', 'الرياضيات'),
  ('Physics', 'الفيزياء'),
  ('Chemistry', 'الكيمياء'),
  ('Biology', 'الأحياء'),
  ('Arabic Language', 'اللغة العربية'),
  ('English Language', 'اللغة الإنجليزية'),
  ('Islamic Studies', 'التربية الإسلامية'),
  ('History', 'التاريخ'),
  ('Geography', 'الجغرافيا'),
  ('Computer Science', 'علوم الحاسوب');