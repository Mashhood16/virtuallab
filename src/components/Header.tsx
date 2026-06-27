import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogIn, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuth, useTheme } from '../store';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES, formatSubject } from '../data/labModules';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchRef.current?.querySelector('input');
        input?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const results = query.trim()
    ? LAB_MODULES.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          `class ${m.classLevel}`.includes(q)
        );
      }).slice(0, 8)
    : [];

  const handleSelect = (lab: typeof LAB_MODULES[number]) => {
    setIsOpen(false);
    setMobileSearchOpen(false);
    setQuery('');
    navigate(`/class/${lab.classLevel}/${lab.subject}/lab/${lab.id}`);
  };

  return (
    <header className={`${isDark ? 'bg-gradient-to-r from-[#0f172a] via-[#141b30] to-[#0f172a]' : 'bg-[#faf8ff] border-b border-slate-200'} px-5 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50 relative`}>
      {/* Subtle glow in dark mode */}
      {isDark && <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>}
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className={`md:hidden p-2 -ml-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="md:hidden w-10 h-10 bg-gradient-to-br from-[#3525cd] to-[#712ae2] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/30 shrink-0">
          V
        </div>
        <h1 className="text-2xl font-bold font-outfit hidden md:block shrink-0">
          <span className={`${isDark ? 'bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-300' : 'text-slate-800 dark:text-slate-200'}`}>Dashboard</span>
        </h1>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden lg:block relative w-96">
          <div className={`flex items-center rounded-full px-4 py-2 transition-all ${isDark ? 'bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400/30 focus-within:bg-white/10' : 'bg-slate-100 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-300 focus-within:bg-white shadow-sm'}`}>
            <Search className={`w-4 h-4 mr-2 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search for a lab..."
              className={`bg-transparent border-none outline-none text-sm w-full ${isDark ? 'text-slate-200 placeholder:text-slate-500' : 'text-slate-700 dark:text-slate-200 placeholder:text-slate-400'}`}
            />
            <div className={`flex items-center justify-center rounded text-[10px] font-bold px-1.5 py-0.5 shrink-0 ml-2 ${isDark ? 'bg-white/10 border border-white/10 text-slate-400' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'}`}>
              ⌘K
            </div>
          </div>

          {/* Desktop Dropdown */}
          {isOpen && query.trim() !== '' && (
            <div className={`absolute top-full mt-2 w-full rounded-2xl shadow-xl overflow-hidden z-50 ${isDark ? 'bg-[#1a1f3a] border border-slate-700/50' : 'bg-white border border-slate-200'}`}>
              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((lab) => (
                    <li key={lab.id}>
                      <button
                        onClick={() => handleSelect(lab)}
                        className={`w-full text-left px-5 py-3 transition-colors flex flex-col gap-1 border-b last:border-0 ${isDark ? 'hover:bg-white/5 border-slate-700/30' : 'hover:bg-slate-50 border-slate-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{lab.title}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded whitespace-nowrap ml-2 ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            Class {lab.classLevel} · {formatSubject(lab.subject)}
                          </span>
                        </div>
                        <span className={`text-xs line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{lab.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`p-6 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  No labs found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-5 shrink-0">
        <button
          onClick={() => setMobileSearchOpen(true)}
          className={`lg:hidden p-2 rounded-full transition-colors ${isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          aria-label="Search labs"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className={`relative p-2 rounded-full transition-colors hidden sm:block ${isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-white/5' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}>
          <Bell className="w-5 h-5" />
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 ${isDark ? 'border-[#0f172a]' : 'border-white'}`}></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping opacity-75"></span>
        </button>

        {user ? (
          <div className="flex items-center gap-2 group relative">
            <button className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all ${isDark ? 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20' : 'bg-slate-50 border border-slate-200 hover:shadow-md hover:border-slate-300'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className={`text-sm font-semibold hidden sm:block ${isDark ? 'text-slate-200' : 'text-slate-700 dark:text-slate-200'}`}>{user.name}</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className={`absolute right-0 top-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl rounded-xl px-4 py-2 flex items-center gap-2 font-semibold text-sm w-full ${isDark ? 'bg-[#1a1f3a] border border-slate-700 text-rose-400 hover:bg-rose-500/10' : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'}`}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-[#3525cd] to-[#712ae2] text-white font-semibold rounded-full hover:opacity-95 transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">Log In</span>
          </button>
        )}
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
          <div className={`flex items-center gap-3 px-4 py-3 ${isDark ? 'border-b border-slate-800' : 'border-b border-slate-200'}`}>
            <button
              onClick={() => { setMobileSearchOpen(false); setQuery(''); }}
              className={`p-2 -ml-2 transition-colors shrink-0 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-200'}`}
              aria-label="Close search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={`flex items-center flex-1 rounded-xl px-4 py-2.5 ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
              <Search className={`w-4 h-4 mr-3 shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
              <input
                ref={mobileSearchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search labs..."
                className={`bg-transparent border-none outline-none text-sm w-full ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-700 dark:text-slate-200 placeholder:text-slate-400'}`}
              />
              {query.trim() !== '' && (
                <button
                  onClick={() => setQuery('')}
                  className={`ml-2 p-1 transition-colors shrink-0 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {query.trim() !== '' ? (
              results.length > 0 ? (
                <ul className="py-2">
                  {results.map((lab) => (
                    <li key={lab.id}>
                      <button
                        onClick={() => handleSelect(lab)}
                        className={`w-full text-left px-5 py-3 transition-colors flex flex-col gap-1 border-b last:border-0 ${isDark ? 'hover:bg-white/5 active:bg-white/10 border-slate-800' : 'hover:bg-slate-50 active:bg-slate-100 border-slate-50'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{lab.title}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded whitespace-nowrap ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            Class {lab.classLevel} · {formatSubject(lab.subject)}
                          </span>
                        </div>
                        <span className={`text-xs line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{lab.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`p-10 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  No labs found matching "{query}"
                </div>
              )
            ) : (
              <div className={`p-10 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Search className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'opacity-30' : 'opacity-40'}`} />
                <p>Type to search across all labs...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
