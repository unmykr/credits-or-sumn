import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ShieldCheck, 
  PlusCircle, 
  ClipboardList, 
  ChevronRight as Chevron,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const TeacherManual = () => {
  const [isRTL, setIsRTL] = useState(document.dir === 'rtl');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsRTL(document.dir === 'rtl');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'] });
    return () => observer.disconnect();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        {/* Breadcrumbs */}
        <nav className={`flex items-center gap-2 text-sm text-muted-foreground mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="hover:text-primary transition-colors">
            {isRTL ? 'الرئيسية' : 'Home'}
          </Link>
          <Chevron className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-foreground font-medium">
            {isRTL ? 'دليل المعلم' : "Teacher's Guide"}
          </span>
        </nav>

        {/* Header Section */}
        <motion.div {...fadeIn} className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-primary tracking-tight">
            {isRTL ? 'دليل بوابة المعلم' : "Teacher's Portal Manual"}
          </h1>
          <div className={`h-1.5 w-24 bg-primary mb-6 rounded-full ${isRTL ? 'ml-auto' : 'mr-auto'}`}></div>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {isRTL 
              ? 'دليل كامل لاستخدام بوابة المعلم - من تسجيل الدخول إلى إدارة درجات الطلاب.' 
              : 'A complete guide to using the Teacher\'s Portal — from logging in to managing student grades.'}
          </p>
        </motion.div>

        {/* Section 1: Login Process */}
        <motion.section {...fadeIn} className="mb-20">
          <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center justify-center min-w-[32px] h-8 rounded-full bg-primary text-white text-sm shadow-lg shadow-primary/30">1</span> 
            {isRTL ? 'عملية تسجيل الدخول' : 'The Login Process'}
          </h2>
          
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-border bg-card/40 backdrop-blur-md shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
            
            <p className={`mb-12 text-muted-foreground text-lg leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL 
                ? 'للوصول إلى بوابة المعلم، استخدم بيانات الاعتماد الخاصة بك ثم اتبع خطوة المصادقة الثنائية (Google Authenticator).'
                : 'To access the Teacher\'s Portal, use your credentials and then complete the two-factor authentication (Google Authenticator) step.'}
            </p>
            
            <div className={`flex flex-col md:flex-row gap-16 justify-center items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex flex-col items-center group w-full max-w-[300px]">
                <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-border/60 transition-transform group-hover:-translate-y-2 duration-300">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                      <BookOpen className="text-primary w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className={`h-11 w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-border px-4 flex items-center text-xs text-muted-foreground/80 italic ${isRTL ? 'justify-end' : ''}`}>
                      teacher@school.com
                    </div>
                    <div className={`h-11 w-full bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-border px-4 flex items-center text-xs tracking-[0.4em] text-muted-foreground/60 font-mono ${isRTL ? 'justify-end' : ''}`}>
                      ••••••••
                    </div>
                    <div className="h-11 w-full bg-primary rounded-xl flex items-center justify-center text-white text-xs font-bold">
                      {isRTL ? 'التالي' : 'NEXT'}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full mb-2 inline-block tracking-wider">
                    {isRTL ? 'الخطوة ٠١' : 'Step 01'}
                  </span>
                  <p className="text-sm font-bold text-foreground">{isRTL ? 'إدخال البيانات' : 'Credentials'}</p>
                </div>
              </div>

              <div className="flex flex-col items-center group w-full max-w-[300px]">
                <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-border/60 transition-transform group-hover:-translate-y-2 duration-300">
                  <div className="flex items-center justify-center mb-8">
                    <div className="p-4 bg-green-500/10 rounded-full">
                      <ShieldCheck className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between gap-1.5" style={{ direction: 'ltr' }}>
                      {[4, 8, 2, 9, 1, 0].map((num, i) => (
                        <div key={i} className="h-11 w-9 bg-primary/5 border-2 border-primary/10 rounded-xl flex items-center justify-center font-bold text-primary text-sm shadow-inner">
                          {num}
                        </div>
                      ))}
                    </div>
                    <div className="h-11 w-full bg-slate-900 dark:bg-slate-800 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-black/20">
                      {isRTL ? 'تأكيد' : 'VERIFY'}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-black uppercase rounded-full mb-2 inline-block tracking-wider">
                    {isRTL ? 'الخطوة ٠٢' : 'Step 02'}
                  </span>
                  <p className="text-sm font-bold text-foreground">{isRTL ? 'رمز التحقق' : '2FA Code'}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2: DASHBOARD OPTIONS */}
        <motion.section {...fadeIn}>
          <h2 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <span className="flex items-center justify-center min-w-[32px] h-8 rounded-full bg-primary text-white text-sm shadow-lg">2</span> 
            {isRTL ? 'خيارات لوحة التحكم' : 'Dashboard Options'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: isRTL ? 'إضافة درجات' : 'Add Grades', 
                desc: isRTL ? 'إدخال درجات الاختبارات الدورية بضغطة زر.' : 'Enter periodic test scores instantly.', 
                icon: PlusCircle, 
                color: 'from-blue-500 to-blue-600',
                link: '/teachers/grades/add' 
              },
              { 
                title: isRTL ? 'عرض التقارير' : 'View Reports', 
                desc: isRTL ? 'مراجعة وتعديل بيانات الطلاب السابقة.' : 'Review and edit student data.', 
                icon: ClipboardList, 
                color: 'from-indigo-500 to-indigo-600',
                link: '/teachers/grades' 
              },
              { 
                title: isRTL ? 'الدرجات النهائية' : 'Final Results', 
                desc: isRTL ? 'رصد واعتماد نتائج الفصل الدراسي.' : 'Confirm and record semester results.', 
                icon: ShieldCheck, 
                color: 'from-emerald-500 to-emerald-600',
                link: '/teachers/AddFinalGrades' 
              }
            ].map((item, idx) => (
              <Link 
                to={item.link} 
                key={idx} 
                className={`group p-8 rounded-3xl border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform ${isRTL ? 'ml-auto' : ''}`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                <div className={`flex items-center gap-2 text-primary text-sm font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{isRTL ? 'ابدأ الآن' : 'Start Now'}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <div className="mt-24 pt-10 border-t border-border flex justify-center">
            <Link to="/" className={`group flex items-center gap-3 px-6 py-3 rounded-full bg-slate-50 dark:bg-slate-900 border border-border hover:border-primary transition-all font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                {isRTL ? <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
                <span className="text-primary">{isRTL ? 'العودة للرئيسية' : 'Return Home'}</span>
            </Link>
        </div>
      </main>
    </div>
  );
};

export default TeacherManual;