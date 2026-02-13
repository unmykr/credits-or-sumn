import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

const EditGrade = () => {
  const { isRTL } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [grade, setGrade] = useState<number>(0);
  const [maxGrade, setMaxGrade] = useState<number>(100);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, signOut, session } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

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
        const fetchedProfile = data.profiles?.[0];

        if (!fetchedProfile || fetchedProfile.role !== 'teacher') {
          await signOut();
          navigate('/teachers');
          return;
        }

      } catch (err) {
        console.error(err);
        await signOut();
        navigate('/teachers');
      }
    };

    fetchProfile();
  }, [user, signOut, navigate]);

  const fetchGrade = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('student_grades')
        .select('grade, max_grade, notes')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setGrade(data.grade);
        setMaxGrade(data.max_grade ?? 100);
        setNotes(data.notes ?? '');
      }
    } catch (err) {
      console.error(err);
      toast.error(isRTL ? 'حدث خطأ أثناء جلب الدرجة' : 'Error fetching grade');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('student_grades')
        .update({ grade, max_grade: maxGrade, notes })
        .eq('id', id);

      if (error) throw error;
      toast.success(isRTL ? 'تم تحديث الدرجة بنجاح' : 'Grade updated successfully');
      navigate('/teachers/grades');
    } catch (err) {
      console.error(err);
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث الدرجة' : 'Error updating grade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            to="/teachers/grades"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {isRTL ? 'تعديل الدرجة' : 'Edit Grade'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'قم بتعديل الدرجة والملاحظات' : 'Update grade and notes'}
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {isRTL ? 'الدرجة' : 'Grade'}
              </label>
              <input
                type="number"
                value={grade}
                onChange={e => setGrade(parseFloat(e.target.value))}
                min={0}
                max={maxGrade}
                className="input-field w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {isRTL ? 'الدرجة القصوى' : 'Max Grade'}
              </label>
              <input
                type="number"
                value={maxGrade}
                onChange={e => setMaxGrade(parseFloat(e.target.value))}
                min={1}
                className="input-field w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                {isRTL ? 'ملاحظات' : 'Notes'}
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="input-field w-full"
              />
            </div>

            <div className="flex justify-end gap-3">
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
                    {isRTL ? 'حفظ' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditGrade;
