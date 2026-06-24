import { useState } from 'react';
import { Search, Shield, Globe, ShieldCheck, UserCheck, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC6CyberScout({ onExit }: LabProps) {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [joined, setJoined] = useState(false);

  return (
    <div className="flex h-screen font-sans bg-slate-50 text-slate-800">
      <div className="flex-1 p-8 flex flex-col overflow-y-auto">
        <LabHeader onExit={onExit} title="Cyber Scout Exploration" />

        <h1 className="text-3xl font-bold mb-2">Cyber Scout Exploration</h1>
        <p className="text-slate-600 mb-8">Search the internet simulator to find out how to become a Cyber Scout and join the program.</p>

        <div className="flex-1 bg-slate-50 rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          {/* Browser Chrome */}
          <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-md flex items-center px-3 py-1.5 shadow-inner">
              <Globe className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-sm text-slate-500">https://www.search-simulator.edu</span>
            </div>
          </div>

          {!hasSearched ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
              <Shield className="w-24 h-24 text-blue-500 mb-8" />
              <div className="w-full max-w-2xl flex relative shadow-lg rounded-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                <input 
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setHasSearched(true)}
                  placeholder="Search 'how to become a Cyber Scout'..."
                  className="w-full text-xl py-4 pl-16 pr-8 rounded-full border-2 border-slate-200 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <button 
                onClick={() => setHasSearched(true)}
                disabled={query.trim().length === 0}
                className="mt-8 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg disabled:opacity-50"
              >
                Simulated Search
              </button>
            </div>
          ) : (
            <div className="flex-1 flex bg-slate-50">
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-6">
                  <Search className="text-blue-500 w-8 h-8" />
                  <input 
                    type="text" 
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 text-lg py-2 px-4 rounded-lg border border-slate-300"
                  />
                  <button onClick={() => setHasSearched(false)} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Search</button>
                </div>

                <div className="text-sm text-slate-500 mb-6">About 1 results (0.02 seconds)</div>

                <div className="bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-200 max-w-3xl">
                  <div className="text-sm text-slate-500 mb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    https://www.national-cyber-scouts.gov.pk
                  </div>
                  <h2 className="text-2xl font-bold text-blue-800 hover:underline cursor-pointer mb-3">
                    Become a Cyber Scout - Official Portal
                  </h2>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    A Cyber Scout is a responsible digital citizen who promotes online safety, practices ethical computing, and helps protect their community from cyber threats. Learn the 5 principles of digital safety and take the pledge today.
                  </p>

                  {!joined ? (
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                      <h3 className="font-bold text-lg mb-4">Registration Requirements:</h3>
                      <ul className="list-disc pl-5 mb-6 space-y-2 text-slate-700">
                        <li>Understand basic internet safety and privacy.</li>
                        <li>Commit to reporting cyberbullying.</li>
                        <li>Respect copyright and avoid plagiarism.</li>
                      </ul>
                      <button 
                        onClick={() => setJoined(true)}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                      >
                        <UserCheck className="w-5 h-5" /> Take the Pledge & Join Now
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-2xl text-green-800 mb-2">Congratulations, Cyber Scout!</h3>
                      <p className="text-green-700 font-medium">You have successfully explored the process and registered as a Cyber Scout.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
