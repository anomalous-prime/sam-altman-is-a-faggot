"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Trash2, Play, Pause, ChevronDown, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import ViewToggle, { ViewType } from '@/components/ui/ViewToggle';
import { Cluster } from '@/types/api';

interface ClustersViewProps {
  clusters: Cluster[];
  onCreateCluster: (parentCluster?: Cluster) => void;
  onEditCluster: (cluster: Cluster) => void;
  onDeleteCluster: (cluster: Cluster) => void;
  onToggleStatus: (cluster: Cluster) => void;
}

const ClustersView: React.FC<ClustersViewProps> = ({
  clusters,
  onCreateCluster,
  onEditCluster,
  onDeleteCluster,
  onToggleStatus
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [view, setView] = useState<ViewType>('list');

  // Build cluster tree
  const clusterTree = useMemo(() => {
    const map = new Map<string, Cluster & { children: Cluster[] }>();
    const roots: (Cluster & { children: Cluster[] })[] = [];

    // Initialize all clusters with empty children arrays
    clusters.forEach(cluster => {
      map.set(cluster.uid, { ...cluster, children: [] });
    });

    // Build the tree
    clusters.forEach(cluster => {
      const node = map.get(cluster.uid)!;
      if (cluster.parent_uid) {
        const parent = map.get(cluster.parent_uid);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort by sort_order
    const sortClusters = (clusters: (Cluster & { children: Cluster[] })[]) => {
      clusters.sort((a, b) => a.sort_order - b.sort_order);
      clusters.forEach(cluster => {
        if (cluster.children.length > 0) {
          sortClusters(cluster.children);
        }
      });
    };

    sortClusters(roots);
    return roots;
  }, [clusters]);

  const toggleExpanded = (uid: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(uid)) {
      newExpanded.delete(uid);
    } else {
      newExpanded.add(uid);
    }
    setExpandedNodes(newExpanded);
  };

  const renderClusterNode = (cluster: Cluster & { children: Cluster[] }, depth = 0) => {
    const hasChildren = cluster.children.length > 0;
    const isExpanded = expandedNodes.has(cluster.uid);

    return (
      <div key={cluster.uid} className="select-none">
        <div
          className="flex items-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-700/50 group"
          style={{ paddingLeft: `${depth * 1.5 + 1}rem` }}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(cluster.uid)}
                className="p-1 hover:bg-slate-600 rounded transition-colors mr-2"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6 mr-2" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-200 truncate">{cluster.name}</span>
                <StatusBadge status={cluster.status} />
                {cluster.area_count !== undefined && (
                  <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                    {cluster.area_count} areas
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <div className="text-xs text-slate-500">{cluster.path}</div>
                {cluster.description && (
                  <div className="text-xs text-slate-400 truncate">{cluster.description}</div>
                )}
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
            <button
              onClick={() => onEditCluster(cluster)}
              className="p-2 hover:bg-slate-600 rounded transition-colors"
              title="Edit cluster"
            >
              <Edit3 className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onCreateCluster(cluster)}
              className="p-2 hover:bg-slate-600 rounded transition-colors"
              title="Add child cluster"
            >
              <Plus className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => onToggleStatus(cluster)}
              className="p-2 hover:bg-slate-600 rounded transition-colors"
              title={cluster.status === 'active' ? 'Deactivate' : 'Activate'}
            >
              {cluster.status === 'active' ? (
                <Pause className="w-4 h-4 text-slate-400" />
              ) : (
                <Play className="w-4 h-4 text-slate-400" />
              )}
            </button>
            <button
              onClick={() => onDeleteCluster(cluster)}
              className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
              title="Delete cluster"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4 border-l border-slate-700/50">
            {cluster.children.map(child => renderClusterNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map(cluster => (
          <div
            key={cluster.uid}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate mb-1">
                  {cluster.name}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {cluster.path}
                </p>
              </div>
              <StatusBadge status={cluster.status} size="sm" />
            </div>
            
            {cluster.description && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                {cluster.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Order: {cluster.sort_order}
              </span>
              {cluster.area_count !== undefined && (
                <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                  {cluster.area_count} areas
                </span>
              )}
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEditCluster(cluster)}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                  title="Edit cluster"
                >
                  <Edit3 className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => onCreateCluster(cluster)}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                  title="Add child cluster"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() => onToggleStatus(cluster)}
                  className="p-1.5 hover:bg-slate-600 rounded transition-colors"
                  title={cluster.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {cluster.status === 'active' ? (
                    <Pause className="w-3 h-3 text-slate-400" />
                  ) : (
                    <Play className="w-3 h-3 text-slate-400" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteCluster(cluster)}
                  className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                  title="Delete cluster"
                >
                  <Trash2 className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Cluster Hierarchy</h2>
          <p className="text-slate-400">Manage your taxonomy structure</p>
        </div>
        <div className="flex items-center space-x-4">
          <ViewToggle view={view} onViewChange={setView} />
          <Button
            onClick={() => onCreateCluster()}
            icon={<Plus className="w-4 h-4" />}
          >
            New Root Cluster
          </Button>
        </div>
      </div>

      {clusters.length === 0 ? (
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No clusters found</h3>
            <p className="text-slate-500 mb-4">Create your first cluster to get started</p>
            <Button onClick={() => onCreateCluster()}>
              Create Cluster
            </Button>
          </div>
        </div>
      ) : view === 'grid' ? (
        renderGridView()
      ) : (
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
          <div className="p-4">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {clusterTree.map(node => renderClusterNode(node))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClustersView;