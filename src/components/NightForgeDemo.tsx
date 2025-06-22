'use client';

import { useMemo, useState } from 'react';
import Script from 'next/script';
import { Filters, FilteredData } from '@/lib/types';
import { seedData } from '@/lib/seedData';
import ControlsPanel from './ControlsPanel';
import StatsDashboard from './StatsDashboard';
import TreeVisualization from './TreeVisualization';
import TagCloud from './TagCloud';
import DataInspector from './DataInspector';

export default function NightForgeDemo() {
  const [filters, setFilters] = useState<Filters>({
    tree: 'all',
    status: 'all',
    type: 'all',
    search: '',
  });
  const [isD3Ready, setIsD3Ready] = useState(false);

  const filteredData: FilteredData = useMemo(() => {
    let filteredTrees: any[] = JSON.parse(JSON.stringify(seedData.trees));
    let filteredAreas: any[] = JSON.parse(JSON.stringify(seedData.areas));

    if (filters.tree !== 'all') {
      filteredTrees = filteredTrees.filter((t) => t.id === filters.tree);
      const ids = filteredTrees.reduce((acc: any[], t: any) => acc.concat(t.clusters.map((c: any) => c.uid)), []);
      filteredAreas = filteredAreas.filter((a: any) => ids.includes(a.cluster_uid));
    }

    if (filters.status === 'active') {
      filteredTrees = filteredTrees.filter((t) => t.status === 'active');
      filteredAreas = filteredAreas.filter((a) => a.status === 'active');
      filteredTrees.forEach((t) => {
        t.clusters = t.clusters.filter((c: any) => c.status === 'active');
      });
    }

    if (filters.type === 'clusters') {
      filteredAreas = [];
    } else if (filters.type === 'areas') {
      filteredTrees.forEach((t) => {
        t.clusters = t.clusters.filter((c: any) => filteredAreas.some((a: any) => a.cluster_uid === c.uid));
      });
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredAreas = filteredAreas.filter(
        (a: any) =>
          a.name.toLowerCase().includes(term) || a.tags.some((tag: string) => tag.toLowerCase().includes(term)),
      );
      filteredTrees.forEach((t) => {
        t.clusters = t.clusters.filter(
          (c: any) => c.name.toLowerCase().includes(term) || filteredAreas.some((a: any) => a.cluster_uid === c.uid),
        );
      });
      filteredTrees = filteredTrees.filter(
        (t: any) => t.name.toLowerCase().includes(term) || t.clusters.length > 0,
      );
    }

    return { trees: filteredTrees, areas: filteredAreas } as FilteredData;
  }, [filters]);

  const handleD3Load = () => {
    setIsD3Ready(true);
  };

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"
        strategy="afterInteractive"
        onLoad={handleD3Load}
      />
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <header className="mb-8">
            <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: 'var(--nf-primary-300)' }}>
              🌑 NightForge Tree API
            </h1>
            <p className="text-lg" style={{ color: 'var(--nf-gray-400)' }}>
              Interactive demonstration of tree-structured data management
            </p>
          </header>

          <ControlsPanel filters={filters} setFilters={setFilters} />
          <StatsDashboard data={filteredData} />
          <TreeVisualization data={filteredData} isD3Ready={isD3Ready} />
          <TagCloud data={filteredData} filters={filters} setFilters={setFilters} />
          <DataInspector data={filteredData} />
        </div>
      </div>
    </>
  );
}
