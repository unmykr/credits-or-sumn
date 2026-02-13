import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth, type Profile } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Users } from 'lucide-react';
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

const AddFinalGrades = () => {
  const { isRTL } = useLanguage();
  const { profile, user, signOut, session } = useAuth();
  const navigate = useNavigate();

  const access_token = session?.access_token;

  const [teacherProfile, setTeacherProfile] = useState<Profile | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const [gradeType, setGradeType] = useState<string | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState<{ id: string; name: string; name_ar: string }[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([]);
  const [maxGrade, setMaxGrade] = useState('100');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const gradeLevels = [
    { value: '7', label: isRTL ? 'الصف الأول المتوسط' : '1st Intermediate Grade' },
    { value: '8', label: isRTL ? 'الصف الثاني متوسط ' : '2nd Intermediate Grade' },
    { value: '9', label: isRTL ? 'الصف الثالث متوسط ' : '3rd Intermediate Grade' },
    { value: '10', label: isRTL ? 'الصف الرابع اعدادي' : '4th Prep Grade' },
    { value: '11', label: isRTL ? 'الصف الخامس اعدادي' : '5th Prep Grade' },
    { value: '12', label: isRTL ? 'الصف السادس اعدادي' : '6th Prep Grade' },
  ];

  const finalGradeTypes = [
    { value: 'first_semester', label: isRTL ? 'الفصلي الأول' : 'First Semester' },
    { value: 'mid_year', label: isRTL ? 'منتصف السنة' : 'Mid-Year' },
    { value: 'second_semester', label: isRTL ? 'الفصلي الثاني' : 'Second Semester' },
    { value: 'finals', label: isRTL ? 'النهائي' : 'Finals' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsVerifying(false);
        return;
      }

      try {
        const res = await fetch(
          'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/get-profiles',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id }),
          }
        );

        const data = await res.json();
        const fetched = data.profiles?.[0];

        if (!fetched || fetched.role !== 'teacher') {
          toast.error(isRTL ? 'غير مصرح لك بالدخول' : 'Unauthorized access');
          await signOut();
          navigate('/teachers');
          return;
        }

        setTeacherProfile(fetched);
      } catch {
        toast.error(isRTL ? 'حدث خطأ' : 'An error occurred');
        navigate('/teachers');
      } finally {
        setIsVerifying(false);
      }
    };

    fetchProfile();
  }, [user, navigate, signOut, isRTL]);

  const fetchDivisions = useCallback(async (grade: string) => {
    if (!grade || !teacherProfile?.id) return;

    try {
      const res = await fetch(
        'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher-assignments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            teacher_id: teacherProfile.id,
            grade_level: grade,
          }),
        }
      );

      const json = await res.json();
      setAvailableDivisions(json.divisions || []);
    } catch {
      toast.error(isRTL ? 'خطأ في تحميل الشُعب' : 'Error loading divisions');
    }
  }, [access_token, teacherProfile?.id, isRTL]);

  useEffect(() => {
    setSelectedDivision('');
    setStudents([]);
    setSubjects([]);
    if (selectedGradeLevel) fetchDivisions(selectedGradeLevel);
  }, [selectedGradeLevel, teacherProfile, fetchDivisions]);

  const fetchSubjects = useCallback(async () => {
    if (!teacherProfile?.id || !gradeType || !selectedGradeLevel) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher-subjects',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            user_id: teacherProfile.id,
            grade_type: gradeType,
            grade_level: selectedGradeLevel,
          }),
        }
      );

      const data = await res.json();
      setSubjects(data.subjects || []);
    } catch {
      toast.error(isRTL ? 'خطأ في تحميل المواد' : 'Error loading subjects');
    } finally {
      setIsLoading(false);
    }
  }, [teacherProfile?.id, gradeType, selectedGradeLevel, access_token, isRTL]);

  useEffect(() => {
    fetchSubjects();
  }, [teacherProfile, gradeType, selectedGradeLevel, fetchSubjects]);

  const updateGradeEntry = (
  studentId: string,
  field: 'grade' | 'notes',
  value: string
    ) => {
  setGradeEntries(prev =>
    prev.map(e =>
      e.studentId === studentId ? { ...e, [field]: value } : e
    )
  );
  };


  const fetchStudents = useCallback(async () => {
      if (!selectedGradeLevel || !selectedDivision) return;
  
      setIsLoading(true);
      try {
        const res = await fetch(
          'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/fetch-students-by-division',
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${access_token}` 
            },
            body: JSON.stringify({ grade_level: selectedGradeLevel, division: selectedDivision })
          }
        );
        const { data, error } = await res.json();
        if (error) throw error;
  
        setStudents(data as Student[] || []);
        setGradeEntries((data || []).map(s => ({ studentId: s.id, grade: '', notes: '' })));
      } catch (err) {
        console.error('Error fetching students:', err);
        toast.error(isRTL ? 'حدث خطأ في تحميل الطلاب' : 'Error loading students');
      } finally {
        setIsLoading(false);
      }
    }, [selectedGradeLevel, selectedDivision, access_token, isRTL]);

  useEffect(() => {
    if (selectedGradeLevel && selectedDivision) {
      fetchStudents();
    }
  }, [selectedGradeLevel, selectedDivision, fetchStudents]);

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

      const res = await fetch(
      'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher_add_grades',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
        data: gradesToInsert,
        }),
      });

    const result = await res.json();
    if (!res.ok || result.error) {
  throw new Error(result.message || 'Failed to add grades');
}

      toast.success(isRTL ? 'تم حفظ الدرجات بنجاح' : 'Grades saved successfully');
    } catch (err) {
      console.error('Error saving grades:', err);
      toast.error(isRTL ? 'حدث خطأ في حفظ الدرجات' : 'Error saving grades');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isVerifying ? (
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          </div>
        </main>
      ) : (
        <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {isRTL ? 'إضافة درجات نهائية' : 'Add Final Grades'}
          </h1>
          <p className="text-muted-foreground">
            {isRTL ? 'أضف درجات الطلاب للامتحانات النهائية' : 'Add students grades for final exams'}
          </p>
        </motion.div>

        <motion.div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="font-medium mb-4">{isRTL ? 'اختر نوع الامتحان' : 'Select Grade Type'}</h2>
          <div className="flex flex-wrap gap-3">
            {finalGradeTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setGradeType(t.value)}
                className={`px-4 py-2 rounded-lg border ${
                  gradeType === t.value 
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-foreground border-border'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        {gradeType && (
          <motion.div className="glass-card p-6 rounded-2xl mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label>{isRTL ? 'المرحلة' : 'Grade Level'}</label>
                <select
                  value={selectedGradeLevel}
                  onChange={(e) => setSelectedGradeLevel(e.target.value)}
                  className="input-field"
                >
                  <option value="">{isRTL ? 'اختر المرحلة' : 'Select grade'}</option>
                  {gradeLevels.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>{isRTL ? 'الشعبة' : 'Division'}</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="input-field"
                >
                  <option value="">{isRTL ? 'اختر الشعبة' : 'Select division'}</option>
                  {availableDivisions.map(d => (
                    <option key={d} value={d}>{isRTL ? `شعبة ${d}` : `Division ${d}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>{isRTL ? 'المادة' : 'Subject'}</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input-field"
                >
                  <option value="">{isRTL ? 'اختر المادة' : 'Select subject'}</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{isRTL ? s.name_ar : s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>{isRTL ? 'الدرجة القصوى' : 'Max Grade'}</label>
                <input
                  type="number"
                  value={maxGrade}
                  onChange={(e) => setMaxGrade(e.target.value)}
                  className="input-field"
                  min="1"
                  max="1000"
                />
              </div>
            </div>
          </motion.div>
        )}

    {gradeType && (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden"
    >
        {isLoading ? (
        <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
        ) : students.length === 0 ? (
        <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
            {!selectedGradeLevel || !selectedDivision
                ? isRTL ? 'اختر المرحلة والشعبة لعرض الطلاب' : 'Select grade level and division to view students'
                : isRTL ? 'لا يوجد طلاب في هذه الشعبة' : 'No students in this division'}
            </p>
        </div>
        ) : (
        <>
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {isRTL ? 'اسم الطالب' : 'Student Name'}
                    </th>
                    <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground w-32">
                    {isRTL ? 'الدرجة' : 'Grade'}
                    </th>
                    <th className="px-4 py-3 text-start text-sm font-medium text-muted-foreground">
                    {isRTL ? 'ملاحظات' : 'Notes'}
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-border">
                {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                        <span className="font-medium text-foreground">
                        {isRTL ? student.full_name_ar || student.full_name : student.full_name}
                        </span>
                    </td>
                    <td className="px-4 py-3">
                        <input
                        type="number"
                        value={gradeEntries[index]?.grade || ''}
                        onChange={(e) => updateGradeEntry(student.id, 'grade', e.target.value)}
                        className="input-field w-24 py-2"
                        placeholder="0"
                        min="0"
                        max={maxGrade}
                        />
                    </td>
                    <td className="px-4 py-3">
                        <input
                        type="text"
                        value={gradeEntries[index]?.notes || ''}
                        onChange={(e) => updateGradeEntry(student.id, 'notes', e.target.value)}
                        className="input-field py-2"
                        placeholder={isRTL ? 'ملاحظات (اختياري)' : 'Notes (optional)'}
                        />
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-3">
            <Link to="/teachers/dashboard" className="btn-outline">
            {   isRTL ? 'إلغاء' : 'Cancel'}
            </Link>
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
            >
                {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                <>
                    <CheckCircle className="w-5 h-5" />
                    {isRTL ? 'تأكيد وحفظ' : 'Confirm & Save'}
                </>
                )}
            </button>
            </div>
        </>
        )}
    </motion.div>
    )}
        </main>
      )}
    </div>
  );
};

export default AddFinalGrades;
