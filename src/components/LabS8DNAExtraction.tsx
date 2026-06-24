import { useState } from 'react';
import {Droplet, CheckCircle2 } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabS8DNAExtractionProps {
  onExit?: () => void;
}

const STEPS = [
  { id: 1, text: "Mash strawberry with salt and water", btn: "Mash Fruit" },
  { id: 2, text: "Filter mixture through cloth into jar", btn: "Filter" },
  { id: 3, text: "Add 2 drops of dish soap (don't bubble)", btn: "Add Soap" },
  { id: 4, text: "Slowly pour chilled isopropyl alcohol", btn: "Add Alcohol" },
];

export default function LabS8DNAExtraction({ onExit }: LabS8DNAExtractionProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-slate-50 font-sans">
      <LabHeader onExit={onExit} title="Act 3.1: DNA Extraction" subtitle="Extract visible DNA strands from a strawberry" />

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full">
        {/* Left Column: Simulation */}
        <div className="flex-1 bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-end relative min-h-[500px]">
          
          <div className="relative w-64 h-80 flex flex-col items-center justify-end z-10">
            {/* The Beaker/Jar */}
            <div className="w-32 h-48 border-4 border-slate-300 rounded-b-3xl rounded-t-sm relative overflow-hidden bg-slate-50/50 backdrop-blur-sm z-20">
              
              {/* Strawberry Mash */}
              <div 
                className={`absolute bottom-0 w-full transition-all duration-1000 ${currentStep >= 1 ? 'bg-red-500' : 'bg-transparent'} ${currentStep >= 2 ? 'bg-red-600/80' : ''}`}
                style={{ height: currentStep >= 1 ? '30%' : '0%' }}
              />

              {/* Soap layer */}
              <div 
                className={`absolute w-full transition-all duration-1000 bg-blue-300/40`}
                style={{ 
                  bottom: currentStep >= 3 ? '30%' : '0%', 
                  height: currentStep >= 3 ? '10%' : '0%',
                  opacity: currentStep >= 3 ? 1 : 0
                }}
              />

              {/* Alcohol layer */}
              <div 
                className={`absolute w-full transition-all duration-1000 bg-slate-50/40`}
                style={{ 
                  bottom: currentStep >= 4 ? '40%' : '0%', 
                  height: currentStep >= 4 ? '40%' : '0%',
                  opacity: currentStep >= 4 ? 1 : 0
                }}
              />

              {/* DNA Precipitate */}
              {currentStep >= 4 && (
                <div className="absolute top-[25%] left-0 w-full h-[30%] flex items-center justify-center animate-pulse duration-1000">
                  <div className="w-16 h-8 bg-slate-50/80 rounded-full blur-sm" />
                  <div className="absolute w-20 h-4 border-t-2 border-white/60 -rotate-12" />
                  <div className="absolute w-20 h-4 border-b-2 border-white/60 rotate-12" />
                </div>
              )}
            </div>

            {/* Dropper Animation for Soap/Alcohol */}
            {(currentStep === 3 || currentStep === 4) && (
              <div className="absolute -top-10 animate-bounce text-blue-400">
                <Droplet className="w-8 h-8 fill-current" />
              </div>
            )}
          </div>

          <div className="mt-8 bg-slate-100 w-full h-4 rounded-full border border-slate-200" />
        </div>

        {/* Right Column: Steps */}
        <div className="w-full md:w-96 flex flex-col gap-4">
          <div className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
            <h3 className="font-bold text-slate-800 mb-6 text-lg">Extraction Protocol</h3>
            
            <div className="flex flex-col gap-4 flex-1">
              {STEPS.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = currentStep > index;
                
                return (
                  <div 
                    key={step.id} 
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isActive ? 'border-blue-500 bg-blue-50' : 
                      isCompleted ? 'border-green-200 bg-green-50 opacity-70' : 
                      'border-slate-100 bg-slate-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                            {step.id}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                          {step.text}
                        </p>
                        {isActive && (
                          <button 
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-blue-700 transition-colors w-full shadow-sm"
                          >
                            {step.btn}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentStep >= 4 && (
              <div className="mt-6 p-4 bg-green-100 rounded-xl border border-green-200 animate-fade-in text-center">
                <h4 className="font-bold text-green-800 mb-1">Success!</h4>
                <p className="text-sm text-green-700">
                  The fluffy white precipitate is the DNA separating from the strawberry cells. The soap broke the cell membranes, and the alcohol caused the DNA to precipitate out of the solution!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
