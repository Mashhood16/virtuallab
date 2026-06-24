import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Microscope, Atom, Calculator, Laptop, Activity, BookOpen, Dna } from 'lucide-react';
import { useAuth, useTheme, useHistory } from './store';
import { progressDB } from './services/dbService';
import { syncService } from './services/syncService';
import { LAB_MODULES, formatSubject } from './data/labModules';
import { getLabComponent } from './routes/labRoutes';
const Layout = lazy(() => import('./components/Layout'));
const Login = lazy(() => import('./components/Login'));

const CLASSES = ['6', '7', '8', '9', '10', '11', '12'];

const getSubjectsForClass = (classLevel: string) => {
  const num = parseInt(classLevel);
  if (num >= 6 && num <= 8) {
    return ['science', 'computer'];
  } else {
    return ['physics', 'chemistry', 'biology', 'math', 'computer'];
  }
};

function Breadcrumbs() {
  const { classId, subjectId } = useParams();

  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500 mb-6 bg-slate-50 py-2 px-4 rounded-lg shadow-sm border border-slate-200">
      <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
      {classId && (
        <>
          <span className="text-slate-300">/</span>
          <Link to={`/class/${classId}`} className={`transition-colors font-medium ${!subjectId ? 'text-slate-800 cursor-default pointer-events-none' : 'hover:text-blue-600'}`}>Class {classId}</Link>
        </>
      )}
      {subjectId && (
        <>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium">{formatSubject(subjectId)}</span>
        </>
      )}
    </div>
  );
}

