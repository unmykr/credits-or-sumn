import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  LogOut, 
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  MessageSquare,
  Users,
  BookOpen,
  Mail,
  Sparkles,
  BarChart3
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const AdminDashboard = () => {
  const { isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  const [stats, setStats] = useState({
    pendingComplaints: 0,
    priorityComplaints: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });

  const isAdmin = async () => {
    // do fetchProfile() and check if role is 'admin'. if so then don't keep doing it in useEffect
    if (!user) return false;

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
        return false;
      }

      setProfile(fetchedProfile);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  useEffect(() => {
    
    
    const fetchProfile = async () => {
      

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

  const fetchStats = async () => {
    try {
      const [complaintsRes, studentsRes, teachersRes] = await Promise.all([
        supabase.from('complaints').select('id, is_priority, status'),
        supabase.from('profiles').select('id').eq('role', 'student'),
        supabase.from('profiles').select('id').eq('role', 'teacher'),
      ]);

      const complaints = complaintsRes.data || [];
      
      setStats({
        pendingComplaints: complaints.filter(c => c.status === 'pending' || c.status === 'under_review').length,
        priorityComplaints: complaints.filter(c => c.is_priority && c.status !== 'resolved' && c.status !== 'dismissed').length,
        totalStudents: studentsRes.data?.length || 0,
        totalTeachers: teachersRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/administration');
  };

  const menuItems = [
    {
      icon: Sparkles,
      title: isRTL ? 'مراجعة الاقتراحات' : 'Review Suggestions',
      description: isRTL ? 'عرض وإدارة اقتراحات الطلاب' : 'View and manage student\'s suggestions',
      href: '/administration/suggestions',
      color: 'from-accent to-accent/70',
      badge: stats.pendingComplaints > 0 ? stats.pendingComplaints : null,
      priority: stats.priorityComplaints > 0,
    },
    {
      icon: Mail,
      title: isRTL ? 'إرسال رسائل' : 'Broadcast: Send Messages',
      description: isRTL ? 'التواصل مع المعلمين والطلاب' : 'Communicate with teachers and students',
      href: '/administration/messages',
      color: 'from-primary to-primary/70',
    },
    {
      icon: BookOpen,
      title: isRTL ? 'عرض الدرجات' : 'View All Grades',
      description: isRTL ? 'عرض جميع درجات الطلاب' : 'View all student grades',
      href: '/administration/grades',
      color: 'from-secondary to-secondary/70',
    },
    {
      icon: Users,
      title: isRTL ? 'إدارة الطلاب' : 'Manage Students',
      description: isRTL ? 'إدارة الطلاب - اضف او احذف طلبة' : 'Add or remove students',
      href: '/administration/students',
      color: 'from-accent to-accent/70',
    },
  ];

  const statCards = [
    {
      icon: Sparkles,
      label: isRTL ? 'مقترحات جديدة' : 'Pending Suggestions',
      value: stats.pendingComplaints,
      color: 'text-foreground bg-foreground/10',
    },
    {
      icon: Users,
      label: isRTL ? 'إجمالي الطلاب' : 'Total Students',
      value: stats.totalStudents,
      color: 'text-secondary bg-secondary/10',
    },
    {
      icon: BookOpen,
      label: isRTL ? 'إجمالي المعلمين' : 'Total Teachers',
      value: stats.totalTeachers,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: AlertTriangle,
      label: isRTL ? 'عدد محاولات التسجيل' : 'Unauthorized Login Attempts',
      value: stats.priorityComplaints,
      color: 'text-destructive bg-destructive/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
                <Shield className="w-7 h-7 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  {isRTL ? `مرحباً، ${profile?.full_name_ar || profile?.full_name}` : `Welcome, ${profile?.full_name}`}
                </h1>
                <p className="text-muted-foreground">
                  {isRTL ? 'لوحة تحكم الإدارة' : 'Administration Dashboard'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{isRTL ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((stat, index) => (
            <div key={index} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={item.href}
                className="group block portal-card h-full relative"
              >
                {item.priority && (
                  <div className="absolute top-4 end-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {isRTL ? 'أولوية' : 'Priority'}
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Chevron className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
