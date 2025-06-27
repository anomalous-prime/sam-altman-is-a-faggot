"use client";

import { useState, useEffect } from "react";
import { Database, Upload, Download, Trash2, Eye, FileText, Image, Music, Video, Archive, Search, Filter, Grid, List, BarChart3 } from "lucide-react";
// import { apiClient } from "@/lib/api-client";
// import { StorageFile, StorageStats, StorageFilters } from "@/types/api";

// Mock types
interface StorageFile {
  id: string;
  name: string;
  size: number;
  mime_type: string;
  status: 'active' | 'archived' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  recentUploads: number;
  storageUsage: number;
  fileTypes: Array<{
    mime_type: string;
    count: number;
    total_size: number;
  }>;
  sizeDistribution: Array<{
    range: string;
    count: number;
    size: number;
  }>;
}

interface StorageFilters {
  mime_type?: string;
  status?: string;
  search?: string;
}

// Mock data
const mockFiles: StorageFile[] = [
  {
    id: '1',
    name: 'project-overview.pdf',
    size: 2048576,
    mime_type: 'application/pdf',
    status: 'active',
    created_at: '2024-06-20T10:00:00Z',
    updated_at: '2024-06-20T10:00:00Z'
  },
  {
    id: '2',
    name: 'dashboard-mockup.png',
    size: 1024768,
    mime_type: 'image/png',
    status: 'active',
    created_at: '2024-06-19T15:30:00Z',
    updated_at: '2024-06-19T15:30:00Z'
  },
  {
    id: '3',
    name: 'demo-video.mp4',
    size: 15728640,
    mime_type: 'video/mp4',
    status: 'active',
    created_at: '2024-06-18T12:00:00Z',
    updated_at: '2024-06-18T12:00:00Z'
  },
  {
    id: '4',
    name: 'data-export.csv',
    size: 512000,
    mime_type: 'text/csv',
    status: 'archived',
    created_at: '2024-06-15T09:00:00Z',
    updated_at: '2024-06-15T09:00:00Z'
  },
  {
    id: '5',
    name: 'background-music.mp3',
    size: 8192000,
    mime_type: 'audio/mp3',
    status: 'active',
    created_at: '2024-06-14T14:20:00Z',
    updated_at: '2024-06-14T14:20:00Z'
  }
];

const mockStats: StorageStats = {
  totalFiles: 5,
  totalSize: 27505984,
  recentUploads: 3,
  storageUsage: 45.2,
  fileTypes: [
    { mime_type: 'image/png', count: 1, total_size: 1024768 },
    { mime_type: 'application/pdf', count: 1, total_size: 2048576 },
    { mime_type: 'video/mp4', count: 1, total_size: 15728640 },
    { mime_type: 'text/csv', count: 1, total_size: 512000 },
    { mime_type: 'audio/mp3', count: 1, total_size: 8192000 }
  ],
  sizeDistribution: [
    { range: '< 1MB', count: 2, size: 1536768 },
    { range: '1-10MB', count: 2, size: 10240576 },
    { range: '> 10MB', count: 1, size: 15728640 }
  ]
};

