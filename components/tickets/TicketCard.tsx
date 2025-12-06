import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Tag, AlertCircle } from 'lucide-react';
import { Ticket, TicketStatus } from '../../types';
import { Card, Badge } from '../ui/Base';

const statusColor = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.OPEN: return 'info';
    case TicketStatus.RESOLVED: return 'success';
    case TicketStatus.ASSIGNED: return 'warning';
    case TicketStatus.CLOSED: return 'info'; // Default fallback
    default: return 'info';
  }
};

const priorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return 'text-red-400';
    case 'HIGH': return 'text-orange-400';
    case 'MEDIUM': return 'text-yellow-400';
    default: return 'text-slate-400';
  }
};

export const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="cursor-pointer hover:bg-slate-800/80 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500 group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-500">{ticket.referenceNumber}</span>
          <Badge variant={statusColor(ticket.status)}>{ticket.status}</Badge>
        </div>
        <span className={`text-xs font-bold flex items-center ${priorityColor(ticket.priority)}`}>
          <AlertCircle className="w-3 h-3 mr-1" />
          {ticket.priority}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">
        {ticket.title}
      </h3>
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">
        {ticket.description}
      </p>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-700 pt-3">
        <div className="flex items-center">
          <Tag className="w-3 h-3 mr-1" />
          {ticket.type}
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(ticket.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};
