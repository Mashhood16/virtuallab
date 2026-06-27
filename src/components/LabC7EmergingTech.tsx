import { useState } from 'react';
import { Play, CheckCircle, Video } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7EmergingTech({ onExit }: LabProps) {
  const [videoWatched, setVideoWatched] = useState(false);
  const [selectedTech, setSelectedTech] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const technologies = [
    { id: 'ai', name: 'Artificial Intelligence', desc: 'Machine learning and neural networks mimicking human thought.' },
    { id: 'vr', name: 'Virtual Reality', desc: 'Immersive computer-generated environments.' },
    { id: 'iot', name: 'Internet of Things', desc: 'Interconnected smart devices communicating over the internet.' },
    { id: '3d', name: '3D Printing', desc: 'Additive manufacturing to create physical objects from digital models.' }
  ];

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Emerging Technologies" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Watch the presentation on emerging tech, then select one to build your mini-project.</p>

        {!videoWatched ? (
          <div className="bg-black rounded-2xl w-full max-w-3xl aspect-video flex flex-col items-center justify-center text-white relative shadow-2xl overflow-hidden group cursor-pointer" onClick={() => setVideoWatched(true)}>
            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000" alt="Tech" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" />
            <div className="z-10 bg-blue-600/80 p-6 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Play className="w-12 h-12 fill-current" />
            </div>
            <p className="z-10 mt-6 text-xl font-medium tracking-wider">Click to Watch: The Future of Tech</p>
          </div>
        ) : (
          <div className="max-w-3xl w-full">
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center mb-8 border border-emerald-200">
              <CheckCircle className="w-6 h-6 mr-3" />
              Video completed! Now, select an emerging technology for your mini-project.
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {technologies.map(tech => (
                <button 
                  key={tech.id}
                  onClick={() => setSelectedTech(tech.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${selectedTech === tech.id ? 'border-blue-500 bg-slate-50 dark:bg-slate-900 shadow-md' : 'border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-50 dark:bg-slate-900 hover:border-blue-300'}`}
                >
                  <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{tech.desc}</p>
                </button>
              ))}
            </div>

            {selectedTech && !submitted && (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500">
                <h3 className="font-bold text-lg mb-4">Project Proposal</h3>
                <textarea 
                  className="w-full h-32 p-4 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 resize-none"
                  placeholder="Describe what your group will build or research for this technology..."
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                />
                <button 
                  disabled={projectNotes.length < 10}
                  onClick={() => setSubmitted(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
                >
                  Submit Mini-Project
                </button>
              </div>
            )}

            {submitted && (
              <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl shadow-xl text-center border border-slate-200 dark:border-slate-700 dark:border-slate-500 border-t-8 border-t-blue-500">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Project Submitted!</h2>
                <p className="text-slate-600 dark:text-slate-300">Your proposal for the {technologies.find(t => t.id === selectedTech)?.name} project has been recorded.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="w-80 bg-slate-50 dark:bg-slate-900 p-6 border-l border-slate-200 dark:border-slate-700 dark:border-slate-500 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 flex flex-col overflow-y-auto">
        <h2 className="font-bold text-lg mb-4 flex items-center"><Video className="w-5 h-5 mr-2 text-blue-500"/> Task List</h2>
        <ul className="space-y-4">
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${videoWatched ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {videoWatched && <CheckCircle className="w-4 h-4" />}
            </div>
            Watch the Tech Video
          </li>
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${selectedTech ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {selectedTech && <CheckCircle className="w-4 h-4" />}
            </div>
            Select a Technology
          </li>
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${submitted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {submitted && <CheckCircle className="w-4 h-4" />}
            </div>
            Submit Project Proposal
          </li>
        </ul>
      </div>
    </div>
  );
}
