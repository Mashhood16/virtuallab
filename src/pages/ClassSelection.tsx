import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LAB_MODULES } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { FlaskConical, Atom, Dna, Calculator, Cpu, Microscope, BookOpen } from 'lucide-react';

const CLASS_CONFIG: Record<string, { gradient: string; icon: typeof FlaskConical; iconBg: string; ring: string; hoverGradient: string; label: string }> = {
  '6':  { gradient: 'from-emerald-500 to-teal-600',   icon: FlaskConical, iconBg: 'bg-emerald-400', ring: 'ring-emerald-300', hoverGradient: 'from-emerald-400 to-teal-500',   label: 'Foundation Year' },
  '7':  { gradient: 'from-sky-500 to-blue-600',       icon: Atom,         iconBg: 'bg-sky-400',   ring: 'ring-sky-300',   hoverGradient: 'from-sky-400 to-blue-500',       label: 'Exploration' },
  '8':  { gradient: 'from-violet-500 to-purple-600',   icon: Cpu,          iconBg: 'bg-violet-400', ring: 'ring-violet-300', hoverGradient: 'from-violet-400 to-purple-500',  label: 'Discovery' },
  '9':  { gradient: 'from-rose-500 to-pink-600',       icon: Dna,          iconBg: 'bg-rose-400',  ring: 'ring-rose-300',  hoverGradient: 'from-rose-400 to-pink-500',      label: 'Pre-Board' },
  '10': { gradient: 'from-orange-500 to-amber-600',    icon: Microscope,   iconBg: 'bg-orange-400', ring: 'ring-orange-300', hoverGradient: 'from-orange-400 to-amber-500',  label: 'Board Prep' },
  '11': { gradient: 'from-indigo-500 to-blue-700',     icon: Calculator,   iconBg: 'bg-indigo-400', ring: 'ring-indigo-300', hoverGradient: 'from-indigo-400 to-blue-600',   label: 'Senior Science' },
  '12': { gradient: 'from-red-500 to-rose-700',        icon: BookOpen,     iconBg: 'bg-red-400',   ring: 'ring-red-300',   hoverGradient: 'from-red-400 to-rose-600',      label: 'Final Year' },
};

export default function ClassSelection() {
  const navigate = useNavigate();
  const moduleCount = useMemo(() => LAB_MODULES.filter(m => m.built).length, []);

  return (
    <Layout>
      <div className="flex flex-col relative">
        <Breadcrumbs />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 md:p-10 mb-8 md:mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-48 h-48 bg-purple-300 opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center text-center" style={{ WebkitFontSmoothing: 'antialiased', WebkitTextSizeAdjust: '100%' }}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4 font-outfit tracking-tight">
              Welcome to <span className="text-blue-200">VirtualLab</span>
            </h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 font-medium px-2">
              Explore our library of <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-lg">{moduleCount} interactive modules</span> across Physics, Chemistry, Biology, Mathematics & Computer Science.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Select Class</h2>
          <p className="text-slate-500 mt-1 mb-6">Choose your grade level to browse available experiments.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Object.entries(CLASS_CONFIG).map(([cls, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={cls}
                  onClick={() => navigate(`/class/${cls}`)}
                  className="relative group p-4 md:p-6 rounded-2xl border-2 border-transparent bg-white hover:border-current hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
                >
                  {/* Gradient accent bar at top */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient} rounded-t-2xl group-hover:h-2 transition-all duration-300`}></div>
                  
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.hoverGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl`}></div>

                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}
                      style={{ boxShadow: `0 8px 20px -4px rgb(0 0 0 / 0.2)` }}
                    >
                      <Icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xl md:text-2xl font-extrabold text-slate-800 font-outfit">Class {cls}</span>
                      <span className="text-xs md:text-sm font-medium text-slate-500">{config.label}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
