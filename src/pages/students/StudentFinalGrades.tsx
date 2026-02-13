import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
  name_ar: string;
}

interface Grade {
  id: string;
  subject_id: string;
  grade: number;
  max_grade: number;
  grade_type: string;
  notes: string | null;
  created_at: string;
}

// 
const semesterOptions = [
  { key: 'first_semester', label: 'First Semester', label_ar: 'الفصل الأول' },
  { key: 'mid_year', label: 'Mid-Year', label_ar: 'منتصف السنة' },
  { key: 'second_semester', label: 'Second Semester', label_ar: 'الفصل الثاني' },
  { key: 'finals', label: 'Finals', label_ar: 'النهائية' },
];

const StudentFinalGrades = () => {
  const { isRTL } = useLanguage();
  const [studentId, setStudentId] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSemester, setSelectedSemester] = useState(semesterOptions[0].key);
  const [loading, setLoading] = useState(false);

  const getStudentId = () => {
    const stored = localStorage.getItem('studentProfile');
    const profile = JSON.parse(stored).profiles?.[0];
    if (!stored) return '';
    return profile.id || '';
  };

  useEffect(() => {
    const id = getStudentId();
    if (!id) return;
    setStudentId(id);

    fetchSubjects();
    fetchGrades(id, selectedSemester);
  }, []);

  // 
  const fetchSubjects = async () => {
    try {
      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/fetch-subjects');
      const data = await res.json();
      setSubjects(data || []);
    } catch {
      toast.error('Failed to load subjects');
    }
  };

  // 
  const fetchGrades = async (studentId: string, gradeTypes: string) => {
    if (!studentId || gradeTypes.length === 0) return;
    setLoading(true);

    try {

      const res = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/fetch-final-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: studentId,
          subject_id: '', // 
          grade_type: gradeTypes
        }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error('Failed to load grades');
        setGrades([]);
      } else {
        setGrades(data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load grades');
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  // 
  const handleSemesterClick = (semesterKey: string) => {
    setSelectedSemester(semesterKey);
    const id = getStudentId();
    if (!id) return;
    fetchGrades(id, semesterKey);
  };

  // 
  const average = grades.length
    ? (grades.reduce((acc, g) => acc + Number(g.grade), 0) / grades.length).toFixed(2)
    : '0';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? 'درجاتي النهائية' : 'Final Grades'}
        </h1>

        {/* ss */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {semesterOptions.map((s) => (
            <button
              key={s.key}
              onClick={() => handleSemesterClick(s.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors
                ${selectedSemester === s.key 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-muted text-foreground hover:bg-primary/70 hover:text-white'}`}
            >
              {isRTL ? s.label_ar : s.label}
            </button>
          ))}
        </div>

        {/* gt */}
        <div className="glass-card rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-muted-foreground">
              {isRTL ? 'جاري التحميل...' : 'Loading...'}
            </p>
          ) : subjects.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">
              {isRTL ? 'لا توجد مواد' : 'No subjects found'}
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b">{isRTL ? 'المادة' : 'Subject'}</th>
                  <th className="p-4 border-b">{isRTL ? 'الدرجة' : 'Grade'}</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => {
                  const subjectGrades = grades.filter(g => g.subject_id === s.id);
                  const total = subjectGrades.reduce((acc, g) => acc + Number(g.grade), 0);
                  const max = subjectGrades.reduce((acc, g) => acc + Number(g.max_grade), 0);
                  return (
                    <tr key={s.id} className="hover:bg-muted transition-colors">
                      <td className="p-4">{isRTL ? s.name_ar : s.name}</td>
                      <td className="p-4">{total} / {max}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold border-t">
                  <td className="p-4">{isRTL ? 'المعدل' : 'Average'}</td>
                  <td className="p-4">{average}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentFinalGrades;
