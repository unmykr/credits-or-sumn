import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  BookOpen,
  LogOut,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  ClipboardList,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

interface Profile {
  id: string;
  user_id: string;
  role: string;
  full_name: string;
  full_name_ar: string | null;
}

const TeacherDashboard = () => {
  
  const { isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

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

  const handleLogout = async () => {
    await signOut();
    navigate('/teachers');
  };

  const menuItems = [
    {
      icon: PlusCircle,
      title: isRTL ? 'إضافة درجات' : 'Add Grades',
      description: isRTL ? 'إضافة درجات للطلاب في فصولك' : 'Add grades for students in your classes',
      href: '/teachers/grades/add',
      color: 'from-primary to-primary/70',
    },
    {
      icon: ClipboardList,
      title: isRTL ? 'عرض الدرجات' : 'View Grades',
      description: isRTL ? 'عرض وإدارة الدرجات المسجلة' : 'View and manage recorded grades',
      href: '/teachers/grades',
      color: 'from-secondary to-secondary/70',
    },
    {
      icon: PlusCircle,
      title: isRTL ? 'اضافة درجات نهائية' : 'Add Final Grades',
      description: isRTL ? 'تجربة' : 'Add First Semester\'s Grades, Second Semester\'s Grades, and Final Grades',
      href: '/teachers/AddFinalGrades',
      color: 'from-accent to-accent/70',
    },
  ];

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
<div className={`mb-8 p-4 rounded-xl border ${isRTL ? 'text-right' : 'text-left'} bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4`}>
  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
    <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
    </div>
    <div>
      <h3 className="font-bold text-lg">
        {isRTL ? 'دليل استخدام البوابة' : "Teacher's Portal Manual"}
      </h3>
      <p className="text-sm text-muted-foreground">
        {isRTL 
          ? 'تعلم كيفية إدارة الدرجات واستخدام النظام بخطوات بسيطة.' 
          : 'Learn how to manage grades and use the system in simple steps.'}
      </p>
    </div>
  </div>
  
  <Link 
    to="/manual/teacher" 
    className="whitespace-nowrap bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-sm"
  >
    {isRTL ? 'فتح الدليل' : 'Open Manual'}
  </Link>
</div>


      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 md:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  {isRTL
                    ? `مرحباً، ${profile.full_name_ar || profile.full_name}`
                    : `Welcome, ${profile.full_name}`}
                </h1>
                <p className="text-muted-foreground">{isRTL ? 'بوابة المعلم' : 'Teacher Portal'}</p>
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

        {/* Menu grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={item.href} className="group block portal-card h-full">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                  <span>{isRTL ? 'دخول' : 'Enter'}</span>
                  <Chevron className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
