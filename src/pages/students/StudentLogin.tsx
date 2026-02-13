import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { Users, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'

const StudentLogin = () => {
  const { t, isRTL } = useLanguage()
  const { signInStudent } = useAuth()
  const navigate = useNavigate()
  const Arrow = isRTL ? ArrowLeft : ArrowRight

  const [code, setCode] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('studentProfile')
    if (stored) navigate('/students/dashboard')
  }, [navigate])

  const fetchProfile = async (studentId: string) => {
    const res = await fetch(
      'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/get-profiles',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: studentId }),
      }
    )

    const data = await res.json()
    if (res.ok && data) {
      localStorage.setItem('studentProfile', JSON.stringify(data))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code.trim() || !pin.trim()) {
      toast.error(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields')
      return
    }

    setIsLoading(true)
    const { error, profile } = await signInStudent(code.trim(), pin.trim())
    setIsLoading(false)

    if (error || !profile?.id) {
      toast.error(isRTL ? 'كود الطالب أو الرقم السري غير صحيح' : 'Invalid student code or PIN')
      return
    }

    await fetchProfile(profile.id)

    toast.success(isRTL ? 'تم تسجيل الدخول بنجاح' : 'Login successful')
    navigate('/students/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{t('student.login.title')}</h1>
              <p className="text-muted-foreground">
                {isRTL ? 'أدخل بياناتك للوصول إلى البوابة' : 'Enter your credentials to access the portal'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input-field"
                placeholder={isRTL ? 'كود الطالب أو البريد' : 'Student code or email'}
              />

              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="input-field pe-12"
                  placeholder={isRTL ? 'الرقم السري' : 'PIN'}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 end-0 px-4"
                >
                  {showPin ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button disabled={isLoading} className="btn-secondary w-full flex gap-2 justify-center">
                {isLoading ? '...' : t('student.login.submit')}
                <Arrow />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default StudentLogin
