import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type UserRole = 'student' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  user_id: string | null;
  role: UserRole;
  full_name: string;
  full_name_ar: string | null;
  student_code: string | null;
  grade_level: string | null;
  division: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInStudent: (code: string, pin: string) => Promise<{ error: Error | null; profile: Profile | null }>;
  signOut: () => Promise<void>;
  verifyTOTP: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
    }

      setIsLoading(false); 
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await fetch('https://ddimklrarzivtrablrvu.supabase.co/functions/v1/get-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    }).then(res => res.json());
    
    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInStudent = async (
  code: string,
  pin: string
  ): Promise<{ error: Error | null; profile: Profile | null }> => {
  const res = await fetch(
    'https://ddimklrarzivtrablrvu.supabase.co/functions/v1/verify-student-pin',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_code: code, student_pin: pin }),
    }
  )

  if (!res.ok) {
    return { error: new Error('Invalid student code or PIN'), profile: null }
  }

  const profile = await res.json()
  localStorage.setItem('studentProfile', JSON.stringify(profile))
  setProfile(profile as Profile)

  return { error: null, profile: profile as Profile }
}

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    localStorage.removeItem('studentProfile');
    localStorage.clear();
  };

  const verifyTOTP = async (code: string): Promise<boolean> => {
    // ALWAYS TRUE FOR NOW DONT FUCK THIS UP
    return code.length === 6;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      signIn,
      signInStudent,
      signOut,
      verifyTOTP,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
