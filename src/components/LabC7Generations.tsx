import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7Generations({ onExit }: LabProps) {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedTech, setDraggedTech] = useState<string | null>(null);

  const generations = [
    { id: 'gen1', title: '1st Generation', years: '1940s - 1950s', correctTech: 'vacuum' },
    { id: 'gen2', title: '2nd Generation', years: '1950s - 1960s', correctTech: 'transistor' },
    { id: 'gen3', title: '3rd Generation', years: '1960s - 1970s', correctTech: 'ic' },
    { id: 'gen4', title: '4th Generation', years: '1970s - Present', correctTech: 'microprocessor' }
  ];

  const technologies = [
    { id: 'transistor', name: 'Transistors', color: 'bg-orange-100 border-orange-400 text-orange-800' },
    { id: 'microprocessor', name: 'Microprocessors', color: 'bg-blue-100 border-blue-400 text-blue-800' },
    { id: 'vacuum', name: 'Vacuum Tubes', color: 'bg-slate-200 dark:bg-slate-800 border-slate-500 dark:border-slate-500 text-slate-800 dark:text-slate-100' },
    { id: 'ic', name: 'Integrated Circuits (IC)', color: 'bg-emerald-100 border-emerald-400 text-emerald-800' }
  ];

  const handleDrop = (genId: string) => {
    if (draggedTech) {
      setMatches(prev => ({ ...prev, [genId]: draggedTech }));
      setDraggedTech(null);
    }
  };

  const isComplete = generations.every(gen => matches[gen.id] === gen.correctTech);

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Computer Generations" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Drag and drop the core computing technology into its correct generation.</p>

        {isComplete && (
          <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 p-4 rounded-xl mb-8 flex items-center shadow-sm">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span className="font-bold">Excellent!</span> You've correctly identified the technological evolution of computers.
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-12">
          {generations.map(gen => {
            const placedTech = matches[gen.id] ? technologies.find(t => t.id === matches[gen.id]) : null;
            const isCorrect = matches[gen.id] === gen.correctTech;
            
            return (
              <div 
                key={gen.id}
                className={`bg-slate-50 dark:bg-slate-900 rounded-xl border-2 p-4 min-h-[200px] flex flex-col shadow-sm transition-colors ${draggedTech ? 'border-dashed border-blue-300 bg-blue-50/50' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(gen.id)}
              >
                <div className="text-center mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200">{gen.title}</h3>
                  <p className="text-xs text-slate-400">{gen.years}</p>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative">
                  {placedTech ? (
                    <div 
                      className={`w-full p-4 rounded-lg border-2 text-center text-sm font-bold shadow-sm ${placedTech.color} ${isCorrect ? 'ring-2 ring-emerald-500 ring-offset-2' : 'opacity-70'}`}
                      onClick={() => setMatches(prev => { const nm = {...prev}; delete nm[gen.id]; return nm; })} // Click to remove
                    >
                      {placedTech.name}
                      {isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 absolute top-2 right-2" />}
                    </div>
                  ) : (
                    <span className="text-slate-300 text-sm italic text-center px-4">Drop Technology Here</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 dark:border-slate-500 shadow-sm">
          <h2 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Core Technologies</h2>
          <div className="flex gap-4">
            {technologies.map(tech => {
              // Hide if already placed
              if (Object.values(matches).includes(tech.id)) return null;
              
              return (
                <div
                  key={tech.id}
                  draggable
                  onDragStart={() => setDraggedTech(tech.id)}
                  onDragEnd={() => setDraggedTech(null)}
                  className={`px-6 py-3 rounded-lg border-2 cursor-grab active:cursor-grabbing font-bold shadow-sm hover:-translate-y-1 transition-transform ${tech.color}`}
                >
                  {tech.name}
                </div>
              )
            })}
            {Object.values(matches).length === 4 && !isComplete && (
              <p className="text-rose-500 font-medium py-3">Some are incorrect. Click a technology to remove it and try again.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
