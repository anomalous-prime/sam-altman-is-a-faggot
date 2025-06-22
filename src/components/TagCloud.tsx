import { useMemo } from 'react';
import { FilteredData, Filters } from '@/lib/types';

interface Props {
  data: FilteredData;
  filters: Filters;
  setFilters: (f: Filters) => void;
}

export default function TagCloud({ data, filters, setFilters }: Props) {
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.areas.forEach((area) => {
      area.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    data.trees.forEach((tree) => {
      tree.clusters.forEach((cluster) => {
        counts[cluster.name] = (counts[cluster.name] || 0) + 2;
      });
    });
    data.areas.forEach((area) => {
      counts[area.name] = (counts[area.name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 50);
  }, [data]);

  const handleClick = (tag: string) => {
    setFilters({ ...filters, search: tag });
  };

  const isCluster = (tag: string) => data.trees.some((t) => t.clusters.some((c) => c.name === tag));
  const isArea = (tag: string) => data.areas.some((a) => a.name === tag);

  return (
    <div className="nf-card rounded-lg p-6 mb-8">
      <h2 className="font-display text-xl font-semibold mb-4">Tag Cloud</h2>
      <div id="tagCloud" className="flex flex-wrap gap-2">
        {tagCounts.map(([tag, count]) => (
          <span
            key={tag}
            className={`tag-badge ${isCluster(tag) ? 'tag-cluster' : isArea(tag) ? 'tag-area' : 'tag-status-active'}`}
            onClick={() => handleClick(tag)}
          >
            {tag} ({count})
          </span>
        ))}
      </div>
    </div>
  );
}
