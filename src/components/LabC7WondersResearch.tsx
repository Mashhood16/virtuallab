import { useState } from 'react';
import { Search, Image as ImageIcon, Send, Paperclip, CheckCircle } from 'lucide-react';
import LabHeader from './LabHeader';

interface LabProps {
  onExit: () => void;
}

export default function LabC7WondersResearch({ onExit }: LabProps) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [, setDocContent] = useState('');
  const [hasImages, setHasImages] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [hasAttached, setHasAttached] = useState(false);
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <LabHeader onExit={onExit} title="Seven Wonders Research" />
      <div className="flex-1 px-8 pb-8 flex flex-col overflow-y-auto">

        <p className="text-slate-600 dark:text-slate-300 mb-6">Complete the 3-step project: Research the internet, compile a document with pictures, and email it to your teacher.</p>

        {/* Progress Tracker */}
        <div className="flex items-center gap-4 mb-8 max-w-4xl mx-auto w-full">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full mb-2 ${step >= s ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`} />
              <p className={`text-sm font-bold ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                Step {s}: {s === 1 ? 'Research' : s === 2 ? 'Document' : 'Email'}
              </p>
            </div>
          ))}
        </div>

        {/* Main Interface Area */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 flex flex-col flex-1 max-w-4xl mx-auto w-full overflow-hidden">
          
          {step === 1 && (
            <div className="p-8 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center justify-center mb-8 mt-12">
                <span className="text-5xl font-bold text-blue-500">G</span>
                <span className="text-5xl font-bold text-rose-500">o</span>
                <span className="text-5xl font-bold text-yellow-500">o</span>
                <span className="text-5xl font-bold text-blue-500">g</span>
                <span className="text-5xl font-bold text-emerald-500">l</span>
                <span className="text-5xl font-bold text-rose-500">e</span>
              </div>
              
              <div className="max-w-xl w-full mx-auto relative flex">
                <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full border border-slate-300 dark:border-slate-700 dark:border-slate-500 rounded-full py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  placeholder="Search for Seven Wonders..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.toLowerCase().includes('wonder')) setHasSearched(true);
                  }}
                />
                <button 
                  onClick={() => { if (searchQuery.toLowerCase().includes('wonder')) setHasSearched(true) }}
                  className="ml-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-800 px-6 rounded-full font-medium"
                >
                  Search
                </button>
              </div>

              {hasSearched && (
                <div className="mt-8 max-w-2xl mx-auto animate-in fade-in">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">About 3,000,000 results</p>
                  <div className="mb-6">
                    <h3 className="text-xl text-blue-700 hover:underline cursor-pointer">New Seven Wonders of the World - Wikipedia</h3>
                    <p className="text-sm text-emerald-700 mb-1">https://en.wikipedia.org/wiki/New_seven_wonders</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">The New7Wonders of the World was a campaign started in 2000 to choose Wonders of the World from a selection of 200 existing monuments: Great Wall, Petra, Colosseum...</p>
                  </div>
                  <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mt-4">Compile Research in Word &rarr;</button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
              <div className="bg-blue-600 text-white p-2 flex justify-between items-center px-4">
                <span className="font-bold text-sm">Seven_Wonders_Research.docx - Microsoft Word</span>
                <button onClick={() => setStep(3)} disabled={!hasImages} className="bg-slate-50 dark:bg-slate-900 text-blue-600 px-4 py-1 text-sm font-bold rounded disabled:opacity-50">Proceed to Email &rarr;</button>
              </div>
              <div className="bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 dark:border-slate-500 p-2 flex gap-2">
                <button onClick={() => setHasImages(true)} className="flex items-center text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:border-slate-500 px-3 py-1 rounded hover:bg-slate-50 dark:bg-slate-900">
                  <ImageIcon className="w-4 h-4 mr-2 text-rose-500" /> Insert 7 Wonder Pictures
                </button>
              </div>
              <div className="flex-1 px-8 pb-8 overflow-y-auto flex justify-center">
                <div className="w-full max-w-xl bg-slate-50 dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 dark:border-slate-500 min-h-full p-8 outline-none" contentEditable onInput={(e) => setDocContent(e.currentTarget.textContent || '')}>
                  <h1 className="text-2xl font-bold mb-4">The Seven Wonders of the World</h1>
                  {hasImages ? (
                    <div className="grid grid-cols-2 gap-4 my-4">
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Taj Mahal</div>
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Colosseum</div>
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Machu Picchu</div>
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Christ the Redeemer</div>
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Chichen Itza</div>
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Petra</div>
                      <div className="bg-slate-200 dark:bg-slate-800 aspect-video rounded border border-slate-300 dark:border-slate-700 dark:border-slate-500 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Great Wall</div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Type descriptions here and insert pictures using the toolbar...</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
              {isSent ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Email Sent Successfully!</h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-sm">Your teacher has received your research document on the Seven Wonders.</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 dark:border-slate-500 p-4 font-bold text-slate-700 dark:text-slate-200">New Message</div>
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <div className="flex border-b border-slate-200 dark:border-slate-700 dark:border-slate-500 pb-2 items-center">
                      <span className="text-slate-500 dark:text-slate-400 w-16">To:</span>
                      <input type="text" className="flex-1 outline-none font-medium" placeholder="teacher@school.com" value={emailTo} onChange={e => setEmailTo(e.target.value)} />
                    </div>
                    <div className="flex border-b border-slate-200 dark:border-slate-700 dark:border-slate-500 pb-2 items-center">
                      <span className="text-slate-500 dark:text-slate-400 w-16">Subject:</span>
                      <input type="text" className="flex-1 outline-none font-medium" defaultValue="My Seven Wonders Research Project" />
                    </div>
                    
                    <button 
                      onClick={() => setHasAttached(true)}
                      className={`flex items-center self-start px-4 py-2 rounded-lg text-sm font-medium border ${hasAttached ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 dark:border-slate-500 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:bg-slate-900'}`}
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      {hasAttached ? 'Seven_Wonders_Research.docx Attached' : 'Attach Document'}
                    </button>

                    <textarea 
                      className="flex-1 w-full outline-none resize-none pt-4" 
                      placeholder="Respected Teacher,&#10;Please find attached my research project on the Seven Wonders of the World..."
                    />
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700 dark:border-slate-500 flex justify-end">
                    <button 
                      disabled={!hasAttached || emailTo.length < 5}
                      onClick={() => setIsSent(true)}
                      className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold flex items-center disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" /> Send Email
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
