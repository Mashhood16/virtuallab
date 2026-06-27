import { useState } from 'react';
import { Image, Table, CheckCircle, Save } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7CVCreation({ onExit }: LabProps) {
  const [hasPicture, setHasPicture] = useState(false);
  const [hasTable, setHasTable] = useState(false);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');

  const isComplete = hasPicture && hasTable && name.length > 2 && interests.length > 5;

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="CV / Resume Creation" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-6">Build a professional CV by inserting your picture, an academic qualifications table, and your interests.</p>

        {isComplete && (
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm w-fit">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span className="font-bold">CV Ready!</span> Your Curriculum Vitae is complete and ready to print.
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-t-xl border border-slate-300 dark:border-slate-700 dark:border-slate-500 p-3 flex gap-2 w-full max-w-3xl mx-auto shadow-sm">
          <button 
            onClick={() => setHasPicture(true)}
            className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-800 rounded text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 dark:border-slate-500"
          >
            <Image className="w-4 h-4 mr-2 text-blue-600" />
            Insert Picture
          </button>
          <button 
            onClick={() => setHasTable(true)}
            className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-800 rounded text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 dark:border-slate-500"
          >
            <Table className="w-4 h-4 mr-2 text-emerald-600" />
            Insert Table
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-800 rounded text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 dark:border-slate-500 ml-auto text-slate-400"
          >
            <Save className="w-4 h-4 mr-2" />
            Print Document
          </button>
        </div>

        {/* CV Paper */}
        <div className="bg-slate-50 dark:bg-slate-900 w-full max-w-3xl mx-auto flex-1 border-b border-l border-r border-slate-300 dark:border-slate-700 dark:border-slate-500 shadow-xl p-12 overflow-y-auto">
          <div className="flex justify-between items-start mb-8 border-b-2 border-slate-800 dark:border-slate-500 pb-8">
            <div className="flex-1 pr-8">
              <input 
                type="text" 
                placeholder="YOUR FULL NAME" 
                className="text-4xl font-black w-full outline-none uppercase tracking-widest text-slate-800 dark:text-slate-100 mb-2 placeholder:text-slate-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-slate-500 dark:text-slate-400 font-medium tracking-widest text-sm">STUDENT • FUTURE TECH LEADER</p>
            </div>
            {hasPicture ? (
              <div className="w-32 h-32 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded border-2 border-dashed border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-slate-400 text-sm font-medium text-center p-4 bg-slate-50 dark:bg-slate-900">
                Click 'Insert Picture'
              </div>
            )}
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-800 dark:text-slate-100 flex items-center">
              <span className="w-6 h-6 bg-slate-800 dark:bg-slate-800 text-white rounded flex items-center justify-center mr-3 text-sm">1</span>
              Academic Details
            </h2>
            {hasTable ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-800 dark:bg-slate-800 text-white text-left text-sm uppercase tracking-wider">
                    <th className="p-3 border border-slate-700 dark:border-slate-500">Degree/Class</th>
                    <th className="p-3 border border-slate-700 dark:border-slate-500">Institution</th>
                    <th className="p-3 border border-slate-700 dark:border-slate-500">Year</th>
                    <th className="p-3 border border-slate-700 dark:border-slate-500">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 font-medium">Class 7</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300">Model High School</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300">2026</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 font-bold text-emerald-600">A+</td>
                  </tr>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 font-medium">Class 6</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300">Model High School</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-600 dark:text-slate-300">2025</td>
                    <td className="p-3 border border-slate-300 dark:border-slate-700 dark:border-slate-500 font-bold text-emerald-600">A</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-medium rounded">
                Click 'Insert Table' in toolbar
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-widest uppercase mb-4 text-slate-800 dark:text-slate-100 flex items-center">
              <span className="w-6 h-6 bg-slate-800 dark:bg-slate-800 text-white rounded flex items-center justify-center mr-3 text-sm">2</span>
              Personal Interests
            </h2>
            <textarea 
              className="w-full h-32 border border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-50 dark:bg-slate-900 p-4 rounded outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="List your hobbies and interests here (e.g. Reading, Coding, Sports)..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
