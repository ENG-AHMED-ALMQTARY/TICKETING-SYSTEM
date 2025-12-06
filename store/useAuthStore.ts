import { create } from 'zustand';
import { User } from '../types';
import { api } from '../services/mockApi';
import { withLocalStoragePersist } from './persist';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(
  withLocalStoragePersist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string) => {
        set({ isLoading: true });
        try {
          const user = await api.auth.login(email);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error(error);
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    'auth_store',
    (state: AuthState) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated
    })
  )
);