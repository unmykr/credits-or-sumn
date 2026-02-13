import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users, BookOpen, Target, Heart, Lightbulb, Shield, Star } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const stats = [
    { value: '600+', label: t('about.stat_students'), icon: Users },
    { value: '40+', label: t('about.stat_teachers'), icon: BookOpen },
    { value: '7+', label: t('about.stat_years'), icon: Award },
  ];

  const values = [
    { icon: Star, title: t('about.values_excellence'), color: 'text-accent' },
    { icon: Shield, title: t('about.values_integrity'), color: 'text-secondary' },
    { icon: Lightbulb, title: t('about.values_innovation'), color: 'text-school-gold' },
    { icon: Heart, title: t('about.values_respect'), color: 'text-destructive' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="hero-blob w-[500px] h-[500px] bg-primary/20 top-0 -left-64" />
            <div className="hero-blob w-[400px] h-[400px] bg-secondary/20 bottom-0 -right-32" style={{ animationDelay: '2s' }} />
            <div className="hero-blob w-[300px] h-[300px] bg-accent/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '4s' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                Est. 2019
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">{t('about.title')}</span>
              </h1>
             
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('about.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <div className="flex items-center justify-center">
        <img src="/public/logo.png" alt="Logo" className="w-40 h-40 sm:w-48 sm:h-48 object-contain" />
      </div>
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="stat-card"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Vision Card */}
              <motion.div
                variants={itemVariants}
                className="group relative overflow-hidden rounded-3xl p-8 sm:p-10 hover-lift"
                style={{ background: 'var(--gradient-hero)' }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    {t('about.vision_title')}
                  </h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    {t('about.vision_desc')}
                  </p>
                </div>
              </motion.div>

              {/* Mission Card */}
              <motion.div
                variants={itemVariants}
                className="group relative overflow-hidden rounded-3xl p-8 sm:p-10 hover-lift"
                style={{ background: 'var(--gradient-hero)' }}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {t('about.mission_title')}
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  {t('about.mission_desc')}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6    ">{t('about.values_title')}</h1>
              
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
                
              {values.map((value, index) => (
                
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 hover-lift shadow-md"
                  style={{ background: 'var(--gradient-hero)' }}
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 flex items-center justify-center mb-6 ${value.color} transition-transform duration-300 group-hover:scale-105`}>
                    <value.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="text-white/90 text-xl sm:text-2xl font-semibold leading-snug">{value.title}</h3>
                </motion.div>
              ))}
            </motion.div>
            
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
