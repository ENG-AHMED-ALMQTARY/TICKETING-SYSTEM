import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartBuilderForm } from '../../components/analytics/ChartBuilderForm';
import { ChartPreview } from '../../components/analytics/ChartPreview';
import { ChartConfig } from '../../types';
import { X } from 'lucide-react';

interface AnalyticsBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Omit<ChartConfig, 'id' | 'createdAt'>) => void;
  initialConfig?: ChartConfig;
}

export const AnalyticsBuilder: React.FC<AnalyticsBuilderProps> = ({ isOpen, onClose, onSave, initialConfig }) => {
  const [previewConfig, setPreviewConfig] = useState<Partial<ChartConfig>>(initialConfig || {});

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {initialConfig ? 'Edit Chart' : 'Create New Chart'}
                </h2>
                <p className="text-sm text-slate-400">Configure your data visualization</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column: Form */}
              <div className="w-1/3 min-w-[320px] border-r border-slate-800 p-6 bg-slate-800/30 overflow-y-auto">
                <ChartBuilderForm 
                  initialConfig={initialConfig} 
                  onSave={onSave} 
                  onCancel={onClose}
                  onChange={setPreviewConfig}
                />
              </div>

              {/* Right Column: Preview */}
              <div className="flex-1 p-8 bg-slate-950 flex flex-col">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-inner h-full flex flex-col">
                   <div className="mb-4 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Preview</span>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                           {previewConfig.type || 'N/A'}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">
                           {previewConfig.groupBy || 'No grouping'}
                        </span>
                      </div>
                   </div>
                   <div className="flex-1 min-h-0">
                      <ChartPreview config={previewConfig} />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};