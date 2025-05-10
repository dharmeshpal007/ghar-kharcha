import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  authType: 'individual' | 'family' | null;
  currentUser: string | null;
  setAuth: (type: 'individual' | 'family', user?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      authType: null,
      currentUser: null,
      setAuth: (type, user) => set({ isAuthenticated: true, authType: type, currentUser: type === 'individual' ? user || null : null }),
      logout: () => set({ isAuthenticated: false, authType: null, currentUser: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 