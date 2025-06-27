"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Search, Grid } from 'lucide-react';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import ViewToggle, { ViewType } from '@/components/ui/ViewToggle';
import { Area, Cluster } from '@/types/api';

interface AreasViewProps {
  areas: Area[];
  clusters: Cluster[];
  onCreateArea: () => void;
  onEditArea: (area: Area) => void;
  onDeleteArea: (area: Area) => void;
}

const AreasView: React.FC<AreasViewProps> = ({
  areas,
  clusters,
  onCreateArea,
  onEditArea,
  onDeleteArea
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [view, setView] = useState<ViewType>('grid');

  // Create cluster lookup map
  const clusterMap = useMemo(() => {
    const map = new Map<string, Cluster>();
    clusters.forEach(cluster => {
      map.set(cluster.uid, cluster);
    });
    return map;
  }, [clusters]);

  // Filter areas based on search and cluster selection
  const filteredAreas = useMemo(() => {
    return areas.filter(area => {
      const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           area.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCluster = selectedCluster === 'all' || area.cluster_uid === selectedCluster;
      return matchesSearch && matchesCluster;
    });
  }, [areas, searchQuery, selectedCluster]);

  // Group areas by cluster
  const groupedAreas = useMemo(() => {
    const groups = new Map<string, Area[]>();
    
    filteredAreas.forEach(area => {
      const clusterUid = area.cluster_uid;
      if (!groups.has(clusterUid)) {
        groups.set(clusterUid, []);
      }
      groups.get(clusterUid)!.push(area);
    });

    // Sort areas within each group by sort_order
    groups.forEach(areas => {
      areas.sort((a, b) => a.sort_order - b.sort_order);
    });

    return groups;
  }, [filteredAreas]);

  const renderListView = () => {
    return (
      <div className="space-y-4">
        {Array.from(groupedAreas.entries()).map(([clusterUid, clusterAreas]) => {
          const cluster = clusterMap.get(clusterUid);
          return (
            <div key={clusterUid} className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
              {cluster && (
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-white">{cluster.name}</h3>
                  <span className="text-sm text-slate-400">{cluster.path}</span>
                  <StatusBadge status={cluster.status} />
                </div>
              )}
              
              <div className="space-y-2">
                {clusterAreas.map(area => (
                  <div
                    key={area.uid}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-medium text-white">{area.name}</h4>
                        <span className="text-xs text-slate-500">Order: {area.sort_order}</span>
                        {area.tag_count !== undefined && (
                          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                            {area.tag_count} tags
                          </span>
                        )}
                      </div>
                      {area.description && (
                        <p className="text-xs text-slate-400 mt-1">{area.description}</p>
                      )}
                      <span className="text-xs text-slate-500">ID: {area.uid}</span>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                      <button
                        onClick={() => onEditArea(area)}
                        className="p-2 hover:bg-slate-600 rounded transition-colors"
                        title="Edit area"
                      >
                        <Edit3 className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => onDeleteArea(area)}
                        className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                        title="Delete area"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Areas Management</h2>
          <p className="text-slate-400">Organize content areas within clusters</p>
        </div>
        <div className="flex items-center space-x-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            onClick={onCreateArea}
            icon={<Plus className="w-4 h-4" />}
          >
            New Area
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search areas..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCluster}
          onChange={(e) => setSelectedCluster(e.target.value)}
          className="px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-48"
        >
          <option value="all">All Clusters</option>
          {clusters.map(cluster => (
            <option key={cluster.uid} value={cluster.uid}>
              {cluster.path} - {cluster.name}
            </option>
          ))}
        </select>
      </div>

      {/* Areas Content */}
      {filteredAreas.length === 0 ? (
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">
              {searchQuery || selectedCluster !== 'all' ? 'No areas match your filters' : 'No areas found'}
            </h3>
            <p className="text-slate-500 mb-4">
              {searchQuery || selectedCluster !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first area to get started'
              }
            </p>
            {!searchQuery && selectedCluster === 'all' && (
              <Button onClick={onCreateArea}>
                Create Area
              </Button>
            )}
          </div>
        </div>
      ) : view === 'list' ? (
        renderListView()
      ) : (
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="divide-y divide-slate-700/50">
            {Array.from(groupedAreas.entries()).map(([clusterUid, clusterAreas]) => {
              const cluster = clusterMap.get(clusterUid);
              return (
                <div key={clusterUid} className="p-6">
                  {cluster && (
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-lg font-semibold text-white">{cluster.name}</h3>
                      <span className="text-sm text-slate-400">{cluster.path}</span>
                      <StatusBadge status={cluster.status} />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clusterAreas.map(area => (
                      <div
                        key={area.uid}
                        className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate mb-1">
                              {area.name}
                            </h4>
                            <p className="text-xs text-slate-400">
                              Order: {area.sort_order}
                            </p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2">
                            <button
                              onClick={() => onEditArea(area)}
                              className="p-1 hover:bg-slate-600 rounded transition-colors"
                              title="Edit area"
                            >
                              <Edit3 className="w-3 h-3 text-slate-400" />
                            </button>
                            <button
                              onClick={() => onDeleteArea(area)}
                              className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                              title="Delete area"
                            >
                              <Trash2 className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        </div>
                        
                        {area.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {area.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            ID: {area.uid}
                          </span>
                          {area.tag_count !== undefined && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                              {area.tag_count} tags
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AreasView;