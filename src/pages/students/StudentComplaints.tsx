import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  MessageSquare, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

interface Complaint {
  id: string;
  teacher_name: string;
  title: string;
  description: string;
  is_priority: boolean;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  admin_response: string | null;
  created_at: string;
}

const StudentComplaints = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // PIN logic
  const [pin, setPin] = useState(localStorage.getItem('student_pin') || '');
  const [askPin, setAskPin] = useState(false);

  const stored = localStorage.getItem('studentProfile');
  if (!stored) navigate('/students');
  const profile = JSON.parse(stored!).profiles?.[0];

  useEffect(() => {
    if (!pin) {
      setAskPin(true);
    } else {
      fetchComplaints();
    }
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/fetch-complaints',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student_id: profile.id,
            student_pin: btoa(pin),
          }),
        }
      );

      if (!res.ok) throw new Error();
      const data = await res.json();
      setComplaints(data.complaints || []);
    } catch {
      toast.error(t('errors.fetch_complaints'));
      setAskPin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPin = () => {
    if (!pin) return;
    localStorage.setItem('student_pin', pin);
    setAskPin(false);
    fetchComplaints();
  };

  const getStatusIcon = (status: Complaint['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'dismissed': return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusClass = (status: Complaint['status']) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'under_review': return 'status-review';
      case 'resolved': return 'status-resolved';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* PIN MODAL */}
      {askPin && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-background rounded-xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-bold">
              {isRTL ? 'أدخل PIN' : 'Enter PIN'}
            </h2>
            <input
              type="password"
              className="input-field"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button className="btn-primary w-full" onClick={confirmPin}>
              Confirm
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/students/dashboard" className="p-2 rounded-lg hover:bg-muted">
            <Arrow className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {isRTL ? 'احتراقات' : 'My Suggestions'}
            </h1>
            <p className="text-muted-foreground">
              {isRTL ? 'تتبع حالة اقتراحاتك' : 'Track the status of your suggestions'}
            </p>
          </div>
        </div>

        {/* LIST */}
        {isLoading ? (
          <div className="glass-card p-12 text-center">Loading…</div>
        ) : complaints.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageSquare className="mx-auto mb-4 opacity-50" />
            <Link to="/students/complaints/new" className="btn-secondary">
              {isRTL ? 'شكوى جديدة' : 'New Complaint'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedComplaint(c)}
                className="glass-card rounded-xl p-6 cursor-pointer"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{c.teacher_name}</h3>

                    {/* ONLY TITLE STYLE CHANGED */}
                    <h1
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        lineHeight: '1.4',
                        marginTop: '4px',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {c.title}
                    </h1>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  <span className={getStatusClass(c.status)}>
                    {getStatusIcon(c.status)} {t(`status.${c.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentComplaints;
