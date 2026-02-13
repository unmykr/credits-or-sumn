import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.portals': 'Portals',
    'nav.contact': 'Contact',
    'nav.students': 'Students',
    'nav.teachers': 'Teachers',
    'nav.administration': 'Administration',
    
    // Hero
    'hero.title': 'Al-Bayariq High School',
    'hero.subtitle': 'For Outstanding High School Students',
    'hero.description': 'Empowering tomorrow\'s leaders through excellence in education, character development, and innovative learning.',
    'hero.explore': 'Student\'s Portals',
    'hero.learn_more': 'Learn More',

    'about.title': 'About Al-Bayariq High School',
    'about.description': 'Al-Bayariq High School empowers students to excel academically and personally, cultivating leaders of tomorrow.',
    'about.vision_title': 'Our Vision',
    'about.vision_desc': 'To create a nurturing and innovative learning environment that inspires excellence and lifelong curiosity.',
    'about.mission_title': 'Our Mission',
    'about.mission_desc': 'To provide high-quality education, character development, and opportunities that prepare students for success in a changing world.',
    
    // Portals
    'portal.student.title': 'Student\'s Portal',
    'portal.student.desc': 'Access your grades, submit suggestions, and manage your academic journey.',
    'portal.teacher.title': 'Teacher\'s Portal',
    'portal.teacher.desc': 'Manage student grades, view your class assignments, and communicate.',
    'portal.admin.title': 'Administration Portal',
    'portal.admin.desc': 'Full access to manage students, teachers, suggestions, and communications.',
    
    // Student Portal
    'student.login.title': 'Student Login',
    'student.login.code': 'Student Code',
    'student.login.pin': 'PIN',
    'student.login.submit': 'Access Portal',
    'student.grades.title': 'My Grades',
    'student.grades.subject': 'Subject',
    'student.grades.grade': 'Grade',
    'student.grades.max': 'Max',
    'student.grades.date': 'Date',
    'student.grades.dispute': 'Request Dispute',
    'student.complaint.title': 'Submit a Suggestion',
    'student.complaint.teacher': 'Teacher Name',
    'student.complaint.reason': 'Reason',
    'student.complaint.description': 'Description',
    'student.complaint.submit': 'Submit a suggestion',
    'student.complaint.view': 'View My Suggestions',
    'student.complaint.priority': 'We PRIORITIZE this kind of report. Your report will be reviewed as soon as possible.',
    
    // Teacher Portal
    'teacher.login.title': 'Teacher Login',
    'teacher.login.username': 'Email',
    'teacher.login.password': 'Password',
    'teacher.login.totp': 'Authenticator Code',
    'teacher.login.submit': 'Sign In',
    'teacher.grades.title': 'Manage Grades',
    'teacher.grades.select_grade': 'Select Grade Level',
    'teacher.grades.select_division': 'Select Division',
    'teacher.grades.add': 'Add Grades',
    'teacher.grades.confirm': 'Confirm & Submit',
    
    // Admin Portal
    'admin.login.title': 'Administration Login',
    'admin.dashboard': 'Dashboard',
    'admin.complaints': 'Review Suggestions',
    'admin.messages': 'Send Messages',
    'admin.grades': 'View All Grades',
    
    // Complaint Reasons
    'reason.verbal_abuse': 'Verbal Abuse',
    'reason.physical_abuse': 'Physical Abuse',
    'reason.disrespectful_behavior': 'Disrespectful Behavior',
    'reason.sexual_harassment': 'Sexual Harassment',
    'reason.unfair_grading': 'Unfair Grading',
    'reason.humiliation_in_class': 'Humiliation in Class',
    'reason.yelling_or_threats': 'Yelling or Threats',
    'reason.inappropriate_language': 'Inappropriate Language',
    'reason.ignoring_students': 'Ignoring Students',
    'reason.refusing_to_explain': 'Refusing to Explain Lessons',
    'reason.poor_teaching_methods': 'Poor Teaching Methods',
    'reason.not_following_curriculum': 'Not Following Curriculum',
    'reason.late_or_absent_frequently': 'Frequently Late or Absent',
    'reason.misuse_of_authority': 'Misuse of Authority',
    'reason.privacy_violation': 'Privacy Violation',
    'reason.unprofessional_behavior': 'Unprofessional Behavior',
    'reason.academic_dishonesty': 'Academic Dishonesty',
    'reason.retaliation_against_students': 'Retaliation Against Students',
    'reason.unclear_exam_rules': 'Unclear Exam Rules',
    'reason.lost_or_altered_grades': 'Lost or Altered Grades',
    'reason.lack_of_communication': 'Lack of Communication',
    'reason.other': 'Other',
    
    // Status
    'status.pending': 'Pending',
    'status.under_review': 'Under Review',
    'status.resolved': 'Resolved',
    'status.dismissed': 'Dismissed',
    'about.stat_students': 'Over 1,200 students',
    'about.stat_teachers': 'More than 80 teachers',
    'about.stat_years': 'Established 1998',
    'about.values_title': 'Our Core Values',
    'about.values_respect': 'Respect: Treat everyone with dignity.',
    'about.values_innovation': 'Innovation: Embrace creativity and new ideas.',
    'about.values_integrity': 'Integrity: Uphold honesty and responsibility.',
    'about.values_excellence': 'Excellence: Strive for the highest standards in all we do.',
    
    // Common
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.logout': 'Logout',
    'common.back': 'Back',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.portals': 'البوابات',
    'nav.contact': 'اتصل بنا',
    'nav.students': 'الطلاب',
    'nav.teachers': 'المعلمين',
    'nav.administration': 'الإدارة',

    'about.title': 'حول ثانوية البيارق المختلطة',
    'about.description': 'تعمل ثانوية البيارق على تمكين الطلاب من التفوق أكاديميًا وشخصيًا، وصقل قادة الغد.',
    'about.vision_title': 'رؤيتنا',
    'about.vision_desc': 'خلق بيئة تعليمية مبتكرة ومحفزة تلهم التميز وحب التعلم مدى الحياة.',
    'about.mission_title': 'رسالتنا',
    'about.mission_desc': 'تقديم تعليم عالي الجودة، وتنمية الشخصية، وإتاحة الفرص التي تُعد الطلاب للنجاح في عالم متغير.',
    
    // Hero
    'hero.title': 'ثانوية البيارق المختلطة',
    'hero.subtitle': 'للمتفوقين',
    'hero.description': 'تمكين قادة الغد من خلال التميز في التعليم وتطوير الشخصية والتعلم المبتكر.',
    'hero.explore': 'بوابة الطلبة',
    'hero.learn_more': 'اعرف المزيد',
    
    // Portals
    'portal.student.title': 'بوابة الطالب',
    'portal.student.desc': 'الوصول إلى درجاتك، تقديم الاقتراحات, وإدارة مسيرتك الأكاديمية.',
    'portal.teacher.title': 'بوابة المعلم',
    'portal.teacher.desc': 'إدارة درجات الطلاب، عرض مهام الفصل، والتواصل.',
    'portal.admin.title': 'بوابة الإدارة',
    'portal.admin.desc': 'وصول كامل لإدارة الطلاب والمعلمين والاقتراحات والاتصالات.',
    
    // Student Portal
    'student.login.title': 'تسجيل دخول الطالب',
    'student.login.code': 'كود الطالب',
    'student.login.pin': 'الرقم السري',
    'student.login.submit': 'الدخول للبوابة',
    'student.grades.title': 'درجاتي',
    'student.grades.subject': 'المادة',
    'student.grades.grade': 'الدرجة',
    'student.grades.max': 'الحد الأقصى',
    'student.grades.date': 'التاريخ',
    'student.complaint.title': 'تقديم اقتراح',
    'student.complaint.teacher': 'اسم المعلم',
    'student.complaint.reason': 'السبب',
    'student.complaint.description': 'الوصف',
    'student.complaint.submit': 'تقديم الاقتراح',
    'student.complaint.view': 'عرض اقتراحاتي',
    'student.complaint.priority': 'نحن نعطي الأولوية لتقريرك. سيتم مراجعة تقريرك في أقرب وقت ممكن.',
    
    // Teacher Portal
    'teacher.login.title': 'تسجيل دخول المعلم',
    'teacher.login.username': 'ايميل المستخدم',
    'teacher.login.password': 'كلمة المرور',
    'teacher.login.totp': 'رمز المصادقة',
    'teacher.login.submit': 'تسجيل الدخول',
    'teacher.grades.title': 'إدارة الدرجات',
    'teacher.grades.select_grade': 'اختر المرحلة',
    'teacher.grades.select_division': 'اختر الشعبة',
    'teacher.grades.add': 'إضافة درجات',
    'teacher.grades.confirm': 'تأكيد وإرسال',

    // About Page Stats
    'about.stat_students': 'أكثر من 600 طالب',
    'about.stat_teachers': 'أكثر من 40 معلم',
    'about.stat_years': 'تأسست عام 2019',
    'about.values_title': 'قيمنا الأساسية',
    'about.values_respect': 'الاحترام: معاملة الجميع بكرامة.',
    'about.values_innovation': 'الابتكار: تبني الإبداع والأفكار الجديدة.',
    'about.values_integrity': 'النزاهة: الالتزام بالصدق والمسؤولية.',
    'about.values_excellence': 'التميز: السعي لأعلى المعايير في كل ما نقوم به.',  
    
    // Admin Portalا
    'admin.login.title': 'تسجيل دخول الإدارة',
    'admin.dashboard': 'لوحة التحكم',
    'admin.complaints': 'مراجعة الاقتراحات',
    'admin.messages': 'إرسال رسائل',
    'admin.grades': 'عرض جميع الدرجات',
    
    // Complaint Reasons
    'reason.verbal_abuse': 'إساءة لفظية',
    'reason.physical_abuse': 'إساءة جسدية',
    'reason.disrespectful_behavior': 'سلوك غير محترم',
    'reason.sexual_harassment': 'تحرش جنسي',
    'reason.unfair_grading': 'درجات غير عادلة',
    'reason.humiliation_in_class': 'إهانة في الفصل',
    'reason.yelling_or_threats': 'صراخ أو تهديدات',
    'reason.inappropriate_language': 'لغة غير لائقة',
    'reason.ignoring_students': 'تجاهل الطلاب',
    'reason.refusing_to_explain': 'رفض شرح الدروس',
    'reason.poor_teaching_methods': 'أساليب تدريس ضعيفة',
    'reason.not_following_curriculum': 'عدم اتباع المنهج',
    'reason.late_or_absent_frequently': 'التأخر أو الغياب المتكرر',
    'reason.misuse_of_authority': 'إساءة استخدام السلطة',
    'reason.privacy_violation': 'انتهاك الخصوصية',
    'reason.unprofessional_behavior': 'سلوك غير مهني',
    'reason.academic_dishonesty': 'عدم الأمانة الأكاديمية',
    'reason.retaliation_against_students': 'انتقام ضد الطلاب',
    'reason.unclear_exam_rules': 'قواعد امتحان غير واضحة',
    'reason.lost_or_altered_grades': 'درجات مفقودة أو معدلة',
    'reason.lack_of_communication': 'نقص التواصل',
    'reason.other': 'أخرى',
    
    // Status
    'status.pending': 'قيد الانتظار',
    'status.under_review': 'قيد المراجعة',
    'status.resolved': 'تم الحل',
    'status.dismissed': 'مرفوض',
    
    // Common
    'common.submit': 'إرسال',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.logout': 'تسجيل الخروج',
    'common.back': 'رجوع',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL: language === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
