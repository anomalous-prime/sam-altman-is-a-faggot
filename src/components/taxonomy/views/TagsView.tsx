"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Search, Tags, Play, Pause } from 'lucide-react';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { Tag } from '@/types/api';

interface TagsViewProps {
  tags: Tag[];
  onCreateTag: () => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
  onToggleStatus: (tag: Tag) => void;
}

const TagsView: React.FC<TagsViewProps> = ({
  tags,
  onCreateTag,
  onEditTag,
  onDeleteTag,
  onToggleStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter tags based on search and status
  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      const matchesSearch = tag.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tag.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tag.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tags, searchQuery, statusFilter]);

  // Sort tags alphabetically by display name
  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => a.display_name.localeCompare(b.display_name));
  }, [filteredTags]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Tags Management</h2>
          <p className="text-slate-400">Manage classification tags for your content</p>
        </div>
        <Button
          onClick={onCreateTag}
          icon={<Plus className="w-4 h-4" />}
        >
          New Tag
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-32"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Tags Grid */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        {sortedTags.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tags className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              {searchQuery || statusFilter !== 'all' ? 'No tags match your filters' : 'No tags found'}
            </h3>
            <p className="text-slate-500 mb-4">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first tag to get started'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={onCreateTag}>
                Create Tag
              </Button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedTags.map(tag => (
                <div
                  key={tag.slug}
                  className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                        title={`Color: ${tag.color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {tag.display_name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">
                          {tag.slug}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={tag.status} size="sm" />
                  </div>

                  {/* Action buttons */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEditTag(tag)}
                        className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                        title="Edit tag"
                      >
                        <Edit3 className="w-3 h-3 text-slate-400" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(tag)}
                        className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                        title={tag.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {tag.status === 'active' ? (
                          <Pause className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Play className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteTag(tag)}
                        className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                        title="Delete tag"
                      >
                        <Trash2 className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                    
                    {tag.area_count !== undefined && (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full">
                        {tag.area_count} areas
                      </span>
                    )}
                  </div>

                  {/* Color preview row */}
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {tag.color}
                      </span>
                      <div
                        className="px-2 py-1 rounded text-white text-xs font-medium"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.display_name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsView;