import { useState, useRef, useEffect } from 'react';
import OnlineOfflineIndicator from './OnlineOfflineIndicator';
import { Search, Bell, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth, useTheme } from '../store';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES, formatSubject } from '../data/labModules';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setQuery('');
    navigate(`/class/${lab.classLevel}/${lab.subject}/lab/${lab.id}`);
  };

  return (
    <header className="glass px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="md:hidden w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
          V
        </div>
        <h1 className="text-2xl font-bold font-outfit text-slate-800 hidden md:block">Dashboard</h1>

        {/* Search Bar */}
        <div ref={searchRef} className="hidden lg:block relative w-96">
          <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-slate-50 transition-all shadow-inner">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search for a lab..."
              className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
            />
            <div className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-500 px-1.5 py-0.5 shadow-sm shrink-0 ml-2">
              ⌘K
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && query.trim() !== '' && (
            <div className="absolute top-full mt-2 w-full bg-slate-50 rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((lab) => (
                    <li key={lab.id}>
                      <button
                        onClick={() => handleSelect(lab)}
                        className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex flex-col gap-1 border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-sm">{lab.title}</span>
                          <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded whitespace-nowrap ml-2">
                            Class {lab.classLevel} · {formatSubject(lab.subject)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 line-clamp-1">{lab.desc}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-slate-500 text-sm">
                  No labs found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <OnlineOfflineIndicator />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-50"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping opacity-75"></span>
        </button>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center gap-2 group relative">
            <button className="flex items-center gap-2 p-1 pr-3 bg-slate-50 border border-slate-200 rounded-full hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name}</span>
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="absolute right-0 top-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-slate-50 border border-slate-200 shadow-xl rounded-xl px-4 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 font-semibold text-sm w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all hover:shadow-lg shadow-blue-500/30"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">Log In</span>
          </button>
        )}
      </div>
    </header>
  );
}
