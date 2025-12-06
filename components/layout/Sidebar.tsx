import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Ticket, 
  BarChart2, 
  Users, 
  Settings, 
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  const links = [
    { to: '/dashboard', icon: Home, label: 'Dashboard', roles: [] },
    { to: '/tickets', icon: Ticket, label: 'Tickets', roles: [] },
    { to: '/analytics', icon: BarChart2, label: 'Analytics', roles: [UserRole.MANAGER, UserRole.ADMIN] },
    { to: '/admin', icon: Users, label: 'Admin', roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6">
        <div className="flex items-center space-x-2">
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
          
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}
              `}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
