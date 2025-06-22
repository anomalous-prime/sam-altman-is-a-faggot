import { useEffect } from 'react';
import type { HierarchyPointNode } from 'd3';
import { FilteredData, TreeNode, Cluster, Area, Status, NodeType, Tree } from '@/lib/types';
import { seedData } from '@/lib/seedData';

interface Props {
  data: FilteredData;
  isD3Ready: boolean;
}

export default function TreeVisualization({ data, isD3Ready }: Props) {
  useEffect(() => {
    if (!isD3Ready) return;
    const d3 = (window as unknown as { d3: typeof import('d3') }).d3;
    if (!d3) return;

    function getAllClusters(): Cluster[] {
      return seedData.trees.reduce(
        (acc: Cluster[], tree: Tree) => acc.concat(tree.clusters),
        [] as Cluster[],
      );
    }

    function createClusterNode(cluster: Cluster, allClusters: Cluster[], areas: Area[]): TreeNode {
      const childClusters = allClusters.filter((c) => c.parent_id === cluster.uid);
      const clusterAreas = areas.filter((a) => a.cluster_uid === cluster.uid);
      return {
        name: cluster.name,
        type: NodeType.Cluster,
        id: cluster.uid,
        status: cluster.status,
        children: [
          ...childClusters.map((child) => createClusterNode(child, allClusters, areas)),
          ...clusterAreas.map((area) => ({
            name: area.name,
            type: NodeType.Area,
            id: area.uid,
            status: area.status,
            tags: area.tags,
          })),
        ],
      } as TreeNode;
    }

    function createHierarchicalData(): TreeNode {
      return {
        name: 'API Root',
        type: NodeType.Root,
        children: data.trees.map((tree: Tree) => ({
          name: tree.name,
          type: NodeType.Tree,
          id: tree.id,
          status: tree.status,
          children: tree.clusters
            .filter((c) => !c.parent_id)
            .map((c) => createClusterNode(c, tree.clusters, data.areas)),
        })),
      } as TreeNode;
    }

    function showNodeDetails(node: TreeNode): void {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.style.backdropFilter = 'blur(8px)';

      const content = document.createElement('div');
      content.className = 'nf-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto';

      let details = '';
      if (node.type === 'tree') {
        const tree = seedData.trees.find((t) => t.id === node.id)!;
        details = `
          <h3 class="font-display text-xl font-semibold mb-4">Tree: ${tree.name}</h3>
          <div class="space-y-2">
            <p><strong>ID:</strong> ${tree.id}</p>
            <p><strong>Status:</strong> <span class="tag-badge ${tree.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}">${tree.status}</span></p>
            <p><strong>Created:</strong> ${new Date(tree.created_at).toLocaleString()}</p>
            <p><strong>Clusters:</strong> ${tree.clusters.length}</p>
            <p><strong>Total Areas:</strong> ${seedData.areas.filter((a) => tree.clusters.some((c) => c.uid === a.cluster_uid)).length}</p>
          </div>`;
      } else if (node.type === 'cluster') {
        const cluster = getAllClusters().find((c) => c.uid === node.id)!;
        const areas = seedData.areas.filter((a) => a.cluster_uid === cluster.uid);
        details = `
          <h3 class="font-display text-xl font-semibold mb-4">Cluster: ${cluster.name}</h3>
          <div class="space-y-2">
            <p><strong>UID:</strong> ${cluster.uid}</p>
            <p><strong>Status:</strong> <span class="tag-badge ${cluster.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}">${cluster.status}</span></p>
            <p><strong>Parent:</strong> ${cluster.parent_id || 'Root'}</p>
            <p><strong>Children:</strong> ${cluster.children.length}</p>
            <p><strong>Areas:</strong> ${areas.length}</p>
            <div class="mt-3">
              <h4 class="font-semibold mb-2">Areas:</h4>
              <div class="grid grid-cols-1 gap-2">
                ${areas
                  .map(
                    (area) => `
                  <div class="border rounded p-2" style="border-color: var(--nf-gray-600);">
                    <div class="flex justify-between items-center">
                      <span>${area.name}</span>
                      <span class="tag-badge ${area.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}">${area.status}</span>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      ${area.tags.map((tag) => `<span class="tag-badge tag-area">${tag}</span>`).join('')}
                    </div>
                  </div>`,
                  )
                  .join('')}
              </div>
            </div>
          </div>`;
      } else if (node.type === 'area') {
        const area = seedData.areas.find((a) => a.uid === node.id)!;
        details = `
          <h3 class="font-display text-xl font-semibold mb-4">Area: ${area.name}</h3>
          <div class="space-y-2">
            <p><strong>UID:</strong> ${area.uid}</p>
            <p><strong>Status:</strong> <span class="tag-badge ${area.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}">${area.status}</span></p>
            <p><strong>Cluster:</strong> ${area.cluster_uid}</p>
            <div class="mt-3">
              <h4 class="font-semibold mb-2">Tags:</h4>
              <div class="flex flex-wrap gap-1">
                ${area.tags.map((tag) => `<span class="tag-badge tag-area">${tag}</span>`).join('')}
              </div>
            </div>
          </div>`;
      }

      content.innerHTML = `${details}<div class="mt-6 flex justify-end"><button class="nf-btn-primary px-4 py-2 rounded-lg" onclick="this.closest('.fixed').remove()">Close</button></div>`;
      modal.appendChild(content);
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    }

    const container = document.getElementById('treeViz') as HTMLElement;
    if (!container) return;

    const render = () => {
      container.innerHTML = '';
      const width = container.clientWidth;
      const height = 600;
      const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
      const g = svg.append('g').attr('transform', 'translate(50,50)');
      const treeLayout = d3.tree().size([width - 100, height - 100]);
      const root = d3.hierarchy(createHierarchicalData());
      treeLayout(root);

      g.selectAll('.tree-link')
        .data(root.descendants().slice(1))
        .enter()
        .append('path')
        .attr('class', 'tree-link')
        .attr('d', (d: HierarchyPointNode<TreeNode>) => `M${d.x},${d.y}C${d.x},${(d.y + d.parent!.y) / 2} ${d.parent!.x},${(d.y + d.parent!.y) / 2} ${d.parent!.x},${d.parent!.y}`);

      const node = g
        .selectAll('.tree-node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'tree-node')
        .attr('transform', (d: HierarchyPointNode<TreeNode>) => `translate(${d.x},${d.y})`);

      node
        .append('circle')
        .attr('r', (d: HierarchyPointNode<TreeNode>) => (d.data.type === NodeType.Tree ? 12 : d.data.type === NodeType.Cluster ? 8 : 6))
        .style('fill', (d: HierarchyPointNode<TreeNode>) => {
          if (d.data.type === 'tree') return 'var(--nf-primary-500)';
          if (d.data.type === 'cluster') return 'var(--nf-accent-cyan)';
          return 'var(--nf-success)';
        })
        .style('stroke', 'var(--nf-gray-400)')
        .style('stroke-width', '2px');

      node
        .append('text')
        .attr('dy', (d: HierarchyPointNode<TreeNode>) => (d.data.type === NodeType.Tree ? -18 : -12))
        .attr('text-anchor', 'middle')
        .style('fill', 'var(--nf-gray-200)')
        .style('font-size', (d: HierarchyPointNode<TreeNode>) => (d.data.type === NodeType.Tree ? '14px' : '12px'))
        .style('font-weight', (d: HierarchyPointNode<TreeNode>) => (d.data.type === NodeType.Tree ? '600' : '400'))
        .text((d: HierarchyPointNode<TreeNode>) => d.data.name);

      node
        .filter((d: HierarchyPointNode<TreeNode>) => d.data.status)
        .append('circle')
        .attr('r', 3)
        .attr('cx', 15)
        .attr('cy', -8)
        .style('fill', (d: HierarchyPointNode<TreeNode>) => (d.data.status === Status.Active ? 'var(--nf-success)' : 'var(--nf-error)'))
        .style('stroke', 'var(--nf-gray-800)')
        .style('stroke-width', '1px');

      node.on('click', (_e: unknown, d: HierarchyPointNode<TreeNode>) => {
        showNodeDetails(d.data);
      });
    };

    render();
    window.addEventListener('resize', render);
    return () => {
      window.removeEventListener('resize', render);
    };
  }, [data, isD3Ready]);

  return (
    <div className="nf-card rounded-lg p-6 mb-8">
      <h2 className="font-display text-xl font-semibold mb-4">Tree Structure Visualization</h2>
      <div id="treeViz" className="w-full" style={{ minHeight: '600px' }}></div>
    </div>
  );
}
