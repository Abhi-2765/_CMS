import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Home, 
  FileText, 
  PlusCircle, 
  Users, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  
  const getNavLinks = () => {
    switch(user?.role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin', icon: Home },
          { name: 'All Complaints', path: '/admin/complaints', icon: FileText },
          { name: 'Manage Users', path: '/admin/users', icon: Users },
          { name: 'System Logs', path: '/admin/logs', icon: Activity },
        ];
      case 'STAFF':
        return [
          { name: 'Dashboard', path: '/staff', icon: Home },
          { name: 'Assigned Tasks', path: '/staff/complaints', icon: FileText },
        ];
      case 'USER':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: Home },
          { name: 'My Complaints', path: '/complaints', icon: FileText },
          { name: 'New Complaint', path: '/complaints/new', icon: PlusCircle },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400">
            Campus CMS
          </span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin' || link.path === '/staff' || link.path === '/dashboard'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-200 p-4 dark:border-slate-800">
          <button 
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
