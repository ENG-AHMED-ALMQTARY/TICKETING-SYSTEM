import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { ChartConfig } from '../../types';
import { ChartPreview } from './ChartPreview';
import { Card } from '../ui/Base';

interface ChartCardProps {
  config: ChartConfig;
  onEdit: (config: ChartConfig) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({ config, onEdit, onDelete, canManage }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <Card className="h-96 flex flex-col relative group">
      <div className="flex justify-between items-start mb-4">
        <div>
           <h3 className="text-lg font-bold text-white">{config.title}</h3>
           {config.description && <p className="text-xs text-slate-400 mt-1">{config.description}</p>}
        </div>
        
        {canManage && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-500 hover:text-white p-1 rounded-md transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <div 
                className="absolute right-0 top-6 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 py-1"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button 
                  onClick={() => { onEdit(config); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center"
                >
                  <Edit2 className="w-3 h-3 mr-2" /> Edit
                </button>
                <button 
                  onClick={() => { onDelete(config.id); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0">
        <ChartPreview config={config} />
      </div>
    </Card>
  );
};