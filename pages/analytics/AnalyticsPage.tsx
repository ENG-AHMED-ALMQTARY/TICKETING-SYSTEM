import React from 'react';
import { motion } from 'framer-motion';
import { BarChartComponent, DistributionChart, TrendChart } from '../../components/analytics/Charts';
import { Button } from '../../components/ui/Base';

const MOCK_BAR_DATA = [
  { name: 'Retail', value: 400 },
  { name: 'Logistics', value: 300 },
  { name: 'Tech', value: 300 },
  { name: 'Health', value: 200 },
];

const MOCK_TREND = [
  { name: 'Mon', value: 45 },
  { name: 'Tue', value: 52 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 48 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Analytics Dashboard</h1>
          <p className="text-slate-400">Deep dive into system metrics and performance.</p>
        </div>
        <div className="space-x-4">
          <Button variant="secondary">Export Report</Button>
          <Button>Custom Builder</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChart data={MOCK_TREND} />
        <DistributionChart data={[
           { name: 'Critical', value: 10 },
           { name: 'High', value: 30 },
           { name: 'Medium', value: 45 },
           { name: 'Low', value: 15 },
        ]} />
        <BarChartComponent data={MOCK_BAR_DATA} title="Tickets by Sector" />
      </div>
    </motion.div>
  );
};
