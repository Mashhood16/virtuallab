import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, BookOpen, Users } from 'lucide-react';

type Tab = 'login' | 'register';

export default function Login() {
  const [tab, setTab] = useState<Tab>('login');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regClass, setRegClass] = useState('');
  const [regSection, setRegSection] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword) return;

    setIsSubmitting(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim()) return setError('Please enter your name');
    if (!regEmail.trim()) return setError('Please enter your email');
    if (!regClass) return setError('Please select your class');
    if (!regSection.trim()) return setError('Please enter your section');
    if (regPassword.length < 6) return setError('Password must be at least 6 characters');
    if (regPassword !== regConfirm) return setError('Passwords do not match');

    setIsSubmitting(true);
    try {
      await register(regName.trim(), regEmail.trim(), regClass, regSection.trim(), regPassword);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-100 focus:bg-white dark:focus:bg-slate-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-slate-800 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-sm";
  const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-600 mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/25 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/25 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-400/15 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-emerald-400/15 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 px-2">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#71717a] hover:text-blue-600 dark:hover:text-blue-600 transition-colors mb-6 ml-1 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-blue-500/30 mx-auto mb-5 transform -rotate-6">
              V
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-slate-800 dark:text-slate-900 tracking-tight mb-1">
              {tab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 dark:text-[#71717a] text-sm">
              {tab === 'login' ? 'Sign in to save your lab progress' : 'Register to track your experiments'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-200 dark:bg-slate-300 rounded-xl p-1 mb-6">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'login'
                  ? 'bg-white dark:bg-slate-400 text-slate-800 dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'register'
                  ? 'bg-white dark:bg-slate-400 text-slate-800 dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-100 border border-rose-200 dark:border-rose-300 text-rose-700 dark:text-rose-700 text-sm rounded-xl px-4 py-3 mb-4 font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className={`${inputClass} pl-10`}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pl-10 pr-10`}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !loginEmail.trim() || !loginPassword}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 mt-2 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`${inputClass} pl-10`}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@school.edu"
                    className={`${inputClass} pl-10`}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Class</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={regClass}
                      onChange={(e) => setRegClass(e.target.value)}
                      className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                      required
                    >
                      <option value="">Select</option>
                      {[6, 7, 8, 9, 10, 11, 12].map((c) => (
                        <option key={c} value={String(c)}>Class {c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Section</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={regSection}
                      onChange={(e) => setRegSection(e.target.value)}
                      placeholder="e.g. A"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className={`${inputClass} pl-10 pr-10`}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`${inputClass} pl-10`}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 mt-2 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 dark:border-transparent"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-300/60 text-center">
            <p className="text-xs text-slate-400 dark:text-[#71717a]">Cendronyx Labs v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
