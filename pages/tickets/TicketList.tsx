import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { useTicketStore } from '../../store/useTicketStore';
import { TicketCard } from '../../components/tickets/TicketCard';
import { Input, Button } from '../../components/ui/Base';

export const TicketList: React.FC = () => {
  const { tickets, fetchTickets, isLoading } = useTicketStore();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.referenceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Tickets</h1>
          <p className="text-slate-400">Manage and track your support requests.</p>
        </div>
        <Button onClick={() => navigate('/tickets/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
           <Input 
             placeholder="Search by reference or title..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="pl-10"
           />
        </div>
        <Button variant="secondary" className="md:w-32">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
           <div className="animate-spin w-8 h-8 border-b-2 border-indigo-500 rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
          {filteredTickets.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No tickets found matching your criteria.
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};