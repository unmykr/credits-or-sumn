import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { t, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      {/* DElements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-accent rounded-full animate-pulse-soft" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary-foreground/50 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/*  */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">
              {isRTL ? 'التميز في التعليم' : 'Excellence in Education'}
            </span>
          </motion.div>
          {/*-- title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-4 leading-tight">
            {t('hero.title')}
          </h1>
          {/*-- subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl font-medium text-primary-foreground/80 mb-6">
            {t('hero.subtitle')}
          </p>
          {/*-- Description */} 
          <p className="text-lg text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/students"
              className="group flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-xl font-semibold text-lg shadow-school-lg hover:shadow-school-glow transition-all duration-300 hover:-translate-y-1"
            >
              {t('hero.explore')}
              <Arrow className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary-foreground/10 transition-all duration-300"
            >
              {t('hero.learn_more')}
            </Link>
          </div>
        </motion.div>

        {/* scroll Indicator */}
        
      </div>
    </section>
  );
};

export default Hero;
