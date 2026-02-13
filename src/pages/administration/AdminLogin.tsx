import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowRight, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';

const AdminLogin = () => {
  const { t, isRTL } = useLanguage();
  const { signIn, verifyTOTP } = useAuth();
  const navigate = useNavigate();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(email.trim(), password);
    localStorage.clear();
    setIsLoading(false);

    if (error) {
      toast.error(isRTL ? 'بيانات الاعتماد غير صحيحة' : 'Invalid Email or Password');
      return;
    }

    setStep('totp');
    toast.info(isRTL ? 'أدخل رمز المصادقة' : 'Enter your authenticator code');
  };

  const handleTOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totpCode.length !== 6) {
      toast.error(isRTL ? 'الرمز يجب أن يكون 6 أرقام' : 'Code must be 6 digits');
      return;
    }

    setIsLoading(true);
    const verified = await verifyTOTP(totpCode);
    setIsLoading(false);

    if (!verified) {
      toast.error(isRTL ? 'رمز المصادقة غير صحيح' : 'Invalid authenticator code');
      return;
    }

    toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Login successful');
    navigate('/administration/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card rounded-2xl p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('admin.login.title')}
              </h1>
              <p className="text-muted-foreground">
                {step === 'credentials' 
                  ? (isRTL ? 'وصول مقيد للإداريين فقط' : 'Restricted access for administrators only')
                  : (isRTL ? 'أدخل رمز المصادقة من تطبيقك' : 'Enter the code from your authenticator app')}
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10 mb-6">
              <Lock className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-xs text-muted-foreground">
                {isRTL 
                  ? 'هذه منطقة محمية. جميع محاولات الدخول مسجلة.'
                  : 'This is a protected area. All login attempts are logged.'}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`flex-1 h-1 rounded-full ${step === 'credentials' ? 'bg-accent' : 'bg-accent'}`} />
              <div className={`flex-1 h-1 rounded-full ${step === 'totp' ? 'bg-accent' : 'bg-muted'}`} />
            </div>

            {step === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('teacher.login.username')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('teacher.login.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pe-12"
                      placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter password'}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 px-4 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium transition-all hover:opacity-90"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      {isRTL ? 'التالي' : 'Next'}
                      <Arrow className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleTOTPSubmit} className="space-y-5">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 mb-6">
                  <Shield className="w-8 h-8 text-accent" />
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {isRTL ? 'التحقق الثنائي' : 'Two-Factor Authentication'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isRTL ? 'Google Authenticator مطلوب' : 'Google Authenticator required'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('teacher.login.totp')}
                  </label>
                  <input
                    type="text"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-field text-center text-2xl tracking-[0.5em] font-mono"
                    placeholder="000000"
                    maxLength={6}
                    dir="ltr"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="btn-outline flex-1"
                  >
                    {isRTL ? 'رجوع' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || totpCode.length !== 6}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        {t('teacher.login.submit')}
                        <Arrow className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {isRTL ? 'العودة للصفحة الرئيسية' : 'Back to home page'}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
