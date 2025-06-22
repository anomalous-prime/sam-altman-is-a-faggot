import { useMemo, useState } from 'react';
import { Filters, FilteredData, Tree, Area } from '@/lib/types';
import { seedData } from '@/lib/seedData';

export function getFilteredData(filters: Filters): FilteredData {
  let filteredTrees: Tree[] = JSON.parse(JSON.stringify(seedData.trees)) as Tree[];
  let filteredAreas: Area[] = JSON.parse(JSON.stringify(seedData.areas)) as Area[];

    if (filters.tree !== 'all') {
      filteredTrees = filteredTrees.filter((t) => t.id === filters.tree);
      const ids = filteredTrees.reduce<string[]>(
        (acc, t) => acc.concat(t.clusters.map((c) => c.uid)),
        [],
      );
      filteredAreas = filteredAreas.filter((a) => ids.includes(a.cluster_uid));
    }

    if (filters.status === 'active') {
      filteredTrees = filteredTrees.filter((t) => t.status === 'active');
      filteredAreas = filteredAreas.filter((a) => a.status === 'active');
      filteredTrees.forEach((t) => {
        t.clusters = t.clusters.filter((c) => c.status === 'active');
      });
  }

    if (filters.type === 'clusters') {
      filteredAreas = [];
    } else if (filters.type === 'areas') {
      filteredTrees.forEach((t) => {
        t.clusters = t.clusters.filter((c) =>
          filteredAreas.some((a) => a.cluster_uid === c.uid),
        );
      });
  }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredAreas = filteredAreas.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          a.tags.some((tag: string) => tag.toLowerCase().includes(term)),
      );
      filteredTrees.forEach((t) => {
        t.clusters = t.clusters.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            filteredAreas.some((a) => a.cluster_uid === c.uid),
        );
      });
      filteredTrees = filteredTrees.filter(
        (t) =>
          t.name.toLowerCase().includes(term) || t.clusters.length > 0,
      );
  }

    return { trees: filteredTrees, areas: filteredAreas } as FilteredData;
}

export default function useFilters() {
  const [filters, setFilters] = useState<Filters>({
    tree: 'all',
    status: 'all',
    type: 'all',
    search: '',
  });

  const setTree = (tree: string) => setFilters((f: Filters) => ({ ...f, tree }));
  const toggleStatus = () =>
    setFilters((f: Filters) => ({ ...f, status: f.status === 'active' ? 'all' : 'active' }));
  const toggleClusters = () =>
    setFilters((f: Filters) => ({ ...f, type: f.type === 'clusters' ? 'all' : 'clusters' }));
  const toggleAreas = () =>
    setFilters((f: Filters) => ({ ...f, type: f.type === 'areas' ? 'all' : 'areas' }));
  const setSearch = (search: string) => setFilters((f: Filters) => ({ ...f, search }));
  const resetFilters = () => setFilters({ tree: 'all', status: 'all', type: 'all', search: '' });

  const filteredData = useMemo(() => getFilteredData(filters), [filters]);

  return {
    filters,
    filteredData,
    setTree,
    toggleStatus,
    toggleClusters,
    toggleAreas,
    setSearch,
    resetFilters,
    setFilters,
  } as const;
}
