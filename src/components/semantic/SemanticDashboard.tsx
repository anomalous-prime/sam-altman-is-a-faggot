"use client";

import { useState, useEffect } from "react";
import { Brain, Search, Zap, BarChart3, Activity, Target, Layers, Clock, TrendingUp, Cpu } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
// import { Embedding, SemanticStats, SemanticResult } from "@/types/api";

// Mock types
interface Embedding {
  id: string;
  content_id: string;
  content_type: string;
  vector: number[];
  model: string;
  created_at: string;
  metadata?: Record<string, any>;
}

interface SemanticStats {
  totalEmbeddings: number;
  processingQueue: number;
  averageProcessingTime: number;
  recentQueries: number;
  modelDistribution: Array<{
    model: string;
    count: number;
    average_score: number;
  }>;
}

interface SemanticResult {
  content_id: string;
  content_type: string;
  content: any;
  score: number;
  embedding?: Embedding;
}

// Mock data
const mockEmbeddings: Embedding[] = [
  {
    id: '1',
    content_id: 'file_1',
    content_type: 'file',
    vector: [0.1, 0.2, -0.3, 0.4, -0.5, 0.6, -0.7, 0.8, 0.9, -1.0, 0.11, 0.22, -0.33, 0.44, -0.55, 0.66],
    model: 'text-embedding-ada-002',
    created_at: '2024-06-20T10:00:00Z',
    metadata: { filename: 'project-overview.pdf', size: 2048576 }
  },
  {
    id: '2',
    content_id: 'area_1',
    content_type: 'area',
    vector: [0.15, -0.25, 0.35, -0.45, 0.55, -0.65, 0.75, -0.85, 0.95, 0.05, -0.15, 0.25, -0.35, 0.45, -0.55, 0.65],
    model: 'text-embedding-ada-002',
    created_at: '2024-06-19T15:30:00Z',
    metadata: { name: 'React Development', cluster: 'Frontend' }
  },
  {
    id: '3',
    content_id: 'cluster_1',
    content_type: 'cluster',
    vector: [-0.1, 0.2, 0.3, -0.4, 0.5, 0.6, -0.7, 0.8, -0.9, 1.0, -0.11, 0.22, 0.33, -0.44, 0.55, -0.66],
    model: 'text-embedding-ada-002',
    created_at: '2024-06-18T12:00:00Z',
    metadata: { name: 'Technology', level: 0 }
  },
  {
    id: '4',
    content_id: 'tag_1',
    content_type: 'tag',
    vector: [0.2, -0.1, 0.4, -0.3, 0.6, -0.5, 0.8, -0.7, 1.0, -0.9, 0.12, -0.11, 0.14, -0.13, 0.16, -0.15],
    model: 'sentence-transformers',
    created_at: '2024-06-17T09:15:00Z',
    metadata: { name: 'React', color: '#61DAFB' }
  }
];

const mockStats: SemanticStats = {
  totalEmbeddings: 4,
  processingQueue: 0,
  averageProcessingTime: 250,
  recentQueries: 15,
  modelDistribution: [
    { model: 'text-embedding-ada-002', count: 3, average_score: 0.85 },
    { model: 'sentence-transformers', count: 1, average_score: 0.78 }
  ]
};

const mockSearchResults: SemanticResult[] = [
  {
    content_id: 'file_1',
    content_type: 'file',
    content: { name: 'project-overview.pdf', type: 'document', description: 'Project overview and specifications' },
    score: 0.92,
    embedding: mockEmbeddings[0]
  },
  {
    content_id: 'area_1',
    content_type: 'area',
    content: { name: 'React Development', cluster: 'Frontend', tags: ['react', 'javascript', 'frontend'] },
    score: 0.87,
    embedding: mockEmbeddings[1]
  },
  {
    content_id: 'tag_1',
    content_type: 'tag',
    content: { name: 'React', color: '#61DAFB', description: 'JavaScript library for building user interfaces' },
    score: 0.82,
    embedding: mockEmbeddings[3]
  }
];

