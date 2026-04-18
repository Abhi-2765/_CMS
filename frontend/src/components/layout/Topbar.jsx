import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/70 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 md:px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <div className="hidden lg:block text-sm font-medium text-slate-500 dark:text-slate-400">
          Welcome back, <span className="text-slate-900 dark:text-slate-100">{user?.name}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
            <User size={18} />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
