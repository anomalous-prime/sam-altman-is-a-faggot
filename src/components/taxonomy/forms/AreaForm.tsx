"use client";

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Area, Cluster, CreateAreaRequest, UpdateAreaRequest } from '@/types/api';

interface AreaFormProps {
  area?: Area;
  clusters: Cluster[];
  onSubmit: (data: CreateAreaRequest | UpdateAreaRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AreaForm: React.FC<AreaFormProps> = ({ 
  area, 
  clusters, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
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
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.name.trim() || (!area && (!formData.uid.trim() || !formData.cluster_uid))}
          icon={<Save className="w-4 h-4" />}
          className="flex-1"
        >
          {area ? 'Update' : 'Create'} Area
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          icon={<X className="w-4 h-4" />}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AreaForm;