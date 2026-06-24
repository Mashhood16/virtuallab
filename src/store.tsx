import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { StudentAccount } from './services/studentService';
import { studentService } from './services/studentService';

// --- Types ---
export interface User {
  id: string;
  name: string;
  email: string;
  classLevel: string;
  section: string;
}

export interface LabRecord {
  labId: string;
  title: string;
  subject: string;
  score: number;
  maxScore: number;
  timeSpentSeconds: number;
  timestamp: number;
  experimentData?: Record<string, string | number>;
}

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  register: (name: string, email: string, classLevel: string, section: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'classLevel' | 'section'>>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function accountToUser(account: StudentAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    classLevel: account.classLevel,
    section: account.section,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore session from IndexedDB on mount
  useEffect(() => {
    const storedId = localStorage.getItem('virtuallab_user_id');
    if (storedId) {
      studentService.getAccount(storedId).then((account) => {
        if (account) {
          setUser(accountToUser(account));
        } else {
          localStorage.removeItem('virtuallab_user_id');
        }
        setIsLoaded(true);
      }).catch(() => {
        localStorage.removeItem('virtuallab_user_id');
        setIsLoaded(true);
      });
    } else {
      setIsLoaded(true);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, classLevel: string, section: string, password: string) => {
    const account = await studentService.register(name, email, classLevel, section, password);
    setUser(accountToUser(account));
    localStorage.setItem('virtuallab_user_id', account.id);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const account = await studentService.login(email, password);
    setUser(accountToUser(account));
    localStorage.setItem('virtuallab_user_id', account.id);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('virtuallab_user_id');
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'classLevel' | 'section'>>) => {
    if (!user) throw new Error('Not logged in');
    await studentService.updateProfile(user.id, updates);
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  }, [user]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not logged in');
    await studentService.changePassword(user.id, currentPassword, newPassword);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoaded, register, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- History Context ---
interface HistoryContextType {
  history: LabRecord[];
  addRecord: (record: Omit<LabRecord, 'timestamp'>) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<LabRecord[]>([]);

  // Load history scoped to current user
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    const stored = localStorage.getItem(`virtuallab_history_${user.id}`);
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      setHistory([]);
    }
  }, [user?.id]);

  const addRecord = useCallback((record: Omit<LabRecord, 'timestamp'>) => {
    if (!user) return;
    const newRecord = { ...record, timestamp: Date.now() };
    setHistory((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem(`virtuallab_history_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  }, [user?.id, user]);

  return (
    <HistoryContext.Provider value={{ history, addRecord }}>
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) throw new Error('useHistory must be used within a HistoryProvider');
  return context;
};

// --- Theme Context ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('virtuallab_theme') as Theme) || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('virtuallab_theme', theme);
  }, [theme]);

  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// --- Unified Store Provider ---
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HistoryProvider>
          {children}
        </HistoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
