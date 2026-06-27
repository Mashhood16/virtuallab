import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../store';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen overflow-hidden font-sans relative ${isDark ? 'bg-[#111827] text-slate-200 selection:bg-blue-500/30 selection:text-blue-200' : 'bg-slate-100 text-slate-800 dark:text-slate-200 selection:bg-blue-200 selection:text-blue-900'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 will-change-scroll ${isDark ? 'bg-[#111827]' : 'bg-slate-100'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
