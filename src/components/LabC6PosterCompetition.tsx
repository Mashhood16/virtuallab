import { useState } from 'react';
import { CheckCircle, Palette, Image as ImageIcon, Download, Copy, Shield, AlertTriangle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6PosterCompetition({ onExit }: LabProps) {
  const [topic, setTopic] = useState<'cyber_ethics' | 'cyber_safety' | 'plagiarism' | 'copyright' | null>(null);
  const [headline, setHeadline] = useState('');
  const [colorScheme, setColorScheme] = useState('blue');
  const [isFinished, setIsFinished] = useState(false);

  const topics = [
    { id: 'cyber_ethics', label: 'Cyber Ethics', icon: Shield },
    { id: 'cyber_safety', label: 'Internet Safety', icon: AlertTriangle },
    { id: 'plagiarism', label: 'Digital Plagiarism', icon: Copy },
    { id: 'copyright', label: 'Copyright / Piracy', icon: Download }
  ] as const;

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    rose: 'bg-rose-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-400 text-amber-900',
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Group Poster Competition" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Work with your virtual group to prepare a poster for the lab competition.</p>

        <div className="flex gap-8 flex-1">
          {/* Editor Sidebar */}
          <div className="w-80 flex flex-col gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase text-sm tracking-wider">1. Select Theme</h3>
              <div className="grid grid-cols-2 gap-2">
                {topics.map(t => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTopic(t.id)}
                      className={`flex flex-col items-center justify-center text-center gap-2 p-3 rounded-lg border-2 text-xs font-bold transition-colors h-24 ${
                        topic === t.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase text-sm tracking-wider">2. Headline</h3>
              <input 
                type="text" 
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                placeholder="Enter catchy headline..."
                className="w-full p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-6">
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4" /> Color Scheme
              </h3>
              <div className="flex gap-2">
                {Object.keys(colorClasses).map(color => (
                  <button
                    key={color}
                    onClick={() => setColorScheme(color)}
                    className={`w-8 h-8 rounded-full border-4 transition-transform ${colorScheme === color ? 'border-slate-800 dark:border-slate-500 scale-110' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: color === 'amber' ? '#fbbf24' : color === 'rose' ? '#e11d48' : color === 'emerald' ? '#059669' : color === 'indigo' ? '#4f46e5' : '#2563eb' }}
                  />
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsFinished(true)}
              disabled={!topic || !headline}
              className="mt-auto py-4 bg-slate-800 dark:bg-slate-800 hover:bg-slate-900 dark:bg-slate-800 text-white font-bold rounded-xl shadow-sm disabled:opacity-50 transition-colors"
            >
              Submit Poster Entry
            </button>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl shadow-inner border border-slate-300 dark:border-slate-700 dark:border-slate-500 p-8 flex items-center justify-center relative overflow-hidden">
            {/* The Poster */}
            <div className={`w-full max-w-lg aspect-[3/4] shadow-2xl flex flex-col relative transition-all duration-500 ${colorClasses[colorScheme]}`}>
              
              <div className="p-12 flex-1 flex flex-col items-center justify-center text-center relative z-10">
                {topic ? (() => {
                  const Icon = topics.find(t => t.id === topic)!.icon;
                  return <Icon className="w-32 h-32 mb-8 opacity-90" />;
                })() : (
                  <ImageIcon className="w-32 h-32 mb-8 opacity-20" />
                )}

                <h1 className="text-5xl font-black uppercase tracking-tight leading-none mb-6">
                  {headline || 'YOUR HEADLINE HERE'}
                </h1>
                
                {topic && (
                  <div className="mt-auto text-xl font-medium opacity-80 border-t-2 border-current pt-4 uppercase tracking-widest">
                    {topics.find(t => t.id === topic)?.label}
                  </div>
                )}
              </div>

              {/* Decorative graphic */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-50 dark:bg-slate-900/10 rounded-full"></div>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-black/10 rounded-full"></div>

            </div>

            {isFinished && (
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 text-center animate-in fade-in">
                <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">Poster Submitted!</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-md">Your group's poster is now entered into the competition. It looks fantastic!</p>
                <button 
                  onClick={() => setIsFinished(false)}
                  className="mt-8 px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-800 rounded-lg font-bold text-slate-700 dark:text-slate-200"
                >
                  Edit Poster
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
