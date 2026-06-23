import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';

export default function Login() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    // Simulate network delay for premium feel
    setTimeout(() => {
      login(name.trim());
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass rounded-3xl p-10 shadow-2xl border border-white/50 backdrop-blur-xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30 mx-auto mb-6 transform -rotate-6">
              V
            </div>
            <h1 className="text-3xl font-bold font-outfit text-slate-800 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to sync your virtual lab telemetry</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Student Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-inner text-slate-800 font-medium"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200/60 text-center">
            <p className="text-xs text-slate-400">VirtualLab Enterprise Engine v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
