"use client";

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Cluster,
  Area,
  Tag,
  CreateClusterRequest,
  UpdateClusterRequest,
  CreateAreaRequest,
  UpdateAreaRequest,
  CreateTagRequest,
  UpdateTagRequest
} from '@/types/api';

interface UseTaxonomyOperationsReturn {
  submitting: boolean;
  createCluster: (data: CreateClusterRequest) => Promise<void>;
  updateCluster: (uid: string, data: UpdateClusterRequest) => Promise<void>;
  deleteCluster: (uid: string) => Promise<void>;
  createArea: (data: CreateAreaRequest) => Promise<void>;
  updateArea: (uid: string, data: UpdateAreaRequest) => Promise<void>;
  deleteArea: (uid: string) => Promise<void>;
  createTag: (data: CreateTagRequest) => Promise<void>;
  updateTag: (slug: string, data: UpdateTagRequest) => Promise<void>;
  deleteTag: (slug: string) => Promise<void>;
  toggleStatus: (item: Cluster | Area | Tag, type: 'cluster' | 'area' | 'tag') => Promise<void>;
}

export const useTaxonomyOperations = (
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void,
  onDataChange?: () => Promise<void>
): UseTaxonomyOperationsReturn => {
  const [submitting, setSubmitting] = useState(false);

  const handleOperation = async (operation: () => Promise<any>, successMessage: string) => {
    try {
      setSubmitting(true);
      const response = await operation();
      
      if (response && response.success) {
        if (onDataChange) await onDataChange();
        if (onSuccess) onSuccess(successMessage);
      } else {
        throw new Error(response?.message || 'Operation failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      if (onError) onError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Cluster operations
  const createCluster = async (data: CreateClusterRequest) => {
    await handleOperation(
      () => apiClient.createCluster(data),
      'Cluster created successfully!'
    );
  };

  const updateCluster = async (uid: string, data: UpdateClusterRequest) => {
    await handleOperation(
      () => apiClient.updateCluster(uid, data),
      'Cluster updated successfully!'
    );
  };

  const deleteCluster = async (uid: string) => {
    await handleOperation(
      () => apiClient.deleteCluster(uid),
      'Cluster deleted successfully!'
    );
  };

  // Area operations
  const createArea = async (data: CreateAreaRequest) => {
    await handleOperation(
      () => apiClient.createArea(data),
      'Area created successfully!'
    );
  };

  const updateArea = async (uid: string, data: UpdateAreaRequest) => {
    await handleOperation(
      () => apiClient.updateArea(uid, data),
      'Area updated successfully!'
    );
  };

  const deleteArea = async (uid: string) => {
    await handleOperation(
      () => apiClient.deleteArea(uid),
      'Area deleted successfully!'
    );
  };

  // Tag operations
  const createTag = async (data: CreateTagRequest) => {
    await handleOperation(
      () => apiClient.createTag(data),
      'Tag created successfully!'
    );
  };

  const updateTag = async (slug: string, data: UpdateTagRequest) => {
    await handleOperation(
      () => apiClient.updateTag(slug, data),
      'Tag updated successfully!'
    );
  };

  const deleteTag = async (slug: string) => {
    await handleOperation(
      () => apiClient.deleteTag(slug),
      'Tag deleted successfully!'
    );
  };

  // Status toggle operation
  const toggleStatus = async (item: Cluster | Area | Tag, type: 'cluster' | 'area' | 'tag') => {
    const isActive = item.status === 'active';
    const uid = 'uid' in item ? item.uid : item.slug;
    
    console.log(`Toggling ${type} status:`, { 
      type, 
      identifier: uid, 
      currentStatus: item.status, 
      isActive, 
      willBecome: isActive ? 'inactive' : 'active'
    });

    let operation;
    if (type === 'cluster') {
      operation = isActive 
        ? () => apiClient.deactivateCluster(uid)
        : () => apiClient.activateCluster(uid);
    } else if (type === 'area') {
      operation = isActive 
        ? () => apiClient.deactivateArea(uid)
        : () => apiClient.activateArea(uid);
    } else if (type === 'tag') {
      console.log(`Making ${isActive ? 'deactivate' : 'activate'} API call for tag: ${uid}`);
      operation = isActive 
        ? () => apiClient.deactivateTag(uid)
        : () => apiClient.activateTag(uid);
    }

    if (operation) {
      await handleOperation(
        operation,
        `${type.charAt(0).toUpperCase() + type.slice(1)} ${isActive ? 'deactivated' : 'activated'} successfully!`
      );
    }
  };

  return {
    submitting,
    createCluster,
    updateCluster,
    deleteCluster,
    createArea,
    updateArea,
    deleteArea,
    createTag,
    updateTag,
    deleteTag,
    toggleStatus
  };
};