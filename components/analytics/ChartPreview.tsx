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
  height?: number | string;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export const ChartPreview: React.FC<ChartPreviewProps> = ({ config, height = '100%' }) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!config.type || !config.metric) return;
      
      setLoading(true);
      try {
        // In a real app, we pass the full config or filters
        const result = await api.analytics.fetchAnalytics(config);
        if (isMounted) setData(result);
      } catch (error) {
        console.error("Failed to load chart data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Debounce slightly to avoid rapid calls during typing in builder
    const timer = setTimeout(fetchData, 500);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [config.type, config.metric, config.groupBy, config.dataSource]);

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-2"></div>
        Loading preview...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-slate-500 border border-dashed border-slate-700 rounded-xl">
        Configure chart to see preview
      </div>
    );
  }

  const renderChart = () => {
    switch (config.type) {
      case 'AREA':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        );
      case 'LINE':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'BAR':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'PIE':
        return (
          <PieChart>
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
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        );
      case 'RADAR':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#475569" />
            <Radar name={config.metric} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        );
      default:
        return <div className="text-center text-slate-500 pt-10">Select a chart type</div>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height as any}>
      {renderChart()}
    </ResponsiveContainer>
  );
};