import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Button } from '../../components/ui/Base';
import { Notification } from '../../types';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const navigate = useNavigate();

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'INFO':
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Notifications</h1>
          <p className="text-slate-400">Stay updated with system alerts and ticket updates.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={markAllAsRead}
            disabled={notifications.every(n => n.read)}
          >
            <Check className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit border border-slate-700">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            filter === 'ALL' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            filter === 'UNREAD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  relative overflow-hidden rounded-xl border p-4 cursor-pointer transition-all hover:scale-[1.005] group
                  ${notification.read 
                    ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60' 
                    : 'bg-slate-800 border-indigo-500/30 hover:border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                  }
                `}
              >
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full transition-colors ${notification.read ? 'bg-slate-700/30 group-hover:bg-slate-700/50' : 'bg-slate-700 group-hover:bg-slate-600'} shrink-0`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 pr-4">
                      <h3 className={`text-sm font-bold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm ${notification.read ? 'text-slate-500' : 'text-slate-300'} line-clamp-2`}>
                      {notification.message}
                    </p>
                    {notification.link && (
                       <p className="text-xs text-indigo-400 mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity">View Details →</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-300">No notifications found</h3>
              <p className="text-slate-500 mt-1">
                {filter === 'UNREAD' ? "You're all caught up!" : "You don't have any notifications yet."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};