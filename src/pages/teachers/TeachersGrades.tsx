import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Trash, Edit, AlertTriangle, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

interface Grade {
  id: string;
  student_id: string;
  grade: number;
  max_grade: number;
  notes: string | null;
  grade_type: string;
  created_at: string;
  student: { id: string; full_name: string; full_name_ar?: string } | null;
  student_full_name: string | null;
  student_full_name_ar: string | null;
}

const Grades = () => {
  const { user, signOut, session } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  // State
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedGradeType, setSelectedGradeType] = useState('');
  const [availableDivisions, setAvailableDivisions] = useState<string[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  const access_token = session?.access_token || '';

  // 1. Iraqi Grade System Mapping (Matches AddFinalGrades)
  const gradeLevels = [
    { value: 'اول متوسط', label: isRTL ? 'الأول المتوسط' : '1st Intermediate' },
    { value: 'ثاني متوسط', label: isRTL ? 'الثاني المتوسط' : '2nd Intermediate' },
    { value: 'ثالث متوسط', label: isRTL ? 'الثالث المتوسط' : '3rd Intermediate' },
    { value: 'رابع اعدادي', label: isRTL ? 'الرابع الاعدادي' : '4th Preparatory' },
    { value: 'خامس اعدادي', label: isRTL ? 'الخامس الاعدادي' : '5th Preparatory' },
    { value: 'سادس اعدادي', label: isRTL ? 'السادس الاعدادي' : '6th Preparatory' },
  ];

  // 2. Fetch Profile & Role Check
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
        const fetched = data.profiles?.[0];

        if (!fetched || fetched.role !== 'teacher') {
          toast.error(isRTL ? 'غير مصرح لك' : 'Unauthorized');
          navigate('/teachers');
        } else {
          setTeacherProfile(fetched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsVerifying(false);
      }
    };
    fetchProfile();
  }, [user]);

  // 3. Fetch Divisions
  const fetchDivisions = async (grade: string) => {
    if (!grade || !teacherProfile?.id) return;
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
      toast.error(isRTL ? 'خطأ في تحميل الشُعب' : 'Error loading divisions');
    }
  };

  useEffect(() => {
    if (selectedGradeLevel) fetchDivisions(selectedGradeLevel);
    setSelectedDivision('');
  }, [selectedGradeLevel]);

  // 4. Fetch Grades
  const fetchGrades = async () => {
    if (!selectedGradeLevel || !selectedDivision) return;
    setIsLoading(true);
    try {
      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher-grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          grade_level: selectedGradeLevel,
          division: selectedDivision,
          grade_type: selectedGradeType || null,
        }),
      });
      const data = await res.json();
      const mapped = (data || []).map((g: any) => ({
        ...g,
        student_full_name: g.student?.full_name || null,
        student_full_name_ar: g.student?.full_name_ar || null,
      }));
      setGrades(mapped);
    } catch {
      toast.error(isRTL ? 'خطأ في التحميل' : 'Error loading grades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedDivision, selectedGradeType]);

  // 5. Actions (Delete)
  const handleDelete = async () => {
    if (!selectedGrades.length) return;
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف الدرجات المختارة؟' : 'Delete selected grades?')) return;

    try {
      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/teacher_delete_grade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ ids: selectedGrades }),
      });
      
      if (res.ok) {
        toast.success(isRTL ? 'تم الحذف بنجاح' : 'Deleted successfully');
        fetchGrades();
        setSelectedGrades([]);
      }
    } catch (err) {
      toast.error(isRTL ? 'خطأ في الحذف' : 'Error deleting');
    }
  };

  if (isVerifying) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        
        {/* Filter Section */}
        <div className="glass-card p-6 rounded-2xl mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={selectedGradeLevel} onChange={e => setSelectedGradeLevel(e.target.value)} className="w-full p-2.5 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">{isRTL ? 'اختر الصف' : 'Select Grade'}</option>
            {gradeLevels.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>

          <select value={selectedDivision} onChange={e => setSelectedDivision(e.target.value)} className="w-full p-2.5 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">{isRTL ? 'اختر الشعبة' : 'Select Division'}</option>
            {availableDivisions.map(d => <option key={d} value={d}>{isRTL ? `شعبة ${d}` : `Division ${d}`}</option>)}
          </select>

          <select value={selectedGradeType} onChange={e => setSelectedGradeType(e.target.value)} className="w-full p-2.5 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20">
            <option value="">{isRTL ? 'كل أنواع الدرجات' : 'All Grade Types'}</option>
            <option value="fmexam">{isRTL ? 'امتحان شهر أول' : "1st Month Exam"}</option>
            <option value="smexam">{isRTL ? 'امتحان شهر ثاني' : "2nd Month Exam"}</option>
            <option value="quiz">{isRTL ? 'كويز / واجب' : 'Quiz/Homework'}</option>
            <option value="finals">{isRTL ? 'الامتحان النهائي' : 'Final Exam'}</option>
          </select>
        </div>

        {/* Grades List */}
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary/40" /></div>
          ) : grades.length === 0 ? (
            <div className="p-20 text-center text-muted-foreground">{isRTL ? 'لا توجد بيانات' : 'No data found'}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-4 text-center w-12">
                      <input type="checkbox" checked={selectedGrades.length === grades.length} onChange={e => setSelectedGrades(e.target.checked ? grades.map(g => g.id) : [])} />
                    </th>
                    <th className="p-4 text-start font-bold">{isRTL ? 'الطالب' : 'Student'}</th>
                    <th className="p-4 text-start font-bold">{isRTL ? 'الدرجة' : 'Grade'}</th>
                    <th className="p-4 text-start font-bold">{isRTL ? 'النوع' : 'Type'}</th>
                    <th className="p-4 text-start font-bold">{isRTL ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {grades.map(grade => (
                    <tr key={grade.id} className="hover:bg-primary/5 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" checked={selectedGrades.includes(grade.id)} onChange={() => setSelectedGrades(p => p.includes(grade.id) ? p.filter(x => x !== grade.id) : [...p, grade.id])} />
                      </td>
                      <td className="p-4 font-medium">{isRTL ? grade.student_full_name_ar || grade.student_full_name : grade.student_full_name}</td>
                      <td className="p-4"><span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold">{grade.grade}</span></td>
                      <td className="p-4 text-sm opacity-70">{grade.grade_type}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => navigate(`/teachers/grades/edit/${grade.id}`)} className="p-2 hover:bg-background rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={handleDelete} className="p-2 hover:bg-background rounded-lg text-red-600"><Trash className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                 <button onClick={handleDelete} disabled={selectedGrades.length === 0} className="px-6 py-2 bg-destructive text-white rounded-xl font-bold disabled:opacity-30">
                    {isRTL ? 'حذف المحدد' : 'Delete Selected'}
                 </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Grades;