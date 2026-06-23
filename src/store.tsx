import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Types ---
export interface User {
  id: string;
  name: string;
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
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // In a real app, you'd check localStorage or an API here.
  useEffect(() => {
    const stored = localStorage.getItem('virtuallab_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (name: string) => {
    const newUser = { id: Math.random().toString(36).substr(2, 9), name };
    setUser(newUser);
    localStorage.setItem('virtuallab_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('virtuallab_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
  const [history, setHistory] = useState<LabRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('virtuallab_history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const addRecord = (record: Omit<LabRecord, 'timestamp'>) => {
    const newRecord = { ...record, timestamp: Date.now() };
    setHistory((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('virtuallab_history', JSON.stringify(updated));
      return updated;
    });
  };

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

// --- Unified Store Provider ---
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HistoryProvider>
        {children}
      </HistoryProvider>
    </AuthProvider>
  );
}
