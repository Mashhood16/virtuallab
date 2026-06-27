import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { LAB_MODULES } from '../data/labModules';
import { useSyncStatus } from '../hooks/useSyncStatus';
import { useTheme } from '../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnline, pendingCount, isSyncing, triggerSync } = useSyncStatus();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        data-sidebar
        className={`
          ${isDark ? 'bg-gradient-to-b from-[#0f172a] via-[#1a1f3a] to-[#0f172a] border-r border-slate-800/50' : 'bg-gradient-to-b from-slate-50 via-white to-slate-50 border-r border-slate-200'}
          overflow-y-auto h-screen w-72 flex-col z-50
          fixed top-0 left-0
          md:static
          transition-transform duration-300 ease-in-out md:transition-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Subtle gradient glows in dark mode */}
        {isDark && <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-600/10 via-indigo-500/5 to-transparent pointer-events-none"></div>}
        {isDark && <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-600/3 to-transparent pointer-events-none"></div>}
        {/* Subtle gradient glow in light mode */}
        {!isDark && <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-500/5 via-indigo-500/3 to-transparent pointer-events-none"></div>}

        <div className="p-8 pb-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/40 transform hover:rotate-12 transition-transform cursor-pointer">
              V
            </div>
            <div>
              <h2 className={`text-2xl font-bold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                Virtual<span className={`bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>Lab</span>
              </h2>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Virtual Labs Engine</p>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-2 relative z-10">
          <div className={`h-px w-full bg-gradient-to-r ${isDark ? 'from-transparent via-blue-500/30 to-transparent' : 'from-transparent via-blue-300/40 to-transparent'}`}></div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 relative z-10">
          {navItems.map((item) => {
            const darkColors: Record<string, { active: string; icon: string; glow: string; dot: string }> = {
              Modules: { active: 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 border border-blue-500/20', icon: 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]', glow: 'bg-blue-500/10', dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,1)]' },
              History: { active: 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 text-emerald-400 border border-emerald-500/20', icon: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]', glow: 'bg-emerald-500/10', dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]' },
              Settings: { active: 'bg-gradient-to-r from-violet-600/20 to-purple-600/10 text-violet-400 border border-violet-500/20', icon: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]', glow: 'bg-violet-500/10', dot: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,1)]' },
            };
            const lightColors: Record<string, { active: string; icon: string; glow: string; dot: string }> = {
              Modules: { active: 'bg-blue-50 text-blue-600 border border-blue-200', icon: 'text-blue-600', glow: 'bg-blue-100/50', dot: 'bg-blue-500' },
              History: { active: 'bg-emerald-50 text-emerald-600 border border-emerald-200', icon: 'text-emerald-600', glow: 'bg-emerald-100/50', dot: 'bg-emerald-500' },
              Settings: { active: 'bg-violet-50 text-violet-600 border border-violet-200', icon: 'text-violet-600', glow: 'bg-violet-100/50', dot: 'bg-violet-500' },
            };
            const colors = isDark ? darkColors : lightColors;
            const c = colors[item.name] || colors.Modules;
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                  isActive
                    ? c.active + ' shadow-inner'
                    : isDark
                      ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200 hover:translate-x-1 border border-transparent'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-200 hover:translate-x-1 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${c.glow} rounded-xl blur-md`}></div>
                )}
                <svg className={`w-5 h-5 transition-colors relative z-10 ${isActive ? c.icon : isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                </svg>
                <span className={`font-semibold relative z-10 ${isActive ? 'tracking-wide' : ''}`}>{item.name}</span>
                {isActive && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${c.dot} relative z-10 animate-pulse`}></div>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-6 mt-auto space-y-3 relative z-10">
          {/* Online / Offline Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${
            isOnline
              ? isDark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              : isDark ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-50 text-rose-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isOnline
                ? isDark ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-emerald-500'
                : isDark ? 'bg-rose-400 animate-pulse' : 'bg-rose-500 animate-pulse'
            }`}></span>
            {isOnline ? 'Online' : 'Offline'}
            {pendingCount > 0 && (
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                {pendingCount} pending
              </span>
            )}
            {isOnline && pendingCount > 0 && !isSyncing && (
              <button
                onClick={triggerSync}
                className={`ml-1 underline text-xs transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                Sync
              </button>
            )}
            {isSyncing && (
              <svg className="animate-spin w-3 h-3 ml-auto text-amber-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>

          {/* System Status Card */}
          <div className={`rounded-2xl p-5 transition-all duration-300 cursor-pointer group ${isDark ? 'bg-white/5 border border-white/10 hover:border-white/20' : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-3 font-outfit ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>System Status</p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-emerald-500'}`}></div>
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
              <span className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-200'}`}>{moduleCount} Modules Online</span>
            </div>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-violet-500 transition-opacity ${isDark ? 'opacity-60 group-hover:opacity-100' : 'opacity-50 group-hover:opacity-80'}`}></div>
          </div>
        </div>
      </aside>
    </>
  );
}
