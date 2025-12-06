
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Calendar, Layers } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Button } from '../../components/ui/Base';
import { ChartCard } from '../../components/analytics/ChartCard';
import { AnalyticsBuilder } from './AnalyticsBuilder';
import { KPIGrid } from '../../components/analytics/Charts';
import { api } from '../../services/mockApi';
import { ChartConfig, UserRole } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const { charts, loadCharts, addChart, updateChart, removeChart, setFilters: setStoreFilters, filters: storeFilters } = useAnalyticsStore();
  const { user } = useAuthStore();
  const { t, direction } = useLanguageStore();
  
  // Local state for UI
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | undefined>(undefined);
  const [stats, setStats] = useState<any>(null);
  
  // Dashboard Filters State
  const [localFilters, setLocalFilters] = useState({
    sector: '',
    dateRange: 'last_30_days'
  });

  // Load initial data
  useEffect(() => {
    loadCharts();
    const fetchStats = async () => {
      const data = await api.analytics.getStats();
      setStats(data);
    };
    fetchStats();
  }, [loadCharts]);

  // Update store when local filters change
  useEffect(() => {
    setStoreFilters({ sector: localFilters.sector });
  }, [localFilters.sector, setStoreFilters]);

  const handleOpenBuilder = (chart?: ChartConfig) => {
    setEditingChart(chart);
    setIsBuilderOpen(true);
  };

  const handleSaveChart = (config: Omit<ChartConfig, 'id' | 'createdAt'>) => {
    if (editingChart) {
      updateChart(editingChart.id, config);
    } else {
      addChart({
        ...config,
        createdAt: new Date().toISOString(),
        createdBy: user?.id || 'unknown'
      });
    }
    setIsBuilderOpen(false);
    setEditingChart(undefined);
  };

  const handleDeleteChart = (id: string) => {
    if (window.confirm('Are you sure you want to delete this chart? This action cannot be undone.')) {
      removeChart(id);
    }
  };

  const visibleCharts = charts.filter(chart => 
    !chart.visibility || 
    chart.visibility.length === 0 || 
    (user && chart.visibility.includes(user.role))
  );

  const canManage = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">{t('analyticsDashboard')}</h1>
          <p className="text-slate-400">{t('analyticsSubtitle')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Dashboard Filters */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse bg-slate-800/50 p-1 rounded-lg border border-slate-700">
             <div className="flex items-center px-3 text-slate-400">
               <Filter className="w-4 h-4" />
             </div>
             
             <div className="h-6 w-px bg-slate-700" />
             
             <div className="relative">
               <Layers className={`absolute ${direction === 'rtl' ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500`} />
               <select 
                 className={`bg-transparent text-sm text-slate-200 py-1.5 focus:outline-none cursor-pointer ${direction === 'rtl' ? 'pr-7 pl-8' : 'pl-7 pr-8'}`}
                 value={localFilters.sector}
                 onChange={(e) => setLocalFilters(prev => ({ ...prev, sector: e.target.value }))}
               >
                 <option value="">All Sectors</option>
                 <option value="Retail">Retail</option>
                 <option value="Tech">Tech</option>
                 <option value="Logistics">Logistics</option>
                 <option value="Health">Health</option>
               </select>
             </div>

             <div className="h-6 w-px bg-slate-700" />

             <div className="relative">
               <Calendar className={`absolute ${direction === 'rtl' ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500`} />
               <select 
                 className={`bg-transparent text-sm text-slate-200 py-1.5 focus:outline-none cursor-pointer ${direction === 'rtl' ? 'pr-7 pl-8' : 'pl-7 pr-8'}`}
                 value={localFilters.dateRange}
                 onChange={(e) => setLocalFilters(prev => ({ ...prev, dateRange: e.target.value }))}
               >
                 <option value="last_7_days">Last 7 Days</option>
                 <option value="last_30_days">Last 30 Days</option>
                 <option value="this_quarter">This Quarter</option>
                 <option value="this_year">This Year</option>
               </select>
             </div>
          </div>

          {/* Action Buttons */}
          {canManage && (
            <div className="flex space-x-3 rtl:space-x-reverse">
              <Button onClick={() => handleOpenBuilder()} className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" /> {t('customChart')}
              </Button>
            </div>
          )}
        </div>
      </div>

      <KPIGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-6">
        {visibleCharts.map(chart => (
          <ChartCard 
            key={chart.id} 
            config={chart} 
            onEdit={handleOpenBuilder} 
            onDelete={handleDeleteChart}
            canManage={canManage}
            globalFilters={localFilters}
          />
        ))}
      </div>

      {visibleCharts.length === 0 && (
        <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
             <Layers className="w-8 h-8 text-slate-600" />
           </div>
           <h3 className="text-lg font-medium text-slate-300">{t('noCustomCharts')}</h3>
           <p className="text-slate-500 mb-6 max-w-md mx-auto">
             There are no charts configured for your role, or they have been deleted. 
             {canManage ? " Create a new custom chart to get started." : ""}
           </p>
           {canManage && (
             <Button onClick={() => handleOpenBuilder()}>
                {t('createFirstChart')}
             </Button>
           )}
        </div>
      )}

      <AnalyticsBuilder 
        isOpen={isBuilderOpen} 
        onClose={() => { setIsBuilderOpen(false); setEditingChart(undefined); }}
        onSave={handleSaveChart}
        initialConfig={editingChart}
      />
    </motion.div>
  );
};
