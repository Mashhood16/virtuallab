import { useState } from 'react';
import { Usb, Disc, Cpu, Printer, Mouse, Terminal, Shield, FolderSearch } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6SystemSoftware({ onExit }: LabProps) {
  const devices = [
    { id: 'usb', name: 'USB Flash Drive', icon: Usb, isPnP: true },
    { id: 'mouse', name: 'USB Mouse', icon: Mouse, isPnP: true },
    { id: 'printer', name: 'Legacy Parallel Printer', icon: Printer, isPnP: false },
    { id: 'cpu', name: 'Internal Processor', icon: Cpu, isPnP: false },
    { id: 'webcam', name: 'Webcam', icon: Disc, isPnP: true }
  ];

  const utilities = [
    { id: 'antivirus', name: 'Antivirus Scanner', icon: Shield, desc: 'Protects system from malware.' },
    { id: 'file_manager', name: 'File Explorer', icon: FolderSearch, desc: 'Manages files and directories.' },
    { id: 'disk_cleanup', name: 'Disk Cleanup', icon: Disc, desc: 'Removes unnecessary temporary files.' },
    { id: 'task_mgr', name: 'Task Manager', icon: Terminal, desc: 'Monitors system performance and tasks.' }
  ];

  const [identifiedPnP, setIdentifiedPnP] = useState<string[]>([]);

  const togglePnP = (id: string) => {
    if (identifiedPnP.includes(id)) {
      setIdentifiedPnP(identifiedPnP.filter(i => i !== id));
    } else {
      setIdentifiedPnP([...identifiedPnP, id]);
    }
  };

  const isPnPComplete = devices.filter(d => d.isPnP).every(d => identifiedPnP.includes(d.id)) && 
                        identifiedPnP.every(id => devices.find(d => d.id === id)?.isPnP);

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="System Software & Devices" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Identify Plug and Play (PnP) devices and explore common utility programs.</p>

        <div className="flex gap-8 flex-1 min-h-[500px]">
          {/* Left Column: PnP */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8 flex flex-col">
            <h2 className="text-xl font-bold mb-2">1. Plug and Play Devices</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Select all the devices below that are "Plug and Play" (devices that work immediately when connected without manual configuration).</p>

            <div className="flex flex-col gap-3 flex-1">
              {devices.map(device => {
                const Icon = device.icon;
                const isSelected = identifiedPnP.includes(device.id);
                
                return (
                  <button
                    key={device.id}
                    onClick={() => togglePnP(device.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${isSelected ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg">{device.name}</span>
                  </button>
                );
              })}
            </div>

            <div className={`mt-6 p-4 rounded-xl font-bold text-center ${
              isPnPComplete 
                ? 'bg-green-100 text-green-700 border-green-200 border' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {isPnPComplete ? "Correct! You've identified all PnP devices." : "Select the PnP devices above."}
            </div>
          </div>

          {/* Right Column: Utilities */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-8 flex flex-col">
            <h2 className="text-xl font-bold mb-2">2. Utility Programs</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Review these essential system software utilities used to maintain and manage a computer.</p>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {utilities.map(util => {
                const Icon = util.icon;
                return (
                  <div key={util.id} className="p-5 rounded-xl border-2 border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center text-center hover:border-indigo-300 transition-colors">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                      <Icon className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{util.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{util.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
