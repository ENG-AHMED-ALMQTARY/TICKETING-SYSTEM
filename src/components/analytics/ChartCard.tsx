import React, { useState } from 'react';
import { Edit2, Trash2, MoreVertical, Maximize2 } from 'lucide-react';
import { ChartConfig } from '../../types';
import { ChartPreview } from './ChartPreview';
import { Card } from '../ui/Base';

interface ChartCardProps {
  config: ChartConfig;
  onEdit: (config: ChartConfig) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
  globalFilters?: Record<string, any>;
}

export const ChartCard: React.FC<ChartCardProps> = ({ config, onEdit, onDelete, canManage, globalFilters }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="h-96 flex flex-col relative group overflow-hidden border border-slate-700 hover:border-indigo-500/50 transition-colors">
      <div className="flex justify-between items-start mb-4 z-10">
        <div className="flex-1 mr-4">
           <h3 className="text-lg font-bold text-white truncate">{config.title}</h3>
           {config.description && <p className="text-xs text-slate-400 mt-1 truncate">{config.description}</p>}
           <div className="flex space-x-2 mt-2">
             <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
               {config.groupBy || 'Total'}
             </span>
             <span className="text-[10px] uppercase tracking-wider bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
               {config.metric.replace('_', ' ')}
             </span>
           </div>
        </div>
        
        {canManage && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-500 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button 
                    onClick={() => { onEdit(config); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                  </button>
                  <button 
                    onClick={() => { onDelete(config.id); setShowMenu(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0 relative">
        <ChartPreview config={config} globalFilters={globalFilters} />
      </div>
    </Card>
  );
};