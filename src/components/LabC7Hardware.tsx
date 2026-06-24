import { useState } from 'react';
import { Cpu, Monitor, Mouse, Keyboard, HardDrive, Speaker } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7Hardware({ onExit }: LabProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = {
    cpu: { name: 'Processor (CPU)', icon: <Cpu className="w-16 h-16" />, desc: 'The brain of the computer that performs all calculations and logical operations.' },
    motherboard: { name: 'Motherboard', icon: <div className="w-16 h-16 border-4 border-emerald-500 rounded flex items-center justify-center font-bold text-emerald-500">MB</div>, desc: 'The main circuit board connecting all internal components.' },
    ram: { name: 'RAM', icon: <div className="w-16 h-16 border-t-8 border-b-8 border-yellow-500 rounded bg-green-800" />, desc: 'Short-term volatile memory used by the CPU for quick data access.' },
    storage: { name: 'Hard Drive', icon: <HardDrive className="w-16 h-16" />, desc: 'Long-term storage for the operating system, applications, and user files.' },
    monitor: { name: 'Monitor', icon: <Monitor className="w-16 h-16" />, desc: 'An output device that displays visual information.' },
    keyboard: { name: 'Keyboard', icon: <Keyboard className="w-16 h-16" />, desc: 'An input device used to type text and issue commands.' },
    mouse: { name: 'Mouse', icon: <Mouse className="w-16 h-16" />, desc: 'An input device used to point, click, and interact with the graphical interface.' },
    speakers: { name: 'Speakers', icon: <Speaker className="w-16 h-16" />, desc: 'An output device that produces audio.' }
  };

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Hardware Demonstration" />

        <h1 className="text-3xl font-bold mb-2">Hardware Demonstration</h1>
        <p className="text-slate-600 mb-8">Click on the internal components and peripheral devices to learn about their functions.</p>

        <div className="grid grid-cols-2 gap-8 max-w-4xl">
          <div className="bg-slate-50 p-6 rounded-xl shadow border border-slate-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">System Unit (Internal)</h2>
            <div className="grid grid-cols-2 gap-4">
              {['cpu', 'motherboard', 'ram', 'storage'].map(key => (
                <button 
                  key={key}
                  onClick={() => setSelectedItem(key)}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${selectedItem === key ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'}`}
                >
                  {items[key as keyof typeof items].icon}
                  <span className="font-medium text-sm">{items[key as keyof typeof items].name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl shadow border border-slate-200">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Peripherals (External)</h2>
            <div className="grid grid-cols-2 gap-4">
              {['monitor', 'keyboard', 'mouse', 'speakers'].map(key => (
                <button 
                  key={key}
                  onClick={() => setSelectedItem(key)}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${selectedItem === key ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'}`}
                >
                  {items[key as keyof typeof items].icon}
                  <span className="font-medium text-sm">{items[key as keyof typeof items].name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-96 bg-slate-50 p-8 flex flex-col shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Component Inspector</h2>
        
        {selectedItem ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 mb-6 shadow-inner">
              {items[selectedItem as keyof typeof items].icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{items[selectedItem as keyof typeof items].name}</h3>
            <p className="text-slate-600 leading-relaxed text-lg bg-slate-50 p-4 rounded-xl border border-slate-100">
              {items[selectedItem as keyof typeof items].desc}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
            Select a component to view its details.
          </div>
        )}
      </div>
    </div>
  );
}
