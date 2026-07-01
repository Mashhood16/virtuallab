import { useState } from 'react';
import {Flag } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps { onExit?: () => void; }

export default function LabS8Windsock({ onExit }: LabProps) {
 const [windDir, setWindDir] = useState(90); // 0 North, 90 East, 180 South, 270 West
 const [windSpeed, setWindSpeed] = useState(50); // 0 to 100

 // Wind sock points AWAY from the wind direction
 const sockAngle = (windDir + 180) % 360;
 
 // Lift angle based on speed (0 speed = pointing down, 100 speed = horizontal)
 const droop = 90 - (windSpeed * 0.9); // degrees to hang down

 // Convert wind direction to compass label
 const getCompassDir = (deg: number) => {
 const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
 return dirs[Math.round(deg / 45) % 8];
 };

 const getSockDir = (deg: number) => {
 const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
 return dirs[Math.round(((deg + 180) % 360) / 45) % 8];
 };

 return (
 <div className="lg:overflow-y-auto flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none">
  <LabHeader onExit={onExit} title="Act 11.9: Design a Windsock" subtitle="Visualizing wind direction and speed" />

  <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 max-w-5xl mx-auto w-full">
  
  {/* Weather Controls */}
  <div className="w-full md:w-64 flex flex-col gap-6">
   <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">Wind Direction</h3>
    
    {/* Compass Dial */}
    <div className="w-40 h-40 rounded-full bg-slate-100 dark:bg-[#121212] border-4 border-slate-300 dark:border-[#1c1b1b] mx-auto relative flex items-center justify-center mb-4">
    <span className="absolute top-2 font-bold text-slate-400 text-xs">N</span>
    <span className="absolute right-2 font-bold text-slate-400 text-xs">E</span>
    <span className="absolute bottom-2 font-bold text-slate-400 text-xs">S</span>
    <span className="absolute left-2 font-bold text-slate-400 text-xs">W</span>
    
    {/* Wind arrow pointing TO the wind direction */}
    <div 
     className="absolute w-2 h-20 bg-blue-500 origin-bottom rounded-t-full transition-transform duration-500 dark:bg-teal-950/20 dark:border-teal-900"
     style={{ transform: `translateY(-50%) rotate(${windDir}deg)` }}
    >
     <div className="absolute -top-2 -left-2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-blue-500" />
    </div>
    </div>
    <input 
    type="range" min="0" max="360" value={windDir} 
    onChange={(e) => setWindDir(Number(e.target.value))}
    className="w-full accent-blue-500"
    />
    <div className="text-center mt-2 font-bold text-sky-600">Wind from {getCompassDir(windDir)}</div>
   </div>

   <div className="bg-slate-50 dark:!bg-[#121212] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-[#1c1b1b]">
    <h3 className="font-bold text-slate-700 dark:text-[#ffffff] mb-4">Wind Speed</h3>
    <input 
    type="range" min="0" max="100" value={windSpeed} 
    onChange={(e) => setWindSpeed(Number(e.target.value))}
    className="w-full accent-sky-500"
    />
    <div className="text-center mt-2 font-bold text-sky-600">
    {windSpeed === 0 ? 'Calm' : windSpeed < 30 ? 'Breeze' : windSpeed < 70 ? 'Strong' : 'Gale'}
    </div>
   </div>
  </div>

  {/* 3D Viewport */}
  <div className="flex-1 bg-sky-100 rounded-3xl shadow-inner border border-sky-200 p-8 relative overflow-hidden flex items-end justify-center perspective-[1000px]">
   
   {/* Ground */}
   <div className="absolute bottom-0 w-[200%] h-32 bg-emerald-600/50 rounded-[100%] shadow-[inset_0_20px_50px_rgba(0,0,0,0.2)]" />

   {/* Clouds */}
   <div className="absolute top-10 left-10 text-6xl text-white/50 animate-[wind_dash_20s_linear_infinite]" style={{ animationDuration: `${100 / Math.max(1, windSpeed)}s` }}>☁️</div>
   <div className="absolute top-20 left-60 text-8xl text-white/40 animate-[wind_dash_15s_linear_infinite]" style={{ animationDuration: `${80 / Math.max(1, windSpeed)}s` }}>☁️</div>

   {/* Windsock Pole */}
   <div className="relative w-4 h-[350px] bg-slate-400 dark:bg-[#121212] z-10 border-l-2 border-slate-300 dark:border-[#1c1b1b] rounded-t-lg mb-8">
    
    {/* Swivel Ring */}
    <div className="absolute top-4 -left-2 w-8 h-4 border-4 border-zinc-600 rounded-full" />

    {/* The Windsock (Top-down view approximated by scaling X and translating) */}
    <div 
    className="absolute top-6 left-2 origin-left transition-all duration-700 ease-out z-20 flex items-center"
    style={{ 
     transform: `rotateY(${sockAngle - 90}deg) rotateZ(${droop}deg)`,
     transformStyle: 'preserve-3d'
    }}
    >
    {/* Wind Sock Fabric */}
    <div className={`w-48 h-12 bg-gradient-to-r from-orange-500 via-white to-orange-500 rounded-r-3xl rounded-l-full shadow-lg border border-orange-600/50 relative overflow-hidden ${windSpeed > 30 ? 'animate-[flutter_0.1s_infinite]' : ''}`}>
     <div className="absolute inset-y-0 left-1/4 w-1/4 bg-slate-50 dark:bg-[#121212]" />
     <div className="absolute inset-y-0 right-1/4 w-1/4 bg-slate-50 dark:bg-[#121212]" />
    </div>
    </div>
   </div>

   {/* Wind visual lines */}
   {windSpeed > 0 && (
    <div 
    className="absolute inset-0 pointer-events-none opacity-50 transition-all duration-500"
    style={{ transform: `rotate(${windDir - 90}deg)` }}
    >
    <div className="absolute top-1/2 left-0 w-full h-1 bg-sky-300 shadow-[0_0_10px_skyblue] rounded-full animate-[wind_dash_1s_linear_infinite]" />
    </div>
   )}

   {/* Hint */}
   <div className="absolute bottom-6 bg-slate-50 dark:bg-[#121212]/80 backdrop-blur px-6 py-4 rounded-xl shadow-lg border border-slate-200 dark:border-[#1c1b1b] text-center z-30">
   <h4 className="font-bold text-slate-800 dark:text-[#ffffff] mb-1 flex items-center justify-center gap-2">
    <Flag className="w-5 h-5 text-orange-500" /> Observation
   </h4>
   <p className="text-sm text-slate-600 dark:text-[#a1a1aa]">
    The windsock fills with air and points <strong>opposite</strong> to where the wind is blowing from.<br/>
    Wind from {getCompassDir(windDir)} &rarr; Sock points {getSockDir(windDir)}.<br/>
    {windSpeed === 0 ? 'No wind — sock hangs limp.' : windSpeed < 30 ? 'Light breeze — sock droops slightly.' : windSpeed < 70 ? 'Strong wind — sock extends outward.' : 'Gale force — sock is nearly horizontal!'}
   </p>
   </div>

  </div>
  </div>
  <style dangerouslySetInnerHTML={{__html: `
  @keyframes flutter {
   0% { border-radius: 50px 100px 100px 50px / 24px; }
   50% { border-radius: 50px 80px 80px 50px / 24px; }
   100% { border-radius: 50px 100px 100px 50px / 24px; }
  }
  `}} />
 </div>
 );
}
