import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../services/mockApi';
import { KPIGrid, TrendChart, DistributionChart } from '../components/analytics/Charts';
import { UserRole } from '../types';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.analytics.getStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-slate-400 mt-2">
            Here's what's happening in your sector today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Current Role</p>
          <p className="text-indigo-400 font-bold">{user?.role}</p>
        </div>
      </div>

      <KPIGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChart data={stats?.weeklyTrend || []} />
        <DistributionChart data={stats?.ticketsByType || []} />
      </div>

      {/* Role specific content sections could go here */}
      {user?.role === UserRole.TECHNICIAN && (
         <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-xl">
            <h3 className="text-indigo-400 font-bold mb-2">Technician Active Assignment</h3>
            <p className="text-slate-300">You have 1 active ticket pending resolution.</p>
         </div>
      )}
    </motion.div>
  );
};
