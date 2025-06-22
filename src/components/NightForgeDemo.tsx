'use client';
import { useEffect } from 'react';
import Script from 'next/script';
import { seedData } from '@/lib/seedData';

export default function NightForgeDemo() {
  useEffect(() => {
    let d3 = (window as any).d3;

    let currentFilters = { tree: 'all', status: 'all', type: 'all', search: '' };

    function getAllClusters() {
      return seedData.trees.reduce((acc, tree) => acc.concat(tree.clusters), [] as any[]);
    }

    function populateTreeSelect() {
      const select = document.getElementById('treeSelect') as HTMLSelectElement;
      seedData.trees.forEach((tree) => {
        const option = document.createElement('option');
        option.value = tree.id;
        option.textContent = tree.name;
        select.appendChild(option);
      });
    }

    function renderStats() {
      const activeTags = seedData.tags.filter((t) => t.status === 'active').length;
      (document.getElementById('statTrees') as HTMLElement).textContent = seedData.trees.length.toString();
      (document.getElementById('statClusters') as HTMLElement).textContent = getAllClusters().length.toString();
      (document.getElementById('statAreas') as HTMLElement).textContent = seedData.areas.length.toString();
      (document.getElementById('statTags') as HTMLElement).textContent = activeTags.toString();
    }

    function createClusterNode(cluster: any, allClusters: any[], areas: any[]) {
      const childClusters = allClusters.filter((c) => c.parent_id === cluster.uid);
      const clusterAreas = areas.filter((a) => a.cluster_uid === cluster.uid);
      return {
        name: cluster.name,
        type: 'cluster',
        id: cluster.uid,
        status: cluster.status,
        children: [
          ...childClusters.map((child) => createClusterNode(child, allClusters, areas)),
          ...clusterAreas.map((area) => ({
            name: area.name,
            type: 'area',
            id: area.uid,
            status: area.status,
            tags: area.tags,
          })),
        ],
      };
    }

    function getFilteredData() {
      let filteredTrees = JSON.parse(JSON.stringify(seedData.trees));
      let filteredAreas = JSON.parse(JSON.stringify(seedData.areas));

      if (currentFilters.tree !== 'all') {
        filteredTrees = filteredTrees.filter((t: any) => t.id === currentFilters.tree);
        const ids = filteredTrees.reduce((acc: any[], t: any) => acc.concat(t.clusters.map((c: any) => c.uid)), []);
        filteredAreas = filteredAreas.filter((a: any) => ids.includes(a.cluster_uid));
      }

      if (currentFilters.status === 'active') {
        filteredTrees = filteredTrees.filter((t: any) => t.status === 'active');
        filteredAreas = filteredAreas.filter((a: any) => a.status === 'active');
        filteredTrees.forEach((t: any) => {
          t.clusters = t.clusters.filter((c: any) => c.status === 'active');
        });
      }

      if (currentFilters.type === 'clusters') {
        filteredAreas = [];
      } else if (currentFilters.type === 'areas') {
        filteredTrees.forEach((t: any) => {
          t.clusters = t.clusters.filter((c: any) => filteredAreas.some((a: any) => a.cluster_uid === c.uid));
        });
      }

      if (currentFilters.search) {
        const term = currentFilters.search.toLowerCase();
        filteredAreas = filteredAreas.filter((a: any) =>
          a.name.toLowerCase().includes(term) || a.tags.some((tag: string) => tag.toLowerCase().includes(term)),
        );
        filteredTrees.forEach((t: any) => {
          t.clusters = t.clusters.filter(
            (c: any) => c.name.toLowerCase().includes(term) || filteredAreas.some((a: any) => a.cluster_uid === c.uid),
          );
        });
        filteredTrees = filteredTrees.filter((t: any) => t.name.toLowerCase().includes(term) || t.clusters.length > 0);
      }

      return { trees: filteredTrees, areas: filteredAreas };
    }

    function createHierarchicalData() {
      const filtered = getFilteredData();
      return {
        name: 'API Root',
        type: 'root',
        children: filtered.trees.map((tree: any) => ({
          name: tree.name,
          type: 'tree',
          id: tree.id,
          status: tree.status,
          children: tree.clusters.filter((c: any) => !c.parent_id).map((c: any) => createClusterNode(c, tree.clusters, filtered.areas)),
        })),
      };
    }

    function renderTreeVisualization() {
      const container = document.getElementById('treeViz') as HTMLElement;
      container.innerHTML = '';
      const width = container.clientWidth;
      const height = 600;
      const svg = d3.select('#treeViz').append('svg').attr('width', width).attr('height', height);
      const g = svg.append('g').attr('transform', 'translate(50,50)');
      const data = createHierarchicalData();
      const tree = d3.tree().size([width - 100, height - 100]);
      const root = d3.hierarchy(data);
      tree(root);
      g.selectAll('.tree-link')
        .data(root.descendants().slice(1))
        .enter()
        .append('path')
        .attr('class', 'tree-link')
        .attr('d', (d: any) => `M${d.x},${d.y}C${d.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${(d.y + d.parent.y) / 2} ${d.parent.x},${d.parent.y}`);

      const node = g
        .selectAll('.tree-node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'tree-node')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      node
        .append('circle')
        .attr('r', (d: any) => (d.data.type === 'tree' ? 12 : d.data.type === 'cluster' ? 8 : 6))
        .style('fill', (d: any) => {
          if (d.data.type === 'tree') return 'var(--nf-primary-500)';
          if (d.data.type === 'cluster') return 'var(--nf-accent-cyan)';
          return 'var(--nf-success)';
        })
        .style('stroke', 'var(--nf-gray-400)')
        .style('stroke-width', '2px');

      node
        .append('text')
        .attr('dy', (d: any) => (d.data.type === 'tree' ? -18 : -12))
        .attr('text-anchor', 'middle')
        .style('fill', 'var(--nf-gray-200)')
        .style('font-size', (d: any) => (d.data.type === 'tree' ? '14px' : '12px'))
        .style('font-weight', (d: any) => (d.data.type === 'tree' ? '600' : '400'))
        .text((d: any) => d.data.name);

      node
        .filter((d: any) => d.data.status)
        .append('circle')
        .attr('r', 3)
        .attr('cx', 15)
        .attr('cy', -8)
        .style('fill', (d: any) => (d.data.status === 'active' ? 'var(--nf-success)' : 'var(--nf-error)'))
        .style('stroke', 'var(--nf-gray-800)')
        .style('stroke-width', '1px');

      node.on('click', (_e: any, d: any) => {
        showNodeDetails(d.data);
      });
    }

    function renderTagCloud() {
      const container = document.getElementById('tagCloud') as HTMLElement;
      container.innerHTML = '';
      const filtered = getFilteredData();
      const tagCounts: Record<string, number> = {};
      filtered.areas.forEach((area: any) => {
        area.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      filtered.trees.forEach((tree: any) => {
        tree.clusters.forEach((cluster: any) => {
          tagCounts[cluster.name] = (tagCounts[cluster.name] || 0) + 2;
        });
      });
      filtered.areas.forEach((area: any) => {
        tagCounts[area.name] = (tagCounts[area.name] || 0) + 1;
      });
      const sorted = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 50);
      sorted.forEach(([tag]) => {
        const badge = document.createElement('span');
        badge.className = 'tag-badge';
        badge.textContent = tag;
        const isCluster = filtered.trees.some((t: any) => t.clusters.some((c: any) => c.name === tag));
        const isArea = filtered.areas.some((a: any) => a.name === tag);
        if (isCluster) badge.classList.add('tag-cluster');
        else if (isArea) badge.classList.add('tag-area');
        else badge.classList.add('tag-status-active');
        badge.addEventListener('click', () => {
          currentFilters.search = tag;
          const input = document.getElementById('searchInput') as HTMLInputElement;
          input.value = tag;
          updateDisplay();
        });
        container.appendChild(badge);
      });
    }

    function renderDataInspector() {
      const container = document.getElementById('dataInspector') as HTMLElement;
      container.innerHTML = '';
      const filtered = getFilteredData();
      filtered.trees.forEach((tree: any) => {
        const card = document.createElement('div');
        card.className = 'nf-card rounded-lg p-4 mb-4';
        card.innerHTML = `
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display text-lg font-semibold">${tree.name}</h3>
            <span class="tag-badge ${tree.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}">${tree.status}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${tree.clusters
              .map(
                (cluster: any) => `
              <div class="border rounded-lg p-3" style="border-color: var(--nf-gray-600);">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-sm">${cluster.name}</h4>
                  <span class="tag-badge tag-cluster text-xs">${cluster.status}</span>
                </div>
                <div class="space-y-1">
                  ${filtered.areas
                    .filter((a: any) => a.cluster_uid === cluster.uid)
                    .map(
                      (area: any) => `
                    <div class="flex items-center justify-between text-xs">
                      <span style="color: var(--nf-gray-400)">${area.name}</span>
                      <span class="tag-badge ${area.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}" style="font-size: 0.6rem; padding: 0.125rem 0.375rem;">${area.status}</span>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      ${area.tags.map((tag: string) => `<span class="tag-badge tag-area" style="font-size: 0.6rem; padding: 0.125rem 0.25rem;">${tag}</span>`).join('')}
                    </div>
                  `,
                    )
                    .join('')}
                </div>
              </div>
            `,
              )
              .join('')}
          </div>`;
        container.appendChild(card);
      });
    }

    function showNodeDetails(data: any) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      modal.style.backdropFilter = 'blur(8px)';
      const content = document.createElement('div');
      content.className = 'nf-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto';
      let details = '';
      if (data.type === 'tree') {
        const tree = seedData.trees.find((t) => t.id === data.id)!;
        details = `
          <h3 class="font-display text-xl font-semibold mb-4">Tree: ${tree.name}</h3>
          <div class="space-y-2">
            <p><strong>ID:</strong> ${tree.id}</p>
            <p><strong>Status:</strong> <span class="tag-badge ${tree.status === 'active' ? 'tag-status-active' : 'tag-status-inactive'}">${tree.status}</span></p>
            <p><strong>Created:</strong> ${new Date(tree.created_at).toLocaleString()}</p>
            <p><strong>Clusters:</strong> ${tree.clusters.length}</p>
            <p><strong>Total Areas:</strong> ${seedData.areas.filter((a) => tree.clusters.some((c) => c.uid === a.cluster_uid)).length}</p>
          </div>`;
      } else if (data.type === 'cluster') {
        const cluster = getAllClusters().find((c) => c.uid === data.id)!;
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
      } else if (data.type === 'area') {
        const area = seedData.areas.find((a) => a.uid === data.id)!;
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

    function updateDisplay() {
      renderStats();
      renderTreeVisualization();
      renderTagCloud();
      renderDataInspector();
    }

    function setupEventListeners() {
      document.getElementById('treeSelect')?.addEventListener('change', (e) => {
        currentFilters.tree = (e.target as HTMLSelectElement).value;
        updateDisplay();
      });
      document.getElementById('filterActive')?.addEventListener('click', (e) => {
        currentFilters.status = currentFilters.status === 'active' ? 'all' : 'active';
        (e.target as HTMLElement).classList.toggle('filter-active');
        updateDisplay();
      });
      document.getElementById('filterClusters')?.addEventListener('click', (e) => {
        currentFilters.type = currentFilters.type === 'clusters' ? 'all' : 'clusters';
        (e.target as HTMLElement).classList.toggle('filter-active');
        updateDisplay();
      });
      document.getElementById('filterAreas')?.addEventListener('click', (e) => {
        currentFilters.type = currentFilters.type === 'areas' ? 'all' : 'areas';
        (e.target as HTMLElement).classList.toggle('filter-active');
        updateDisplay();
      });
      document.getElementById('resetFilters')?.addEventListener('click', () => {
        currentFilters = { tree: 'all', status: 'all', type: 'all', search: '' };
        (document.getElementById('treeSelect') as HTMLSelectElement).value = 'all';
        (document.getElementById('searchInput') as HTMLInputElement).value = '';
        document.querySelectorAll('.filter-active').forEach((btn) => btn.classList.remove('filter-active'));
        updateDisplay();
      });
      document.getElementById('searchInput')?.addEventListener('input', (e) => {
        currentFilters.search = (e.target as HTMLInputElement).value;
        updateDisplay();
      });
      window.addEventListener('resize', () => {
        setTimeout(renderTreeVisualization, 100);
      });
    }

    function init() {
      populateTreeSelect();
      setupEventListeners();
      updateDisplay();
    }

    if (d3) {
      init();
    } else {
      const script = document.getElementById('d3-script');
      const onLoad = () => {
        script?.removeEventListener('load', onLoad);
        d3 = (window as any).d3;
        init();
      };
      script?.addEventListener('load', onLoad);
      return () => {
        script?.removeEventListener('load', onLoad);
      };
    }
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <Script id="d3-script" src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js" strategy="afterInteractive" />
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: 'var(--nf-primary-300)' }}>
          🌑 NightForge Tree API
        </h1>
        <p className="text-lg" style={{ color: 'var(--nf-gray-400)' }}>
          Interactive demonstration of tree-structured data management
        </p>
      </header>
      <div className="nf-card rounded-lg p-6 mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Controls & Filters</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <select id="treeSelect" className="px-4 py-2 rounded-lg border" style={{ background: 'var(--nf-gray-700)', borderColor: 'var(--nf-gray-600)', color: 'var(--nf-gray-200)' }}>
            <option value="all">All Trees</option>
          </select>
          <button id="filterActive" className="nf-btn-secondary px-4 py-2 rounded-lg">Active Only</button>
          <button id="filterClusters" className="nf-btn-secondary px-4 py-2 rounded-lg">Clusters</button>
          <button id="filterAreas" className="nf-btn-secondary px-4 py-2 rounded-lg">Areas</button>
          <button id="resetFilters" className="nf-btn-primary px-4 py-2 rounded-lg">Reset Filters</button>
        </div>
        <div className="flex items-center gap-4">
          <input id="searchInput" type="text" placeholder="Search tags, clusters, areas..." className="px-4 py-2 rounded-lg border flex-1" style={{ background: 'var(--nf-gray-700)', borderColor: 'var(--nf-gray-600)', color: 'var(--nf-gray-200)' }} />
          <button id="expandAll" className="nf-btn-secondary px-4 py-2 rounded-lg">Expand All</button>
          <button id="collapseAll" className="nf-btn-secondary px-4 py-2 rounded-lg">Collapse All</button>
        </div>
      </div>
      <div className="stats-grid mb-8">
        <div className="nf-card rounded-lg p-6">
          <h3 className="font-display text-lg font-semibold mb-2">Total Trees</h3>
          <div className="text-3xl font-bold" style={{ color: 'var(--nf-primary-300)' }} id="statTrees">3</div>
        </div>
        <div className="nf-card rounded-lg p-6">
          <h3 className="font-display text-lg font-semibold mb-2">Total Clusters</h3>
          <div className="text-3xl font-bold" style={{ color: 'var(--nf-accent-cyan)' }} id="statClusters">8</div>
        </div>
        <div className="nf-card rounded-lg p-6">
          <h3 className="font-display text-lg font-semibold mb-2">Total Areas</h3>
          <div className="text-3xl font-bold" style={{ color: 'var(--nf-success)' }} id="statAreas">30</div>
        </div>
        <div className="nf-card rounded-lg p-6">
          <h3 className="font-display text-lg font-semibold mb-2">Active Tags</h3>
          <div className="text-3xl font-bold" style={{ color: 'var(--nf-warning)' }} id="statTags">45</div>
        </div>
      </div>
      <div className="nf-card rounded-lg p-6 mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Tree Structure Visualization</h2>
        <div id="treeViz" className="w-full" style={{ minHeight: '600px' }}></div>
      </div>
      <div className="nf-card rounded-lg p-6 mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Tag Cloud</h2>
        <div id="tagCloud" className="flex flex-wrap gap-2"></div>
      </div>
      <div className="nf-card rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Data Inspector</h2>
        <div id="dataInspector" className="space-y-4"></div>
      </div>
    </div>
  );
}
