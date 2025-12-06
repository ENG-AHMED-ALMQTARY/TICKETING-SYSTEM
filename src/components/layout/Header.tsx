
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User as UserIcon, RotateCcw, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const { language, setLanguage, t } = useLanguageStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const handleResetState = () => {
    if (window.confirm('Are you sure you want to clear all local state and cache? This will log you out and reload the page.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="flex justify-between items-center mb-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
       <div className="flex-1">
          {/* Breadcrumbs or Title could go here */}
       </div>
       <div className="flex items-center space-x-4 rtl:space-x-reverse">
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white hover:border-indigo-500 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="font-mono font-bold pt-0.5">{language.toUpperCase()}</span>
          </button>

          {/* Dev/Admin Reset Tool */}
          <button
            onClick={handleResetState}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title={t('resetState')}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-sm">{t('notifications')}</span>
                    <button onClick={() => navigate('/notifications')} className="text-xs text-indigo-400 hover:underline">{t('viewAll')}</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            markAsRead(n.id);
                            if(n.link) navigate(n.link);
                          }}
                          className={`p-3 border-b border-slate-800 hover:bg-slate-800 cursor-pointer transition-colors ${!n.read ? 'bg-indigo-900/10' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                             <p className="text-sm text-slate-200 font-medium mb-1">{n.title}</p>
                             {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Profile */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse pl-6 rtl:pl-0 rtl:pr-6 border-l rtl:border-l-0 rtl:border-r border-slate-700">
            <div className="text-right rtl:text-left hidden md:block">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <UserIcon className="w-5 h-5" />
            </div>
          </div>
       </div>
    </div>
  );
};