export default function SemanticDashboard() {
  const [embeddings, setEmbeddings] = useState<Embedding[]>([]);
  const [stats, setStats] = useState<SemanticStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SemanticResult[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'embeddings' | 'stats'>('search');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('');

  useEffect(() => {
    loadSemanticData();
  }, []);

  const loadSemanticData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setEmbeddings(mockEmbeddings);
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load semantic data');
      console.error('Failed to load semantic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock results based on content type filter
      let results = mockSearchResults;
      if (contentTypeFilter) {
        results = results.filter(result => result.content_type === contentTypeFilter);
      }
      
      // Simulate relevance scoring based on query
      const queryLower = searchQuery.toLowerCase();
      results = results.map(result => ({
        ...result,
        score: Math.max(0.5, result.score - Math.random() * 0.3) // Add some variation
      })).filter(result => {
        // Simple mock search logic
        const contentStr = JSON.stringify(result.content).toLowerCase();
        return contentStr.includes(queryLower) || queryLower.includes('react') || queryLower.includes('file') || queryLower.includes('project');
      });
      
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleCreateEmbedding = async (contentId: string, contentType: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add a new mock embedding
      const newEmbedding: Embedding = {
        id: Date.now().toString(),
        content_id: contentId,
        content_type: contentType,
        vector: Array.from({ length: 16 }, () => Math.random() * 2 - 1), // Random vector
        model: 'text-embedding-ada-002',
        created_at: new Date().toISOString(),
        metadata: { created_by: 'user', manual: true }
      };
      
      mockEmbeddings.push(newEmbedding);
      await loadSemanticData();
    } catch (err) {
      console.error('Failed to create embedding:', err);
      setError(err instanceof Error ? err.message : 'Failed to create embedding');
    }
  };

  const formatVector = (vector: number[]) => {
    if (vector.length <= 8) {
      return `[${vector.map(v => v.toFixed(3)).join(', ')}]`;
    }
    return `[${vector.slice(0, 4).map(v => v.toFixed(3)).join(', ')}, ..., ${vector.slice(-4).map(v => v.toFixed(3)).join(', ')}]`;
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'file': return 'text-green-400';
      case 'area': return 'text-cyan-400';
      case 'cluster': return 'text-purple-400';
      case 'tag': return 'text-pink-400';
      default: return 'text-slate-400';
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'file': return 'F';
      case 'area': return 'A';
      case 'cluster': return 'C';
      case 'tag': return 'T';
      default: return '?';
    }
  };

  const renderSearch = () => (
    <div className="space-y-6">
      <div className="glass rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Semantic Search</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter your search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="file">Files</option>
              <option value="area">Areas</option>
              <option value="cluster">Clusters</option>
              <option value="tag">Tags</option>
            </select>
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{searching ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Search Results</h3>
          {searchResults.map((result, index) => (
            <div key={`${result.content_id}-${index}`} className="glass rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center ${getContentTypeColor(result.content_type)}`}>
                    <span className="font-bold">{getContentTypeIcon(result.content_type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white">Content ID: {result.content_id}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${getContentTypeColor(result.content_type)} bg-current/20`}>
                        {result.content_type}
                      </span>
                    </div>
                    <div className="text-sm text-slate-300 mb-2">
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(result.content, null, 2)}
                      </pre>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Similarity Score: {(result.score * 100).toFixed(1)}%</span>
                      {result.embedding && (
                        <span>Model: {result.embedding.model}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-400">
                    {Math.round(result.score * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">Match</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !searching && (
        <div className="glass rounded-lg p-8 text-center">
          <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No results found</h3>
          <p className="text-slate-500">Try adjusting your search query or content type filter</p>
        </div>
      )}
    </div>
  );

  const renderEmbeddings = () => (
    <div className="space-y-4">
      {embeddings.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No embeddings found</h3>
          <p className="text-slate-500 mb-4">Create embeddings to enable semantic search</p>
          <button
            onClick={() => {
              // TODO: Open create embedding modal
              console.log('Create embedding');
            }}
            className="btn-primary"
          >
            Create Embedding
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {embeddings.map(embedding => (
            <div key={embedding.id} className="glass rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center ${getContentTypeColor(embedding.content_type)}`}>
                    <span className="font-bold text-xs">{getContentTypeIcon(embedding.content_type)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">ID: {embedding.id}</h4>
                    <p className="text-sm text-slate-400">Content: {embedding.content_id}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getContentTypeColor(embedding.content_type)} bg-current/20`}>
                  {embedding.content_type}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="text-slate-300 font-mono">{embedding.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vector Size:</span>
                  <span className="text-slate-300">{embedding.vector.length} dimensions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-slate-300">{new Date(embedding.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="text-xs text-slate-500">
                  <span className="text-slate-400">Vector Preview:</span>
                  <div className="mt-1 font-mono text-slate-400 truncate">
                    {formatVector(embedding.vector)}
                  </div>
                </div>
              </div>

              {embedding.metadata && Object.keys(embedding.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs">
                    <span className="text-slate-400">Metadata:</span>
                    <pre className="mt-1 text-slate-500 font-mono text-xs">
                      {JSON.stringify(embedding.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStats = () => {
    if (!stats) return <div className="text-center text-slate-400">Loading stats...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass rounded-lg p-6 text-center">
            <Layers className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{stats.totalEmbeddings}</div>
            <div className="text-sm text-slate-400">Total Embeddings</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <Activity className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{stats.processingQueue}</div>
            <div className="text-sm text-slate-400">Processing Queue</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <Clock className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{stats.averageProcessingTime}ms</div>
            <div className="text-sm text-slate-400">Avg Processing Time</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{stats.recentQueries}</div>
            <div className="text-sm text-slate-400">Recent Queries</div>
          </div>
        </div>

        {stats.modelDistribution && stats.modelDistribution.length > 0 && (
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Model Distribution</h3>
            <div className="space-y-4">
              {stats.modelDistribution.map(modelStat => (
                <div key={modelStat.model} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Cpu className="w-5 h-5 text-pink-400" />
                    <span className="text-slate-300 font-mono">{modelStat.model}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${(modelStat.count / stats.totalEmbeddings) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right min-w-0">
                      <div className="text-sm font-bold text-white">{modelStat.count}</div>
                      <div className="text-xs text-slate-400">Score: {modelStat.average_score.toFixed(3)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Embeddings:</span>
                <span className="text-white font-semibold">{stats.totalEmbeddings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Processing Time:</span>
                <span className="text-white font-semibold">{stats.averageProcessingTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Queue Size:</span>
                <span className={`font-semibold ${stats.processingQueue > 10 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.processingQueue}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recent Activity:</span>
                <span className="text-white font-semibold">{stats.recentQueries} queries</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Processing Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  stats.processingQueue === 0 
                    ? 'text-green-300 bg-green-500/20' 
                    : 'text-yellow-300 bg-yellow-500/20'
                }`}>
                  {stats.processingQueue === 0 ? 'Idle' : 'Processing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Model Health:</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium text-green-300 bg-green-500/20">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vector Store:</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium text-green-300 bg-green-500/20">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading semantic data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Failed to Load Semantic Service</h3>
        <p className="text-slate-400 mb-4">{error}</p>
        <button onClick={loadSemanticData} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display gradient-text">Semantic Analysis</h1>
          <p className="text-slate-400 mt-1">AI-powered semantic search and embeddings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              // TODO: Create embedding modal
              console.log('Create embedding');
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Create Embedding</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-lg">
        <div className="flex border-b border-white/10">
          {[
            { key: 'search', label: 'Semantic Search', icon: Search },
            { key: 'embeddings', label: 'Embeddings', icon: Layers },
            { key: 'stats', label: 'Statistics', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-white border-b-2 border-pink-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'search' && renderSearch()}
          {activeTab === 'embeddings' && renderEmbeddings()}
          {activeTab === 'stats' && renderStats()}
        </div>
      </div>
    </div>
  );
}