import { useState } from 'react';
import { Map, Compass } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8SkyMap({ onExit }: LabProps) {
  const [panX, setPanX] = useState(50);
  const [panY, setPanY] = useState(50);
  const [isScanning, setIsScanning] = useState(false);

  // Constellations mapped to arbitrary coordinates [x, y]
  const stars = [
    { name: "Ursa Major", x: 20, y: 30, color: "text-blue-300" },
    { name: "Orion", x: 70, y: 40, color: "text-red-300" },
    { name: "Southern Cross", x: 40, y: 80, color: "text-yellow-300" },
    { name: "Alpha Centauri", x: 35, y: 85, color: "text-white animate-pulse" },
    { name: "Cassiopeia", x: 80, y: 20, color: "text-purple-300" }
  ];

  const checkFound = (x: number, y: number) => {
    return Math.abs(x - panX) < 15 && Math.abs(y - panY) < 15;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScanning) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPanX(x);
      setPanY(y);
    }
  };

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-900 font-sans select-none text-white overflow-hidden">
      <LabHeader onExit={onExit} variant="dark" title="Act 12.1: Sky Map Mobile App" />
      <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 p-2 flex justify-end z-10">
        <div className="flex gap-2">
          <button 
            onMouseDown={() => setIsScanning(true)}
            onMouseUp={() => setIsScanning(false)}
            onMouseLeave={() => setIsScanning(false)}
            className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors ${isScanning ? 'bg-blue-600 text-white shadow-[0_0_15px_blue]' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
          >
            <Compass className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Hold to Scan'}
          </button>
        </div>
      </div>

      <div 
        className="flex-1 relative cursor-crosshair overflow-hidden bg-slate-950"
        onMouseMove={handleMouseMove}
      >
        
        {/* Background Stars (Static) */}
        <div className="absolute inset-0 opacity-40">
           {Array.from({length: 100}).map((_, i) => (
             <div 
               key={i} 
               className="absolute w-1 h-1 bg-slate-50 rounded-full"
               style={{ 
                 left: `${Math.random() * 100}%`, 
                 top: `${Math.random() * 100}%`,
                 opacity: Math.random() * 0.8 + 0.2
               }}
             />
           ))}
        </div>

        {/* Viewfinder (Phone screen metaphor) */}
        <div 
          className="absolute w-64 h-64 border-2 border-white/20 rounded-[40px] pointer-events-none transition-all duration-75 ease-out flex items-center justify-center"
          style={{ 
            left: `calc(${panX}% - 128px)`, 
            top: `calc(${panY}% - 128px)`,
            boxShadow: isScanning ? '0 0 50px rgba(59, 130, 246, 0.2), inset 0 0 50px rgba(59, 130, 246, 0.2)' : 'none',
            borderColor: isScanning ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.1)'
          }}
        >
           {/* Crosshair */}
           <div className="absolute w-4 h-px bg-slate-50/50" />
           <div className="absolute h-4 w-px bg-slate-50/50" />

           {/* AR Overlay UI */}
           {isScanning && (
             <>
                <div className="absolute top-4 left-4 text-xs font-mono text-blue-400">RA: {(panX * 0.24).toFixed(1)}h</div>
                <div className="absolute top-4 right-4 text-xs font-mono text-blue-400">DEC: {(panY - 50).toFixed(1)}°</div>
                <div className="absolute bottom-4 w-full text-center text-[10px] text-slate-400 tracking-widest uppercase">Point device at sky</div>
             </>
           )}
        </div>

        {/* Constellations */}
        {stars.map((star, i) => {
          const found = isScanning && checkFound(star.x, star.y);
          return (
            <div 
              key={i}
              className={`absolute transition-all duration-300 ${found ? 'scale-150 z-20' : 'scale-100 opacity-80 z-10'}`}
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
            >
              <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${star.color}`} />
              
              {/* Tooltip when found */}
              <div className={`absolute top-4 left-4 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-sm font-bold whitespace-nowrap transition-opacity duration-300 ${found ? 'opacity-100' : 'opacity-0'}`}>
                {star.name}
              </div>
            </div>
          )
        })}

        {/* Mission Panel */}
        <div className="absolute bottom-8 right-8 bg-slate-800/90 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm">
           <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Map className="w-5 h-5" /> Navigation Log</h3>
           <p className="text-sm text-slate-300 mb-4">Click and hold <span className="bg-slate-700 px-2 py-1 rounded text-xs">Hold to Scan</span> and move your cursor to explore the night sky.</p>
           <div className="space-y-2">
             <div className="flex justify-between text-sm items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400">Target:</span>
                <span className="font-bold text-yellow-300">Southern Cross</span>
             </div>
             <div className="flex justify-between text-sm items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400">Target:</span>
                <span className="font-bold text-white">Alpha Centauri</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
