import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

type Planet = {
 id: string;
 name: string;
 color: string;
 size: number;
 distance: number; // distance from center (Sun)
 speed: number;
};

export default function LabS6SolarSystemBuilder({ onExit }: LabProps) {
 const [planets, setPlanets] = useState<Planet[]>([]);
 const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

 const predefinedPlanets = [
 { name: 'Mercury', color: 'bg-stone-400', size: 14, distance: 50, speed: 4 },
 { name: 'Venus', color: 'bg-orange-300', size: 16, distance: 80, speed: 3 },
 { name: 'Earth', color: 'bg-blue-500', size: 18, distance: 115, speed: 2 },
 { name: 'Mars', color: 'bg-red-500', size: 14, distance: 150, speed: 1.5 },
 { name: 'Jupiter', color: 'bg-orange-400', size: 30, distance: 180, speed: 0.8 },
 { name: 'Saturn', color: 'bg-amber-200', size: 26, distance: 230, speed: 0.5 },
 { name: 'Uranus', color: 'bg-cyan-200', size: 20, distance: 270, speed: 0.3 },
 { name: 'Neptune', color: 'bg-blue-600', size: 18, distance: 310, speed: 0.2 },
 ];

 const addPlanet = (p: typeof predefinedPlanets[0]) => {
 if (!planets.some(existing => existing.name === p.name)) {
  setPlanets([...planets, { ...p, id: p.name }]);
 }
 };

 const removePlanet = (id: string) => {
 setPlanets(planets.filter(p => p.id !== id));
 if (selectedPlanet === id) setSelectedPlanet(null);
 };

 return (
 <div className="flex flex-col h-screen font-sans bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-white">
  <LabHeader onExit={onExit} title="Unit 12: 3-D Solar System Model" />

  <div className="flex-1 flex lg:overflow-hidden">
  
  {/* Sidebar */}
  <div className="w-80 bg-slate-100 dark:bg-[#121212] border-r border-slate-300 dark:border-[#1c1b1b] p-6 lg:overflow-y-auto flex flex-col">
   <h2 className="text-lg font-bold mb-4 text-slate-800 dark:text-[#ffffff]">Planet Inventory</h2>
   <p className="text-xs text-slate-600 dark:text-[#71717a] mb-6">Click to add planets to your 3D model. They will automatically be placed at their relative distances from the Sun.</p>

   <div className="space-y-3 flex-1">
   {predefinedPlanets.map(p => {
    const isAdded = planets.some(existing => existing.name === p.name);
    return (
    <div key={p.name} className={`flex items-center justify-between p-3 rounded-lg border ${isAdded ? 'bg-slate-200 dark:bg-[#121212]/50 border-slate-300 dark:border-slate-600' : 'bg-slate-50 dark:bg-[#121212] border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}>
     <div className="flex items-center gap-3">
     <div className={`w-6 h-6 rounded-full ${p.color} shadow-sm border border-black/20`}></div>
     <span className={`font-medium ${isAdded ? 'text-slate-400' : 'text-slate-700 dark:text-[#ffffff]'}`}>{p.name}</span>
     </div>
     {isAdded ? (
     <button onClick={() => removePlanet(p.name)} className="text-slate-500 dark:text-[#71717a] hover:text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
     ) : (
     <button onClick={() => addPlanet(p)} className="text-blue-400 hover:text-blue-300 p-1"><Plus className="w-5 h-5" /></button>
     )}
    </div>
    );
   })}
   </div>

   <div className="mt-4 pt-4 border-t border-[#1c1b1b] dark:border-[#1c1b1b] text-center">
    <div className="text-2xl font-bold text-slate-800 dark:text-[#a1a1aa]">{planets.length} / 8</div>
    <div className="text-xs text-slate-500 dark:text-[#71717a] uppercase tracking-wider">Planets Added</div>
   </div>
  </div>

  {/* Space Canvas */}
  <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-hidden flex items-center justify-center">
   
   {/* Stars background */}
   <div className="absolute inset-0 opacity-50" style={{ backgroundSize: '100px 100px', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)' }}></div>

   {/* The Sun */}
   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-yellow-500 rounded-full shadow-[0_0_80px_rgba(234,179,8,0.6)] z-10 flex items-center justify-center font-bold text-yellow-900 shadow-inner dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-yellow-500/40">
   SUN
   </div>

   {/* Orbits and Planets */}
   {planets.map(planet => (
   <div key={planet.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-slate-600 dark:border-[#1c1b1b]/30 rounded-full z-20 pointer-events-none" style={{ width: `${planet.distance * 2}px`, height: `${planet.distance * 2}px` }}>
    <div 
    className={`absolute rounded-full shadow-lg ${planet.color} flex items-center justify-center group cursor-pointer transition-transform hover:scale-150 animate-[orbit_linear_infinite] pointer-events-auto`}
    style={{ 
     width: `${planet.size}px`, 
     height: `${planet.size}px`,
     top: `-${planet.size/2}px`,
     left: `calc(50% - ${planet.size/2}px)`,
     animationDuration: `${20 / planet.speed}s`
    }}
    onClick={() => setSelectedPlanet(planet.id)}
    >
    {/* Saturn Rings */}
    {planet.name === 'Saturn' && (
     <div className="absolute w-[250%] h-[50%] border-[3px] border-amber-300/60 rounded-full transform rotate-12"></div>
    )}
    <div className="absolute -top-6 bg-black/80 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#1c1b1b] dark:border-[#1c1b1b] pointer-events-none">
     {planet.name}
    </div>
    </div>
   </div>
   ))}

   {/* Info Panel overlay */}
   {selectedPlanet && (
   <div className="absolute bottom-8 right-8 bg-[#121212] dark:bg-[#121212]/90 backdrop-blur-md p-6 rounded-xl border border-slate-600 dark:border-[#1c1b1b] shadow-2xl max-w-sm">
    <div className="flex justify-between items-start mb-4">
     <h3 className="text-xl font-bold text-white flex items-center gap-2">
     <div className={`w-4 h-4 rounded-full ${planets.find(p=>p.id===selectedPlanet)?.color}`}></div>
     {selectedPlanet}
     </h3>
     <button onClick={() => setSelectedPlanet(null)} className="text-slate-400 hover:text-white">&times;</button>
    </div>
    <p className="text-sm text-slate-300 leading-relaxed">
     You have successfully added {selectedPlanet} to the physical model! In a real classroom, you would build this using painted styrofoam balls and wire. Notice its relative size and distance from the central star.
    </p>
   </div>
   )}

  </div>

  </div>

  <style dangerouslySetInnerHTML={{__html: `
  @keyframes orbit {
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
  }
  `}} />
 </div>
 );
}
