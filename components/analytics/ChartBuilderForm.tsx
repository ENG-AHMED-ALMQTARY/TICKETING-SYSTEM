import React, { useState, useEffect } from 'react';
import { ChartConfig, ChartType, UserRole } from '../../types';
import { Input, Button } from '../ui/Base';
import { Save, X, Eye } from 'lucide-react';

interface ChartBuilderFormProps {
  initialConfig?: Partial<ChartConfig>;
  onSave: (config: Omit<ChartConfig, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onChange: (config: Partial<ChartConfig>) => void;
}

const DEFAULT_CONFIG: Partial<ChartConfig> = {
  title: '',
  type: 'AREA',
  metric: 'tickets_count',
  dataSource: 'tickets',
  groupBy: 'date',
  granularity: 'daily',
  visibility: [UserRole.ADMIN, UserRole.MANAGER],
  description: ''
};

export const ChartBuilderForm: React.FC<ChartBuilderFormProps> = ({ initialConfig, onSave, onCancel, onChange }) => {
  const [config, setConfig] = useState<Partial<ChartConfig>>({ ...DEFAULT_CONFIG, ...initialConfig });

  useEffect(() => {
    // Notify parent of changes for live preview
    onChange(config);
  }, [config, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.title || !config.metric || !config.type || !config.dataSource) return;
    
    onSave(config as Omit<ChartConfig, 'id' | 'createdAt'>);
  };

  const handleVisibilityChange = (role: UserRole) => {
    const current = config.visibility || [];
    const updated = current.includes(role) 
      ? current.filter(r => r !== role)
      : [...current, role];
    setConfig({ ...config, visibility: updated });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Input
          label="Chart Title"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="e.g. Weekly Resolution Rate"
          required
        />
        
        <Input
          label="Description (Optional)"
          value={config.description}
          onChange={(e) => setConfig({ ...config, description: e.target.value })}
          placeholder="Briefly describe what this chart shows"
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Chart Type</label>
            <select
              value={config.type}
              onChange={(e) => setConfig({ ...config, type: e.target.value as ChartType })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="AREA">Area Chart</option>
              <option value="BAR">Bar Chart</option>
              <option value="LINE">Line Chart</option>
              <option value="PIE">Pie Chart</option>
              <option value="RADAR">Radar Chart</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Data Source</label>
            <select
              value={config.dataSource}
              onChange={(e) => setConfig({ ...config, dataSource: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tickets">Tickets</option>
              <option value="users">Users</option>
              <option value="performance">System Performance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Metric</label>
            <select
              value={config.metric}
              onChange={(e) => setConfig({ ...config, metric: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="tickets_count">Total Tickets</option>
              <option value="resolved_count">Resolved Tickets</option>
              <option value="avg_response">Avg Response Time</option>
              <option value="satisfaction">User Satisfaction</option>
              <option value="sla_breach">SLA Breaches</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-400">Group By</label>
            <select
              value={config.groupBy}
              onChange={(e) => setConfig({ ...config, groupBy: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Date (Timeline)</option>
              <option value="sector">Sector</option>
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="technician">Technician</option>
            </select>
          </div>
        </div>
        
        {config.groupBy === 'date' && (
           <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Granularity</label>
              <select
                value={config.granularity}
                onChange={(e) => setConfig({ ...config, granularity: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
           </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-400">Visibility (Roles)</label>
          <div className="grid grid-cols-2 gap-2">
            {[UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.RETAILER].map(role => (
              <label key={role} className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.visibility?.includes(role)}
                  onChange={() => handleVisibilityChange(role)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500"
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" /> Save Chart
        </Button>
      </div>
    </form>
  );
};