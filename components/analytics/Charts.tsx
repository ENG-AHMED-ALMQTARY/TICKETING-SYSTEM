import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card } from '../ui/Base';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

export const KPIGrid: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return null;

  const items = [
    { label: 'Total Tickets', value: stats.totalTickets, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Resolved (Week)', value: stats.resolvedThisWeek, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Avg Response', value: stats.avgResponseTime, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Satisfaction', value: stats.satisfaction, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, idx) => (
        <Card key={idx} className="relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-400">{item.label}</p>
            <h3 className={`text-3xl font-bold mt-2 ${item.color}`}>{item.value}</h3>
          </div>
          <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 blur-xl`} />
        </Card>
      ))}
    </div>
  );
};

export const TrendChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card className="h-96">
      <h3 className="text-lg font-bold text-white mb-6">Weekly Ticket Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
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
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#e2e8f0' }}
          />
          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const DistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card className="h-96">
      <h3 className="text-lg font-bold text-white mb-6">Tickets by Type</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const BarChartComponent: React.FC<{ data: any[], title: string }> = ({ data, title }) => {
  return (
    <Card className="h-96">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
          <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
          <Tooltip 
            cursor={{ fill: '#334155', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
          />
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
