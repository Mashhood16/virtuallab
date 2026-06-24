import { useState } from 'react';
import { CheckCircle, Monitor, Keyboard, Mouse, HardDrive, Cpu, Printer } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6HardwareCharts({ onExit }: LabProps) {
  const hardwareItems = [
    { id: 'monitor', label: 'Monitor', icon: Monitor },
    { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
    { id: 'mouse', label: 'Mouse', icon: Mouse },
    { id: 'hdd', label: 'Hard Drive', icon: HardDrive },
    { id: 'cpu', label: 'CPU', icon: Cpu },
    { id: 'printer', label: 'Printer', icon: Printer }
  ];

  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  
  const handleSlotClick = (slotId: string) => {
    if (selectedLabel) {
      setMatches(prev => ({ ...prev, [slotId]: selectedLabel }));
      setSelectedLabel(null);
    }
  };

  const removeMatch = (slotId: string) => {
    setMatches(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  };

  const isComplete = Object.keys(matches).length === hardwareItems.length;
  const isCorrect = isComplete && hardwareItems.every(item => matches[item.id] === item.id);

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Hardware Identification Charts" />

        <h1 className="text-3xl font-bold mb-2">Hardware Identification Charts</h1>
        <p className="text-slate-600 mb-8">Click a label from the word bank, then click an empty slot below the correct hardware icon to label it.</p>

        <div className="flex gap-8 flex-1">
          {/* Main Chart Area */}
          <div className="flex-1 bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-center">Hardware Components</h2>
            
            <div className="grid grid-cols-3 gap-8 flex-1">
              {hardwareItems.map(item => {
                const Icon = item.icon;
                const matchedLabelId = matches[item.id];
                const matchedLabel = hardwareItems.find(h => h.id === matchedLabelId)?.label;

                return (
                  <div key={item.id} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border-2 border-slate-100">
                    <Icon className="w-24 h-24 text-slate-700 mb-6" strokeWidth={1.5} />
                    
                    <button 
                      onClick={() => matchedLabelId ? removeMatch(item.id) : handleSlotClick(item.id)}
                      className={`w-full h-12 rounded-lg border-2 border-dashed flex items-center justify-center font-bold text-sm transition-colors ${
                        matchedLabelId 
                          ? 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                          : selectedLabel 
                            ? 'border-blue-300 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 text-slate-400' 
                            : 'border-slate-300 bg-slate-100 text-slate-400'
                      }`}
                    >
                      {matchedLabel || 'Click to Place Label'}
                    </button>
                  </div>
                );
              })}
            </div>

            {isComplete && (
              <div className={`mt-8 p-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    All components labeled correctly! Excellent work.
                  </>
                ) : (
                  "Some labels are incorrect. Click a label to remove it and try again."
                )}
              </div>
            )}
          </div>

          {/* Word Bank Sidebar */}
          <div className="w-64 flex flex-col gap-4">
            <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">Word Bank</h3>
              <div className="flex flex-col gap-3">
                {hardwareItems.map(item => {
                  const isUsed = Object.values(matches).includes(item.id);
                  return (
                    <button
                      key={item.id}
                      disabled={isUsed}
                      onClick={() => setSelectedLabel(item.id)}
                      className={`p-3 rounded-lg border-2 font-bold text-sm text-left transition-colors ${
                        isUsed 
                          ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                          : selectedLabel === item.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
