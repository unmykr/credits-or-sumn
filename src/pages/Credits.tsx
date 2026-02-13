import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Server, 
  Layout, 
  Code, 
  Settings, 
  Database, 
  Sparkles, 
  Heart,
  ChevronRight as Chevron,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

const coreTeam = [
  { 
    name: { en: "Muntadhar Ahmed", ar: "منتظر أحمد" }, 
    role: { en: "Backend & Security Engineer", ar: "مهندس الحماية والبرمجة الخلفية" },
    desc: { en: "Designed, developed, and maintained the API and database; conducted penetration testing.", ar: "صمم وطور وقام بصيانة واجهة برمجة التطبيقات وقاعدة البيانات؛ وأجرى اختبارات الاختراق." },
    icon: Shield 
  },
  { 
    name: { en: "Ali Majed", ar: "علي ماجد" }, 
    role: { en: "Backend Developer", ar: "مطور البرمجيات الخلفية" },
    desc: { en: "Contributed to backend development and system implementation.", ar: "ساهم في تطوير الخلفية البرمجية وتنفيذ النظام." },
    icon: Server 
  },
  { 
    name: { en: "Mustafa Mohammed", ar: "مصطفى محمد" }, 
    role: { en: "Student Portal Developer", ar: "مطور بوابة الطلاب" },
    desc: { en: "Developed the student dashboard, grades system, and user interface.", ar: "طور لوحة تحكم الطلاب ونظام الدرجات وواجهة المستخدم." },
    icon: Layout 
  },
  { 
    name: { en: "Saif Ammar", ar: "سيف عمار" }, 
    role: { en: "Teacher Portal Developer", ar: "مطور بوابة المعلمين" },
    desc: { en: "Built class management and grading functionalities; authored the instructive booklet.", ar: "بنى وظائف إدارة الفصول والدرجات؛ وألف الكتيب الإرشادي." },
    icon: Code 
  },
  { 
    name: { en: "Yosef Mohammed", ar: "يوسف محمد" }, 
    role: { en: "Admin Portal Developer", ar: "مطور بوابة الإدارة" },
    desc: { en: "Implemented system controls, permissions, and user management; completed the suggestion-based system.", ar: "نفذ ضوابط النظام والأذونات وإدارة المستخدمين؛ وأكمل نظام الاقتراحات." },
    icon: Settings 
  },
  { 
    name: { en: "Ali Naser", ar: "علي ناصر" }, 
    role: { en: "Operations & Data Coordinator", ar: "منسق العمليات والبيانات" },
    desc: { en: "Managed requirements, structured data, and coordinated between the team and the school.", ar: "أدار المتطلبات وهيكلة البيانات ونسق بين الفريق والمدرسة." },
    icon: Database 
  }
];

const Credits = () => {
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
    <div className="min-h-screen bg-white text-slate-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        {/* Breadcrumbs */}
        <nav className={`flex items-center gap-2 text-sm text-muted-foreground mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Link to="/" className="hover:text-primary transition-colors">
            {isRTL ? 'الرئيسية' : 'Home'}
          </Link>
          <Chevron className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-foreground font-medium">
            {isRTL ? 'فريق العمل' : 'Project Credits'}
          </span>
        </nav>

        {/* Header Section */}
        <motion.div {...fadeIn} className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <Sparkles className="w-4 h-4 text-blue-600" />
             <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
               {isRTL ? 'التميز في التعليم' : 'Excellence in Education'}
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#002B5B] tracking-tight">
            {isRTL ? 'فريق العمل والاعتمادات' : 'Project Credits'}
          </h1>
          <div className={`h-1.5 w-24 bg-blue-600 mb-6 rounded-full ${isRTL ? 'ml-auto' : 'mr-auto'}`}></div>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl">
            {isRTL 
              ? 'نظام بوابة مدرسية متكامل لثانوية البيارق المختلطة للمتفوقين، تم تطويره بواسطة فريق متميز.' 
              : 'A complete school portal system for Al-Bayariq High School, developed by a dedicated core team.'}
          </p>
        </motion.div>

        {/* Photo Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xl relative"
        >
          <img 
            src="/team.jpg" 
            alt="Development Team" 
            className="w-full h-auto object-contain block" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002B5B]/10 to-transparent pointer-events-none" />
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {coreTeam.map((member, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                <member.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-1 text-[#002B5B]">
                {isRTL ? member.name.ar : member.name.en}
              </h3>
              <p className="text-blue-600 text-sm font-bold mb-4 uppercase tracking-wide">
                {isRTL ? member.role.ar : member.role.en}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isRTL ? member.desc.ar : member.desc.en}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Supervisor & Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#002B5B] p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <Heart className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                {isRTL ? 'بإشراف' : 'Supervised By'}
              </h3>
              <h2 className="text-3xl font-bold mb-2">
                {isRTL ? 'الست انتصار شوكت' : 'Mrs. Intisar Showket'}
              </h2>
              <p className="text-blue-100/60 text-sm mb-6 italic">{isRTL ? 'المشرف على المشروع' : 'Project Supervisor'}</p>
              <p className="text-blue-50/80 leading-relaxed">
                {isRTL 
                  ? 'قدمت التوجيه والإشراف الإداري والدعم المعنوي والمادي المستمر طوال فترة تطوير المشروع.' 
                  : 'Provided guidance, administrative oversight, and continuous moral and material support throughout the development lifecycle.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-10 rounded-[2.5rem] flex flex-col justify-center">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              {isRTL ? 'التقنيات المستخدمة' : 'Technologies Used'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {["React", "Supabase", "Bun", "Vite"].map(tech => (
                <div key={tech} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm font-bold text-[#002B5B]">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-16">
          <Link 
            to="/" 
            className={`group flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-slate-200 hover:border-blue-600 transition-all font-bold text-[#002B5B] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /> : <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" />}
            <span>{isRTL ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Credits;