import { GraduationCap, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { language, isRTL } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">
                  {language === 'ar' ? 'ثانوية البيارق المختلطة' : 'Al Bayariq High School'}
                </p>
                <p className="text-sm text-primary-foreground/70">
                  {language === 'ar' ? 'للمتفوقين' : 'For Outstanding Students'}
                </p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-sm">
              {language === 'ar' 
                ? 'نحن ملتزمون بتوفير تعليم عالي الجودة وتنمية قادة المستقبل.'
                : 'We are committed to providing high-quality education and developing future leaders.'}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4" />
                <span>albyarq.highschool@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4" />
                <span>+964 0770 406 4758</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4" />
                <span>{language === 'ar' ? 'العراق, بغداد, قضاء الطارمية' : 'Iraq, Baghdad, Tarmiyah'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <div className="space-y-2">
              <Link to="/students" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                {language === 'ar' ? 'بوابة الطلاب' : 'Student Portal'}
              </Link>
              <Link to="/teachers" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                {language === 'ar' ? 'بوابة المعلمين' : 'Teacher Portal'}
              </Link>
              <Link to="/administration" className="block text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                {language === 'ar' ? 'بوابة الإدارة' : 'Administration Portal'}
              </Link>
              
              {/* Credits Link */}
              <Link 
                to="/credits" 
                className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium mt-4 pt-2 border-t border-primary-foreground/10"
              >
                <Heart className="w-3 h-3" />
                {language === 'ar' ? 'فريق العمل والاعتمادات' : 'Project Credits'}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} {language === 'ar' ? 'ثانوية البيارق المختلطة للمتفوقين' : 'Al Bayariq Mixed High School for OHS'}. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;