import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartBuilderForm } from '../../components/analytics/ChartBuilderForm';
import { ChartPreview } from '../../components/analytics/ChartPreview';
import { ChartConfig } from '../../types';
import { X, LayoutTemplate } from 'lucide-react';

interface AnalyticsBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Omit<ChartConfig, 'id' | 'createdAt'>) => void;
  initialConfig?: ChartConfig;
}

export const AnalyticsBuilder: React.FC<AnalyticsBuilderProps> = ({ isOpen, onClose, onSave, initialConfig }) => {
  const [previewConfig, setPreviewConfig] = useState<Partial<ChartConfig>>(initialConfig || {});

  // Reset preview when opening/closing or changing selection
  useEffect(() => {
    if (isOpen) {
      setPreviewConfig(initialConfig || {});
    }
  }, [isOpen, initialConfig]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
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
            className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <LayoutTemplate className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {initialConfig ? 'Edit Chart Configuration' : 'Create New Chart'}
                  </h2>
                  <p className="text-xs text-slate-400">Design your data visualization</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Column: Form */}
              <div className="w-full lg:w-4/12 border-r border-slate-800 p-6 bg-slate-800/30 overflow-y-auto">
                <ChartBuilderForm 
                  initialConfig={initialConfig} 
                  onSave={onSave} 
                  onCancel={onClose}
                  onChange={setPreviewConfig}
                />
              </div>

              {/* Right Column: Preview */}
              <div className="hidden lg:flex flex-1 p-8 bg-slate-950 flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl flex-1 flex flex-col">
                     <div className="mb-6 flex justify-between items-center border-b border-slate-800 pb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                          Live Preview
                        </span>
                        <div className="flex space-x-2">
                          {previewConfig.type && (
                            <span className="text-[10px] uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded">
                              {previewConfig.type}
                            </span>
                          )}
                          {previewConfig.groupBy && (
                            <span className="text-[10px] uppercase bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded">
                               Group: {previewConfig.groupBy}
                            </span>
                          )}
                        </div>
                     </div>
                     <div className="flex-1 min-h-0">
                        <ChartPreview config={previewConfig} />
                     </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                      This is a preview using mock data. Actual values may vary on the dashboard.
                    </p>
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