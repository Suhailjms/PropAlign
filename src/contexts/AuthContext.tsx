
'use client';

import type { AccessRole } from '@/lib/types';
import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateUser, completeMfaLogin, logLogout } from '@/lib/actions';


interface User {
  name: string;
  email: string;
  role: AccessRole;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; mfaRequired?: boolean }>;
  completeLogin: (email: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('proposerai_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Could not parse user from localStorage", error);
        localStorage.removeItem('proposerai_user');
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string; mfaRequired?: boolean }> => {
    const result = await authenticateUser(email, password);

    if (result.success && !result.mfaRequired && result.user) {
      const sessionUser: User = {
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          avatarUrl: result.user.avatarUrl
      };
      localStorage.setItem('proposerai_user', JSON.stringify(sessionUser));
      setUser(sessionUser);
      router.push('/');
    }
    
    // For MFA, we just return the result. The login page will handle the next step.
    // For failure, we also just return the result.
    return result;
  }, [router]);
  
  const completeLogin = useCallback(async (email: string): Promise<boolean> => {
      const result = await completeMfaLogin(email);
      if (result.success && result.user) {
          const sessionUser: User = {
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            avatarUrl: result.user.avatarUrl
          };
          localStorage.setItem('proposerai_user', JSON.stringify(sessionUser));
          setUser(sessionUser);
          router.push('/');
          return true;
      }
      return false;
  }, [router]);


  const logout = useCallback(async () => {
    if (user) {
      await logLogout(user.email);
    }
    localStorage.removeItem('proposerai_user');
    setUser(null);
    router.push('/login');
  }, [router, user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, completeLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
