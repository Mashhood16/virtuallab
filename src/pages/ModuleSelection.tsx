import { useParams, useNavigate } from 'react-router-dom';
import { LAB_MODULES, formatSubject } from '../data/labModules';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { Rocket, Lock } from 'lucide-react';

const SUBJECT_ACCENT: Record<string, string> = {
  physics: 'from-blue-500 to-indigo-600',
  chemistry: 'from-emerald-500 to-teal-600',
  biology: 'from-rose-500 to-pink-600',
  math: 'from-violet-500 to-purple-600',
  computer: 'from-sky-500 to-cyan-600',
  science: 'from-amber-500 to-orange-600',
};

export default function ModuleSelection() {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();

  const filteredModules = LAB_MODULES.filter(m => m.classLevel === classId && m.subject === subjectId);
  const accent = SUBJECT_ACCENT[subjectId || ''] || 'from-slate-500 to-slate-600';

  return (
    <Layout>
      <div className="flex flex-col">
        <Breadcrumbs />

        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 glass rounded-2xl border border-dashed border-slate-200/50 dark:border-slate-800/50">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${accent} flex items-center justify-center mb-4 opacity-50`}>
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Modules Coming Soon</h3>
            <p className="text-slate-500 max-w-md text-center">We are actively developing premium virtual labs for Class {classId} {subjectId && formatSubject(subjectId)}. Check back soon!</p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Curriculum Modules</h2>
            <p className="text-slate-500 mt-1 mb-6">High-End Interactive Experiments &mdash; Class {classId} {subjectId && formatSubject(subjectId)}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((lab) => {
                const isBuilt = lab.built;
                return (
                  <div
                    key={lab.id}
                    onClick={() => isBuilt && navigate(`/class/${classId}/${subjectId}/lab/${lab.id}`)}
                    className={`relative group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
                      isBuilt
                        ? 'glass border border-slate-200/50 dark:border-slate-800/50 hover:-translate-y-2 hover:shadow-xl cursor-pointer'
                        : 'glass border border-dashed border-slate-200/50 dark:border-slate-800/50 opacity-70'
                    }`}
                  >
                    {/* Gradient header strip */}
                    <div className={`relative h-32 bg-gradient-to-br ${lab.bg} overflow-hidden`}>
                      {/* Dot pattern overlay */}
                      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
                      
                      {/* Shine effect on hover */}
                      {isBuilt && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
                      
                      {/* Module number badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-md text-white text-xs font-bold tracking-wider border border-white/20">
                        {formatSubject(lab.subject)} &middot; Class {lab.classLevel}
                      </div>
                      
                      {/* Built indicator */}
                      {isBuilt ? (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm">
                          <Rocket className="w-3.5 h-3.5" /> Ready
                        </div>
                      ) : (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/30 text-white/70 text-xs font-bold backdrop-blur-sm">
                          Coming Soon
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 flex-1 flex flex-col bg-transparent">
                      <h3 className={`text-base font-bold font-outfit leading-snug mb-2 ${isBuilt ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-600'}`}>
                        {lab.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 flex-1">
                        {lab.desc}
                      </p>

                      {/* Bottom row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-bold">~15 min</span>
                        </div>
                        {isBuilt ? (
                          <span className={`text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-gradient-to-r ${accent} group-hover:scale-105 transition-transform`}>
                            Launch &rarr;
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
