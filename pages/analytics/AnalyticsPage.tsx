import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Base';
import { ChartCard } from '../../components/analytics/ChartCard';
import { AnalyticsBuilder } from './AnalyticsBuilder';
import { KPIGrid } from '../../components/analytics/Charts';
import { api } from '../../services/mockApi';
import { ChartConfig, UserRole } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const { charts, loadCharts, addChart, updateChart, removeChart } = useAnalyticsStore();
  const { user } = useAuthStore();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<ChartConfig | undefined>(undefined);
  const [stats, setStats] = useState<any>(null);

  // Load static stats and dynamic charts
  useEffect(() => {
    loadCharts();
    const fetchStats = async () => {
      const data = await api.analytics.getStats();
      setStats(data);
    };
    fetchStats();
  }, [loadCharts]);

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
    if (window.confirm('Are you sure you want to delete this chart?')) {
      removeChart(id);
    }
  };

  // Filter charts based on visibility
  const visibleCharts = charts.filter(chart => 
    !chart.visibility || chart.visibility.length === 0 || (user && chart.visibility.includes(user.role))
  );

  const canManage = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Analytics Dashboard</h1>
          <p className="text-slate-400">Deep dive into system metrics and performance.</p>
        </div>
        
        {canManage && (
          <div className="flex space-x-3">
            <Button variant="secondary">Export Report</Button>
            <Button onClick={() => handleOpenBuilder()}>
              <Plus className="w-4 h-4 mr-2" /> Custom Chart
            </Button>
          </div>
        )}
      </div>

      {/* KPI Grid (Static for now) */}
      <KPIGrid stats={stats} />

      {/* Dynamic Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleCharts.map(chart => (
          <ChartCard 
            key={chart.id} 
            config={chart} 
            onEdit={handleOpenBuilder} 
            onDelete={handleDeleteChart}
            canManage={canManage}
          />
        ))}
      </div>

      {visibleCharts.length === 0 && (
        <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-800 border-dashed">
           <h3 className="text-lg font-medium text-slate-300">No Custom Charts</h3>
           <p className="text-slate-500 mb-4">Create a new chart to visualize your data.</p>
           {canManage && (
             <Button onClick={() => handleOpenBuilder()}>
                Create First Chart
             </Button>
           )}
        </div>
      )}

      {/* Chart Builder Modal */}
      <AnalyticsBuilder 
        isOpen={isBuilderOpen} 
        onClose={() => { setIsBuilderOpen(false); setEditingChart(undefined); }}
        onSave={handleSaveChart}
        initialConfig={editingChart}
      />
    </motion.div>
  );
};