function ClassSelection() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex flex-col relative">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-10 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-slate-50 opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-40 h-40 bg-slate-50 opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-outfit tracking-tight">
              Welcome to Virtual<span className="text-blue-300">Lab</span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8 font-medium">
              Explore our massive library of <span className="font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded">384 interactive modules</span> across Physics, Chemistry, Biology, Mathematics, and Computer Science.
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Select Class</h2>
          <p className="text-slate-500 mt-1 mb-6">Choose your grade level to browse available experiments.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {CLASSES.map(cls => (
              <button
                key={cls}
                onClick={() => navigate(`/class/${cls}`)}
                className="glass p-8 rounded-3xl hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center text-3xl font-extrabold shadow-inner group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300 font-outfit">
                  {cls}
                </div>
                <span className="text-xl font-bold text-slate-700 group-hover:text-blue-700 font-outfit transition-colors">Class {cls}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

const getSubjectIcon = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'physics': return <Atom className="w-7 h-7" />;
    case 'chemistry': return <Microscope className="w-7 h-7" />;
    case 'biology': return <Dna className="w-7 h-7" />;
    case 'mathematics': return <Calculator className="w-7 h-7" />;
    case 'computer': return <Laptop className="w-7 h-7" />;
    case 'science': return <Activity className="w-7 h-7" />;
    default: return <BookOpen className="w-7 h-7" />;
  }
};

function SubjectSelection() {
  const { classId } = useParams();
  const navigate = useNavigate();
  if (!classId) return null;
  const subjects = getSubjectsForClass(classId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Select Subject</h2>
          <p className="text-slate-500 mt-1 mb-6">Class {classId} Curriculum</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => navigate(`/class/${classId}/${subject}`)}
                className="glass p-6 rounded-2xl hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex items-center gap-4 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
                  {getSubjectIcon(subject)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors font-outfit">{formatSubject(subject)}</h3>
                  <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">Explore Interactive Modules</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ModuleSelection() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();

  const filteredModules = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />

        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Modules Coming Soon</h3>
            <p className="text-slate-500 max-w-md text-center">We are actively developing premium virtual labs for Class {classId} {subjectId && formatSubject(subjectId)}. Check back soon!</p>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Curriculum Modules</h2>
            <p className="text-slate-500 mt-1 mb-6">High-End Interactive Experiments (Class {classId} {subjectId && formatSubject(subjectId)})</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(lab => (
                <div
                  key={lab.id}
                  onClick={() => lab.built && navigate(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                  className={`glass rounded-3xl ${lab.built ? 'hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 border-slate-50/40 cursor-pointer' : 'border-dashed border-slate-300 opacity-80'} overflow-hidden transition-all duration-300 group flex flex-col h-full relative`}
                >
                  {lab.built && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 pointer-events-none"></div>}
                  <div className={`h-48 relative overflow-hidden ${!lab.built && 'grayscale-[50%]'}`}>
                    {/* Unique 2D SVG Cover Image */}
                    <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${lab.id}&backgroundColor=transparent`} alt={lab.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3" loading="lazy" />

                    {/* Gradient & Pattern Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${lab.bg} mix-blend-color opacity-90`}></div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${lab.bg} opacity-70`}></div>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>

                    <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                      <span className="bg-slate-50/30 backdrop-blur-md border border-slate-50/40 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">{formatSubject(lab.subject)}</span>
                      <span className="bg-black/30 backdrop-blur-md border border-slate-50/20 text-white text-xs font-bold tracking-wide px-3 py-1.5 rounded-full shadow-sm">Class {lab.classLevel}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col relative bg-slate-50/60/60 backdrop-blur-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-xl font-bold font-outfit ${lab.built ? 'text-slate-800 group-hover:text-blue-700' : 'text-slate-600'} transition-colors leading-tight`}>{lab.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-6 font-medium">
                      {lab.desc}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-200/60/60">
                      <div className="flex items-center gap-2 bg-slate-100/80 px-2.5 py-1 rounded-md">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-bold text-slate-600">15 MIN</span>
                      </div>
                      {lab.built ? (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transition-all z-20 transform group-hover:scale-105 pointer-events-none"
                        >
                          Launch
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function LabRunnerInner() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(-1); // Go back to the dashboard
  };

  // Use dynamic component lookup
  const LabComponent = moduleId ? getLabComponent(moduleId) : null;

  if (!LabComponent || !moduleId) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 rounded-2xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Not Found</h2>
          <p className="text-slate-500 mb-6">The module "{moduleId}" does not exist or is still under construction.</p>
          <button onClick={handleExit} className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return <LabComponent onExit={handleExit} />;
}

function HistoryDashboard() {
  const { history } = useHistory();

  return (
    <Layout>
      <div className="flex flex-col min-h-[70vh] bg-slate-50 rounded-3xl border border-slate-200 shadow-sm mt-8 p-12">
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Lab History</h2>
            <p className="text-slate-500 text-lg">Verified telemetry and performance metrics from your completed labs.</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Labs Visited Yet</h3>
            <p className="text-slate-500 max-w-sm text-center">Your completed labs and measured results will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((record, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all group bg-gradient-to-b from-white to-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{record.subject}</span>
                  <span className="text-sm font-medium text-slate-400">{new Date(record.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 leading-tight">{record.title}</h3>

                {record.experimentData && Object.keys(record.experimentData).length > 0 && (
                  <div className="mt-4 mb-2 bg-slate-50 rounded-lg p-3 border border-slate-100 shadow-inner">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Experiment Data</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(record.experimentData).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-medium truncate">{key}</span>
                          <span className="text-sm font-bold text-slate-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
                    <span className={`text-2xl font-bold font-outfit ${record.score >= (record.maxScore * 0.8) ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {record.score} <span className="text-sm text-slate-400 font-medium">/ {record.maxScore}</span>
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                    <span className="text-lg font-bold text-slate-600">{Math.floor(record.timeSpentSeconds / 60)}m {record.timeSpentSeconds % 60}s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function SettingsPanel() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('virtuallab_fontsize') || '16');
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('virtuallab_reduced_motion') === 'true');
  const [storageInfo, setStorageInfo] = useState<{ used: string; total: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  // Font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('virtuallab_fontsize', fontSize);
  }, [fontSize]);

  // Reduced motion
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
    localStorage.setItem('virtuallab_reduced_motion', String(reducedMotion));
  }, [reducedMotion]);

  // Calculate storage usage
  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        const totalMB = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
        setStorageInfo({ used: `${usedMB} MB`, total: `${totalMB} MB` });
      });
    }
  }, []);

  // Check unsynced records
  useEffect(() => {
    progressDB.getUnsyncedRecords().then((records) => setUnsyncedCount(records.length));
  }, []);

  const handleSaveName = async () => {
    if (editName.trim() && user) {
      await updateProfile({ name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleClearAllData = async () => {
    logout();
    // Clear per-user history keys
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('virtuallab_history_') || key === 'virtuallab_user_id') {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('virtuallab_fontsize');
    localStorage.removeItem('virtuallab_reduced_motion');
    indexedDB.deleteDatabase('VirtualLabDB');
    indexedDB.deleteDatabase('VirtualLabStudents');
    setTimeout(() => window.location.reload(), 200);
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
    setTimeout(() => window.location.reload(), 200);
  };

  const handleSyncNow = async () => {
    setSyncStatus('syncing');
    try {
      await syncService.syncAllUnsynced();
      setSyncStatus('done');
      const records = await progressDB.getUnsyncedRecords();
      setUnsyncedCount(records.length);
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 font-outfit tracking-tight">Settings</h1>

        {/* Profile & Account */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile & Account
          </h2>
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      />
                      <button onClick={handleSaveName} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">Save</button>
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-800 font-semibold">{user.name}</span>
                      <button onClick={() => { setEditName(user.name); setIsEditing(true); }} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Class</span>
                    <p className="text-sm font-semibold text-slate-700">Class {user.classLevel}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Section</span>
                    <p className="text-sm font-semibold text-slate-700">{user.section}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 mb-3">You are not signed in.</p>
              <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm">Log In</button>
            </div>
          )}
        </div>

        {/* Appearance */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Theme</span>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light' ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >☀️ Light</button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-slate-50 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >🌙 Dark</button>
            </div>
          </div>
        </div>

        {/* Storage & Cache */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            Storage & Cache
          </h2>
          <div className="space-y-4">
            {storageInfo && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Local Storage Used</span>
                  <span className="font-semibold text-slate-800">{storageInfo.used} / {storageInfo.total}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((parseFloat(storageInfo.used) / parseFloat(storageInfo.total)) * 100, 100)}%` }}></div>
                </div>
              </div>
            )}
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-3 bg-amber-50 text-amber-700 font-semibold rounded-xl hover:bg-amber-100 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear Cached Labs
            </button>
            <button
              onClick={handleClearAllData}
              className="w-full px-4 py-3 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              Clear All Data & Reset
            </button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Sync Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Pending Records</p>
                <p className="text-xs text-slate-500">{unsyncedCount} experiment{unsyncedCount !== 1 ? 's' : ''} waiting to sync</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${unsyncedCount > 0 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            </div>
            <button
              onClick={handleSyncNow}
              disabled={syncStatus === 'syncing' || unsyncedCount === 0}
              className={`w-full px-4 py-3 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${syncStatus === 'syncing' ? 'bg-blue-100 text-blue-600 cursor-wait' :
                  syncStatus === 'done' ? 'bg-emerald-100 text-emerald-700' :
                    syncStatus === 'error' ? 'bg-rose-100 text-rose-600' :
                      unsyncedCount === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                        'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'done' ? '✓ Synced!' : syncStatus === 'error' ? '✗ Sync Failed' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Accessibility
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Font Size</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFontSize(String(Math.max(12, parseInt(fontSize) - 2)))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">A-</button>
                <span className="text-sm font-semibold text-slate-800 w-12 text-center">{fontSize}px</span>
                <button onClick={() => setFontSize(String(Math.min(24, parseInt(fontSize) + 2)))} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm">A+</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Reduce Animations</span>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`relative w-12 h-6 rounded-full transition-colors ${reducedMotion ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-slate-50 rounded-full shadow transition-transform ${reducedMotion ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function LabRunner() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading lab...</p>
        </div>
      </Layout>
    }>
      <LabRunnerInner />
    </Suspense>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClassSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/progress" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryDashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPanel /></ProtectedRoute>} />
      <Route path="/class/:classId" element={<SubjectSelection />} />
      <Route path="/class/:classId/:subjectId" element={<ModuleSelection />} />
      <Route path="/class/:classId/:subjectId/lab/:moduleId" element={<LabRunner />} />
    </Routes>
  );
}
