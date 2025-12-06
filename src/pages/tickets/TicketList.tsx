import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, X, ChevronLeft, ChevronRight, 
  Calendar, Layers, AlertCircle, CheckCircle 
} from 'lucide-react';
import { useTicketStore } from '../../store/useTicketStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { TicketCard } from '../../components/tickets/TicketCard';
import { Button } from '../../components/ui/Base';
import { TicketStatus } from '../../types';

export const TicketList: React.FC = () => {
  const { 
    tickets, loadTickets, isLoading, 
    filters, setFilters, resetFilters, pagination, setPagination 
  } = useTicketStore();
  const { t, direction } = useLanguageStore();
  const navigate = useNavigate();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.q || '');

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.q) {
        setFilters({ q: localSearch });
        loadTickets();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, filters.q, setFilters, loadTickets]);

  // Initial Load
  useEffect(() => {
    loadTickets();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(pagination.total / pagination.pageSize)) {
      setPagination(newPage, pagination.pageSize);
      loadTickets();
    }
  };

  const toggleStatus = (status: TicketStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status) 
      ? current.filter(s => s !== status) 
      : [...current, status];
    setFilters({ status: updated });
    loadTickets();
  };

  const togglePriority = (priority: string) => {
    const current = filters.priority || [];
    const updated = current.includes(priority) 
      ? current.filter(p => p !== priority) 
      : [...current, priority];
    setFilters({ priority: updated });
    loadTickets();
  };

  const hasActiveFilters = filters.q || (filters.status?.length ?? 0) > 0 || (filters.priority?.length ?? 0) > 0 || filters.sector || filters.dateFrom;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">{t('tickets')}</h1>
          <p className="text-slate-400">{t('manageTickets')}</p>
        </div>
        <Button onClick={() => navigate('/tickets/create')}>
          <Plus className="w-4 h-4 mr-2" />
          {t('createTicket')}
        </Button>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        {/* Top Bar: Search & Toggle */}
        <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className={`absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
            <input 
              placeholder={t('searchTickets')} 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={`w-full bg-slate-900 border border-slate-700 rounded-lg py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${direction === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <Button variant={isFilterOpen ? "primary" : "secondary"} onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full md:w-auto">
            <Filter className="w-4 h-4 mr-2" /> {t('filter')}
            {hasActiveFilters && <div className="ml-2 w-2 h-2 rounded-full bg-white animate-pulse" />}
          </Button>
        </div>

        {/* Collapsible Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700 bg-slate-900/30"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.values(TicketStatus) as TicketStatus[]).map(status => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                          filters.status?.includes(status)
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('priority')}</label>
                  <div className="flex flex-wrap gap-2">
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                      <button
                        key={p}
                        onClick={() => togglePriority(p)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                          filters.priority?.includes(p)
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sector Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('ticketSector')}</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={filters.sector || ''}
                      onChange={(e) => { setFilters({ sector: e.target.value }); loadTickets(); }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                      <option value="">All Sectors</option>
                      <option value="Retail">Retail</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Tech">Tech</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>

                {/* Date Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Range</label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                      <input
                        type="date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => { setFilters({ dateFrom: e.target.value }); loadTickets(); }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 pl-8 pr-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="relative flex-1">
                       <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                       <input
                        type="date"
                        value={filters.dateTo || ''}
                        onChange={(e) => { setFilters({ dateTo: e.target.value }); loadTickets(); }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 pl-8 pr-2 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="px-6 pb-4 flex flex-wrap gap-2 items-center border-t border-slate-700/50 pt-4">
                  <span className="text-xs text-slate-500 mr-2">Active Filters:</span>
                  
                  {filters.status?.map(s => (
                    <span key={s} className="inline-flex items-center px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">
                      {s} <button onClick={() => toggleStatus(s)} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  
                  {filters.priority?.map(p => (
                     <span key={p} className="inline-flex items-center px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-xs border border-orange-500/20">
                      {p} <button onClick={() => togglePriority(p)} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  ))}

                  {filters.sector && (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                      {filters.sector} <button onClick={() => { setFilters({ sector: '' }); loadTickets(); }} className="ml-1 hover:text-white"><X className="w-3 h-3" /></button>
                    </span>
                  )}

                  <button 
                    onClick={() => { resetFilters(); setLocalSearch(''); loadTickets(); }}
                    className="text-xs text-red-400 hover:text-red-300 underline ml-auto"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-48 bg-slate-800 rounded-xl animate-pulse border border-slate-700" />
           ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
            {tickets.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                   <AlertCircle className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">{t('noTickets')}</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                <Button variant="ghost" onClick={() => { resetFilters(); setLocalSearch(''); loadTickets(); }} className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
              <div className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-300">{Math.min(pagination.total, (pagination.page - 1) * pagination.pageSize + 1)}</span> to <span className="font-bold text-slate-300">{Math.min(pagination.total, pagination.page * pagination.pageSize)}</span> of <span className="font-bold text-slate-300">{pagination.total}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Simple Page Indicator */}
                <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                  className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};