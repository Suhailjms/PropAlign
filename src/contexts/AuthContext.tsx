
'use client';

import type { AccessRole } from '@/lib/types';
import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import store from '@/lib/store';

interface User {
  name: string;
  email: string;
  role: AccessRole;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
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

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // This is a simulation of a real auth flow.
    // In a real app, you'd call your auth provider/backend here.
    const storableUser = store.getUserByEmail(email);

    if (!storableUser || storableUser.password_bcrypt_hash !== password) {
        return { success: false, message: "Invalid email or password." };
    }

    const sessionUser: User = {
        name: storableUser.name,
        email: storableUser.email,
        role: storableUser.role,
        avatarUrl: storableUser.avatarUrl
    };
    
    localStorage.setItem('proposerai_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    router.push('/');
    return { success: true, message: "Login successful." };
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('proposerai_user');
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
