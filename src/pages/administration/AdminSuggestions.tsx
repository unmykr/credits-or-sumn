import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  User,
  Filter
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { toast } from 'sonner';

interface Complaint {
  id: string;
  teacher_name: string;
  reason: string;
  description: string;
  is_priority: boolean;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  admin_response: string | null;
  created_at: string;
  student: {
    full_name: string;
    full_name_ar: string | null;
    grade_level: string | null;
    division: string | null;
  };
}

const AdminSuggestions = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowRight : ArrowLeft;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState<Complaint['status']>('under_review');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'priority' | 'pending'>('all');
  const { user, signOut, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const access_token = session.access_token;

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

        if (!fetchedProfile || fetchedProfile.role !== 'admin') {
          await signOut();
          navigate('/teachers');
          return;
        }

        setProfile(fetchedProfile);
      } catch (err) {
        console.error(err);
        await signOut();
        navigate('/teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, signOut, navigate]);

  const fetchComplaints = async () => {
    try {
      // calling function /get-suggestions that has take:20, skip:0, but if user clicks on another dropdown, it should fetch again with skip increased by 20
      const res = await fetch(
        'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/get-suggestions',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}` // KEEZING THIS TEMP; REPLACE LATER FOR FASTER FETCHs
           },
        }
      );
      const data = await res.json();
      setComplaints(data.suggestions || []);
    }
    catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error(isRTL ? 'حدث خطأ أثناء جلب الاقتراحات' : 'Error fetching suggestions');
    } 
    finally {
      setIsLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          status: newStatus,
          admin_response: response || null,
          admin_id: profile?.id,
        })
        .eq('id', selectedComplaint.id);

      if (error) throw error;

      toast.success(isRTL ? 'تم تحديث الشكوى' : 'Complaint updated');
      setSelectedComplaint(null);
      setResponse('');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error(isRTL ? 'حدث خطأ' : 'Error occurred');
    } finally {
      setIsSubmitting(false);
    }
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
      case 'resolved': return 'status-resolved';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'pending') return c.status === 'pending' || c.status === 'under_review';
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link
              to="/administration/dashboard"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Arrow className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {isRTL ? 'مراجعة الاقتراحات' : 'Review Suggestions'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? 'إدارة اقتراحات الطلاب' : 'Manage student suggestions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="input-field py-2 px-3"
            >
              <option value="all">{isRTL ? 'الكل' : 'All'}</option>
              <option value="resolved">{isRTL ? 'تم معالجة' : 'Resolved'}</option>
              <option value="pending">{isRTL ? 'جديد' : 'New'}</option>
            </select>
          </div>
        </motion.div>

        {/* Complaints List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isLoading ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">{isRTL ? 'لا توجد شكاوى' : 'No complaints'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-xl p-5 md:p-6 cursor-pointer hover:shadow-school-md transition-shadow ${
                    complaint.is_priority ? 'border-2 border-destructive/30' : ''
                  }`}
                  onClick={() => {
                    setSelectedComplaint(complaint);
                    setNewStatus(complaint.status);
                    setResponse(complaint.admin_response || '');
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        complaint.is_priority ? 'bg-destructive/10' : 'bg-primary/10'
                      }`}>
                        {complaint.is_priority ? (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {isRTL ? 'شكوى ضد: ' : 'Complaint against: '}{complaint.teacher_name}
                          </h3>
                          {complaint.is_priority && (
                            <span className="priority-badge text-xs">
                              {isRTL ? 'أولوية عالية' : 'High Priority'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="font-medium">
                            {isRTL ? complaint.student?.full_name_ar || complaint.student?.full_name : complaint.student?.full_name}
                          </span>
                          <span>•</span>
                          <span>{complaint.student?.grade_level} - {complaint.student?.division}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {t(`reason.${complaint.reason}`)}
                        </p>
                        
                        <p className="text-sm text-foreground line-clamp-2">
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`${getStatusClass(complaint.status)} flex items-center gap-1.5`}>
                        {getStatusIcon(complaint.status)}
                        {t(`status.${complaint.status}`)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(complaint.created_at).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Detail Modal */}
        {selectedComplaint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSelectedComplaint(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="glass-card rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-foreground">
                      {isRTL ? 'شكوى ضد: ' : 'Complaint against: '}{selectedComplaint.teacher_name}
                    </h2>
                    {selectedComplaint.is_priority && (
                      <span className="priority-badge text-xs">
                        {isRTL ? 'أولوية' : 'Priority'}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{t(`reason.${selectedComplaint.reason}`)}</p>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              {/* Student Info */}
              <div className="p-4 rounded-xl bg-muted/50 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {isRTL ? 'معلومات الطالب' : 'Student Information'}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{isRTL ? 'الاسم:' : 'Name:'}</span>
                    <span className="font-medium text-foreground ms-2">
                      {isRTL ? selectedComplaint.student?.full_name_ar || selectedComplaint.student?.full_name : selectedComplaint.student?.full_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{isRTL ? 'المرحلة:' : 'Grade:'}</span>
                    <span className="font-medium text-foreground ms-2">
                      {selectedComplaint.student?.grade_level} - {selectedComplaint.student?.division}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {isRTL ? 'تفاصيل الشكوى' : 'Complaint Details'}
                </h3>
                <p className="text-foreground whitespace-pre-wrap">{selectedComplaint.description}</p>
              </div>
              
              {/* Status Update */}
              <div className="space-y-4 border-t border-border pt-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isRTL ? 'تحديث الحالة' : 'Update Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as Complaint['status'])}
                    className="input-field"
                  >
                    <option value="pending">{t('status.pending')}</option>
                    <option value="under_review">{t('status.under_review')}</option>
                    <option value="resolved">{t('status.resolved')}</option>
                    <option value="dismissed">{t('status.dismissed')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {isRTL ? 'رد الإدارة' : 'Admin Response'}
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="input-field min-h-[100px] resize-y"
                    placeholder={isRTL ? 'اكتب ردك هنا...' : 'Write your response here...'}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="btn-outline flex-1"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleUpdateComplaint}
                    disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {isRTL ? 'حفظ التحديث' : 'Save Update'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminSuggestions;
