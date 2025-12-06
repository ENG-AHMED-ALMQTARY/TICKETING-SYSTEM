
import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { ChartConfig, ChartDataPoint } from '../../types';
import { api } from '../../services/mockApi';

interface ChartPreviewProps {
  config: Partial<ChartConfig>;
  globalFilters?: Record<string, any>;
  height?: number | string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export const ChartPreview: React.FC<ChartPreviewProps> = ({ config, globalFilters = {}, height = '100%' }) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      // Don't fetch if minimal config is missing
      if (!config.type || !config.metric) return;
      
      setLoading(true);
      try {
        // Merge chart-specific filters with dashboard global filters
        const requestConfig = {
          ...config,
          filters: { ...config.filters, ...globalFilters }
        };

        const result = await api.analytics.fetchAnalytics(requestConfig);
        if (isMounted) setData(result);
      } catch (error) {
        console.error("Failed to load chart data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Debounce to prevent flashing during rapid typing
    const timer = setTimeout(fetchData, 400);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [config.type, config.metric, config.groupBy, config.dataSource, config.filters, globalFilters]);

  // Loading State
  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-slate-500 bg-slate-800/20 rounded-xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-2"></div>
          <span className="text-xs">Generating Preview...</span>
        </div>
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-slate-500 border border-dashed border-slate-700 rounded-xl bg-slate-800/10">
        <span className="text-sm">Configure chart options to view data</span>
      </div>
    );
  }

  const renderChart = () => {
    const commonProps = { data, margin: { top: 10, right: 10, left: -20, bottom: 0 } };
    
    switch (config.type) {
      case 'AREA':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} 
              itemStyle={{ color: '#818cf8' }}
            />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
      case 'LINE':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} 
            />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'BAR':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: '#334155', opacity: 0.2 }}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} 
            />
            <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        );
      case 'PIE':
        return (
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        );
      case 'RADAR':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="#475569" />
            <Radar name={config.metric || 'Value'} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
            <Legend />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
          </RadarChart>
        );
      default:
        return <div className="text-center text-slate-500 pt-10">Select a chart type</div>;
    }
  };

  return (
    <div className="w-full h-full min-h-[250px] flex flex-col">
       <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
       </div>
    </div>
  );
};
