"use client";

import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Tag, CreateTagRequest, UpdateTagRequest } from '@/types/api';

interface TagFormProps {
  tag?: Tag;
  onSubmit: (data: CreateTagRequest | UpdateTagRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const TagForm: React.FC<TagFormProps> = ({ 
  tag, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
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
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.display_name.trim() || (!tag && !formData.slug.trim())}
          icon={<Save className="w-4 h-4" />}
          className="flex-1"
        >
          {tag ? 'Update' : 'Create'} Tag
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

export default TagForm;