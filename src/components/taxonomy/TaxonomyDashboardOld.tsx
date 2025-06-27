"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Grid,
  List,
  BarChart3,
  Tags,
  TreePine,
  Home,
  ChevronRight,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
  Play,
  Pause,
  Save
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import {
  Cluster,
  Area,
  Tag,
  TaxonomyFilters,
  CreateClusterRequest,
  UpdateClusterRequest,
  CreateAreaRequest,
  UpdateAreaRequest,
  CreateTagRequest,
  UpdateTagRequest
} from '@/types/api';

// Form Components
const ClusterForm: React.FC<{
  cluster?: Cluster;
  parentCluster?: Cluster;
  onSubmit: (data: CreateClusterRequest | UpdateClusterRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}> = ({ cluster, parentCluster, onSubmit, onCancel, isSubmitting }) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    uid: cluster?.uid || '',
    name: cluster?.name || '',
    description: cluster?.description || '',
    parent_uid: cluster?.parent_uid || parentCluster?.uid || '',
    sort_order: cluster?.sort_order || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (cluster) {
        // Update existing cluster
        await onSubmit({
          name: formData.name,
          description: formData.description || undefined,
          sort_order: formData.sort_order
        });
      } else {
        // Create new cluster
        await onSubmit({
          uid: formData.uid,
          name: formData.name,
          description: formData.description || undefined,
          parent_uid: formData.parent_uid || undefined,
          sort_order: formData.sort_order
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setFormError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
          {formError}
        </div>
      )}
      {!cluster && (
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">UID</label>
          <input
            type="text"
            value={formData.uid}
            onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., tech-001"
            required
            disabled={isSubmitting}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Cluster name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Optional description"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Sort Order</label>
        <input
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.name.trim() || (!cluster && !formData.uid.trim())}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{cluster ? 'Update' : 'Create'} Cluster</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
};

const AreaForm: React.FC<{
  area?: Area;
  clusters: Cluster[];
  onSubmit: (data: CreateAreaRequest | UpdateAreaRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}> = ({ area, clusters, onSubmit, onCancel, isSubmitting }) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    uid: area?.uid || '',
    name: area?.name || '',
    description: area?.description || '',
    cluster_uid: area?.cluster_uid || '',
    sort_order: area?.sort_order || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (area) {
        await onSubmit({
          name: formData.name,
          description: formData.description || undefined,
          sort_order: formData.sort_order
        });
      } else {
        await onSubmit({
          uid: formData.uid,
          name: formData.name,
          description: formData.description || undefined,
          cluster_uid: formData.cluster_uid,
          sort_order: formData.sort_order
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setFormError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
          {formError}
        </div>
      )}
      {!area && (
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">UID</label>
          <input
            type="text"
            value={formData.uid}
            onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., area-001"
            required
            disabled={isSubmitting}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Area name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Optional description"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {!area && (
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Cluster</label>
          <select
            value={formData.cluster_uid}
            onChange={(e) => setFormData({ ...formData, cluster_uid: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            disabled={isSubmitting}
          >
            <option value="">Select a cluster</option>
            {clusters.map(cluster => (
              <option key={cluster.uid} value={cluster.uid}>
                {cluster.path} - {cluster.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Sort Order</label>
        <input
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="0"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.name.trim() || (!area && (!formData.uid.trim() || !formData.cluster_uid))}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{area ? 'Update' : 'Create'} Area</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
};

const TagForm: React.FC<{
  tag?: Tag;
  onSubmit: (data: CreateTagRequest | UpdateTagRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}> = ({ tag, onSubmit, onCancel, isSubmitting }) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: tag?.slug || '',
    display_name: tag?.display_name || '',
    color: tag?.color || '#6366F1'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (tag) {
        await onSubmit({
          display_name: formData.display_name,
          color: formData.color || undefined
        });
      } else {
        await onSubmit({
          slug: formData.slug,
          display_name: formData.display_name,
          color: formData.color || undefined
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setFormError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm">
          {formError}
        </div>
      )}
      {!tag && (
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., react-js"
            required
            disabled={isSubmitting}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Display Name</label>
        <input
          type="text"
          value={formData.display_name}
          onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Tag display name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Color</label>
        <div className="flex space-x-3">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-12 h-10 rounded border border-slate-600 bg-slate-800"
            disabled={isSubmitting}
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="#6366F1"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !formData.display_name.trim() || (!tag && !formData.slug.trim())}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{tag ? 'Update' : 'Create'} Tag</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener for escape key
    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not any child elements
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div 
          className="relative inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-600"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 id="modal-title" className="text-lg font-medium text-white">{title}</h3>
              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                type="button"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
type View = 'overview' | 'clusters' | 'areas' | 'tags' | 'graph';

const TaxonomyDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('overview');
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [showCreateClusterModal, setShowCreateClusterModal] = useState(false);
  const [showCreateAreaModal, setShowCreateAreaModal] = useState(false);
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [parentClusterForNew, setParentClusterForNew] = useState<Cluster | null>(null);
  
  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'cluster' | 'area' | 'tag';
    item: Cluster | Area | Tag;
    show: boolean;
  } | null>(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchFilters: TaxonomyFilters = {
        search: searchTerm || undefined
      };

      const [clustersResponse, areasResponse, tagsResponse] = await Promise.all([
        apiClient.getClusters(searchFilters),
        apiClient.getAreas(searchFilters),
        apiClient.getTags(searchFilters)
      ]);

      setClusters(clustersResponse.data || []);
      setAreas(areasResponse.data.areas || []);
      setTags(tagsResponse.data.tags || []);
    } catch (err) {
      console.error('Failed to load taxonomy data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  // CRUD Operations
  const handleCreateCluster = async (data: CreateClusterRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiClient.createCluster(data);
      if (response.success) {
        await loadData();
        setShowCreateClusterModal(false);
        setParentClusterForNew(null);
        setSuccess('Cluster created successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response.message || 'Failed to create cluster');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create cluster';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCluster = async (data: UpdateClusterRequest) => {
    if (!editingCluster) return;
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiClient.updateCluster(editingCluster.uid, data);
      if (response.success) {
        await loadData();
        setEditingCluster(null);
      } else {
        throw new Error(response.message || 'Failed to update cluster');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cluster';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCluster = async (cluster: Cluster) => {
    setDeleteConfirmation({
      type: 'cluster',
      item: cluster,
      show: true
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    
    try {
      setError(null);
      const { type, item } = deleteConfirmation;
      let response;
      
      if (type === 'cluster') {
        response = await apiClient.deleteCluster((item as Cluster).uid);
      } else if (type === 'area') {
        response = await apiClient.deleteArea((item as Area).uid);
      } else if (type === 'tag') {
        response = await apiClient.deleteTag((item as Tag).slug);
      }
      
      if (response && response.success) {
        await loadData();
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response?.message || `Failed to delete ${type}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to delete ${deleteConfirmation.type}`;
      setError(errorMessage);
      console.error(`Failed to delete ${deleteConfirmation.type}:`, err);
    } finally {
      setDeleteConfirmation(null);
    }
  };

  const handleCreateArea = async (data: CreateAreaRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiClient.createArea(data);
      if (response.success) {
        await loadData();
        setShowCreateAreaModal(false);
      } else {
        throw new Error(response.message || 'Failed to create area');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create area';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateArea = async (data: UpdateAreaRequest) => {
    if (!editingArea) return;
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiClient.updateArea(editingArea.uid, data);
      if (response.success) {
        await loadData();
        setEditingArea(null);
      } else {
        throw new Error(response.message || 'Failed to update area');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update area';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArea = async (area: Area) => {
    setDeleteConfirmation({
      type: 'area',
      item: area,
      show: true
    });
  };

  const handleCreateTag = async (data: CreateTagRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiClient.createTag(data);
      if (response.success) {
        await loadData();
        setShowCreateTagModal(false);
      } else {
        throw new Error(response.message || 'Failed to create tag');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create tag';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTag = async (data: UpdateTagRequest) => {
    if (!editingTag) return;
    try {
      setSubmitting(true);
      setError(null);
      const response = await apiClient.updateTag(editingTag.slug, data);
      if (response.success) {
        await loadData();
        setEditingTag(null);
      } else {
        throw new Error(response.message || 'Failed to update tag');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tag';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    setDeleteConfirmation({
      type: 'tag',
      item: tag,
      show: true
    });
  };

  const handleStatusToggle = async (item: Cluster | Area | Tag, type: 'cluster' | 'area' | 'tag') => {
    try {
      setError(null);
      const isActive = item.status === 'active';
      const uid = 'uid' in item ? item.uid : item.slug;
      
      console.log(`Toggling ${type} status:`, { 
        type, 
        identifier: uid, 
        currentStatus: item.status, 
        isActive, 
        willBecome: isActive ? 'inactive' : 'active'
      });
      
      let response;

      if (type === 'cluster') {
        if (isActive) {
          response = await apiClient.deactivateCluster(uid);
        } else {
          response = await apiClient.activateCluster(uid);
        }
      } else if (type === 'area') {
        if (isActive) {
          response = await apiClient.deactivateArea(uid);
        } else {
          response = await apiClient.activateArea(uid);
        }
      } else if (type === 'tag') {
        console.log(`Making ${isActive ? 'deactivate' : 'activate'} API call for tag: ${uid}`);
        if (isActive) {
          response = await apiClient.deactivateTag(uid);
        } else {
          response = await apiClient.activateTag(uid);
        }
        console.log('Tag API response:', response);
      }

      if (response && response.success) {
        await loadData();
        setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} ${isActive ? 'deactivated' : 'activated'} successfully!`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(response?.message || `Failed to toggle ${type} status`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to toggle ${type} status`;
      setError(errorMessage);
      console.error(`Failed to toggle ${type} status:`, err);
    }
  };

  // Tree Component
  const ClusterTreeView: React.FC = () => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

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
            className="flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 group"
            style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
          >
            <div className="flex items-center flex-1 min-w-0">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(cluster.uid)}
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
                  <span className="text-sm font-medium text-slate-200 truncate">{cluster.name}</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                    cluster.status === 'active'
                      ? 'bg-green-500/20 text-green-300'
                      : cluster.status === 'archived'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {cluster.status}
                  </span>
                  {cluster.area_count !== undefined && (
                    <span className="ml-2 px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full flex-shrink-0">
                      {cluster.area_count} areas
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 truncate">{cluster.path}</div>
                {cluster.description && (
                  <div className="text-xs text-slate-400 truncate">{cluster.description}</div>
                )}
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
              <button
                onClick={() => setEditingCluster(cluster)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Edit cluster"
              >
                <Edit3 className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setParentClusterForNew(cluster);
                  setShowCreateClusterModal(true);
                }}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Add child cluster"
              >
                <Plus className="w-3 h-3 text-slate-400" />
              </button>
              <button
                onClick={() => handleStatusToggle(cluster, 'cluster')}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title={cluster.status === 'active' ? 'Deactivate' : 'Activate'}
              >
                {cluster.status === 'active' ? (
                  <Pause className="w-3 h-3 text-slate-400" />
                ) : (
                  <Play className="w-3 h-3 text-slate-400" />
                )}
              </button>
              <button
                onClick={() => handleDeleteCluster(cluster)}
                className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                title="Delete cluster"
              >
                <Trash2 className="w-3 h-3 text-slate-400" />
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

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Cluster Hierarchy</h3>
            <p className="text-sm text-slate-400">Manage your taxonomy structure</p>
          </div>
          <button
            onClick={() => setShowCreateClusterModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Root Cluster</span>
          </button>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
          {clusterTree.length === 0 ? (
            <div className="text-center py-12">
              <TreePine className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No clusters found</h3>
              <p className="text-slate-500 mb-4">Create your first cluster to get started</p>
              <button
                onClick={() => setShowCreateClusterModal(true)}
                className="btn-primary"
              >
                Create Cluster
              </button>
            </div>
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {clusterTree.map(node => renderClusterNode(node))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Areas View Component
  const AreasView: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredAreas = useMemo(() => {
      return areas.filter(area => {
        const matchesSearch = !searchTerm ||
          area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          area.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          area.cluster_path?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    }, [areas, searchTerm]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Area Management</h3>
            <p className="text-sm text-slate-400">Browse and manage areas in your taxonomy</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => setShowCreateAreaModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Area</span>
            </button>
          </div>
        </div>

        {filteredAreas.length === 0 ? (
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-12 text-center">
            <Grid className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No areas found</h3>
            <p className="text-slate-500 mb-4">Create your first area to organize content</p>
            <button
              onClick={() => setShowCreateAreaModal(true)}
              className="btn-primary"
            >
              Create Area
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAreas.map(area => (
              <div key={area.uid} className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-200 group">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-200 truncate">{area.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{area.cluster_path || `Cluster: ${area.cluster_uid}`}</p>
                      {area.description && (
                        <p className="text-xs text-slate-400 truncate mt-1">{area.description}</p>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                      <button
                        onClick={() => setEditingArea(area)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Edit area"
                      >
                        <Edit3 className="w-3 h-3 text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleStatusToggle(area, 'area')}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title={area.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {area.status === 'active' ? (
                          <Pause className="w-3 h-3 text-slate-400" />
                        ) : (
                          <Play className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area)}
                        className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                        title="Delete area"
                      >
                        <Trash2 className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      area.status === 'active'
                        ? 'bg-green-500/20 text-green-300'
                        : area.status === 'archived'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {area.status}
                    </span>
                    {area.tag_count !== undefined && (
                       <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                         {area.tag_count} tags
                       </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ( // List View
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Cluster Path
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAreas.map(area => (
                  <tr key={area.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-200">{area.name}</div>
                          <div className="text-xs text-slate-400">{area.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {area.cluster_path || area.cluster_uid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        area.status === 'active'
                          ? 'bg-green-500/20 text-green-300'
                          : area.status === 'archived'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {area.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {area.tag_count !== undefined ? area.tag_count : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setEditingArea(area)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
                          title="Edit area"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusToggle(area, 'area')}
                          className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded"
                          title={area.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {area.status === 'active' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area)}
                          className="p-1 text-red-400 hover:text-red-500 hover:bg-red-500/20 rounded"
                          title="Delete area"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Tags View Component
  const TagsView: React.FC = () => {
    const filteredTags = useMemo(() => {
      return tags.filter(tag => {
        const matchesSearch = !searchTerm ||
          tag.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.slug.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
    }, [tags, searchTerm]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Tag Management</h3>
            <p className="text-sm text-slate-400">Organize content with descriptive tags</p>
          </div>
          <button
            onClick={() => setShowCreateTagModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Tag</span>
          </button>
        </div>

        {filteredTags.length === 0 ? (
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-12 text-center">
            <Tags className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No tags found</h3>
            <p className="text-slate-500 mb-4">Create your first tag to categorize content</p>
            <button
              onClick={() => setShowCreateTagModal(true)}
              className="btn-primary"
            >
              Create Tag
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTags.map(tag => (
              <div key={tag.slug} className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4 hover:border-indigo-500/30 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: tag.color || '#6366F1' }} />
                    <h4 className="text-sm font-semibold text-slate-200 truncate">{tag.display_name}</h4>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Edit tag"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleStatusToggle(tag, 'tag')}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title={tag.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {tag.status === 'active' ? (
                        <Pause className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Play className="w-3 h-3 text-slate-400" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag)}
                      className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                      title="Delete tag"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 truncate mb-2">Slug: {tag.slug}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tag.status === 'active'
                      ? 'bg-green-500/20 text-green-300'
                      : tag.status === 'archived'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {tag.status}
                  </span>
                  {tag.area_count !== undefined && (
                     <span className="px-2 py-1 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                       Used in {tag.area_count} areas
                     </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tree Graph View Component
  const TreeGraphView: React.FC = () => {
    const [isD3Ready, setIsD3Ready] = useState(false);

    useEffect(() => {
      // Load D3.js dynamically
      const script = document.createElement('script');
      script.src = 'https://d3js.org/d3.v7.min.js';
      script.onload = () => setIsD3Ready(true);
      document.head.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="https://d3js.org/d3.v7.min.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }, []);

    useEffect(() => {
      if (!isD3Ready) return;
      const d3 = (window as any).d3;
      if (!d3) return;

      const createHierarchicalData = () => {
        // Transform API data into tree structure
        const treeData = {
          name: "Origin",
          type: "root",
          children: clusterTree.map(cluster => ({
            name: cluster.name,
            type: "cluster",
            id: cluster.uid,
            status: cluster.status,
            children: [
              ...cluster.children.map(child => ({
                name: child.name,
                type: "cluster",
                id: child.uid,
                status: child.status,
                children: areas
                  .filter(area => area.cluster_uid === child.uid)
                  .map(area => ({
                    name: area.name,
                    type: "area",
                    id: area.uid,
                    status: area.status,
                  }))
              })),
              ...areas
                .filter(area => area.cluster_uid === cluster.uid)
                .map(area => ({
                  name: area.name,
                  type: "area",
                  id: area.uid,
                  status: area.status,
                }))
            ]
          }))
        };
        return treeData;
      };

      const showNodeDetails = (node: any) => {
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm";
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div class="relative inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-600" id="modalContent">
              <div class="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-white">${node.type === 'cluster' ? 'Cluster' : node.type === 'area' ? 'Area' : 'Node'}: ${node.name}</h3>
                  <button id="closeModal" class="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700" type="button" aria-label="Close modal">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                <div class="space-y-2 text-slate-300">
                  <p><strong>ID:</strong> ${node.id || 'N/A'}</p>
                  <p><strong>Type:</strong> ${node.type}</p>
                  <p><strong>Status:</strong> <span class="px-2 py-1 text-xs rounded-full ${node.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}">${node.status || 'unknown'}</span></p>
                  ${node.children ? `<p><strong>Children:</strong> ${node.children.length}</p>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modal);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        const closeModal = () => {
          modal.remove();
          document.body.style.overflow = 'unset';
        };

        // Close button click
        modal.querySelector('#closeModal')?.addEventListener('click', closeModal);
        
        // Backdrop click - only close if clicking the backdrop itself
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            closeModal();
          }
        });
        
        // Prevent modal content clicks from closing
        modal.querySelector('#modalContent')?.addEventListener('click', (e) => {
          e.stopPropagation();
        });

        // Escape key
        const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
          }
        };
        document.addEventListener('keydown', handleEscape);
      };

      const container = document.getElementById("taxonomyTreeViz");
      if (!container) return;

      const render = () => {
        container.innerHTML = "";
        const width = container.clientWidth;
        const height = 600;
        const svg = d3
          .select(container)
          .append("svg")
          .attr("width", width)
          .attr("height", height);
        const g = svg.append("g").attr("transform", "translate(50,50)");
        const treeLayout = d3.tree().size([width - 100, height - 100]);
        const root = d3.hierarchy(createHierarchicalData());
        treeLayout(root);

        // Links
        g.selectAll(".tree-link")
          .data(root.descendants().slice(1))
          .enter()
          .append("path")
          .attr("class", "tree-link")
          .attr("fill", "none")
          .attr("stroke", "#475569")
          .attr("stroke-width", 2)
          .attr(
            "d",
            (d: any) =>
              `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`,
          );

        // Nodes
        const node = g
          .selectAll(".tree-node")
          .data(root.descendants())
          .enter()
          .append("g")
          .attr("class", "tree-node")
          .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
          .style("cursor", "pointer");

        // Node circles
        node
          .append("circle")
          .attr("r", (d: any) =>
            d.data.type === "root" ? 8 : d.data.type === "cluster" ? 6 : 4,
          )
          .style("fill", (d: any) => {
            if (d.data.type === "root") return "#6366f1";
            if (d.data.type === "cluster") return "#06b6d4";
            return "#10b981";
          })
          .style("stroke", "#1e293b")
          .style("stroke-width", "2px");

        // Node labels
        node
          .append("text")
          .attr("dy", (d: any) => (d.data.type === "root" ? -15 : -10))
          .attr("text-anchor", "middle")
          .style("fill", "#e2e8f0")
          .style("font-size", (d: any) =>
            d.data.type === "root" ? "12px" : "10px",
          )
          .style("font-weight", (d: any) =>
            d.data.type === "root" ? "600" : "400",
          )
          .text((d: any) => d.data.name);

        // Status indicators
        node
          .filter((d: any) => d.data.status && d.data.type !== "root")
          .append("circle")
          .attr("r", 3)
          .attr("cx", 12)
          .attr("cy", -6)
          .style("fill", (d: any) =>
            d.data.status === "active" ? "#10b981" : "#ef4444",
          )
          .style("stroke", "#1e293b")
          .style("stroke-width", "1px");

        // Click handlers
        node.on("click", (_e: any, d: any) => {
          if (d.data.type !== "root") {
            showNodeDetails(d.data);
          }
        });
      };

      render();
      window.addEventListener("resize", render);
      return () => {
        window.removeEventListener("resize", render);
      };
    }, [clusters, areas, isD3Ready, clusterTree]);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Taxonomy Graph Visualization</h3>
            <p className="text-sm text-slate-400">Interactive tree view of your taxonomy structure</p>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6">
          {!isD3Ready ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="ml-3 text-slate-400">Loading visualization...</p>
            </div>
          ) : clusters.length === 0 ? (
            <div className="text-center py-12">
              <TreePine className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-400 mb-2">No data to visualize</h3>
              <p className="text-slate-500 mb-4">Create some clusters and areas to see the tree visualization</p>
            </div>
          ) : (
            <div>
              <div id="taxonomyTreeViz" className="w-full" style={{ minHeight: "600px" }}></div>
              <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>Root</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span>Clusters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Areas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Inactive</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Home className="w-8 h-8 mr-3 text-indigo-400" />
        Taxonomy Dashboard
      </h1>

      <div className="mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="relative flex-1 mr-0 md:mr-4 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clusters, areas, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-3 bg-slate-800/50 rounded-lg p-1 flex-shrink-0">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeView === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveView('clusters')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeView === 'clusters' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}`}
          >
            <TreePine className="w-4 h-4" />
            <span>Clusters</span>
          </button>
          <button
            onClick={() => setActiveView('areas')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeView === 'areas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}`}
          >
            <Grid className="w-4 h-4" />
            <span>Areas</span>
          </button>
          <button
            onClick={() => setActiveView('tags')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeView === 'tags' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}`}
          >
            <Tags className="w-4 h-4" />
            <span>Tags</span>
          </button>
          <button
            onClick={() => setActiveView('graph')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeView === 'graph' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/10'}`}
          >
            <TreePine className="w-4 h-4" />
            <span>Graph</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="ml-3 text-slate-400">Loading taxonomy data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5" />
            <p>Error: {error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {success && (
            <div className="bg-green-500/20 text-green-300 p-4 rounded-lg flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p>{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-300 hover:text-green-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        <div className="flex-1">
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 text-center">
                <TreePine className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-slate-200">{clusters.length}</h4>
                <p className="text-slate-400">Total Clusters</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 text-center">
                <Grid className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-slate-200">{areas.length}</h4>
                <p className="text-slate-400">Total Areas</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-6 text-center">
                <Tags className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h4 className="text-2xl font-bold text-slate-200">{tags.length}</h4>
                <p className="text-slate-400">Total Tags</p>
              </div>
            </div>
          )}
          {activeView === 'clusters' && <ClusterTreeView />}
          {activeView === 'areas' && <AreasView />}
          {activeView === 'tags' && <TagsView />}
          {activeView === 'graph' && <TreeGraphView />}
        </div>
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={showCreateClusterModal}
        onClose={() => {setShowCreateClusterModal(false); setParentClusterForNew(null);}}
        title={parentClusterForNew ? `Create Child Cluster under ${parentClusterForNew.name}` : 'Create New Cluster'}
      >
        <ClusterForm
          parentCluster={parentClusterForNew || undefined}
          onSubmit={handleCreateCluster}
          onCancel={() => {setShowCreateClusterModal(false); setParentClusterForNew(null);}}
          isSubmitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={!!editingCluster}
        onClose={() => setEditingCluster(null)}
        title={`Edit Cluster: ${editingCluster?.name || ''}`}
      >
        {editingCluster && (
          <ClusterForm
            cluster={editingCluster}
            onSubmit={handleUpdateCluster}
            onCancel={() => setEditingCluster(null)}
            isSubmitting={submitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={showCreateAreaModal}
        onClose={() => setShowCreateAreaModal(false)}
        title="Create New Area"
      >
        <AreaForm
          clusters={clusters}
          onSubmit={handleCreateArea}
          onCancel={() => setShowCreateAreaModal(false)}
          isSubmitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={!!editingArea}
        onClose={() => setEditingArea(null)}
        title={`Edit Area: ${editingArea?.name || ''}`}
      >
        {editingArea && (
          <AreaForm
            area={editingArea}
            clusters={clusters} // Pass clusters for dropdown even when editing
            onSubmit={handleUpdateArea}
            onCancel={() => setEditingArea(null)}
            isSubmitting={submitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={showCreateTagModal}
        onClose={() => setShowCreateTagModal(false)}
        title="Create New Tag"
      >
        <TagForm
          onSubmit={handleCreateTag}
          onCancel={() => setShowCreateTagModal(false)}
          isSubmitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={!!editingTag}
        onClose={() => setEditingTag(null)}
        title={`Edit Tag: ${editingTag?.display_name || ''}`}
      >
        {editingTag && (
          <TagForm
            tag={editingTag}
            onSubmit={handleUpdateTag}
            onCancel={() => setEditingTag(null)}
            isSubmitting={submitting}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        title={`Delete ${deleteConfirmation?.type || ''}`}
      >
        {deleteConfirmation && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-white">
                &quot;{deleteConfirmation.type === 'tag' 
                  ? (deleteConfirmation.item as Tag).display_name
                  : (deleteConfirmation.item as Cluster | Area).name}&quot;
              </span>
              ? This action cannot be undone.
            </p>
            
            {deleteConfirmation.type === 'cluster' && (
              <div className="bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm">
                <strong>Warning:</strong> Deleting this cluster will also affect any child clusters and areas.
              </div>
            )}
            
            {deleteConfirmation.type === 'tag' && (
              <div className="bg-yellow-500/20 text-yellow-300 p-3 rounded-lg text-sm">
                <strong>Warning:</strong> This tag may be in use by areas and will be removed from them.
              </div>
            )}
            
            <div className="flex space-x-3 pt-4">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete {deleteConfirmation.type}</span>
              </button>
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TaxonomyDashboard;