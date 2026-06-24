import { useState, useEffect } from 'react';
import { Thermometer, Sun, Wind} from 'lucide-react';
import LabHeader from './LabHeader';

interface LabS8GreenhouseEffectProps {
  onExit?: () => void;
}

export default function LabS8GreenhouseEffect({ onExit }: LabS8GreenhouseEffectProps) {
  const [timePassed, setTimePassed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Outside thermometer
  const [outsideTemp, setOutsideTemp] = useState(25);
  
  // Inside jar thermometer
  const [insideTemp, setInsideTemp] = useState(25);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timePassed < 20) {
      interval = window.setInterval(() => {
        setTimePassed(t => {
          const next = t + 1;
          if (next >= 20) setIsRunning(false);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRunning, timePassed]);

  useEffect(() => {
    // Calculate temperatures based on time passed
    // Outside goes from 25 to 28
    setOutsideTemp(25 + (timePassed * (3 / 20)));
    // Inside goes from 25 to 40 because heat is trapped
    setInsideTemp(25 + (timePassed * (15 / 20)));
  }, [timePassed]);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 1.1: Greenhouse Effect" subtitle="Observe how a closed environment traps thermal energy" />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Left Column: Visual */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="absolute top-8 left-8">
            <Sun className="w-24 h-24 text-yellow-400 animate-spin-slow opacity-80" />
            <div className="text-sm text-center text-slate-500 font-medium mt-2">Sunlight</div>
          </div>
          
          <div className="absolute top-10 right-10">
            <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-4 py-2 rounded-full font-bold">
              Time: {timePassed} minutes
            </div>
          </div>

          <div className="flex items-end justify-center gap-16 mt-16 w-full h-80 border-b-4 border-emerald-700 pb-2 relative">
            
            {/* Thermometer 1 (Outside) */}
            <div className="flex flex-col items-center">
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 shadow-inner mb-4 relative w-24 h-48 flex items-end justify-center">
                <div className="w-4 h-full bg-slate-200 rounded-full relative overflow-hidden border border-slate-300">
                  <div 
                    className="absolute bottom-0 w-full bg-red-500 transition-all duration-300"
                    style={{ height: `${(outsideTemp / 50) * 100}%` }}
                  />
                </div>
                {/* Wind icon to show air circulation */}
                <Wind className="absolute top-4 right-2 w-6 h-6 text-blue-300 opacity-50" />
              </div>
              <div className="font-bold text-slate-700 text-lg">{outsideTemp.toFixed(1)}°C</div>
              <div className="text-slate-500 text-sm">Open Air</div>
            </div>

            {/* Thermometer 2 (Inside Jar) */}
            <div className="flex flex-col items-center relative z-10">
              {/* Glass Jar Outline */}
              <div className="absolute -top-6 -bottom-6 -left-8 -right-8 border-4 border-slate-300 rounded-t-3xl rounded-b-xl bg-blue-50/20 backdrop-blur-[2px] shadow-lg pointer-events-none z-20 flex flex-col items-center">
                {/* Jar Lid */}
                <div className="w-16 h-4 bg-slate-400 rounded-t-sm -mt-4 border border-slate-500" />
              </div>
              
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 shadow-inner mb-4 relative w-24 h-48 flex items-end justify-center z-10">
                <div className="w-4 h-full bg-slate-200 rounded-full relative overflow-hidden border border-slate-300">
                  <div 
                    className="absolute bottom-0 w-full bg-red-500 transition-all duration-300"
                    style={{ height: `${(insideTemp / 50) * 100}%` }}
                  />
                </div>
                {/* Heat Waves */}
                {insideTemp > 30 && (
                  <div className="absolute top-10 flex gap-2 animate-pulse opacity-50 text-red-500">
                    ⌇⌇
                  </div>
                )}
              </div>
              <div className="font-bold text-slate-700 text-lg relative z-30">{insideTemp.toFixed(1)}°C</div>
              <div className="text-slate-500 text-sm relative z-30">Inside Closed Jar</div>
            </div>

          </div>
        </div>

        {/* Right Column: Information */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-2">Observation</h3>
            <p className="text-sm text-slate-600">
              As time passes, solar energy enters both environments. The open air thermometer cools naturally through convection (wind/air flow).
            </p>
            <p className="text-sm text-slate-600 mt-2">
              The glass jar allows light energy in, but prevents the warmed air from escaping. This traps thermal energy, causing the temperature to rise rapidly.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 p-6">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Thermometer className="w-5 h-5" />
              Real World Link
            </h3>
            <p className="text-sm text-blue-700">
              This experiment perfectly models the <strong>Greenhouse Effect</strong> in our atmosphere. Gases like Carbon Dioxide (CO₂) and Methane act just like the glass jar, trapping Earth's heat and contributing to global warming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
