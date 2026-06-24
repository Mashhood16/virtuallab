import { useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8LaserMaze({ onExit }: LabProps) {
  const [mirrors, setMirrors] = useState([
    { id: 1, x: 100, y: 150, angle: 45, active: false },
    { id: 2, x: 250, y: 50, angle: 135, active: false },
    { id: 3, x: 250, y: 250, angle: 135, active: false }
  ]);
  const [laserOn, setLaserOn] = useState(false);

  const rotateMirror = (id: number) => {
    setMirrors(mirrors.map(m => {
      if (m.id === id) {
        return { ...m, angle: (m.angle + 45) % 180 };
      }
      return m;
    }));
  };

  const reset = () => {
    setLaserOn(false);
    setMirrors([
      { id: 1, x: 100, y: 150, angle: 45, active: false },
      { id: 2, x: 250, y: 50, angle: 135, active: false },
      { id: 3, x: 250, y: 250, angle: 135, active: false }
    ]);
  };

  // Determine if maze is solved based on current angles
  // Correct path: Source(left) -> hits m1(angle 45) -> goes up -> hits m2(angle 135) -> goes right to exit.
  // OR Source(left) -> hits m1(angle 135) -> goes down -> hits m3(angle 45) -> goes right to exit.
  const isSolvedTop = mirrors[0].angle === 45 && mirrors[1].angle === 135;
  const isSolvedBottom = mirrors[0].angle === 135 && mirrors[2].angle === 45;
  const isSolved = isSolvedTop || isSolvedBottom;

  return (
    <div className="overflow-y-auto flex flex-col h-screen bg-slate-50 font-sans select-none">
      <LabHeader onExit={onExit} title="Act 9.1: Tracing Mirror Reflections" subtitle="Navigate the laser through the maze" rightContent={<>{rightJsx}</>} />

      <div className="flex-1 flex flex-col p-6 gap-6 max-w-4xl mx-auto w-full items-center justify-center">
        
        <div className="w-full bg-slate-900 rounded-2xl shadow-xl border-4 border-slate-700 p-8 flex flex-col items-center relative overflow-hidden h-[500px]">
          
          {/* Laser Source */}
          <div className="absolute left-0 top-[140px] flex items-center">
             <div className="w-12 h-8 bg-slate-700 rounded-r-md border border-slate-500 flex items-center justify-end pr-1 z-20">
                <div className="w-2 h-4 bg-red-500 rounded-sm" />
             </div>
          </div>

          {/* Target/Exit */}
          <div className="absolute right-0 top-[40px] flex items-center">
             <div className="w-12 h-12 bg-emerald-900/50 rounded-l-xl border-2 border-emerald-500 border-r-0 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
             </div>
          </div>
          <div className="absolute right-0 top-[240px] flex items-center">
             <div className="w-12 h-12 bg-emerald-900/50 rounded-l-xl border-2 border-emerald-500 border-r-0 flex items-center justify-center z-20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
             </div>
          </div>

          {/* Obstacles */}
          <div className="absolute left-[180px] top-0 w-8 h-[120px] bg-slate-800 border border-slate-600 rounded-b-md" />
          <div className="absolute left-[180px] bottom-0 w-8 h-[120px] bg-slate-800 border border-slate-600 rounded-t-md" />
          <div className="absolute left-[180px] top-[180px] w-8 h-[40px] bg-slate-800 border border-slate-600 rounded-sm" />

          {/* Laser Beams */}
          {laserOn && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* Beam 1: Source to M1 */}
              <div className="absolute left-12 top-[152px] h-1 bg-red-500 shadow-[0_0_10px_red]" style={{ width: '88px' }} />
              
              {/* If hits M1 correctly */}
              {mirrors[0].angle === 45 && (
                 <>
                   {/* Beam 2: M1 up to M2 */}
                   <div className="absolute left-[100px] top-[50px] w-1 h-[104px] bg-red-500 shadow-[0_0_10px_red]" />
                   {/* If hits M2 correctly */}
                   {mirrors[1].angle === 135 ? (
                      <div className="absolute left-[100px] top-[50px] h-1 bg-red-500 shadow-[0_0_10px_red]" style={{ width: 'calc(100% - 100px)' }} />
                   ) : (
                      <div className="absolute left-[100px] top-[50px] h-1 bg-red-500 shadow-[0_0_10px_red] w-[150px] origin-left rotate-[-45deg] opacity-50" />
                   )}
                 </>
              )}

              {mirrors[0].angle === 135 && (
                 <>
                   {/* Beam 2: M1 down to M3 */}
                   <div className="absolute left-[100px] top-[154px] w-1 h-[100px] bg-red-500 shadow-[0_0_10px_red]" />
                   {/* If hits M3 correctly */}
                   {mirrors[2].angle === 45 ? (
                      <div className="absolute left-[100px] top-[254px] h-1 bg-red-500 shadow-[0_0_10px_red]" style={{ width: 'calc(100% - 100px)' }} />
                   ) : (
                      <div className="absolute left-[100px] top-[254px] h-1 bg-red-500 shadow-[0_0_10px_red] w-[150px] origin-left rotate-[45deg] opacity-50" />
                   )}
                 </>
              )}

              {/* M1 wrong angles */}
              {mirrors[0].angle === 0 && <div className="absolute left-[100px] top-[152px] h-1 bg-red-500 shadow-[0_0_10px_red] w-12 opacity-50" />}
              {mirrors[0].angle === 90 && <div className="absolute left-[100px] top-[152px] h-1 bg-red-500 shadow-[0_0_10px_red] w-12 origin-left rotate-180 opacity-50" />}
            </div>
          )}

          {/* Mirrors */}
          {mirrors.map(m => (
            <button 
              key={m.id}
              onClick={() => rotateMirror(m.id)}
              className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center rounded-full hover:bg-slate-50/10 active:bg-slate-50/20 transition-colors"
              style={{ left: m.x, top: m.y }}
            >
              <div 
                className="w-10 h-2 bg-blue-300 shadow-[0_0_8px_blue] rounded-full transition-transform duration-300"
                style={{ transform: `rotate(${m.angle}deg)` }}
              />
            </button>
          ))}

          {/* Controls */}
          <div className="absolute bottom-6 flex flex-col items-center gap-4 z-40">
            <button 
              onClick={() => setLaserOn(!laserOn)}
              className={`px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg transition-all active:scale-95 ${laserOn ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/50' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            >
              <Zap className={`w-5 h-5 ${laserOn ? 'animate-pulse text-yellow-300' : ''}`} /> 
              {laserOn ? 'Laser ON' : 'Laser OFF'}
            </button>

            <p className="text-slate-400 text-sm font-medium">Click the blue mirrors to rotate them and guide the beam to the green targets.</p>
          </div>

          {/* Success message */}
          {laserOn && isSolved && (
            <div className="absolute top-6 px-6 py-4 bg-emerald-500/90 backdrop-blur border border-emerald-400 text-white rounded-xl shadow-2xl animate-bounce z-50">
              <h3 className="font-bold text-xl mb-1 text-center">Maze Solved!</h3>
              <p className="text-sm font-medium">Light reflects off mirrors according to the law of reflection.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
