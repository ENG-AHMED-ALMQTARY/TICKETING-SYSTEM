import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, RefreshCw, UserPlus, Paperclip, CheckCircle, User } from 'lucide-react';
import { TimelineItem } from '../../types';

interface TicketTimelineProps {
  items: TimelineItem[];
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ items }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'STATUS_CHANGE': return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case 'COMMENT': return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'ASSIGNMENT': return <UserPlus className="w-4 h-4 text-blue-400" />;
      case 'FILE_UPLOAD': return <Paperclip className="w-4 h-4 text-purple-400" />;
      default: return <CheckCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'STATUS_CHANGE': return 'Status Update';
      case 'COMMENT': return 'Comment Added';
      case 'ASSIGNMENT': return 'Assigned';
      case 'FILE_UPLOAD': return 'File Uploaded';
      default: return 'Event';
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-800" />
      
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            layout
            className="relative flex items-start space-x-4"
          >
            {/* Icon Bubble */}
            <div className={`
              relative z-10 w-8 h-8 rounded-full border flex items-center justify-center shadow-lg
              ${item.type === 'COMMENT' 
                ? 'bg-slate-700 border-slate-600' 
                : 'bg-slate-900 border-slate-700'
              }
            `}>
              {item.type === 'COMMENT' && item.user ? (
                <span className="text-xs font-bold text-white">
                  {item.user.name ? item.user.name.charAt(0) : <User className="w-4 h-4" />}
                </span>
              ) : (
                getIcon(item.type)
              )}
            </div>
            
            {/* Content Card */}
            <div className="flex-1 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  {item.user?.name || getLabel(item.type)}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div className="text-sm text-slate-300 whitespace-pre-wrap">
                {item.content}
              </div>

              {item.type !== 'COMMENT' && (
                <p className="text-xs text-slate-500 mt-2">
                  System ID: {item.userId}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {items.length === 0 && (
        <div className="text-center py-4 text-slate-500 italic text-sm">
          No history available for this ticket.
        </div>
      )}
    </div>
  );
};