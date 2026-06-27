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
    <div className={`flex h-screen overflow-hidden font-sans relative ${isDark ? 'bg-[#0f172a] text-slate-200 selection:bg-blue-500/30 selection:text-blue-200' : 'bg-[#faf8ff] text-slate-800 dark:text-slate-200 selection:bg-blue-200 selection:text-blue-900'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className={`flex-1 overflow-y-auto px-5 md:px-10 py-6 md:py-8 will-change-scroll ${isDark ? 'bg-[#0f172a]' : 'bg-[#faf8ff]'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
