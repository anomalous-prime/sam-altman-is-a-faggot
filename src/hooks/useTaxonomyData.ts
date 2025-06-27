"use client";

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { Cluster, Area, Tag, TaxonomyFilters } from '@/types/api';

interface UseTaxonomyDataReturn {
  clusters: Cluster[];
  areas: Area[];
  tags: Tag[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useTaxonomyData = (searchTerm?: string): UseTaxonomyDataReturn => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const refreshData = useCallback(() => {
    return loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    clusters,
    areas,
    tags,
    loading,
    error,
    loadData,
    refreshData
  };
};