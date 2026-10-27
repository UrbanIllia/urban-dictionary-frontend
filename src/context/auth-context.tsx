
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { AuthError, getCurrentUser } from '@/lib/api/auth';
import { AUTH_UNAUTHORIZED_EVENT } from '@/lib/api/auth-events';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

async function refreshUser() {
  try {
    const response = await getCurrentUser();
    setUser(response.user);
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      setUser(null);
    } else {
      console.error('Failed to check authentication:', error);
    }
  } finally {
    setIsLoading(false);
  }
}
useEffect(() => {
  const handleUnauthorized = () => {
    setUser(null);
  };

  window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

  return () => {
    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  };
}, []);
  useEffect(() => {
    void refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
