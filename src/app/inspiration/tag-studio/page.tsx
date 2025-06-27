'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit3, Trash2, Move, Filter, Grid, List, BarChart3, Tags, TreePine, Settings, Home, ChevronRight, ChevronDown } from 'lucide-react';

// Types
interface Cluster {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  path: string;
  level: number;
  isActive: boolean;
  children?: Cluster[];
  areaCount?: number;
}

interface Area {
  id: string;
  name: string;
  slug: string;
  clusterId: string;
  clusterPath: string;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Tag {
  slug: string;
  name: string;
  color: string;
  description?: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalClusters: number;
  totalAreas: number;
  totalTags: number;
  activeAreas: number;
  maxDepth: number;
  recentActivity: number;
}

// Mock API functions (replace with actual API calls)
const mockAPI = {
  async getClusters(): Promise<Cluster[]> {
    return [
      { id: '1', name: 'Technology', slug: 'technology', path: '/technology', level: 0, isActive: true, areaCount: 15 },
      { id: '2', name: 'Web Development', slug: 'web-development', parentId: '1', path: '/technology/web-development', level: 1, isActive: true, areaCount: 8 },
      { id: '3', name: 'Frontend', slug: 'frontend', parentId: '2', path: '/technology/web-development/frontend', level: 2, isActive: true, areaCount: 5 },
      { id: '4', name: 'Backend', slug: 'backend', parentId: '2', path: '/technology/web-development/backend', level: 2, isActive: true, areaCount: 3 },
      { id: '5', name: 'Science', slug: 'science', path: '/science', level: 0, isActive: true, areaCount: 12 },
      { id: '6', name: 'Physics', slug: 'physics', parentId: '5', path: '/science/physics', level: 1, isActive: true, areaCount: 7 },
    ];
  },

  async getAreas(): Promise<Area[]> {
    return [
      { id: '1', name: 'React Development', slug: 'react-development', clusterId: '3', clusterPath: '/technology/web-development/frontend', isActive: true, tags: ['react', 'javascript', 'frontend'], createdAt: '2024-01-15', updatedAt: '2024-06-20' },
      { id: '2', name: 'Vue.js Framework', slug: 'vuejs-framework', clusterId: '3', clusterPath: '/technology/web-development/frontend', isActive: true, tags: ['vue', 'javascript', 'frontend'], createdAt: '2024-02-10', updatedAt: '2024-06-18' },
      { id: '3', name: 'Node.js Development', slug: 'nodejs-development', clusterId: '4', clusterPath: '/technology/web-development/backend', isActive: true, tags: ['nodejs', 'javascript', 'backend'], createdAt: '2024-01-20', updatedAt: '2024-06-22' },
      { id: '4', name: 'Quantum Mechanics', slug: 'quantum-mechanics', clusterId: '6', clusterPath: '/science/physics', isActive: true, tags: ['quantum', 'physics', 'theory'], createdAt: '2024-03-05', updatedAt: '2024-06-19' },
      { id: '5', name: 'Database Design', slug: 'database-design', clusterId: '4', clusterPath: '/technology/web-development/backend', isActive: true, tags: ['database', 'sql', 'design'], createdAt: '2024-02-28', updatedAt: '2024-06-21' },
    ];
  },

  async getTags(): Promise<Tag[]> {
    return [
      { slug: 'react', name: 'React', color: '#61DAFB', description: 'JavaScript library for building user interfaces', usageCount: 12, isActive: true, createdAt: '2024-01-01' },
      { slug: 'javascript', name: 'JavaScript', color: '#F7DF1E', description: 'Programming language for web development', usageCount: 25, isActive: true, createdAt: '2024-01-01' },
      { slug: 'frontend', name: 'Frontend', color: '#8B5CF6', description: 'Client-side development', usageCount: 18, isActive: true, createdAt: '2024-01-01' },
      { slug: 'backend', name: 'Backend', color: '#6366F1', description: 'Server-side development', usageCount: 15, isActive: true, createdAt: '2024-01-01' },
      { slug: 'vue', name: 'Vue.js', color: '#4FC08D', description: 'Progressive JavaScript framework', usageCount: 8, isActive: true, createdAt: '2024-01-05' },
      { slug: 'nodejs', name: 'Node.js', color: '#339933', description: 'JavaScript runtime environment', usageCount: 10, isActive: true, createdAt: '2024-01-02' },
      { slug: 'quantum', name: 'Quantum', color: '#EC4899', description: 'Quantum physics and mechanics', usageCount: 5, isActive: true, createdAt: '2024-01-10' },
      { slug: 'physics', name: 'Physics', color: '#F59E0B', description: 'Physical sciences', usageCount: 12, isActive: true, createdAt: '2024-01-01' },
      { slug: 'database', name: 'Database', color: '#10B981', description: 'Data storage and management', usageCount: 7, isActive: true, createdAt: '2024-01-03' },
      { slug: 'sql', name: 'SQL', color: '#3B82F6', description: 'Structured Query Language', usageCount: 6, isActive: true, createdAt: '2024-01-04' },
    ];
  },

  async getStats(): Promise<DashboardStats> {
    return {
      totalClusters: 6,
      totalAreas: 24,
      totalTags: 15,
      activeAreas: 22,
      maxDepth: 3,
      recentActivity: 8
    };
  }
};

// Tree Builder Component
const TreeBuilder: React.FC<{ clusters: Cluster[] }> = ({ clusters }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '2', '5']));
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const buildTree = (clusters: Cluster[]): Cluster[] => {
    const map = new Map<string, Cluster>();
    const roots: Cluster[] = [];

    clusters.forEach(cluster => {
      map.set(cluster.id, { ...cluster, children: [] });
    });

    clusters.forEach(cluster => {
      const node = map.get(cluster.id)!;
      if (cluster.parentId) {
        const parent = map.get(cluster.parentId);
        if (parent) {
          parent.children!.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const renderTreeNode = (node: Cluster, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 group ${
            isSelected ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30' : ''
          }`}
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
          onClick={() => setSelectedNode(node.id)}
        >
          <div className="flex items-center flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpanded(node.id);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors mr-1"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6 mr-1" />
            )}
            
            <TreePine className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="text-sm font-medium text-slate-200 truncate">{node.name}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full flex-shrink-0">
                  {node.areaCount || 0}
                </span>
              </div>
              <div className="text-xs text-slate-500 truncate">{node.path}</div>
            </div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Edit3 className="w-3 h-3 text-slate-400" />
            </button>
            <button className="p-1 hover:bg-white/10 rounded transition-colors">
              <Plus className="w-3 h-3 text-slate-400" />
            </button>
            <button className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors">
              <Trash2 className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 border-l border-slate-700/50">
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(clusters);

  return (
    <div className="h-full bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-200">Cluster Tree</h3>
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Cluster</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 h-96 overflow-y-auto">
        <div className="space-y-1">
          {tree.map(node => renderTreeNode(node))}
        </div>
      </div>
    </div>
  );
};

// Area Grid Component
const AreaGrid: React.FC<{ areas: Area[], tags: Tag[] }> = ({ areas, tags }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const filteredAreas = useMemo(() => {
    return areas.filter(area => {
      const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           area.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCluster = selectedCluster === 'all' || area.clusterId === selectedCluster;
      const matchesTags = selectedTags.size === 0 || 
                         Array.from(selectedTags).every(tag => area.tags.includes(tag));
      
      return matchesSearch && matchesCluster && matchesTags;
    });
  }, [areas, searchQuery, selectedCluster, selectedTags]);

  const getTagInfo = (tagSlug: string) => tags.find(t => t.slug === tagSlug);

  const toggleTagFilter = (tagSlug: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tagSlug)) {
      newTags.delete(tagSlug);
    } else {
      newTags.add(tagSlug);
    }
    setSelectedTags(newTags);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded transition-colors ${view === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded transition-colors ${view === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Area</span>
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 8).map(tag => (
          <button
            key={tag.slug}
            onClick={() => toggleTagFilter(tag.slug)}
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              selectedTags.has(tag.slug)
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      {/* Areas Display */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAreas.map(area => (
            <div key={area.id} className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-200 group">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{area.name}</h4>
                    <p className="text-xs text-slate-500 truncate">{area.clusterPath}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {area.tags.map(tagSlug => {
                    const tag = getTagInfo(tagSlug);
                    return tag ? (
                      <span
                        key={tagSlug}
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          border: `1px solid ${tag.color}40`
                        }}
                      >
                        {tag.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Cluster</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Tags</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredAreas.map(area => (
                  <tr key={area.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-slate-200">{area.name}</div>
                        <div className="text-xs text-slate-500">{area.slug}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-300">{area.clusterPath}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {area.tags.slice(0, 3).map(tagSlug => {
                          const tag = getTagInfo(tagSlug);
                          return tag ? (
                            <span
                              key={tagSlug}
                              className="px-2 py-1 text-xs rounded-full"
                              style={{ 
                                backgroundColor: `${tag.color}20`,
                                color: tag.color,
                                border: `1px solid ${tag.color}40`
                              }}
                            >
                              {tag.name}
                            </span>
                          ) : null;
                        })}
                        {area.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded-full">
                            +{area.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{area.updatedAt}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-white/10 rounded transition-colors">
                        <Edit3 className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Tag Studio Component
const TagStudio: React.FC<{ tags: Tag[] }> = ({ tags }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'created'>('usage');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const filteredAndSortedTags = useMemo(() => {
    let filtered = tags.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [tags, searchQuery, sortBy]);

  const toggleTagSelection = (tagSlug: string) => {
    const newSelection = new Set(selectedTags);
    if (newSelection.has(tagSlug)) {
      newSelection.delete(tagSlug);
    } else {
      newSelection.add(tagSlug);
    }
    setSelectedTags(newSelection);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'usage' | 'created')}
            className="px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="usage">Sort by Usage</option>
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created</option>
          </select>
          
          <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Tag</span>
          </button>
        </div>
      </div>

      {/* Tag Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAndSortedTags.map(tag => (
          <div 
            key={tag.slug}
            className={`bg-slate-900/50 rounded-xl border backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-200 cursor-pointer group ${
              selectedTags.has(tag.slug) ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-slate-700/50'
            }`}
            onClick={() => toggleTagSelection(tag.slug)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 border-2"
                  style={{ 
                    backgroundColor: tag.color,
                    borderColor: tag.color
                  }}
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-white/10 rounded transition-colors">
                    <Edit3 className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-slate-200 mb-1">{tag.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{tag.description || 'No description'}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Used {tag.usageCount} times</span>
                <span 
                  className="px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${tag.color}20`,
                    color: tag.color
                  }}
                >
                  {tag.slug}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedTags.size > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-300">
              {selectedTags.size} tag{selectedTags.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                Delete
              </button>
              <button 
                onClick={() => setSelectedTags(new Set())}
                className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Statistics Dashboard Component
const StatsDashboard: React.FC<{ stats: DashboardStats, clusters: Cluster[], areas: Area[], tags: Tag[] }> = ({ stats, clusters, areas, tags }) => {
  const topTags = [...tags]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5);

  const recentAreas = [...areas]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-400/30 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Clusters</p>
              <p className="text-2xl font-bold text-slate-200">{stats.totalClusters}</p>
            </div>
            <TreePine className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-400/30 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Areas</p>
              <p className="text-2xl font-bold text-slate-200">{stats.totalAreas}</p>
            </div>
            <Grid className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-400/30 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Tags</p>
              <p className="text-2xl font-bold text-slate-200">{stats.totalTags}</p>
            </div>
            <Tags className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Max Depth</p>
              <p className="text-2xl font-bold text-slate-200">{stats.maxDepth}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tags */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Most Used Tags</h3>
          <div className="space-y-3">
            {topTags.map((tag, index) => (
              <div key={tag.slug} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-400 w-4">#{index + 1}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm text-slate-200">{tag.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-400">{tag.usageCount} uses</span>
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        backgroundColor: tag.color,
                        width: `${(tag.usageCount / topTags[0].usageCount) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {recentAreas.map(area => (
              <div key={area.id} className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{area.name}</p>
                  <p className="text-xs text-slate-500 truncate">{area.clusterPath}</p>
                </div>
                <div className="text-xs text-slate-400">{area.updatedAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const TaxonomyDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'clusters' | 'areas' | 'tags' | 'analytics'>('overview');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClusters: 0,
    totalAreas: 0,
    totalTags: 0,
    activeAreas: 0,
    maxDepth: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clustersData, areasData, tagsData, statsData] = await Promise.all([
          mockAPI.getClusters(),
          mockAPI.getAreas(),
          mockAPI.getTags(),
          mockAPI.getStats()
        ]);
        
        setClusters(clustersData);
        setAreas(areasData);
        setTags(tagsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'clusters', label: 'Clusters', icon: TreePine },
    { id: 'areas', label: 'Areas', icon: Grid },
    { id: 'tags', label: 'Tags', icon: Tags },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading taxonomy dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  NightForge Taxonomy
                </h1>
                <p className="text-xs text-slate-500">Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
              <div className="space-y-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeView === item.id
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-indigo-300'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeView === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Dashboard Overview</h2>
                  <p className="text-slate-400">Monitor your taxonomy health and performance metrics</p>
                </div>
                <StatsDashboard stats={stats} clusters={clusters} areas={areas} tags={tags} />
              </div>
            )}

            {activeView === 'clusters' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Cluster Management</h2>
                  <p className="text-slate-400">Organize your taxonomy hierarchy with drag-and-drop cluster management</p>
                </div>
                <TreeBuilder clusters={clusters} />
              </div>
            )}

            {activeView === 'areas' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Area Management</h2>
                  <p className="text-slate-400">Browse, search, and manage all areas in your taxonomy</p>
                </div>
                <AreaGrid areas={areas} tags={tags} />
              </div>
            )}

            {activeView === 'tags' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Tag Studio</h2>
                  <p className="text-slate-400">Create, organize, and manage tags with powerful bulk operations</p>
                </div>
                <TagStudio tags={tags} />
              </div>
            )}

            {activeView === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Analytics & Insights</h2>
                  <p className="text-slate-400">Deep dive into taxonomy usage patterns and performance metrics</p>
                </div>
                <StatsDashboard stats={stats} clusters={clusters} areas={areas} tags={tags} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyDashboard;