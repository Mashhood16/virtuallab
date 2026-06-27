import { useState } from 'react';
import { CheckCircle, Type, Palette, Baseline } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7LetterFormat({ onExit }: LabProps) {
  const [content, setContent] = useState('');
  const [font, setFont] = useState('Arial');
  const [size, setSize] = useState('12');
  const [color, setColor] = useState('text-slate-800 dark:text-slate-100');

  const isFontCorrect = font === 'Calibri';
  const isSizeCorrect = size === '11';
  const isColorCorrect = color === 'text-blue-700';
  const hasSignature = content.toLowerCase().includes('signature') || content.toLowerCase().includes('name') || content.toLowerCase().includes('class');

  const isSuccess = isFontCorrect && isSizeCorrect && isColorCorrect && hasSignature && content.length > 50;

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Formal Letter Formatting" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-6">Write an application using specific formatting rules: Calibri font, size 11, blue color, and include your signature/details.</p>

        {isSuccess && (
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl mb-6 flex items-center border border-emerald-300 shadow-sm">
            <CheckCircle className="w-6 h-6 mr-3" />
            <span className="font-bold">Perfect Formatting!</span> You have applied all the required styles to your formal letter.
          </div>
        )}

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-xl border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex flex-col flex-1 overflow-hidden max-w-4xl mx-auto w-full">
          {/* Word Processor Toolbar */}
          <div className="bg-blue-50 border-b border-blue-200 p-3 flex gap-4 items-center">
            {/* Font Family */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded overflow-hidden">
              <Type className="w-4 h-4 mx-2 text-slate-400" />
              <select 
                value={font} 
                onChange={e => setFont(e.target.value)}
                className="py-1 px-2 outline-none border-l border-slate-300 dark:border-slate-700 dark:border-slate-500 bg-transparent text-sm w-32"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Calibri">Calibri</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded overflow-hidden">
              <Baseline className="w-4 h-4 mx-2 text-slate-400" />
              <select 
                value={size} 
                onChange={e => setSize(e.target.value)}
                className="py-1 px-2 outline-none border-l border-slate-300 dark:border-slate-700 dark:border-slate-500 bg-transparent text-sm w-16"
              >
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
              </select>
            </div>

            {/* Font Color */}
            <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded overflow-hidden">
              <Palette className="w-4 h-4 mx-2 text-slate-400" />
              <select 
                value={color} 
                onChange={e => setColor(e.target.value)}
                className="py-1 px-2 outline-none border-l border-slate-300 dark:border-slate-700 dark:border-slate-500 bg-transparent text-sm w-24"
              >
                <option value="text-slate-800 dark:text-slate-100">Black</option>
                <option value="text-rose-600">Red</option>
                <option value="text-emerald-600">Green</option>
                <option value="text-blue-700">Blue</option>
              </select>
            </div>
          </div>

          {/* Paper */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 p-8 overflow-y-auto flex justify-center">
            <textarea
              className={`w-full max-w-2xl min-h-full bg-slate-50 dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 dark:border-slate-500 p-12 resize-none outline-none transition-all
                ${font === 'Calibri' ? 'font-sans' : font === 'Times New Roman' ? 'font-serif' : font === 'Verdana' ? 'font-mono' : 'font-sans'}
                ${size === '11' ? 'text-sm' : size === '10' ? 'text-xs' : size === '14' ? 'text-lg' : size === '16' ? 'text-xl' : 'text-base'}
                ${color}
              `}
              placeholder="To The Principal,&#10;...&#10;&#10;Yours sincerely,&#10;[Name]&#10;[Class]&#10;[Signature]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="w-80 bg-slate-50 dark:bg-slate-900 p-6 border-l border-slate-200 dark:border-slate-700 dark:border-slate-500 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] z-10 flex flex-col overflow-y-auto">
        <h2 className="font-bold text-lg mb-4">Requirements Checklist</h2>
        <ul className="space-y-4">
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${isFontCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {isFontCorrect && <CheckCircle className="w-4 h-4" />}
            </div>
            Font Type: Calibri
          </li>
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${isSizeCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {isSizeCorrect && <CheckCircle className="w-4 h-4" />}
            </div>
            Font Size: 11
          </li>
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${isColorCorrect ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {isColorCorrect && <CheckCircle className="w-4 h-4" />}
            </div>
            Font Color: Blue
          </li>
          <li className="flex items-center text-slate-600 dark:text-slate-300">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${hasSignature ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700 dark:border-slate-500'}`}>
              {hasSignature && <CheckCircle className="w-4 h-4" />}
            </div>
            Include Name, Class, & Signature
          </li>
        </ul>
      </div>
    </div>
  );
}
