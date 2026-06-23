import OnlineOfflineIndicator from './OnlineOfflineIndicator';
import { Search, Bell, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../store';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="glass px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6 flex-1">
        <div className="md:hidden w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
          V
        </div>
        <h1 className="text-2xl font-bold font-outfit text-slate-800 hidden md:block">Dashboard</h1>
        
        {/* Search Bar */}
        <div className="hidden lg:flex items-center bg-slate-100/80 border border-slate-200 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white transition-all shadow-inner">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search for a lab..." 
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
          />
          <div className="flex items-center justify-center bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 px-1.5 py-0.5 shadow-sm">
            ⌘K
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <OnlineOfflineIndicator />
        
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping opacity-75"></span>
        </button>

        {/* User Profile */}
        {user ? (
          <div className="flex items-center gap-2 group relative">
            <button className="flex items-center gap-2 p-1 pr-3 bg-white border border-slate-200 rounded-full hover:shadow-md transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:block">{user.name}</span>
            </button>
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="absolute right-0 top-12 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-white border border-slate-200 shadow-xl rounded-xl px-4 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 font-semibold text-sm w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-all hover:shadow-lg shadow-slate-900/20"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:block">Log In</span>
          </button>
        )}
      </div>
    </header>
  );
}
