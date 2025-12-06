
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Ticket, 
  BarChart2, 
  Users, 
  LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { UserRole } from '../../types';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t, direction } = useLanguageStore();
  const location = useLocation();

  const links = [
    { to: '/dashboard', icon: Home, label: 'dashboard', roles: [] },
    { to: '/tickets', icon: Ticket, label: 'tickets', roles: [] },
    { to: '/analytics', icon: BarChart2, label: 'analytics', roles: [UserRole.MANAGER, UserRole.ADMIN] },
    { to: '/admin', icon: Users, label: 'admin', roles: [UserRole.ADMIN] },
  ];

  return (
    <div className={`h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed top-0 z-40 ${direction === 'rtl' ? 'right-0 border-r-0 border-l' : 'left-0'}`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SmartTicket
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 uppercase tracking-wider">
          {user?.role || 'Guest'}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          if (link.roles.length > 0 && user && !link.roles.includes(user.role)) return null;
          
          const isActive = location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to));
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`
                flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}
              `}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{t(link.label)}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 rtl:space-x-reverse w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className={`w-5 h-5 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </div>
  );
};
