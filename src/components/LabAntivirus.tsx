import { useState, useEffect } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabAntivirus({ onExit }: LabProps) {
  const [step, setStep] = useState<'desktop' | 'installer' | 'scanning' | 'results'>('desktop');
  const [installProgress, setInstallProgress] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    let interval: number;
    if (step === 'installer') {
      interval = window.setInterval(() => {
        setInstallProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('desktop'), 1000);
            return 100;
          }
          return p + 5;
        });
      }, 100);
    } else if (step === 'scanning') {
      interval = window.setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('results'), 1000);
            return 100;
          }
          return p + 2;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [step]);

  const [hasAntivirus, setHasAntivirus] = useState(false);
  const [threatsRemoved, setThreatsRemoved] = useState(false);

  return (
    <div className="overflow-y-auto w-full h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <LabHeader onExit={onExit} title="Act 5.2: Malware Protection" subtitle="Install an antivirus and run a system scan to remove threats." variant="dark" />

      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
        
        {/* Desktop Interface */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]">
           
           <div className="p-8 flex flex-col gap-6">
              {!hasAntivirus && (
                <div 
                  className="w-24 h-24 flex flex-col items-center gap-2 cursor-pointer group"
                  onDoubleClick={() => {setStep('installer'); setHasAntivirus(true);}}
                >
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center shadow-lg group-hover:bg-blue-100 border border-slate-300 dark:border-slate-700 dark:border-slate-500">
                    <span className="text-blue-600 font-bold font-mono">.exe</span>
                  </div>
                  <span className="text-white text-xs font-bold text-center drop-shadow-md bg-black/50 px-2 py-1 rounded">Antivirus<br/>Setup.exe</span>
                </div>
              )}

              {hasAntivirus && (
                <div 
                  className="w-24 h-24 flex flex-col items-center gap-2 cursor-pointer group"
                  onDoubleClick={() => setStep('scanning')}
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-400 border-2 border-white">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <span className="text-white text-xs font-bold text-center drop-shadow-md bg-black/50 px-2 py-1 rounded">SecureShield<br/>Antivirus</span>
                </div>
              )}

              <div className="w-24 h-24 flex flex-col items-center gap-2 cursor-pointer group">
                 <div className="w-12 h-12 bg-yellow-400 rounded-sm flex items-center justify-center shadow-lg group-hover:bg-yellow-300 border border-yellow-600">
                   <div className="w-8 h-6 bg-slate-50 dark:bg-slate-900 opacity-20 mt-2"></div>
                 </div>
                 <span className="text-white text-xs font-bold text-center drop-shadow-md bg-black/50 px-2 py-1 rounded">My Files</span>
              </div>
           </div>

        </div>

        {/* Modal Windows */}
        {step === 'installer' && (
          <div className="w-[500px] bg-slate-50 dark:bg-slate-900 rounded shadow-2xl border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex flex-col overflow-hidden z-20 animate-fade-in">
             <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center text-sm font-bold">
                <span>Setup - SecureShield Antivirus</span>
                <span>✕</span>
             </div>
             <div className="p-8 flex flex-col items-center text-center">
                <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Installing Protection...</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Please wait while setup installs SecureShield on your computer.</p>
                
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-6 rounded-sm overflow-hidden border border-slate-300 dark:border-slate-700 dark:border-slate-500 mb-2">
                   <div className="h-full bg-blue-500 transition-all duration-75" style={{ width: `${installProgress}%` }}></div>
                </div>
                <div className="w-full text-left text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Extracting files: C:\Program Files\SecureShield\core_{installProgress}.dll...
                </div>
             </div>
          </div>
        )}

        {step === 'scanning' && (
          <div className="w-[600px] bg-slate-50 dark:bg-slate-900 rounded shadow-2xl border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex flex-col overflow-hidden z-20 animate-fade-in">
             <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center text-sm font-bold">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  SecureShield Antivirus
                </div>
                <span>✕</span>
             </div>
             <div className="p-8 flex gap-8">
                <div className="w-1/3 flex flex-col justify-between border-r border-slate-200 dark:border-slate-700 dark:border-slate-500 pr-8">
                   <div className="space-y-4">
                     <div className="text-slate-800 dark:text-slate-100 font-bold flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Status</div>
                     <div className="text-slate-500 dark:text-slate-400 cursor-pointer hover:text-green-600">Protection</div>
                     <div className="text-slate-500 dark:text-slate-400 cursor-pointer hover:text-green-600">Privacy</div>
                   </div>
                   <button onClick={() => setStep('desktop')} className="text-sm text-slate-500 dark:text-slate-400 underline text-left">Cancel Scan</button>
                </div>
                <div className="w-2/3 flex flex-col">
                   <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Full System Scan</h2>
                   <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Scanning memory, registry, and file system for malicious software.</p>
                   
                   <div className="relative w-32 h-32 mx-auto mb-6">
                      <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                         <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * scanProgress) / 100} className="transition-all duration-75" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-slate-700 dark:text-slate-200">
                         {scanProgress}%
                      </div>
                   </div>

                   <div className="bg-slate-900 dark:bg-slate-800 text-green-400 font-mono text-xs p-2 h-24 overflow-hidden rounded border border-slate-700 dark:border-slate-500">
                      Scanning: C:\Windows\System32\drivers\etc\hosts<br/>
                      Scanning: C:\Users\Admin\Downloads\invoice_{Math.floor(scanProgress*100)}.pdf<br/>
                      {scanProgress > 40 && <span className="text-red-400">Warning: Suspicious behavior detected in temp file...<br/></span>}
                      {scanProgress > 70 && <span className="text-red-400">Alert: Trojan.Win32.Generic found!<br/></span>}
                   </div>
                </div>
             </div>
          </div>
        )}

        {step === 'results' && (
          <div className="w-[600px] bg-slate-50 dark:bg-slate-900 rounded shadow-2xl border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex flex-col overflow-hidden z-20 animate-fade-in">
             <div className="bg-red-600 text-white px-4 py-2 flex justify-between items-center text-sm font-bold">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Attention Required
                </div>
                <span>✕</span>
             </div>
             <div className="p-8 flex flex-col items-center text-center">
                {threatsRemoved ? (
                   <>
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">System is Protected</h2>
                     <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">All detected malware has been quarantined successfully.</p>
                     <button onClick={() => setStep('desktop')} className="px-8 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded transition-colors">Close</button>
                   </>
                ) : (
                   <>
                     <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                       <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     </div>
                     <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Threats Detected!</h2>
                     <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">The scan found 2 malicious files on your system.</p>
                     
                     <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-500 rounded text-left p-4 mb-6 shadow-inner text-sm space-y-2">
                        <div className="flex justify-between text-red-600 font-bold">
                          <span>Trojan.Win32.Generic</span>
                          <span className="uppercase text-xs bg-red-100 px-2 py-1 rounded text-red-800">High Risk</span>
                        </div>
                        <div className="flex justify-between text-orange-600 font-bold">
                          <span>Adware.BrowserHijack</span>
                          <span className="uppercase text-xs bg-orange-100 px-2 py-1 rounded text-orange-800">Med Risk</span>
                        </div>
                     </div>

                     <button 
                       onClick={() => setThreatsRemoved(true)}
                       className="w-full px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-lg transition-colors uppercase tracking-widest flex justify-center items-center gap-2"
                     >
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       Quarantine & Remove All
                     </button>
                   </>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
