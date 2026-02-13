import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, ArrowRight, CheckCircle, Users, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

interface Student {
  id: string;
  full_name: string;
  full_name_ar: string | null;
  grade_level: string;
  division: string;
}

interface GradeEntry {
  studentId: string;
  grade: string;
  notes: string;
}

interface TeacherProfile {
  id: string;
  user_id: string | null;
  role: string;
  full_name: string;
  full_name_ar: string | null;
}

const AddGrades = () => {
  const { isRTL } = useLanguage();
  const { user, signOut, session, profile } = useAuth();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  // SAFETY FIX: Prevent crash when session is null
  const access_token = session?.access_token || '';

  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeType, setGradeType] = useState('fmexam');
  const [maxGrade, setMaxGrade] = useState('100');
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([]);
  const [subjects, setSubjects] = useState<{id: string; name: string; name_ar: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  // 1. Iraqi Grade System Mapping
  const gradeLevels = [
    { value: 'اول متوسط', label: isRTL ? 'الأول المتوسط' : '1st Intermediate' },
    { value: 'ثاني متوسط', label: isRTL ? 'الثاني المتوسط' : '2nd Intermediate' },
    { value: 'ثالث متوسط', label: isRTL ? 'الثالث المتوسط' : '3rd Intermediate' },
    { value: 'رابع اعدادي', label: isRTL ? 'الرابع الاعدادي' : '4th Preparatory' },
    { value: 'خامس اعدادي', label: isRTL ? 'الخامس الاعدادي' : '5th Preparatory' },
    { value: 'سادس اعدادي', label: isRTL ? 'السادس الاعدادي' : '6th Preparatory' },
  ];

  const gradeTypes = [
    { value: 'fmexam', label: isRTL ? 'امتحان شهر اول' : "Monthly Exam (1st)" },
    { value: 'smexam', label: isRTL ? 'امتحان شهر ثاني' : "Monthly Exam (2nd)" },
    { value: 'quiz', label: isRTL ? 'امتحان يومي/واجب' : 'Quiz/Homework' },
  ];

  // 2. Fetch Teacher Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsVerifying(false);
        return;
      }
      try {
        const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/get-profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id }),
        });
        const data = await res.json();
        const fetchedProfile = data.profiles?.[0];

        if (!fetchedProfile || fetchedProfile.role !== 'teacher') {
          toast.error(isRTL ? 'غير مصرح لك بالدخول' : 'Unauthorized access');
          await signOut();
          navigate('/teachers');
          return;
        }
        setTeacherProfile(fetchedProfile);
      } catch (err) {
        console.error(err);
        toast.error(isRTL ? 'حدث خطأ' : 'An error occurred');
      } finally {
        setIsVerifying(false);
      }
    };
    fetchProfile();
  }, [user, navigate, signOut, isRTL]);

  // 3. Fetch Subjects
  const fetchSubjects = useCallback(async () => {
    if (!teacherProfile?.id || !access_token) return;
    try {
      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher-subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          user_id: teacherProfile.id,
          grade_type: gradeType,
          grade_level: selectedGradeLevel,
        }),
      });
      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch (err) {
      console.error(err);
    }
  }, [teacherProfile?.id, access_token, gradeType, selectedGradeLevel]);

  // 4. Fetch Divisions
  const fetchDivisions = useCallback(async (grade: string) => {
    if (!grade || !teacherProfile?.id || !access_token) return;
    try {
      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher-assignments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${access_token}` 
        },
        body: JSON.stringify({ teacher_id: teacherProfile.id, grade_level: grade }),
      });
      const json = await res.json();
      setAvailableDivisions(json.divisions || []);
    } catch (err) {
      toast.error(isRTL ? 'حدث خطأ في تحميل الشُعب' : 'Error loading divisions');
    }
  }, [access_token, teacherProfile?.id, isRTL]);

  // 5. Fetch Students
  const fetchStudents = useCallback(async () => {
    if (!selectedGradeLevel || !selectedDivision || !access_token) return;
    setIsLoading(true);
    try {
      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/fetch-students-by-division', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}` 
        },
        body: JSON.stringify({ grade_level: selectedGradeLevel, division: selectedDivision })
      });
      const { data } = await res.json();
      setStudents(data as Student[] || []);
      setGradeEntries((data || []).map((s: Student) => ({ studentId: s.id, grade: '', notes: '' })));
    } catch (err) {
      toast.error(isRTL ? 'حدث خطأ في تحميل الطلاب' : 'Error loading students');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGradeLevel, selectedDivision, access_token, isRTL]);

  useEffect(() => {
    if (selectedGradeLevel) {
      setSelectedDivision('');
      setStudents([]);
      fetchDivisions(selectedGradeLevel);
    }
  }, [selectedGradeLevel, fetchDivisions]);

  useEffect(() => {
    if (selectedGradeLevel && selectedDivision) fetchStudents();
  }, [selectedGradeLevel, selectedDivision, fetchStudents]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const updateGradeEntry = (studentId: string, field: 'grade' | 'notes', value: string) => {
    setGradeEntries(prev => 
      prev.map(entry => entry.studentId === studentId ? { ...entry, [field]: value } : entry)
    );
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      toast.error(isRTL ? 'يرجى اختيار المادة' : 'Please select a subject');
      return;
    }

    const validEntries = gradeEntries.filter(e => e.grade.trim() !== '');
    if (validEntries.length === 0) {
      toast.error(isRTL ? 'يرجى إدخال درجة واحدة على الأقل' : 'Please enter at least one grade');
      return;
    }

    setIsSubmitting(true);
    try {
      const gradesToInsert = validEntries.map(entry => ({
        student_id: entry.studentId,
        subject_id: selectedSubject,
        teacher_id: profile?.id,
        grade: parseFloat(entry.grade),
        max_grade: parseFloat(maxGrade),
        notes: entry.notes || null,
        grade_type: gradeType,
      }));

      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher_add_grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({ data: gradesToInsert }),
      });

      if (res.ok) {
        toast.success(isRTL ? 'تم حفظ الدرجات بنجاح' : 'Grades saved successfully');
        navigate('/teachers/grades');
      }
    } catch (err) {
      toast.error(isRTL ? 'حدث خطأ في حفظ الدرجات' : 'Error saving grades');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  if (isVerifying) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <Link to="/teachers/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Arrow className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{isRTL ? 'إضافة درجات' : 'Add Grades'}</h1>
          </div>
        </motion.div>

        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm mb-2">{isRTL ? 'المرحلة' : 'Grade Level'}</label>
              <select value={selectedGradeLevel} onChange={(e) => setSelectedGradeLevel(e.target.value)} className="w-full p-2 border rounded-xl bg-background outline-none">
                <option value="">{isRTL ? 'اختر المرحلة' : 'Select grade'}</option>
                {gradeLevels.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">{isRTL ? 'الشعبة' : 'Division'}</label>
              <select value={selectedDivision} onChange={(e) => setSelectedDivision(e.target.value)} className="w-full p-2 border rounded-xl bg-background outline-none">
                <option value="">{isRTL ? 'اختر الشعبة' : 'Select division'}</option>
                {availableDivisions.map(d => <option key={d} value={d}>{isRTL ? `شعبة ${d}` : `Division ${d}`}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">{isRTL ? 'المادة' : 'Subject'}</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full p-2 border rounded-xl bg-background outline-none">
                <option value="">{isRTL ? 'اختر المادة' : 'Select subject'}</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{isRTL ? s.name_ar : s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">{isRTL ? 'نوع الدرجة' : 'Grade Type'}</label>
              <select value={gradeType} onChange={(e) => setGradeType(e.target.value)} className="w-full p-2 border rounded-xl bg-background outline-none">
                {gradeTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">{isRTL ? 'الدرجة القصوى' : 'Max Grade'}</label>
              <input type="number" value={maxGrade} onChange={(e) => setMaxGrade(e.target.value)} className="w-full p-2 border rounded-xl bg-background outline-none" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">{isRTL ? 'اختر المرحلة والشعبة' : 'Select grade and division'}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-start">{isRTL ? 'اسم الطالب' : 'Student Name'}</th>
                      <th className="px-4 py-3 text-start w-32">{isRTL ? 'الدرجة' : 'Grade'}</th>
                      <th className="px-4 py-3 text-start">{isRTL ? 'ملاحظات' : 'Notes'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{isRTL ? student.full_name_ar || student.full_name : student.full_name}</td>
                        <td className="px-4 py-3">
                          <input type="number" value={gradeEntries[index]?.grade || ''} onChange={(e) => updateGradeEntry(student.id, 'grade', e.target.value)} className="w-full p-2 border rounded-lg bg-background" placeholder="0" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" value={gradeEntries[index]?.notes || ''} onChange={(e) => updateGradeEntry(student.id, 'notes', e.target.value)} className="w-full p-2 border rounded-lg bg-background" placeholder="..." />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t flex justify-end gap-3">
                <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  {isRTL ? 'حفظ الدرجات' : 'Save Grades'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddGrades;