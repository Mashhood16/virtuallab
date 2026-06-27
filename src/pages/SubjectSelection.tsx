import { useNavigate, useParams } from 'react-router-dom';
import { Microscope, Atom, Calculator, Laptop, Activity, BookOpen, Dna } from 'lucide-react';
import { formatSubject } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { LAB_MODULES } from '../data/labModules';

const getSubjectsForClass = (classLevel: string) => {
  const num = parseInt(classLevel);
  if (num >= 6 && num <= 8) {
    return ['science', 'computer'];
  } else {
    return ['physics', 'chemistry', 'biology', 'math', 'computer'];
  }
};

const SUBJECT_CONFIG: Record<string, { gradient: string; icon: typeof Atom; description: string; moduleKey: string }> = {
  physics:    { gradient: 'from-blue-500 to-indigo-600',   icon: Atom,        description: 'Forces, Energy, Waves & Electromagnetism', moduleKey: 'physics' },
  chemistry:  { gradient: 'from-emerald-500 to-teal-600',  icon: Microscope,  description: 'Reactions, Bonding, Organic & Inorganic', moduleKey: 'chemistry' },
  biology:    { gradient: 'from-rose-500 to-pink-600',     icon: Dna,         description: 'Cells, Genetics, Ecology & Human Body', moduleKey: 'biology' },
  math:       { gradient: 'from-violet-500 to-purple-600',  icon: Calculator,  description: 'Algebra, Geometry, Statistics & Calculus', moduleKey: 'math' },
  computer:   { gradient: 'from-sky-500 to-cyan-600',      icon: Laptop,      description: 'Programming, Networks, AI & Cyber Safety', moduleKey: 'computer' },
  science:    { gradient: 'from-amber-500 to-orange-600',   icon: Activity,    description: 'Integrated Science Curriculum', moduleKey: 'science' },
};

export default function SubjectSelection() {
  const { classId } = useParams();
  const navigate = useNavigate();
  if (!classId) return null;
  const subjects = getSubjectsForClass(classId);

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Select Subject</h2>
          <p className="text-slate-500 mt-1 mb-6">Class {classId} Curriculum</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => {
              const config = SUBJECT_CONFIG[subject] || { gradient: 'from-slate-500 to-slate-600', icon: BookOpen, description: 'Explore modules', moduleKey: subject };
              const Icon = config.icon;
              const count = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === config.moduleKey && m.built).length;
              return (
                <button
                  key={subject}
                  onClick={() => navigate(`/class/${classId}/${subject}`)}
                  className="relative group p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/50 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden text-left"
                >
                  {/* Top accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient} rounded-t-2xl group-hover:h-2 transition-all duration-300`}></div>
                  
                  {/* Hover glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl`}></div>

                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`w-11 h-11 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${config.gradient} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}
                      style={{ boxShadow: `0 8px 20px -4px rgb(0 0 0 / 0.2)` }}
                    >
                      <Icon className="w-5 h-5 md:w-7 md:h-7" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 font-outfit mb-1">{formatSubject(subject)}</h3>
                      <p className="text-sm font-medium text-slate-500 leading-snug mb-3">{config.description}</p>
                      <div className="flex items-center gap-2 mt-auto">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.gradient}`}>
                          {count} modules
                        </span>
                      </div>
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
