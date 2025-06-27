"use client";

import React, { useState, useEffect } from 'react';
import { 
  TreePine, Plus, Edit3, Search, Filter, BarChart3, Settings, 
  ChevronLeft, ChevronRight, Grid, List, Maximize2, Minimize2,
  Loader2, RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Cluster, Area, Tag, TaxonomyStats } from '@/types/api';
import TreeVisualization from './TreeVisualization';
import TaxonomyDashboard from './taxonomy/TaxonomyDashboard';
import { seedData } from '@/lib/seedData';
import { FilteredData } from '@/lib/types';

interface UnifiedTaxonomyViewProps {
  className?: string;
}

export default function UnifiedTaxonomyView({ className = '' }: UnifiedTaxonomyViewProps) {
  const [view, setView] = useState<'tree' | 'dashboard' | 'split'>('split');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState<TaxonomyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isD3Ready, setIsD3Ready] = useState(false);

  // Prepare data for TreeVisualization (using seed data format)
  const filteredData: FilteredData = {
    trees: seedData.trees,
    areas: seedData.areas,
  };

  useEffect(() => {
    // Handle D3 loading
    const checkD3 = () => {
      if ((window as any).d3) {
        setIsD3Ready(true);
      } else {
        setTimeout(checkD3, 100);
      }
    };
    checkD3();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to load from API first, fallback to seed data
      const [clustersResponse, areasResponse, tagsResponse] = await Promise.allSettled([
        apiClient.getClusters(),
        apiClient.getAreas(),
        apiClient.getTags()
      ]);

      if (clustersResponse.status === 'fulfilled' && clustersResponse.value.success) {
        setClusters(clustersResponse.value.data);
      }
      
      if (areasResponse.status === 'fulfilled' && areasResponse.value.success) {
        setAreas(areasResponse.value.data);
      }
      
      if (tagsResponse.status === 'fulfilled' && tagsResponse.value.success) {
        setTags(tagsResponse.value.data);
      }

      // Try to load stats
      try {
        const statsResponse = await apiClient.getStats();
        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
      } catch (err) {
        console.warn('Failed to load stats:', err);
      }

    } catch (err) {
      console.error('Failed to load taxonomy data:', err);
      setError('Failed to load data from API. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
    // You could use this to highlight the selected node in the dashboard
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
          <p className="text-slate-400">Loading taxonomy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full ${className}`}>
      {/* Header */}
      <div className="glass-strong rounded-t-xl p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Taxonomy Management</h2>
              <p className="text-sm text-slate-400">Interactive tree visualization with full CRUD operations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {error && (
              <div className="flex items-center space-x-2 text-amber-400 text-sm">
                <span>⚠️ {error}</span>
                <button
                  onClick={handleRefresh}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* CORS Test Button */}
            <button
              onClick={async () => {
                try {
                  const response = await apiClient.getClusters();
                  alert(`✅ CORS Success! Found ${response.data.length} clusters`);
                } catch (err) {
                  alert(`❌ CORS Error: ${err.message}`);
                }
              }}
              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-green-300 text-sm transition-colors"
            >
              🧪 Test API
            </button>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setView('tree')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === 'tree'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tree
              </button>
              <button
                onClick={() => setView('split')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === 'split'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  view === 'dashboard'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dashboard
              </button>
            </div>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white transition-colors glass rounded-lg"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-full">
        {/* Tree Visualization */}
        {(view === 'tree' || view === 'split') && (
          <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} border-r border-white/10`}>
            <div className="h-full p-4">
              <TreeVisualization 
                data={filteredData} 
                isD3Ready={isD3Ready}
                onNodeSelect={handleNodeSelect}
              />
            </div>
          </div>
        )}

        {/* Dashboard/CRUD Operations */}
        {(view === 'dashboard' || view === 'split') && (
          <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} flex`}>
            <div className="flex-1 h-full overflow-auto">
              <TaxonomyDashboard selectedNode={selectedNode} />
            </div>

            {/* Collapsible Sidebar */}
            {sidebarOpen && (
              <div className="w-80 border-l border-white/10 glass-strong p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Quick Actions</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Clusters</span>
                      <span className="text-lg font-bold text-indigo-400">
                        {clusters.length || seedData.trees.reduce((acc, tree) => acc + tree.clusters.length, 0)}
                      </span>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Areas</span>
                      <span className="text-lg font-bold text-cyan-400">
                        {areas.length || seedData.areas.length}
                      </span>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Tags</span>
                      <span className="text-lg font-bold text-pink-400">
                        {tags.length || seedData.tags.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}