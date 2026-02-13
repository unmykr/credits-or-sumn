import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

const PortalCards = () => {
  const { t, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const portals = [
    {
      icon: Users,
      title: t('portal.student.title'),
      description: t('portal.student.desc'),
      href: '/students',
      gradient: 'from-secondary to-secondary/70',
      delay: 0,
    },
    {
      icon: BookOpen,
      title: t('portal.teacher.title'),
      description: t('portal.teacher.desc'),
      href: '/teachers',
      gradient: 'from-primary to-primary/70',
      delay: 0.1,
    },
    {
      icon: Shield,
      title: t('portal.admin.title'),
      description: t('portal.admin.desc'),
      href: '/administration',
      gradient: 'from-accent to-accent/70',
      delay: 0.2,
    },
  ];

  return (
    <section id="portals" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {isRTL ? 'بوابات الوصول' : 'Access Portals'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? 'اختر البوابة المناسبة للوصول إلى لوحة التحكم الخاصة بك'
              : 'Choose the appropriate portal to access your personalized dashboard'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: portal.delay }}
            >
              <Link
                to={portal.href}
                className="group block h-full portal-card"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <portal.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {portal.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {portal.description}
                </p>
                
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>{isRTL ? 'دخول' : 'Enter'}</span>
                  <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortalCards;
