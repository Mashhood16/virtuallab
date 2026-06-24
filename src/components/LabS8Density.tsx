import { useState } from 'react';
import { RefreshCw, Droplets } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

interface ObjectToDrop {
  id: string;
  name: string;
  type: 'metal' | 'non-metal';
  color: string;
  shape: 'square' | 'circle';
  density: 'high' | 'low';
}

const OBJECTS: ObjectToDrop[] = [
  { id: 'fe', name: 'Iron Coin', type: 'metal', color: 'bg-slate-400', shape: 'circle', density: 'high' },
  { id: 'al', name: 'Aluminum Block', type: 'metal', color: 'bg-gray-300', shape: 'square', density: 'high' },
  { id: 'wood', name: 'Wood Piece', type: 'non-metal', color: 'bg-amber-700', shape: 'square', density: 'low' },
  { id: 'plastic', name: 'Plastic Cap', type: 'non-metal', color: 'bg-red-500', shape: 'circle', density: 'low' },
];

export default function LabS8Density({ onExit }: LabProps) {
  const [selected, setSelected] = useState<ObjectToDrop | null>(null);
  const [dropped, setDropped] = useState(false);

  const reset = () => {
    setDropped(false);
    setSelected(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 5.5: Density" subtitle="Drop objects in water to test their density" rightContent={<>{rightJsx}</>} />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Selection */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <h3 className="font-bold text-slate-700 mb-2">Select Object</h3>
          {OBJECTS.map(o => (
            <button 
              key={o.id}
              onClick={() => { setSelected(o); setDropped(false); }}
              className={`p-3 text-left rounded-lg font-bold transition-all border-2 ${selected?.id === o.id ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-700'}`}
            >
              {o.name}
            </button>
          ))}
        </div>

        {/* Action Area */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          
          {/* Beaker with Water */}
          <div className="relative w-64 h-80 flex flex-col justify-end items-center">
            
            {/* Beaker Glass */}
            <div className="absolute inset-0 border-x-4 border-b-4 border-white/80 bg-slate-50/10 rounded-b-xl z-20 backdrop-blur-[2px] pointer-events-none shadow-[0_8px_32px_rgba(0,0,0,0.1)]" />
            
            {/* Measurement lines */}
            <div className="absolute left-2 top-10 bottom-10 w-4 border-r border-white/50 z-30 opacity-50">
              {[0,1,2,3].map(i => <div key={i} className="w-2 h-px bg-slate-50/50 absolute right-0" style={{top: `${i*25}%`}} />)}
            </div>

            {/* The Dropped Object */}
            {selected && dropped && (
              <div 
                className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 ${selected.color} shadow-lg z-10 ${selected.shape === 'circle' ? 'rounded-full' : 'rounded-sm'} ${selected.density === 'high' ? 'animate-[sink_1.5s_cubic-bezier(0.4,0,1,1)_forwards]' : 'animate-[float_0.5s_ease-out_forwards]'}`}
                style={{ top: '0' }}
              />
            )}

            {/* The Water */}
            <div className="w-full h-3/4 bg-cyan-400/40 relative z-0 border-t-2 border-cyan-300/60 overflow-hidden rounded-b-lg">
              {/* Bubbles */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-2 h-2 rounded-full bg-slate-50 absolute bottom-4 left-10 animate-[rise_2s_infinite]" />
                <div className="w-3 h-3 rounded-full bg-slate-50 absolute bottom-10 right-16 animate-[rise_3s_infinite_1s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-50 absolute bottom-20 left-24 animate-[rise_1.5s_infinite_0.5s]" />
              </div>
            </div>

          </div>

          <div className="mt-8 text-center h-24">
            {!dropped ? (
              <button 
                onClick={() => setDropped(true)}
                disabled={!selected}
                className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-700 disabled:opacity-50 text-xl shadow-lg flex items-center gap-2 mx-auto transition-transform active:scale-95"
              >
                <Droplets className="w-6 h-6" /> Drop in Water
              </button>
            ) : (
              selected && (
                <div className={`px-6 py-4 rounded-xl border-2 animate-fade-in ${selected.density === 'high' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-cyan-50 border-cyan-200 text-cyan-800'}`}>
                  <h3 className="font-bold text-lg mb-1">{selected.name} is a {selected.type.toUpperCase()}</h3>
                  <p className="text-sm">
                    {selected.density === 'high' 
                      ? "It SANK! Most metals have HIGH density and sink in water." 
                      : "It FLOATED! Many non-metals (and organic materials) have LOW density and float."}
                  </p>
                </div>
              )
            )}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sink {
          0% { top: 0; transform: translate(-50%, -50%) rotate(0deg); }
          30% { top: 25%; transform: translate(-50%, -50%) rotate(10deg); }
          100% { top: calc(100% - 30px); transform: translate(-50%, -100%) rotate(25deg); }
        }
        @keyframes float {
          0% { top: 0; transform: translate(-50%, -50%); }
          50% { top: 25%; transform: translate(-50%, -50%); }
          100% { top: 20%; transform: translate(-50%, -50%); }
        }
        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
      `}} />
    </div>
  );
}