export default function StorageDashboard() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'files' | 'stats'>('files');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StorageFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, [filters, searchTerm]);

  const loadStorageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter files based on search and filters
      let filteredFiles = mockFiles;
      
      if (searchTerm) {
        filteredFiles = filteredFiles.filter(file => 
          file.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filters.mime_type) {
        filteredFiles = filteredFiles.filter(file => file.mime_type === filters.mime_type);
      }
      
      if (filters.status) {
        filteredFiles = filteredFiles.filter(file => file.status === filters.status);
      }

      setFiles(filteredFiles);
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load storage data');
      console.error('Failed to load storage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add mock file to the list
      const newFile: StorageFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        mime_type: file.type,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockFiles.unshift(newFile);
      await loadStorageData();
    } catch (err) {
      console.error('Failed to upload file:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove file from mock data
      const index = mockFiles.findIndex(f => f.id === fileId);
      if (index > -1) {
        mockFiles.splice(index, 1);
      }
      
      await loadStorageData();
    } catch (err) {
      console.error('Failed to delete file:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Video;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType.includes('archive') || mimeType.includes('zip')) return Archive;
    return FileText;
  };

  const getFileTypeColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'text-green-400';
    if (mimeType.startsWith('video/')) return 'text-red-400';
    if (mimeType.startsWith('audio/')) return 'text-purple-400';
    if (mimeType.includes('pdf')) return 'text-red-500';
    if (mimeType.includes('text')) return 'text-blue-400';
    return 'text-slate-400';
  };

  const renderFileGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map(file => {
        const FileIcon = getFileIcon(file.mime_type);
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <div
            key={file.id}
            className={`glass rounded-lg p-4 cursor-pointer transition-all duration-200 hover:glass-strong ${
              isSelected ? 'ring-2 ring-cyan-500' : ''
            }`}
            onClick={() => {
              if (isSelected) {
                setSelectedFiles(prev => prev.filter(id => id !== file.id));
              } else {
                setSelectedFiles(prev => [...prev, file.id]);
              }
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <FileIcon className={`w-8 h-8 ${getFileTypeColor(file.mime_type)}`} />
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Preview file
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold text-white mb-1 truncate" title={file.name}>
              {file.name}
            </h3>
            
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="truncate ml-2">{file.mime_type.split('/')[1]}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`px-1 rounded ${
                  file.status === 'active' ? 'status-active' : 
                  file.status === 'archived' ? 'status-archived' : 'status-inactive'
                }`}>
                  {file.status}
                </span>
              </div>
            </div>
            
            <div className="mt-3 pt-2 border-t border-white/10">
              <div className="text-xs text-slate-500">
                {new Date(file.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderFileList = () => (
    <div className="space-y-2">
      {files.map(file => {
        const FileIcon = getFileIcon(file.mime_type);
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <div
            key={file.id}
            className={`glass rounded-lg p-4 cursor-pointer transition-all duration-200 hover:glass-strong ${
              isSelected ? 'ring-2 ring-cyan-500' : ''
            }`}
            onClick={() => {
              if (isSelected) {
                setSelectedFiles(prev => prev.filter(id => id !== file.id));
              } else {
                setSelectedFiles(prev => [...prev, file.id]);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <FileIcon className={`w-6 h-6 ${getFileTypeColor(file.mime_type)} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{file.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.mime_type}</span>
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      file.status === 'active' ? 'status-active' : 
                      file.status === 'archived' ? 'status-archived' : 'status-inactive'
                    }`}>
                      {file.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Preview file
                  }}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Download file
                  }}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderStats = () => {
    if (!stats) return <div className="text-center text-slate-400">Loading stats...</div>;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass rounded-lg p-6 text-center">
            <Database className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{stats.totalFiles}</div>
            <div className="text-sm text-slate-400">Total Files</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <Archive className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{formatFileSize(stats.totalSize)}</div>
            <div className="text-sm text-slate-400">Total Size</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{stats.recentUploads}</div>
            <div className="text-sm text-slate-400">Recent Uploads</div>
          </div>
          <div className="glass rounded-lg p-6 text-center">
            <BarChart3 className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <div className="text-3xl font-bold text-white">{Math.round(stats.storageUsage)}%</div>
            <div className="text-sm text-slate-400">Storage Usage</div>
          </div>
        </div>

        {stats.fileTypes && stats.fileTypes.length > 0 && (
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">File Types Distribution</h3>
            <div className="space-y-3">
              {stats.fileTypes.slice(0, 10).map(typeStats => (
                <div key={typeStats.mime_type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getFileTypeColor(typeStats.mime_type)} bg-current`}></div>
                    <span className="text-slate-300">{typeStats.mime_type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(typeStats.count / stats.totalFiles) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-400 w-12 text-right">{typeStats.count}</span>
                    <span className="text-sm text-slate-500 w-16 text-right">{formatFileSize(typeStats.total_size)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.sizeDistribution && stats.sizeDistribution.length > 0 && (
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Size Distribution</h3>
            <div className="space-y-3">
              {stats.sizeDistribution.map(sizeStats => (
                <div key={sizeStats.range} className="flex items-center justify-between">
                  <span className="text-slate-300">{sizeStats.range}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                        style={{ width: `${(sizeStats.count / stats.totalFiles) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-400 w-12 text-right">{sizeStats.count}</span>
                    <span className="text-sm text-slate-500 w-16 text-right">{formatFileSize(sizeStats.size)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400">Loading storage data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Failed to Load Storage</h3>
        <p className="text-slate-400 mb-4">{error}</p>
        <button onClick={loadStorageData} className="btn-primary">
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
          <h1 className="text-3xl font-bold font-display gradient-text">Storage Management</h1>
          <p className="text-slate-400 mt-1">Manage your files and storage resources</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="btn-primary flex items-center space-x-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {selectedFiles.length > 0 && (
            <button
              onClick={() => {
                selectedFiles.forEach(fileId => handleDeleteFile(fileId));
                setSelectedFiles([]);
              }}
              className="btn-secondary flex items-center space-x-2 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete ({selectedFiles.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors glass rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1 glass rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass rounded-lg">
        <div className="flex border-b border-white/10">
          {[
            { key: 'files', label: 'Files', icon: Database },
            { key: 'stats', label: 'Statistics', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-white border-b-2 border-cyan-500'
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
          {activeTab === 'files' && (
            <div>
              {files.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-400 mb-2">No files found</h3>
                  <p className="text-slate-500 mb-4">Upload your first file to get started</p>
                  <label className="btn-primary cursor-pointer">
                    Upload File
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                viewMode === 'grid' ? renderFileGrid() : renderFileList()
              )}
            </div>
          )}

          {activeTab === 'stats' && renderStats()}
        </div>
      </div>
    </div>
  );
}