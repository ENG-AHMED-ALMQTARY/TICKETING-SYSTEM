import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Base';

interface SLAIndicatorProps {
  deadline: string;
  createdAt: string;
  status: string;
}

export const SLAIndicator: React.FC<SLAIndicatorProps> = ({ deadline, createdAt, status }) => {
  const now = new Date().getTime();
  const due = new Date(deadline).getTime();
  const start = new Date(createdAt).getTime();
  
  const totalDuration = due - start;
  const elapsed = now - start;
  const remaining = due - now;
  
  // Calculate percentage used (0 to 100)
  const percentageUsed = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  const isOverdue = remaining < 0;
  const isResolved = status === 'RESOLVED' || status === 'CLOSED';

  const getStatusColor = () => {
    if (isResolved) return 'bg-green-500';
    if (isOverdue) return 'bg-red-500';
    if (percentageUsed > 75) return 'bg-orange-500';
    return 'bg-indigo-500';
  };

  const formatTimeRemaining = (ms: number) => {
    if (ms < 0) return `${Math.abs(Math.floor(ms / 3600000))}h overdue`;
    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    return `${hours}h remaining`;
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-slate-300 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          SLA Timer
        </h4>
        <span className={`text-xs font-mono font-bold ${isOverdue && !isResolved ? 'text-red-400' : 'text-slate-400'}`}>
          {isResolved ? 'Completed' : formatTimeRemaining(remaining)}
        </span>
      </div>

      {!isResolved && (
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentageUsed}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${getStatusColor()}`}
          />
        </div>
      )}

      <div className="flex items-center space-x-2 text-xs text-slate-500">
        {isResolved ? (
          <span className="flex items-center text-green-400">
            <CheckCircle className="w-3 h-3 mr-1" /> Within SLA
          </span>
        ) : isOverdue ? (
          <span className="flex items-center text-red-400">
            <AlertTriangle className="w-3 h-3 mr-1" /> Action Required
          </span>
        ) : (
          <span>Target: {new Date(deadline).toLocaleDateString()}</span>
        )}
      </div>
    </Card>
  );
};