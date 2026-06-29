import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { LAB_MODULES } from '../data/labModules';

import { useTheme } from '../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  const getActive = () => {
    if (location.pathname.startsWith('/history')) return 'History';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    return 'Modules';
  };
  const active = getActive();

  const handleNav = (name: string) => {
    if (name === 'History') navigate('/history');
    else if (name === 'Settings') navigate('/settings');
    else navigate('/');
    onClose();
  };

  const navItems = [
    { name: 'Modules', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        data-sidebar
        className={`
          ${isDark ? 'bg-[#121212] border-r border-[#1c1b1b]' : 'bg-gradient-to-b from-slate-50 via-white to-slate-50 border-r border-slate-200'}
          overflow-y-auto h-screen w-72 flex flex-col z-50
          fixed top-0 left-0
          md:static
          transition-transform duration-300 ease-in-out md:transition-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className={`h-[72px] px-8 flex items-center border-b shrink-0 relative z-10 ${isDark ? 'border-[#1c1b1b]' : 'border-slate-200'}`}>
          <h2 className={`text-2xl font-bold tracking-tight font-outfit ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
            Cendronyx<span className={isDark ? 'text-[#a855f7]' : 'text-purple-600'}>Labs</span>
          </h2>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? isDark ? 'bg-[#1c1b1b] text-[#a855f7]' : 'bg-blue-50 text-blue-600'
                    : isDark ? 'text-[#a1a1aa] hover:text-[#ffffff]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <svg className={`w-5 h-5 transition-colors relative z-10 ${isActive ? (isDark ? 'text-[#a855f7]' : 'text-blue-600') : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                </svg>
                <span className={`font-semibold relative z-10 ${isActive ? 'tracking-wide' : ''}`}>{item.name}</span>
                {isActive && isDark && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-[#a855f7] relative z-10"></div>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-6 mt-auto space-y-3 relative z-10">
          {/* System Status Card */}
          <div className={`rounded-xl p-4 transition-all duration-300 border ${isDark ? 'bg-[#1c1b1b] border-[#2a2a2a]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                {isOnline && <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75"></div>}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-rose-400' : 'text-rose-600')}`}>
                {isOnline ? 'System Online' : 'System Offline'}
              </span>
            </div>
            <p className={`text-xl font-bold tracking-tight mb-0.5 ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
              {moduleCount} Modules
            </p>
            <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>
              Available to play
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
