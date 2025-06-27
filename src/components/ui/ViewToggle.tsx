"use client";

import React from 'react';
import { Grid, List } from 'lucide-react';

export type ViewType = 'grid' | 'list';

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange, className = '' }) => {
  return (
    <div className={`flex items-center bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
          view === 'grid'
            ? 'bg-indigo-600 text-white'
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
        }`}
        title="Grid view"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
          view === 'list'
            ? 'bg-indigo-600 text-white'
            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'
        }`}
        title="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ViewToggle;