import React from 'react';
import { FileText, Image, Paperclip, Download } from 'lucide-react';

interface AttachmentPreviewProps {
  attachments: string[];
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="p-4 border border-slate-700 border-dashed rounded-lg text-center">
        <p className="text-sm text-slate-500">No attachments uploaded</p>
      </div>
    );
  }

  const getIcon = (url: string) => {
    if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')) return <Image className="w-6 h-6 text-purple-400" />;
    if (url.endsWith('.pdf')) return <FileText className="w-6 h-6 text-red-400" />;
    return <Paperclip className="w-6 h-6 text-indigo-400" />;
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Unknown File';
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {attachments.map((url, idx) => (
        <div key={idx} className="group relative bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center space-x-3 hover:border-indigo-500 transition-colors">
          <div className="p-2 bg-slate-900 rounded-lg">
            {getIcon(url)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{getFileName(url)}</p>
            <p className="text-xs text-slate-500 uppercase">{url.split('.').pop()}</p>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noreferrer"
            className="absolute right-2 top-2 p-1.5 bg-slate-700 text-slate-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 hover:text-white"
          >
            <Download className="w-3 h-3" />
          </a>
        </div>
      ))}
    </div>
  );
};