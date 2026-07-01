import type { ReactNode } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../store';

export type LabHeaderVariant = 'light' | 'dark' | 'emerald' | 'amber' | 'blue';

interface LabHeaderProps {
 onExit?: () => void;
 title: string;
 subtitle?: string;
 icon?: ReactNode;
 rightContent?: ReactNode;
 variant?: LabHeaderVariant;
}

const variantStyles: Record<LabHeaderVariant, { container: string; button: string; title: string; subtitle: string }> = {
 light: {
 container: ' border-b border-slate-200 dark:border-[#1c1b1b] shadow-sm',
 button: 'p-2 rounded-full transition-colors text-slate-600 dark:text-[#ffffff] hover:bg-slate-100/50 dark:hover:bg-white/10',
 title: 'text-slate-800 dark:text-white',
 subtitle: 'text-slate-500 dark:text-[#a1a1aa]',
 },
 dark: {
 container: 'bg-[#121212] dark:bg-[#121212] border-b border-[#1c1b1b] dark:border-[#1c1b1b] text-white',
 button: 'p-2 rounded-full transition-colors text-slate-300 hover:bg-white/10 dark:text-[#ffffff]',
 title: 'text-white dark:text-white',
 subtitle: 'text-slate-300 dark:text-[#a1a1aa]',
 },
 emerald: {
 container: 'bg-emerald-700 text-white dark:bg-emerald-900',
 button: 'p-2 rounded-full transition-colors text-white/80 hover:bg-white/10',
 title: 'text-white',
 subtitle: 'text-emerald-100',
 },
 amber: {
 container: 'bg-amber-700 text-white dark:bg-amber-900',
 button: 'p-2 rounded-full transition-colors text-white/80 hover:bg-white/10',
 title: 'text-white',
 subtitle: 'text-amber-100',
 },
 blue: {
 container: 'bg-blue-900 text-white',
 button: 'p-2 rounded-full transition-colors text-white/80 hover:bg-white/10',
 title: 'text-white',
 subtitle: 'text-blue-200',
 },
};

export default function LabHeader({ onExit, title, subtitle, icon, rightContent, variant = 'light' }: LabHeaderProps) {
 const styles = variantStyles[variant];
 const { theme, toggleTheme } = useTheme();
 return (
 <div className={`${styles.container} px-4 py-3 md:px-6 md:py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm shrink-0`}>
  <div className="flex items-center gap-3 md:gap-4 min-w-0">
  {onExit && (
   <button
   onClick={onExit}
   className={`${styles.button} shrink-0`}
   >
   <ArrowLeft className="w-5 h-5" />
   </button>
  )}
  <div className="min-w-0">
   <h1 className={`text-base md:text-xl font-bold ${styles.title} flex items-center gap-2 truncate`}>
   {icon}
   {title}
   </h1>
   {subtitle && (
   <p className={`text-xs md:text-sm ${styles.subtitle} truncate`}>{subtitle}</p>
   )}
  </div>
  </div>
  <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-2 md:ml-4">
  {rightContent}
  <button
   onClick={toggleTheme}
   className={`${styles.button} shrink-0`}
   title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
   {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
  </div>
 </div>
 );
}
