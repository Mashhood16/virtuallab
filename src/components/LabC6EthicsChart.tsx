import { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, Type, Move } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6EthicsChart({ onExit }: LabProps) {
  const [stickers, setStickers] = useState<{id: string, text: string, type: 'good'|'bad'|'info', x: number, y: number}[]>([]);
  
  const rules = [
    { text: "Do not use computers to harm others.", type: 'bad' },
    { text: "Respect the privacy of others.", type: 'good' },
    { text: "Do not snoop around in other people's files.", type: 'bad' },
    { text: "Do not copy software for which you have not paid.", type: 'bad' },
    { text: "Think about the social consequences of the program you are writing.", type: 'info' },
    { text: "Always use a computer in ways that ensure consideration and respect.", type: 'good' }
  ] as const;

  const handleDrop = (e: React.DragEvent, rule: typeof rules[0]) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 100;
    const y = e.clientY - rect.top - 20;

    setStickers([...stickers, { id: Date.now().toString(), text: rule.text, type: rule.type, x, y }]);
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Cyber Ethics Chart Builder" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">
        

        <p className="text-slate-600 dark:text-slate-300 mb-8">Drag rules from the bank onto the classroom chart canvas to create a custom ethics poster.</p>

        <div className="flex gap-8 flex-1 h-[600px]">
          {/* Rule Bank */}
          <div className="w-80 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col overflow-hidden p-6">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-sm mb-4">Rule Bank</h3>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-2">
              {rules.map((rule, idx) => (
                <div 
                  key={idx}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify(rule));
                  }}
                  className={`p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing font-medium text-sm flex gap-3 items-start ${
                    rule.type === 'good' ? 'border-green-200 bg-green-50 text-green-800' :
                    rule.type === 'bad' ? 'border-red-200 bg-red-50 text-red-800' :
                    'border-blue-200 bg-blue-50 text-blue-800'
                  }`}
                >
                  <Move className="w-4 h-4 shrink-0 mt-0.5 opacity-50" />
                  {rule.text}
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div 
            className="flex-1 bg-amber-50 rounded-xl shadow-md border-8 border-amber-800/20 relative overflow-hidden flex flex-col items-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const rule = JSON.parse(e.dataTransfer.getData('text/plain'));
              handleDrop(e, rule);
            }}
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, #fbbf24 28px, #fbbf24 29px)',
              backgroundAttachment: 'local'
            }}
          >
            <div className="bg-slate-50 dark:bg-slate-900 px-8 py-4 rounded-full border-4 border-amber-400 font-bold text-2xl text-amber-700 mt-8 mb-4 shadow-sm z-10">
              Classroom Cyber Ethics
            </div>

            {stickers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50 pointer-events-none">
                <Type className="w-16 h-16 text-amber-900 mb-4" />
                <p className="font-bold text-amber-900 text-xl">Drag rules here to build the chart</p>
              </div>
            )}

            {stickers.map(sticker => (
              <div 
                key={sticker.id}
                className={`absolute p-4 rounded-lg shadow-lg font-bold text-sm max-w-xs flex gap-3 items-center ${
                  sticker.type === 'good' ? 'bg-green-500 text-white' :
                  sticker.type === 'bad' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}
                style={{ left: sticker.x, top: sticker.y, transform: 'rotate(-2deg)' }}
              >
                {sticker.type === 'good' && <CheckCircle className="w-5 h-5 shrink-0" />}
                {sticker.type === 'bad' && <AlertTriangle className="w-5 h-5 shrink-0" />}
                {sticker.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
                {sticker.text}
              </div>
            ))}
          </div>
        </div>

        {stickers.length >= 4 && (
          <div className="mt-8 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg flex items-center justify-center gap-3 font-bold text-lg">
            <CheckCircle className="w-6 h-6" /> 
            Chart is looking great! This covers enough rules to be displayed in the lab.
          </div>
        )}
      </div>
    </div>
  );
}
