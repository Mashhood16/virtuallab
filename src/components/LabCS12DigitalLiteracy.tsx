import { useState, useMemo } from 'react';
import { Search, Table, EyeOff, CheckCircle, Save } from 'lucide-react';
import LabHeader from './LabHeader';

const INITIAL_DATA = [
 { id: 1, name: 'Alice Smith', email: 'alice@example.com', age: 28, country: 'UK', condition: 'Asthma', ip: '192.168.1.1' },
 { id: 2, name: 'Bob Jones', email: 'bob@example.com', age: 52, country: 'USA', condition: 'Diabetes', ip: '10.0.0.5' },
 { id: 3, name: 'Charlie Brown', email: 'charlie@gmail.com', age: 45, country: 'UK', condition: 'Diabetes', ip: '172.16.0.2' },
 { id: 4, name: 'Diana Prince', email: 'diana@corp.com', age: 31, country: 'CA', condition: 'Asthma', ip: '192.168.1.2' },
 { id: 5, name: 'Evan Wright', email: 'evan@test.org', age: 60, country: 'USA', condition: 'Hypertension', ip: '10.1.1.1' },
];

export default function LabCS12DigitalLiteracy({ onExit }: { onExit?: () => void }) {
 const [activeMobileTab, setActiveMobileTab] = useState<'theory' | 'lab'>('theory');

 const [searchQuery, setSearchQuery] = useState('');
 
 const [maskName, setMaskName] = useState(false);
 const [hashEmail, setHashEmail] = useState(false);
 const [generalizeAge, setGeneralizeAge] = useState(false);
 const [removeIp, setRemoveIp] = useState(false);

 const [q1Answer, setQ1Answer] = useState('');
 const [assessmentStatus, setAssessmentStatus] = useState<string | null>(null);

 const processedData = useMemo(() => {
 let data = [...INITIAL_DATA];
 
 if (searchQuery.trim()) {
  const terms = searchQuery.split(/\s+/);
  terms.forEach(term => {
  if (term.toUpperCase().startsWith('NOT:')) {
   const parts = term.substring(4).split(':');
   if (parts.length === 2) {
   const [key, val] = parts;
   data = data.filter(item => {
    const itemVal = (item as any)[key.toLowerCase()];
    return itemVal !== undefined && String(itemVal).toLowerCase() !== val.toLowerCase();
   });
   }
  } else if (term.includes(':')) {
   const parts = term.split(':');
   if (parts.length === 2) {
   const [key, val] = parts;
   data = data.filter(item => {
    const itemVal = (item as any)[key.toLowerCase()];
    return itemVal !== undefined && String(itemVal).toLowerCase() === val.toLowerCase();
   });
   }
  } else {
   data = data.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(term.toLowerCase())));
  }
  });
 }

 return data.map(row => {
  const newRow = { ...row };
  if (maskName) newRow.name = `User_${row.id}`;
  if (hashEmail) newRow.email = `***@${row.email.split('@')[1]}`;
  if (generalizeAge) newRow.age = `${Math.floor(row.age / 10) * 10}-${Math.floor(row.age / 10) * 10 + 9}` as any;
  if (removeIp) newRow.ip = '[REDACTED]';
  return newRow;
 });
 }, [searchQuery, maskName, hashEmail, generalizeAge, removeIp]);

 const checkAnswers = () => {
 const q1 = q1Answer.trim().toLowerCase();
 const q1Correct = q1.includes('country:usa') && q1.includes('condition:diabetes');
 const q2Correct = maskName && hashEmail && removeIp && generalizeAge;

 if (q1Correct && q2Correct) {
  setAssessmentStatus('Success! Dataset properly filtered and fully anonymized for GDPR compliance.');
 } else if (!q1Correct) {
  setAssessmentStatus('Query is incorrect. Ensure you use both country: and condition: operators.');
 } else {
  setAssessmentStatus('Data is not fully anonymized. Review GDPR PII definitions.');
 }
 };

 return (
 <div className="flex flex-col h-screen bg-slate-50 dark:!bg-[#000000] font-sans select-none overflow-hidden">
  <div className="flex items-center justify-between bg-[#121212] dark:bg-[#121212] text-white p-4 shadow-md">
  <LabHeader onExit={onExit} title="Grade 12 Digital Literacy: Data Querying & GDPR" />
  <div className="text-sm font-mono bg-[#000000] dark:bg-[#121212] px-3 py-1 rounded-md text-slate-300">
   RECORDS: {processedData.length}
  </div>
  </div>

  
  {/* Mobile Tab Navigation */}
  <div className="lg:hidden w-full px-4 py-4 md:px-6 grid grid-cols-2 gap-2 flex-shrink-0 z-10 relative">
   <button 
    onClick={() => setActiveMobileTab('theory')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'theory' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >
    Theory
   </button>
   <button 
    onClick={() => setActiveMobileTab('lab')}
    className={`w-full py-3 text-sm font-bold rounded-xl transition-all text-center ${activeMobileTab === 'lab' ? 'bg-[#4158D1] text-white shadow-md' : 'bg-white dark:bg-[#1c1b1b] text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700'}`}
   >Lab</button>
  </div>
  <div className="lg:flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-0 lg:gap-4 p-4 lg: overflow-y-auto lg:overflow-visible">
  
  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-y-auto `}>
   <div className={`p-4 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]/50 flex-col `}>
   <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
    <Table size={18} className="text-blue-500" />
    Theory & Context
   </h2>
   </div>
   <div className="p-4 space-y-6 text-slate-600 dark:text-[#a1a1aa] text-sm">
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">Advanced Search Operators</h3>
    <p className="mb-2">Search operators allow you to pinpoint specific data records efficiently.</p>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>Key-Value Search:</strong> <code>key:value</code> (e.g., <code>country:UK</code>) restricts results to records where the key matches the value.</li>
    <li><strong>Exclusion (NOT):</strong> <code>NOT:key:value</code> filters out matching records.</li>
    <li><strong>Implicit AND:</strong> Spacing multiple terms implies an AND logic.</li>
    </ul>
   </section>
   
   <section>
    <h3 className="font-semibold text-slate-800 dark:text-[#ffffff] mb-2">GDPR Data Anonymization</h3>
    <p className="mb-2">The General Data Protection Regulation (GDPR) mandates protecting Personally Identifiable Information (PII).</p>
    <ul className="list-disc pl-4 space-y-2">
    <li><strong>Direct Identifiers:</strong> Names, Emails, and IP Addresses must be masked, hashed, or redacted entirely.</li>
    <li><strong>Indirect Identifiers:</strong> Data like exact age can be re-identified when combined. We <em>generalize</em> them into ranges (e.g., 20-29).</li>
    </ul>
   </section>
   </div>
  </div>

  <div className={`bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col overflow- `}>
   <div className="p-4 border-b border-slate-200 dark:border-[#1c1b1b] bg-slate-50 dark:bg-[#121212] flex items-center gap-3">
   <Search className="text-slate-400" size={20} />
   <input 
    type="text" 
    placeholder="Query e.g., country:UK NOT:condition:Asthma"
    className="flex-1 bg-slate-50 dark:bg-[#121212] border border-slate-300 dark:border-[#1c1b1b] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
   />
   </div>
   
   <div className="p-4 bg-slate-100 dark:bg-[#121212] border-b border-slate-200 dark:border-[#1c1b1b] flex flex-wrap gap-4">
   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#ffffff] cursor-pointer">
    <input type="checkbox" checked={maskName} onChange={e => setMaskName(e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
    Mask Names
   </label>
   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#ffffff] cursor-pointer">
    <input type="checkbox" checked={hashEmail} onChange={e => setHashEmail(e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
    Hash Emails
   </label>
   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#ffffff] cursor-pointer">
    <input type="checkbox" checked={generalizeAge} onChange={e => setGeneralizeAge(e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
    Generalize Age
   </label>
   <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-[#ffffff] cursor-pointer">
    <input type="checkbox" checked={removeIp} onChange={e => setRemoveIp(e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
    Redact IP
   </label>
   </div>

   <div className="flex-1 overflow-auto bg-slate-50 dark:bg-[#121212] p-4">
   <table className="w-full text-left border-collapse text-sm">
    <thead>
    <tr className="border-b-2 border-slate-200 dark:border-[#1c1b1b] text-slate-600 dark:text-[#a1a1aa]">
     <th className="py-2 px-3">ID</th>
     <th className="py-2 px-3">Name</th>
     <th className="py-2 px-3">Email</th>
     <th className="py-2 px-3">Age</th>
     <th className="py-2 px-3">Country</th>
     <th className="py-2 px-3">Condition</th>
     <th className="py-2 px-3">IP Address</th>
    </tr>
    </thead>
    <tbody>
    {processedData.length === 0 ? (
     <tr>
     <td colSpan={7} className="py-8 text-center text-slate-400">No records found matching query.</td>
     </tr>
    ) : (
     processedData.map((row, i) => (
     <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 dark:bg-[#121212]">
      <td className="py-2 px-3 font-mono text-xs text-slate-500 dark:text-[#71717a]">{row.id}</td>
      <td className="py-2 px-3 font-medium">{row.name}</td>
      <td className="py-2 px-3 text-slate-600 dark:text-[#a1a1aa]">{row.email}</td>
      <td className="py-2 px-3">{row.age}</td>
      <td className="py-2 px-3">
      <span className="bg-slate-100 dark:bg-[#121212] text-slate-700 dark:text-[#ffffff] px-2 py-0.5 rounded text-xs font-bold">{row.country}</span>
      </td>
      <td className="py-2 px-3">{row.condition}</td>
      <td className="py-2 px-3 font-mono text-xs text-slate-500 dark:text-[#71717a]">{row.ip}</td>
     </tr>
     ))
    )}
    </tbody>
   </table>
   </div>
  </div>

  <div className="bg-slate-50 dark:!bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#1c1b1b] flex flex-col lg:overflow-y-auto">
   <div className="p-4 border-b border-slate-100 bg-slate-50 dark:bg-[#121212]/50">
   <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-[#ffffff]">
    <CheckCircle size={18} className="text-emerald-500" />
    Compliance Assessment
   </h2>
   </div>
   <div className="p-4 space-y-6 flex-1">
   
   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] leading-relaxed">
    1. Write a search query using the Simulator's syntax to find all records where the country is USA and the condition is Diabetes. (Include space between terms).
    </label>
    <input
    type="text"
    value={q1Answer}
    onChange={(e) => setQ1Answer(e.target.value)}
    placeholder="e.g. country:USA ..."
    className={`w-full border border-slate-300 dark:border-[#1c1b1b] rounded-md p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono bg-slate-50 dark:bg-[#121212] `}
    />
   </div>

   <div className="space-y-3">
    <label className="block text-sm font-medium text-slate-700 dark:text-[#ffffff] leading-relaxed">
    2. In the simulator, activate ALL necessary toggles to ensure the dataset is fully GDPR compliant. Direct PII must be gone, and indirect PII generalized.
    </label>
    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#71717a] bg-slate-50 dark:bg-[#121212] p-3 rounded border border-slate-200 dark:border-[#1c1b1b]">
    <EyeOff size={16} /> Use the toggles in the middle column.
    </div>
   </div>

   <button
    onClick={checkAnswers}
    className="w-full bg-[#121212] dark:!bg-[#121212] text-white font-medium py-3 rounded-lg hover:bg-slate-700 dark:!bg-[#121212] transition-colors shadow-sm"
   >
    Verify Compliance
   </button>

   {assessmentStatus && (
    <div className={`p-4 rounded-lg text-sm font-medium border ${assessmentStatus.includes('Success') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
    {assessmentStatus}
    </div>
   )}

   <div className="pt-4 border-t border-slate-200 dark:border-[#1c1b1b] mt-6">
    <button 
    onClick={() => {
     if (onExit) onExit();
    }}
    className={`w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-emerald-500/40 `}
    >
    <Save size={20} />
    Submit Results & Exit
    </button>
   </div>
   </div>
  </div>

  </div>
 </div>
 );
}
