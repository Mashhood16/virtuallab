import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES } from '../data/labModules';
import Layout from '../components/Layout';
import { FlaskConical, Atom, Dna, Calculator, Cpu, Microscope, LayoutGrid, List, Rocket } from 'lucide-react';
import { useTheme } from '../store';

const CLASS_CONFIG: Record<string, { color: string; icon: typeof FlaskConical; iconBg: string; textColor: string; label: string; desc: string }> = {
  '6':  { color: '#f97316', icon: FlaskConical, iconBg: 'bg-orange-500/20', textColor: 'text-orange-500', label: 'Science', desc: 'Foundations of Science. Introduction to basic concepts and principles.' },
  '7':  { color: '#3b82f6', icon: Atom,         iconBg: 'bg-blue-500/20',   textColor: 'text-blue-500',   label: 'Physics', desc: 'Exploring physical and chemical changes, acids, bases and salts.' },
  '8':  { color: '#8b5cf6', icon: Cpu,          iconBg: 'bg-violet-500/20', textColor: 'text-violet-500', label: 'Tech', desc: 'Forces, pressure, sound, and the universe. Intermediate science.' },
  '9':  { color: '#ec4899', icon: Dna,          iconBg: 'bg-pink-500/20',   textColor: 'text-pink-500',   label: 'Biology', desc: 'Matter, atoms, motion, and fundamental units of life.' },
  '10': { color: '#eab308', icon: Microscope,   iconBg: 'bg-yellow-500/20', textColor: 'text-yellow-500', label: 'Chem', desc: 'Chemical reactions, life processes, light, and electricity.' },
  '11': { color: '#6366f1', icon: Calculator,   iconBg: 'bg-indigo-500/20', textColor: 'text-indigo-500', label: 'Math', desc: 'Advanced physics, chemistry, and biology. Preparation for higher studies.' },
  '12': { color: '#10b981', icon: Rocket,       iconBg: 'bg-emerald-500/20', textColor: 'text-emerald-500', label: 'Advanced', desc: 'Capstone simulations in advanced subjects and engineering principles.' },
};

export default function ClassSelection() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  return (
    <Layout>
      <div className="flex flex-col relative max-w-5xl mx-auto pb-12">
        {/* Welcome Banner */}
        <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] saturate-[0.85] opacity-[0.95]' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} p-8 md:p-12 mb-10 shadow-xl flex flex-col items-center text-center`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
          

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 font-outfit tracking-tight">
            Next-Generation Cendronyx Labs
          </h1>
          
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mb-2 font-medium leading-relaxed mx-auto">
            Step inside and explore a growing library of <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg shadow-sm">{moduleCount} immersive simulations</span> Master complex scientific and technical concepts through interactive, hands-on experimentation.
          </p>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
            Select Class
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? (isDark ? 'bg-[#121212] border border-[#1c1b1b] text-[#ffffff]' : 'bg-slate-100 border border-slate-200 text-slate-800') : (isDark ? 'bg-[#121212]/50 border border-[#1c1b1b]/50 text-[#71717a] hover:text-[#a1a1aa]' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600')}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? (isDark ? 'bg-[#121212] border border-[#1c1b1b] text-[#ffffff]' : 'bg-slate-100 border border-slate-200 text-slate-800') : (isDark ? 'bg-[#121212]/50 border border-[#1c1b1b]/50 text-[#71717a] hover:text-[#a1a1aa]' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-600')}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards Grid / List */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
          {Object.entries(CLASS_CONFIG).map(([cls, config]) => {
            const Icon = config.icon;
            const classModuleCount = LAB_MODULES.filter(m => m.built && m.classLevel === cls).length;

            return (
              <button
                key={cls}
                onClick={() => navigate(`/class/${cls}`)}
                className={`group p-6 rounded-2xl border transition-all duration-300 text-left overflow-hidden relative ${
                  isDark ? 'bg-[#121212] border-[#1c1b1b] hover:border-[#2a2a2a]' : 'bg-white border-slate-200 hover:shadow-xl'
                } ${viewMode === 'list' ? 'flex items-center gap-5 sm:gap-8' : 'flex flex-col'}`}
              >
                {/* Colored Top or Left Border */}
                <div 
                  className={`absolute ${viewMode === 'list' ? 'top-0 bottom-0 left-0 w-1' : 'top-0 left-0 right-0 h-1'}`} 
                  style={{ backgroundColor: config.color }}
                />

                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-4 mt-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.iconBg} ${config.textColor}`}>
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                        {classModuleCount} Modules
                      </div>
                    </div>

                    <h3 className={`text-xl font-bold font-outfit mb-2 ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>
                      Class {cls}
                    </h3>
                    
                    <p className={`text-sm mb-6 flex-1 ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>
                      {config.desc}
                    </p>

                    <div className={`text-sm font-bold flex items-center gap-1 ${config.textColor} transition-transform group-hover:translate-x-1`}>
                      Enter curriculum <span>→</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg} ${config.textColor}`}>
                      <Icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-xl font-bold font-outfit ${isDark ? 'text-[#ffffff]' : 'text-slate-800'}`}>Class {cls}</h3>
                        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full sm:hidden ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                          {classModuleCount} Mod
                        </div>
                      </div>
                      <p className={`text-sm truncate ${isDark ? 'text-[#a1a1aa]' : 'text-slate-500'}`}>{config.desc}</p>
                    </div>
                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 hidden sm:block ${isDark ? 'bg-[#1c1b1b] text-[#71717a]' : 'bg-slate-100 text-slate-500'}`}>
                      {classModuleCount} Modules
                    </div>
                    <div className={`text-sm font-bold flex items-center gap-1 ${config.textColor} transition-transform group-hover:translate-x-1 shrink-0 ml-2 hidden md:flex`}>
                      Enter curriculum <span>→</span>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
