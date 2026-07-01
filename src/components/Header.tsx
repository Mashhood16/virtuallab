import { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogIn, LogOut, Sun, Moon, Menu, ChevronDown } from 'lucide-react';
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
    <header className={`${isDark ? 'bg-[#121212] border-b border-[#1c1b1b]' : 'bg-[#faf8ff] border-b border-slate-200'} px-5 md:px-10 h-[72px] flex items-center justify-between sticky top-0 z-50 shrink-0`}>
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onToggleSidebar}
            className={`p-2 -ml-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-[#4158D1] hover:bg-[#1c1b1b]' : 'text-slate-500 hover:text-[#4158D1] hover:bg-indigo-50'}`}
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img 
            src="/logo.png" 
            alt="Logo" 
            className={`h-8 w-auto object-contain pointer-events-none ${isDark ? 'drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]'}`}
          />
        </div>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden lg:block relative w-[400px]">
          <div className={`flex items-center rounded-lg px-4 py-2.5 transition-all ${isDark ? 'bg-[#000000] border border-[#1c1b1b] focus-within:border-[#4158D1]' : 'bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-300 shadow-sm'}`}>
            <Search className={`w-4 h-4 mr-3 shrink-0 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search modules..."
              autoComplete="off"
              className={`!bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm w-full font-medium ${isDark ? 'text-[#ffffff] placeholder:text-[#71717a]' : 'text-slate-900 placeholder:text-slate-500'}`}
            />
            <div className={`ml-2 px-1.5 py-0.5 rounded border text-[10px] font-bold tracking-wide flex items-center shrink-0 ${isDark ? 'border-[#1c1b1b] bg-[#000000] text-[#71717a]' : 'border-slate-300 bg-slate-100 text-slate-500 shadow-sm'}`}>
              ctrl + k
            </div>
          </div>

          {/* Desktop Dropdown */}
          {isOpen && query.trim() !== '' && (
            <div className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl overflow-hidden z-50 ${isDark ? 'bg-[#121212] border border-[#1c1b1b]' : 'bg-white border border-slate-200'}`}>
              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((lab) => (
                    <li key={lab.id}>
                      <button
                         onClick={() => handleSelect(lab)}
                        className={`w-full text-left px-5 py-3 transition-colors flex flex-col gap-1 border-b last:border-0 ${isDark ? 'hover:bg-[#1c1b1b] border-[#1c1b1b]' : 'hover:bg-slate-50 border-slate-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-sm ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{lab.title}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded whitespace-nowrap ml-2 ${isDark ? 'bg-[#000000] text-[#a1a1aa] border border-[#1c1b1b]' : 'bg-slate-100 text-slate-600'}`}>
                            Class {lab.classLevel} · {formatSubject(lab.subject)}
                          </span>
                        </div>
                        <span className={`text-xs line-clamp-1 ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>{lab.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`p-6 text-center text-sm ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
                  No labs found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => setMobileSearchOpen(true)}
          className={`lg:hidden p-2 rounded-full transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#6366f1] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          aria-label="Search labs"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${isDark ? 'text-[#a1a1aa] hover:text-[#6366f1] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className={`relative p-2 rounded-full transition-colors hidden sm:block ${isDark ? 'text-[#a1a1aa] hover:text-[#ffffff] hover:bg-[#121212]' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}>
          <Bell className="w-5 h-5" />
        </button>

        {user ? (
          <div className="flex items-center gap-3 group relative ml-2 pl-4 border-l border-[#1c1b1b] cursor-pointer">
            <div className="hidden sm:block text-right">
              <p className={`text-sm font-semibold leading-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{user.name}</p>
              <p className={`text-[10px] font-medium ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>{user.email || 'student@school.edu'}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#5560F1] flex items-center justify-center text-white font-bold text-sm tracking-wide">
              {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <ChevronDown className={`w-4 h-4 ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`} />
            
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className={`absolute right-0 top-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl rounded-xl px-4 py-2 flex items-center gap-2 font-semibold text-sm min-w-[150px] ${isDark ? 'bg-[#121212] border border-[#1c1b1b] text-rose-400 hover:bg-[#1a1515]' : 'bg-white border border-slate-200 text-rose-600 hover:bg-rose-50'}`}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2 bg-[#6366f1] text-white font-semibold rounded-lg hover:bg-[#4f46e5] transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">Log In</span>
          </button>
        )}
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-[#121212]' : 'bg-white'}`}>
          <div className={`flex items-center gap-3 px-4 py-3 ${isDark ? 'border-b border-[#1c1b1b]' : 'border-b border-slate-200'}`}>
            <button
              onClick={() => { setMobileSearchOpen(false); setQuery(''); }}
              className={`p-2 -ml-2 transition-colors shrink-0 ${isDark ? 'text-[#a1a1aa] hover:text-[#ffffff]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={`flex items-center flex-1 rounded-xl px-4 py-2.5 ${isDark ? 'bg-[#000000] border border-[#1c1b1b]' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <Search className={`w-4 h-4 mr-3 shrink-0 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-600'}`} />
              <input
                ref={mobileSearchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules..."
                autoComplete="off"
                className={`!bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-sm w-full font-medium ${isDark ? 'text-[#ffffff] placeholder:text-[#71717a]' : 'text-slate-900 placeholder:text-slate-500'}`}
              />
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
                        className={`w-full text-left px-5 py-3 transition-colors flex flex-col gap-1 border-b last:border-0 ${isDark ? 'hover:bg-[#121212] border-[#1c1b1b]' : 'hover:bg-slate-50 border-slate-50'}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>{lab.title}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`p-10 text-center text-sm ${isDark ? 'text-[#71717a]' : 'text-slate-500'}`}>
                  No labs found matching "{query}"
                </div>
              )
            ) : (
              <div className={`p-10 text-center text-sm ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`}>
                <Search className={`w-8 h-8 mx-auto mb-3 opacity-30`} />
                <p>Type to search across all labs...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
