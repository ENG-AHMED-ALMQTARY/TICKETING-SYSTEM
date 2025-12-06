import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { useTicketStore } from '../../store/useTicketStore';
import { Input, Button, Card } from '../../components/ui/Base';
import { TicketType } from '../../types';

export const TicketCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createTicket, isLoading } = useTicketStore();
  
  const [formData, setFormData] = useState({
    title: '',
    type: TicketType.GENERAL_INQUIRY,
    priority: 'MEDIUM' as const,
    description: '',
    sector: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTicket(formData);
    navigate('/tickets');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/tickets')} className="flex items-center text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
      </button>

      <div>
        <h1 className="text-3xl font-bold text-white font-display">Create New Ticket</h1>
        <p className="text-slate-400">Please provide detailed information about the issue.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Issue Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as TicketType})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(TicketType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Priority</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <Input 
            label="Subject / Title"
            placeholder="E.g. Price surge detected in..."
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={isLoading} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Submit Ticket
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};
