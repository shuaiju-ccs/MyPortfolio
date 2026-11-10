import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { apiRequest } from '../lib/api';
import type { AuthUser, SigninResponse } from '../lib/api';

type Session = { token: string; user: AuthUser };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signin: (email: string, password: string) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
};

const STORAGE_KEY = 'portfolio.session';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    if (!session.token || isTokenExpired(session.token)) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [session, setSession] = useState<Session | null>(loadSession);

  const signin = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<SigninResponse>('/auth/signin', 'POST', { email, password });
    const next = { token: data.token, user: data.user };
    setSession(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
    return data.user;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await apiRequest('/api/users', 'POST', { name, email, password });
  }, []);

  const signout = useCallback(async () => {
    try {
      await apiRequest('/auth/signout');
    } catch {
    }
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: session?.token ?? null,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isAdmin: session?.user.role === 'admin',
      signin,
      signup,
      signout
    }),
    [session, signin, signup, signout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}