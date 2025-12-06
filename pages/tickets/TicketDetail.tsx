import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Shield, Share2, Tag } from 'lucide-react';
import { useTicketStore } from '../../store/useTicketStore';
import { ticketsApi } from '../../services/ticketsApi';
import { TimelineItem } from '../../types';
import { Card, Badge, Button } from '../../components/ui/Base';
import { SLAIndicator } from '../../components/tickets/SLAIndicator';
import { AttachmentPreview } from '../../components/tickets/AttachmentPreview';
import { TicketTimeline } from '../../components/tickets/TicketTimeline';

export const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTicket, fetchTicketById, isLoading } = useTicketStore();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicketById(id);
      
      // Fetch Timeline locally as it's specific to this view
      setTimelineLoading(true);
      ticketsApi.getTimeline(id)
        .then(setTimeline)
        .finally(() => setTimelineLoading(false));
    }
  }, [id, fetchTicketById]);

  if (isLoading || !currentTicket) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-12">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/tickets')} 
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tickets
        </button>
        <div className="flex space-x-3">
          <Button variant="secondary" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button size="sm">Update Status</Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-white font-display">{currentTicket.title}</h1>
            <span className="text-sm font-mono text-slate-500 px-2 py-1 bg-slate-800 rounded">{currentTicket.referenceNumber}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={currentTicket.status === 'OPEN' ? 'info' : 'success'}>{currentTicket.status}</Badge>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
              currentTicket.priority === 'CRITICAL' ? 'border-red-500/50 text-red-400 bg-red-500/10' :
              currentTicket.priority === 'HIGH' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' :
              'border-slate-600 text-slate-400'
            }`}>
              {currentTicket.priority}
            </span>
            <span className="text-sm text-slate-400 flex items-center">
              <Tag className="w-3 h-3 mr-1" /> {currentTicket.type}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Description</h3>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {currentTicket.description}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-slate-500 uppercase">Sector</p>
                 <p className="font-medium text-slate-200">{currentTicket.sector || 'N/A'}</p>
               </div>
               <div>
                 <p className="text-xs text-slate-500 uppercase">Service Category</p>
                 <p className="font-medium text-slate-200">{currentTicket.service || 'General'}</p>
               </div>
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <h3 className="text-lg font-bold text-white mb-4">Attachments</h3>
            <AttachmentPreview attachments={currentTicket.attachments} />
          </Card>

          {/* Comments / Activity Feed Placeholder */}
          <Card>
             <h3 className="text-lg font-bold text-white mb-4">Discussion</h3>
             <textarea 
               placeholder="Add a comment..."
               className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
             />
             <div className="mt-2 flex justify-end">
               <Button size="sm">Post Comment</Button>
             </div>
          </Card>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          
          {/* SLA Status */}
          <SLAIndicator 
            deadline={currentTicket.slaDeadline} 
            createdAt={currentTicket.createdAt}
            status={currentTicket.status}
          />

          {/* Assignee Card */}
          <Card>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Assigned Technician</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                {currentTicket.assignedToId ? (
                  <>
                    <p className="text-sm font-bold text-white">Technician #{currentTicket.assignedToId}</p>
                    <p className="text-xs text-green-400">Currently Active</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-300">Unassigned</p>
                    <p className="text-xs text-slate-500">Waiting for dispatch</p>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-6">Activity History</h3>
            {timelineLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <TicketTimeline items={timeline} />
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};