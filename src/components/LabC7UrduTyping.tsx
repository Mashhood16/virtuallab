import { useState } from 'react';
import { Keyboard, Type } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7UrduTyping({ onExit }: LabProps) {
  const [text, setText] = useState('');
  const [urduMode, setUrduMode] = useState(false);

  // Simplified mapping for Pak Urdu Installer phonetic layout
  const urduMap: Record<string, string> = {
    'a': 'ا', 'b': 'ب', 'c': 'چ', 'd': 'د', 'e': 'ع', 'f': 'ف', 'g': 'گ', 'h': 'ہ', 'i': 'ی', 'j': 'ج', 
    'k': 'ک', 'l': 'ل', 'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'پ', 'q': 'ق', 'r': 'ر', 's': 'س', 't': 'ت', 
    'u': 'ئ', 'v': 'ط', 'w': 'و', 'x': 'ش', 'y': 'ے', 'z': 'ز', ' ': ' ', '\n': '\n'
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (urduMode) {
      // Don't intercept control keys like Backspace, Enter, etc.
      if (e.key.length === 1) {
        e.preventDefault();
        const lowerKey = e.key.toLowerCase();
        const urduChar = urduMap[lowerKey] || e.key;
        setText(prev => prev + urduChar);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Urdu Typing Practice" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-8">Toggle the Pak Urdu Installer layout and type a sentence in Urdu.</p>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col flex-1 overflow-hidden">
          {/* Editor Toolbar */}
          <div className="border-b border-slate-200 dark:border-slate-700 dark:border-slate-500 bg-slate-100 dark:bg-slate-800 p-2 flex gap-2 items-center">
            <button 
              onClick={() => setUrduMode(!urduMode)}
              className={`px-4 py-2 rounded font-medium flex items-center transition-colors ${urduMode ? 'bg-emerald-600 text-white' : 'bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900'}`}
            >
              <Keyboard className="w-4 h-4 mr-2" />
              {urduMode ? 'Urdu Keyboard Active' : 'Enable Urdu Keyboard'}
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-4 font-medium italic">
              {urduMode ? 'Phonetic typing enabled (e.g., a=ا, b=ب, p=پ)' : 'Standard English typing'}
            </span>
          </div>

          {/* Text Area */}
          <textarea
            className={`flex-1 px-8 pb-8 text-2xl resize-none outline-none ${urduMode ? 'text-right font-urdu' : 'text-left font-sans'}`}
            placeholder={urduMode ? "یہاں لکھیں..." : "Start typing here..."}
            value={text}
            onChange={(e) => {
              if (!urduMode) setText(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            dir={urduMode ? 'rtl' : 'ltr'}
          />
        </div>
      </div>

      <div className="w-80 bg-slate-50 dark:bg-slate-900 p-6 border-l border-slate-200 dark:border-slate-700 dark:border-slate-500 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 flex flex-col overflow-y-auto">
        <h2 className="font-bold text-lg mb-4 flex items-center"><Type className="w-5 h-5 mr-2 text-blue-500"/> Phonetic Map</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">A simplified reference for the Pak Urdu Installer Phonetic layout:</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(urduMap).map(([eng, urd]) => {
            if (eng === ' ' || eng === '\n') return null;
            return (
              <div key={eng} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100">
                <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{eng.toUpperCase()}</span>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{urd}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
