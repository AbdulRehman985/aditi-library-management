import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Loading states
  loading: {
    students: boolean;
    payments: boolean;
    notifications: boolean;
    dashboard: boolean;
  };
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;

  // Notifications state
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      sidebarOpen: false,
      loading: {
        students: false,
        payments: false,
        notifications: false,
        dashboard: false,
      },
      unreadNotifications: 0,

      // Auth actions
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      // UI actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Loading actions
      setLoading: (key, value) =>
        set((state) => ({
          loading: {
            ...state.loading,
            [key]: value,
          },
        })),

      // Notification actions
      setUnreadNotifications: (count) => set({ unreadNotifications: count }),
    }),
    {
      name: 'aditi-library-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 