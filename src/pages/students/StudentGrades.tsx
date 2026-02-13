import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/layout/Navbar';
import { ArrowLeft, ArrowRight, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
  name_ar: string;
}

interface Grade {
  id: string;
  grade: number;
  max_grade: number;
  grade_type: string;
  notes: string | null;
  created_at: string;
}

const StudentGrades = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);

  
  const subjects: Subject[] = [
    { id: "569c0fea-c1f1-4a0a-a685-d4b5c0291e5d", name: "Mathematics", name_ar: "الرياضيات" },
    { id: "137d9944-b2d6-43e5-8f78-4a29c31b2849", name: "French Language", name_ar: "اللغة الفرنسية" },
    { id: "5c5e0849-d932-43de-a412-390835bd11b7", name: "Physics", name_ar: "الفيزياء" },
    { id: "152e200a-10b6-4dbc-b135-39b23693e326", name: "Chemistry", name_ar: "الكيمياء" },
    { id: "d116b0e5-e110-4790-8b0d-26102dfa2d40", name: "Biology", name_ar: "الأحياء" },
    { id: "ae3c2b4f-7427-45f5-950a-1fc2505790f2", name: "Arabic Language", name_ar: "اللغة العربية" },
    { id: "7deb1923-ae71-4605-80f9-d27e6584e37a", name: "English Language", name_ar: "اللغة الإنجليزية" },
    { id: "a6b1376b-1033-4912-8108-421b9903f639", name: "Islamic Studies", name_ar: "التربية الإسلامية" },
    { id: "4afb0116-0082-4d90-8fe0-ada8d23daa73", name: "History", name_ar: "التاريخ" },
    { id: "69e5ceeb-2ec0-4272-99ca-442c8bb542a6", name: "Computer Science", name_ar: "علوم الحاسوب" }
  ];

 const fetchGrades = async (subjectId: string) => {
  setSelectedSubject(subjectId);
  if (!subjectId) return;

  const stored = localStorage.getItem('studentProfile');
  if (!stored) return toast.error('Student not found');

  const profile = JSON.parse(stored).profiles?.[0];

  setLoading(true);
  try {
    const res = await fetch(
      'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/fetch-student-grades',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: profile.id, subject_id: subjectId }),
      }
    );

    const resData = await res.json(); 
    setGrades(Array.isArray(resData) ? resData : []);
  } catch (err) {
    toast.error('Failed to load grades');
    setGrades([]);
  } finally {
    setLoading(false);
  }
};

  const getGradeTypeLabel = (type: string) => {
    if (isRTL) {
      if (type === 'fmexam') return 'امتحان الشهر الاول';
      if (type === 'smexam') return 'امتحان الشهر الثاني';
      if (type === 'quiz') return 'امتحان يومي / واجب';
      return type;
    } else {
      if (type === 'fmexam') return "First Month's Exam";
      if (type === 'smexam') return "Second Month's Exam";
      if (type === 'quiz') return 'Quiz / Homework';
      return type;
    }
  };

  const getGradeStyle = (grade: number, max: number) => {
    const percent = (grade / max) * 100;
    if (percent === 100) return { color: 'text-yellow-500', icon: <Award className="w-5 h-5 ml-2 text-yellow-500" /> };
    if (percent >= 85) return { color: 'text-green-500', icon: null };
    if (percent >= 70) return { color: 'text-lime-500', icon: null };
    if (percent >= 50) return { color: 'text-orange-500', icon: null };
    return { color: 'text-red-500', icon: null };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/students/dashboard" className="p-2 rounded-lg hover:bg-muted">
            <Arrow className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">
            {isRTL ? 'درجاتي حسب المادة' : 'Grades by Subject'}
          </h1>
        </div>

        <select
          className="w-full max-w-sm p-3 rounded-xl bg-muted mb-8"
          value={selectedSubject}
          onChange={(e) => fetchGrades(e.target.value)}
        >
          <option value="">{isRTL ? 'اختر المادة' : 'Select Subject'}</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {isRTL ? s.name_ar : s.name}
            </option>
          ))}
        </select>

        <motion.div className="glass-card rounded-xl overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          ) : grades.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">{isRTL ? 'لا توجد درجات' : 'No grades found'}</p>
          ) : (
            <div className="divide-y">
              {grades.map(g => {
                const style = getGradeStyle(g.grade, g.max_grade);
                return (
                  <div key={g.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{getGradeTypeLabel(g.grade_type)}</p>
                      <p className="text-sm text-muted-foreground">{new Date(g.created_at).toLocaleDateString()}</p>
                      {g.notes && <p className="text-sm text-muted-foreground mt-1">{g.notes}</p>}
                    </div>
                    <div className={`font-bold text-lg flex items-center ${style.color}`}>
                      {g.grade} / {g.max_grade}
                      {style.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default StudentGrades;
