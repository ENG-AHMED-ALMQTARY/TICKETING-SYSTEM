import React, { useState, useEffect } from 'react';
import { ChartConfig, ChartType, UserRole } from '../../types';
import { Input, Button } from '../ui/Base';
import { Save, BarChart2, PieChart, Activity, Globe, Users } from 'lucide-react';

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
  // Merge default config with initial config, ensuring nested objects are handled if necessary
  const [config, setConfig] = useState<Partial<ChartConfig>>({ ...DEFAULT_CONFIG, ...initialConfig });

  useEffect(() => {
    onChange(config);
  }, [config, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.title || !config.metric || !config.type) return;
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-4 space-y-6 custom-scrollbar">
        
        {/* General Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-2">General Info</h3>
          <Input
            label="Chart Title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="e.g. Weekly Resolution Rate"
            required
            autoFocus
          />
          <Input
            label="Description (Optional)"
            value={config.description || ''}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            placeholder="What insights does this chart provide?"
          />
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-2">Configuration</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Chart Visualization</label>
            <div className="grid grid-cols-3 gap-2">
              {['AREA', 'LINE', 'BAR', 'PIE', 'RADAR'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConfig({ ...config, type: type as ChartType })}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                    config.type === type 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {type === 'AREA' && <Activity className="w-5 h-5 mb-1" />}
                  {type === 'LINE' && <Activity className="w-5 h-5 mb-1" />}
                  {type === 'BAR' && <BarChart2 className="w-5 h-5 mb-1" />}
                  {type === 'PIE' && <PieChart className="w-5 h-5 mb-1" />}
                  {type === 'RADAR' && <Globe className="w-5 h-5 mb-1" />}
                  <span className="text-[10px] font-bold">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Metric</label>
              <select
                value={config.metric}
                onChange={(e) => setConfig({ ...config, metric: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="tickets_count">Ticket Volume</option>
                <option value="resolved_count">Resolution Count</option>
                <option value="avg_response">Response Time</option>
                <option value="satisfaction">CSAT Score</option>
                <option value="sla_breach">SLA Breaches</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-400">Group By</label>
              <select
                value={config.groupBy}
                onChange={(e) => setConfig({ ...config, groupBy: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="date">Date (Time Series)</option>
                <option value="sector">Sector</option>
                <option value="status">Ticket Status</option>
                <option value="priority">Priority Level</option>
                <option value="technician">Technician</option>
              </select>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800 pb-2">Visibility</h3>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
              <Users className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-sm text-slate-300">Select roles that can view this chart:</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[UserRole.ADMIN, UserRole.MANAGER, UserRole.TECHNICIAN, UserRole.RETAILER, UserRole.CONSUMER].map(role => (
                <label key={role} className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    config.visibility?.includes(role) 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-slate-800 border-slate-600 group-hover:border-slate-500'
                  }`}>
                    {config.visibility?.includes(role) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={config.visibility?.includes(role)}
                    onChange={() => handleVisibilityChange(role)}
                  />
                  <span className={`text-sm ${config.visibility?.includes(role) ? 'text-white' : 'text-slate-400'}`}>{role}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-2 border-t border-slate-800 flex justify-end space-x-3 bg-slate-800/30 -mx-6 px-6 -mb-6 pb-6 sticky bottom-0">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" /> 
          {initialConfig?.id ? 'Update Chart' : 'Create Chart'}
        </Button>
      </div>
    </form>
  );
};