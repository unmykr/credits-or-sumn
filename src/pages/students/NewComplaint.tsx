import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const NewComplaint = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState(localStorage.getItem('student_pin') || '');
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem('studentProfile');
    if (!storedProfile) navigate('/students');
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error(isRTL ? 'املأ جميع الحقول' : 'Fill all fields');
      return;
    }
    setShowPinPrompt(true);
  };

  const submitWithPin = async () => {
    if (!pin.trim()) {
      toast.error(isRTL ? 'ادخل PIN' : 'Enter PIN');
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem('student_pin', pin);

    try {
      const profile = JSON.parse(localStorage.getItem('studentProfile') || '{}').profiles?.[0];
      await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/create-complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          student_id: profile?.id,
          title: title.trim(),
          description: description.trim(),
          student_pin: btoa(pin),
        }),
      });

      toast.success(isRTL ? 'تم الإرسال' : 'Submitted');
      navigate('/students/complaints');
    } catch {
      toast.error(isRTL ? 'خطأ بالإرسال' : 'Submit error');
    } finally {
      setIsSubmitting(false);
      setShowPinPrompt(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <Link to="/students/dashboard" className="p-2 hover:bg-muted rounded-lg">
              <Arrow className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">
              {isRTL ? 'إرسال اقتراح جديد' : 'Submit a suggestion'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder={isRTL ? 'العنوان' : 'Title'}
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[160px]"
              placeholder={isRTL ? 'الوصف' : 'Description'}
            />

            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              {isRTL ? 'إرسال' : 'Submit'}
            </button>
          </form>
        </motion.div>
      </main>

      {/* PIN MODAL */}
      {showPinPrompt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-2xl p-6 w-full max-w-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-primary">
              <Lock className="w-5 h-5" />
              <h2 className="font-semibold">
                {isRTL ? 'تأكيد PIN' : 'Confirm PIN'}
              </h2>
            </div>

            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input-field"
              placeholder="PIN"
            />

            <button
              disabled={isSubmitting}
              onClick={submitWithPin}
              className="btn-primary w-full"
            >
              {isSubmitting ? '...' : 'Confirm'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewComplaint;
