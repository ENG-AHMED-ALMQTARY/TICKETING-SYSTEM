
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card } from '../ui/Base';
import { useLanguageStore } from '../../store/useLanguageStore';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export const KPIGrid: React.FC<{ stats: any }> = ({ stats }) => {
  const { t } = useLanguageStore();

  if (!stats) return null;

  const items = [
    { label: t('totalTickets'), value: stats.totalTickets, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: t('resolvedWeek'), value: stats.resolvedThisWeek, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: t('avgResponse'), value: stats.avgResponseTime, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: t('satisfaction'), value: stats.satisfaction, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, idx) => (
        <Card key={idx} className="relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400">{item.label}</p>
            <h3 className={`text-3xl font-bold mt-2 ${item.color}`}>{item.value}</h3>
          </div>
          <div className={`absolute top-0 right-0 rtl:right-auto rtl:left-0 w-24 h-24 ${item.bg} rounded-full -mr-8 rtl:-mr-0 rtl:-ml-8 -mt-8 transition-transform group-hover:scale-150 blur-xl`} />
        </Card>
      ))}
    </div>
  );
};

export const TrendChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { t } = useLanguageStore();
  return (
    <Card className="h-96 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 shrink-0">{t('weeklyTrend')}</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const DistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { t } = useLanguageStore();
  return (
    <Card className="h-96 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 shrink-0">{t('ticketsByType')}</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const BarChartComponent: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
  return (
    <Card className="h-96 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6 shrink-0">{title}</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#334155', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            />
            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
