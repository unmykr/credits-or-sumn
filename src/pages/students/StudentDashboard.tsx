import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import {
  GraduationCap,
  FileText,
  AlertCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  MessageSquare
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

const StudentDashboard = () => {
  const { t, isRTL } = useLanguage()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const Chevron = isRTL ? ChevronLeft : ChevronRight

  const [profile, setProfile] = useState<any>(null)

  const storedStudent = JSON.parse(
    localStorage.getItem('studentProfile') || 'null'
  )
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
      setProfile(data)
      localStorage.setItem('studentProfile', JSON.stringify(data))
    }
  }
  useEffect(() => {
  const raw = localStorage.getItem('studentProfile')
  if (!raw) {
    navigate('/students')
    return
  }

  let stored: any
  try {
    stored = JSON.parse(raw)
  } catch {
    navigate('/students')
    return
  }

  const profile = stored?.profiles?.[0]

  if (!profile?.student_code || !profile?.student_pin) {
    navigate('/students')
    return
  }

  setProfile(stored)
}, [navigate])
  const studentProfile = profile?.profiles?.[0] || null
  if (!studentProfile) return null
  const handleLogout = async () => {
    await signOut()
    localStorage.removeItem('studentProfile')
    navigate('/students')
  }
  const menuItems = [
    {
      icon: BookOpen,
      title: isRTL ? 'درجاتي' : 'My Grades',
      description: isRTL
        ? 'عرض جميع درجاتك وتفاصيل الأداء'
        : 'View all your grades and performance details',
      href: '/students/grades',
      color: 'from-secondary to-secondary/70',
    },
    {
      icon: AlertCircle,
      title: isRTL ? 'الدرجات النهائية' : 'Final Grades',
      description: isRTL
        ? 'عرض الدرجات النهائية'
        : 'View your final grades',
      href: '/students/final-grades',
      color: 'from-amber-500 to-amber-500/70',
    },
    {
      icon: MessageSquare,
      title: isRTL ? 'تقديم اقتراح' : 'Submit a suggestion',
      description: isRTL
        ? 'تقديم اقتراح لتحسين المدرسة'
        : 'Submit a suggestion',
      href: '/students/complaints/new',
      color: 'from-destructive to-destructive/70',
    },
    {
      icon: FileText,
      title: isRTL ? 'اقتراحاتي' : 'My Suggestions',
      description: isRTL
        ? 'عرض حالة الاقتراحات السابقة'
        : 'View your suggestions',
      href: '/students/complaints',
      color: 'from-primary to-primary/70',
    },
  ]
  const gradeMapping: Record<string, string> = {
    '12': isRTL ? ' السادس إعدادي' : '6th Prep Grade',
    '11': isRTL ? 'الخامس إعدادي' : '5th Prep Grade',
    '10': isRTL ? 'الرابع إعدادي' : '4th Prep Grade',
    '9':  isRTL ? 'الثالث متوسط' : '3rd Intermediate Grade',
    '8':  isRTL ? 'الثاني متوسط' : '2nd Intermediate Grade',
    '7':  isRTL ? 'الأول متوسط' : '1st Intermediate Grade',
  }

  const divisionMapping: Record<string, string> = {
    'A': isRTL ? 'شعبة أ' : 'A',
    'B': isRTL ? 'شعبة ب' : 'B',
    'C': isRTL ? 'شعبة ج' : 'C',
    'D': isRTL ? 'شعبة د' : 'D',
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  {isRTL
                    ? `مرحباً، ${studentProfile.full_name_ar || studentProfile.full_name}`
                    : `Welcome, ${studentProfile.full_name}`}
                </h1>
                <p className="text-muted-foreground">
                  {gradeMapping[studentProfile.grade_level]} - {divisionMapping[studentProfile.division]}
                </p>
              </div>
            </div>

            <button onClick={handleLogout} className="flex gap-2">
              <LogOut className="w-4 h-4" />
              {t('common.logout')}
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={item.href} className="portal-card flex gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="text-white" />
                </div>
                <div className="flex-1">
                  <h3>{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Chevron />
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard
