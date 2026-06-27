import { useState } from 'react';
import { Save, Layout, ShieldAlert, ShieldCheck } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7EthicsChart({ onExit }: LabProps) {
  const [elements, setElements] = useState<{id: string, type: string, content: string, x: number, y: number}[]>([]);
  const [draggedItem, setDraggedItem] = useState<{type: string, content: string} | null>(null);

  const library = [
    { type: 'header', content: 'ONLINE SAFETY RULES' },
    { type: 'header', content: 'CYBERCRIME AWARENESS' },
    { type: 'rule', content: 'Never share your password with anyone.' },
    { type: 'rule', content: 'Report suspicious links immediately.' },
    { type: 'rule', content: 'Treat others with respect online.' },
    { type: 'alert', content: 'WARNING: Identity Theft' },
    { type: 'alert', content: 'WARNING: Phishing Scams' }
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 100; // rough offset
    const y = e.clientY - rect.top - 20;

    setElements([...elements, { id: Math.random().toString(), ...draggedItem, x, y }]);
    setDraggedItem(null);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Digital Ethics Poster" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Design a classroom display chart about Ethical Use, Online Safety, or Cybercrimes.</p>

        <div className="flex gap-8 flex-1 w-full max-w-6xl mx-auto">
          {/* Library */}
          <div className="w-80 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col gap-4">
            <h2 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm flex items-center mb-2"><Layout className="w-4 h-4 mr-2"/> Components</h2>
            
            <div className="space-y-3 overflow-y-auto pr-2 pb-4">
              {library.map((item, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDraggedItem(item)}
                  onDragEnd={() => setDraggedItem(null)}
                  className={`
                    p-3 rounded border-2 shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-transform
                    ${item.type === 'header' ? 'bg-blue-600 text-white font-black text-center text-xl' : ''}
                    ${item.type === 'rule' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium flex items-center' : ''}
                    ${item.type === 'alert' ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold flex items-center' : ''}
                  `}
                >
                  {item.type === 'rule' && <ShieldCheck className="w-5 h-5 mr-2 shrink-0 text-emerald-500" />}
                  {item.type === 'alert' && <ShieldAlert className="w-5 h-5 mr-2 shrink-0 text-rose-500" />}
                  {item.content}
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-slate-200 dark:border-slate-700 dark:border-slate-500 pt-4">
              <button className="w-full py-3 bg-blue-100 text-blue-700 font-bold rounded flex items-center justify-center hover:bg-blue-200 transition-colors">
                <Save className="w-5 h-5 mr-2" /> Save Poster
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div 
            className="flex-1 bg-slate-50 dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 dark:border-slate-500 shadow-xl rounded-xl relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium italic text-2xl">
                Drag items here to build your chart
              </div>
            )}

            {elements.map(el => (
              <div 
                key={el.id}
                className={`
                  absolute p-4 cursor-pointer shadow-md rounded border-2 group
                  ${el.type === 'header' ? 'bg-blue-600 border-blue-700 text-white font-black text-3xl' : ''}
                  ${el.type === 'rule' ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium text-lg flex items-center' : ''}
                  ${el.type === 'alert' ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold flex items-center' : ''}
                `}
                style={{ left: el.x, top: el.y }}
              >
                {el.type === 'rule' && <ShieldCheck className="w-6 h-6 mr-3 shrink-0 text-emerald-600" />}
                {el.type === 'alert' && <ShieldAlert className="w-6 h-6 mr-3 shrink-0 text-rose-600" />}
                {el.content}

                <button 
                  onClick={() => setElements(elements.filter(e => e.id !== el.id))}
                  className="absolute -top-3 -right-3 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
