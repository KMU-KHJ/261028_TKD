import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services';
import type { AppUser } from '../types';

interface AuthState {
  user: AppUser | null;
  /** 첫 로그인 상태 확인이 끝나기 전에는 true */
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true });

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => authService.onAuthChange((user) => setState({ user, loading: false })), []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
