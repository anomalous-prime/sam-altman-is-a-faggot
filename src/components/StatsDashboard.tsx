import { FilteredData } from '@/lib/types';
import { seedData } from '@/lib/seedData';

interface Props {
  data: FilteredData;
}

export default function StatsDashboard({ data }: Props) {
  const activeTags = seedData.tags.filter((t) => t.status === 'active').length;
  const totalTrees = data.trees.length;
  const totalClusters = data.trees.reduce((acc, t) => acc + t.clusters.length, 0);
  const totalAreas = data.areas.length;

  return (
    <div className="stats-grid mb-8">
      <div className="nf-card rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold mb-2">Total Trees</h3>
        <div className="text-3xl font-bold" style={{ color: 'var(--nf-primary-300)' }} id="statTrees">
          {totalTrees}
        </div>
      </div>
      <div className="nf-card rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold mb-2">Total Clusters</h3>
        <div className="text-3xl font-bold" style={{ color: 'var(--nf-accent-cyan)' }} id="statClusters">
          {totalClusters}
        </div>
      </div>
      <div className="nf-card rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold mb-2">Total Areas</h3>
        <div className="text-3xl font-bold" style={{ color: 'var(--nf-success)' }} id="statAreas">
          {totalAreas}
        </div>
      </div>
      <div className="nf-card rounded-lg p-6">
        <h3 className="font-display text-lg font-semibold mb-2">Active Tags</h3>
        <div className="text-3xl font-bold" style={{ color: 'var(--nf-warning)' }} id="statTags">
          {activeTags}
        </div>
      </div>
    </div>
  );
}
