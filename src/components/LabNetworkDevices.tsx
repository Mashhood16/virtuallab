import { useState } from 'react';
import LabHeader from './LabHeader';

interface LabProps {
 onExit: () => void;
}

export default function LabNetworkDevices({ onExit }: LabProps) {
 const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
 
 // Power states
 const [power, setPower] = useState({ router: false, switch: false, wap: false });
 const [cables, setCables] = useState({ routerToSwitch: false, switchToWap: false });

 const networkOnline = power.router && power.switch && cables.routerToSwitch;
 const wifiOnline = networkOnline && power.wap && cables.switchToWap;

 const devices = {
 router: { name: 'Network Router', desc: 'Connects different networks together (like your home network to the Internet) and directs traffic efficiently.' },
 switch: { name: 'Network Switch', desc: 'Connects devices within the SAME network, allowing them to talk to each other. It has many ethernet ports.' },
 wap: { name: 'Wireless Access Point', desc: 'Creates a WLAN (Wireless Local Area Network). It connects to a wired router or switch to project a Wi-Fi signal.' },
 nic: { name: 'Network Interface Card', desc: 'A hardware component that connects a computer to a computer network (has an Ethernet port or Wi-Fi antenna).' }
 };

 return (
 <div className="w-full h-screen bg-slate-50 dark:!bg-[#000000] text-slate-800 dark:text-[#ffffff] flex flex-col font-sans">
  <LabHeader onExit={onExit} title="Act 1.2: Networking Devices Demo" subtitle="Identify devices and configure the server rack." variant="dark" />

  <div className="flex-1 flex lg:overflow-hidden">
  
  {/* Lab Area */}
  <div className="flex-1 bg-slate-950 p-12 flex flex-col items-center justify-center relative shadow-inner bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
   
   {/* Server Rack Background */}
   <div className="w-[600px] h-[600px] bg-[#121212] dark:bg-[#121212] rounded border-8 border-[#1c1b1b] dark:border-[#1c1b1b] shadow-2xl p-4 flex flex-col gap-6 relative">
    
    {/* Router */}
    <div 
    className={`w-full h-24 bg-[#000000] dark:bg-[#121212] border-2 rounded-lg relative cursor-pointer transition-all ${selectedDevice === 'router' ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-slate-600 dark:border-slate-500'}`}
    onClick={() => setSelectedDevice('router')}
    >
    <div className="absolute top-2 left-4 font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest text-xs">Edge Router</div>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4">
     {/* Internet Port */}
     <div className="w-8 h-8 bg-black rounded border border-[#1c1b1b] dark:border-[#1c1b1b] flex items-center justify-center">
      <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
     </div>
     {/* LAN Port */}
     <button 
      className={`w-8 h-8 rounded border flex items-center justify-center transition-colors ${cables.routerToSwitch ? 'bg-blue-500 border-blue-400' : 'bg-black border-[#1c1b1b] dark:border-slate-500 hover:border-slate-400 dark:border-slate-500'}`}
      onClick={(e) => { e.stopPropagation(); setCables(c => ({...c, routerToSwitch: !c.routerToSwitch})); }}
     >
      {cables.routerToSwitch && <div className="w-2 h-2 bg-slate-50 dark:bg-[#121212] rounded-full"></div>}
     </button>
    </div>
    {/* Status LED */}
    <div className={`absolute left-4 bottom-4 w-3 h-3 rounded-full ${power.router ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700 dark:bg-[#121212]'}`}></div>
    </div>

    {/* Cable 1 */}
    {cables.routerToSwitch && (
    <div className="absolute right-12 top-24 w-2 h-24 bg-blue-500 z-10 shadow-lg border-x border-blue-600 dark:bg-teal-950/20 dark:border-teal-900"></div>
    )}

    {/* Switch */}
    <div 
    className={`w-full h-24 bg-[#000000] dark:bg-[#121212] border-2 rounded-lg relative cursor-pointer transition-all ${selectedDevice === 'switch' ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-slate-600 dark:border-slate-500'}`}
    onClick={() => setSelectedDevice('switch')}
    >
    <div className="absolute top-2 left-4 font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest text-xs">24-Port Switch</div>
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
     {/* Uplink Port */}
     <div className="w-8 h-8 mr-4 rounded border bg-blue-500 border-blue-400 flex items-center justify-center opacity-50 dark:bg-teal-950/20 dark:border-teal-900"></div>
     
     {/* standard ports */}
     {[...Array(6)].map((_, i) => (
      <div key={i} className="w-6 h-6 bg-black border border-[#1c1b1b] dark:border-[#1c1b1b] rounded-sm"></div>
     ))}
     
     {/* Port to WAP */}
     <button 
      className={`w-6 h-6 ml-4 rounded border flex items-center justify-center transition-colors ${cables.switchToWap ? 'bg-orange-500 border-orange-400' : 'bg-black border-[#1c1b1b] dark:border-slate-500 hover:border-slate-400 dark:border-slate-500'}`}
      onClick={(e) => { e.stopPropagation(); setCables(c => ({...c, switchToWap: !c.switchToWap})); }}
     ></button>
    </div>
    {/* Status LEDs */}
    <div className="absolute left-4 bottom-4 flex gap-2">
     <div className={`w-3 h-3 rounded-full ${power.switch ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700 dark:bg-[#121212]'}`}></div>
     <div className={`w-3 h-3 rounded-full ${networkOnline ? 'bg-blue-400 animate-pulse' : 'bg-slate-700 dark:bg-[#121212]'}`}></div>
    </div>
    </div>

    {/* Cable 2 */}
    {cables.switchToWap && (
    <div className="absolute right-[110px] top-[216px] w-2 h-[120px] bg-orange-500 z-10 shadow-lg border-x border-orange-600"></div>
    )}

    {/* WAP */}
    <div 
    className={`w-full h-32 bg-[#000000] dark:bg-[#121212] border-2 rounded-lg relative cursor-pointer transition-all flex justify-center items-center ${selectedDevice === 'wap' ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-slate-600 dark:border-slate-500'}`}
    onClick={() => setSelectedDevice('wap')}
    >
    <div className="absolute top-2 left-4 font-bold text-slate-500 dark:text-[#71717a] uppercase tracking-widest text-xs">Wireless Access Point</div>
    
    {/* Antennas */}
    <div className="absolute top-[-30px] left-10 w-2 h-10 bg-slate-400 dark:bg-[#121212] rounded-t-full"></div>
    <div className="absolute top-[-30px] left-20 w-2 h-10 bg-slate-400 dark:bg-[#121212] rounded-t-full"></div>
    
    {wifiOnline && (
     <svg className="absolute w-64 h-64 -top-32 pointer-events-none opacity-50">
      <circle cx="50%" cy="50%" r="40" fill="none" stroke="#38bdf8" strokeWidth="4" className="animate-[ping_2s_infinite]" />
      <circle cx="50%" cy="50%" r="80" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-[ping_2s_infinite_0.5s]" />
     </svg>
    )}

    <div className="absolute right-[100px] top-[-10px] w-6 h-6 bg-orange-500 border border-orange-400 rounded flex items-center justify-center opacity-50 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-orange-500/40"></div>
    
    {/* Status LEDs */}
    <div className="absolute left-4 bottom-4 flex gap-2">
     <div className={`w-3 h-3 rounded-full ${power.wap ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700 dark:bg-[#121212]'}`}></div>
     <div className={`w-3 h-3 rounded-full ${wifiOnline ? 'bg-sky-400 animate-pulse' : 'bg-slate-700 dark:bg-[#121212]'}`}></div>
    </div>
    </div>

    {/* Desktop PC (NIC) */}
    <div 
    className={`absolute bottom-4 left-4 w-48 h-32 bg-[#121212] dark:bg-[#121212] border-2 rounded-lg relative cursor-pointer transition-all ${selectedDevice === 'nic' ? 'border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'border-slate-600 dark:border-slate-500'}`}
    onClick={() => setSelectedDevice('nic')}
    >
    <div className="absolute top-2 left-4 font-bold text-slate-400 uppercase tracking-widest text-xs">Workstation PC</div>
    {/* Network Interface Card highlighted */}
    <div className="absolute right-[-10px] bottom-4 w-8 h-20 bg-green-800 border border-green-600 rounded flex items-center justify-center rotate-y-12">
     <div className="text-[8px] font-mono text-green-300 -rotate-90 whitespace-nowrap">NIC CARD</div>
     {wifiOnline && <div className="absolute -right-2 top-2 w-1 h-8 bg-sky-400 rounded-full animate-pulse shadow-[0_0_10px_#38bdf8] dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white dark:border-transparent dark:shadow-lg dark:shadow-sky-500/40"></div>} {/* wifi antenna receiving */}
    </div>
    </div>

   </div>
   
  </div>

  {/* Control Panel */}
  <div className="w-96 bg-[#121212] dark:bg-[#121212] p-8 flex flex-col border-l border-[#1c1b1b] dark:border-[#1c1b1b] z-10 text-slate-200 lg:overflow-y-auto">
   <h2 className="text-xl font-bold text-white mb-6 border-b border-[#1c1b1b] dark:border-[#1c1b1b] pb-2">Hardware Setup</h2>
   
   <div className="grid grid-cols-2 gap-4 mb-8">
    <button 
    onClick={() => setPower(p => ({...p, router: !p.router}))}
    className={`py-2 px-4 rounded font-bold border transition-colors ${power.router ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-700 dark:bg-[#121212] border-slate-600 dark:border-slate-500 hover:bg-slate-600 dark:bg-[#121212]'}`}
    >Power Router</button>
    <button 
    onClick={() => setPower(p => ({...p, switch: !p.switch}))}
    className={`py-2 px-4 rounded font-bold border transition-colors ${power.switch ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-700 dark:bg-[#121212] border-slate-600 dark:border-slate-500 hover:bg-slate-600 dark:bg-[#121212]'}`}
    >Power Switch</button>
    <button 
    onClick={() => setPower(p => ({...p, wap: !p.wap}))}
    className={`py-2 px-4 rounded font-bold border transition-colors ${power.wap ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-700 dark:bg-[#121212] border-slate-600 dark:border-slate-500 hover:bg-slate-600 dark:bg-[#121212]'}`}
    >Power WAP</button>
   </div>

   <p className="text-sm text-slate-400 mb-6">Click empty ports on the devices to plug in cables. Click on a device to read its function.</p>

   {selectedDevice ? (
    <div className="bg-[#000000] dark:!bg-[#121212] p-6 rounded-xl border border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.1)] animate-fade-in">
    <h3 className="font-bold text-sky-400 tracking-wider text-lg mb-2 uppercase">
     {devices[selectedDevice as keyof typeof devices].name}
    </h3>
    <p className="text-slate-300 text-sm leading-relaxed">
     {devices[selectedDevice as keyof typeof devices].desc}
    </p>
    </div>
   ) : (
    <div className="bg-[#000000] dark:bg-[#121212]/50 p-6 rounded-xl border border-[#1c1b1b] dark:border-[#1c1b1b] border-dashed text-center">
    <span className="text-slate-500 dark:text-[#71717a] font-bold uppercase tracking-widest text-xs">Select a Device to Inspect</span>
    </div>
   )}

   <div className="mt-auto space-y-4">
    {wifiOnline && (
    <div className="bg-sky-900/50 p-4 rounded-xl border border-sky-500 animate-fade-in">
     <h3 className="font-bold text-sky-300 mb-1 tracking-wider text-sm flex items-center gap-2">
     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>
     WLAN Online
     </h3>
     <p className="text-sky-200 text-xs">
     The Internet is routed to the Switch, which connects to the WAP, which broadcasts Wi-Fi to the PC's Network Interface Card!
     </p>
    </div>
    )}
   </div>
  </div>
  </div>
 </div>
 );
}
