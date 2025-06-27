"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, TreePine } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import { Cluster } from '@/types/api';

interface TreeGraphViewProps {
  clusters: Cluster[];
}

interface TreeData extends Cluster {
  children: TreeData[];
}

interface TreeNode {
  data: TreeData;
  x?: number;
  y?: number;
  children?: TreeNode[];
  parent?: TreeNode;
}

const TreeGraphView: React.FC<TreeGraphViewProps> = ({ clusters }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Cluster | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const zoomRef = useRef<any>(null);

  const createTreeData = (clusters: Cluster[]): TreeData | null => {
    if (clusters.length === 0) return null;

    // Create a map for quick lookup
    const clusterMap = new Map<string, TreeData>();
    
    // Initialize all clusters with empty children arrays
    clusters.forEach(cluster => {
      clusterMap.set(cluster.uid, { ...cluster, children: [] });
    });

    // Build the tree structure
    const roots: TreeData[] = [];
    clusters.forEach(cluster => {
      const node = clusterMap.get(cluster.uid)!;
      if (cluster.parent_uid) {
        const parent = clusterMap.get(cluster.parent_uid);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort by sort_order
    const sortNodes = (nodes: TreeData[]) => {
      nodes.sort((a, b) => a.sort_order - b.sort_order);
      nodes.forEach(node => {
        if (node.children.length > 0) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(roots);

    // If we have multiple roots, create a virtual root
    if (roots.length > 1) {
      return {
        uid: 'virtual-root',
        name: 'Taxonomy Root',
        description: 'Virtual root node',
        status: 'active' as const,
        sort_order: 0,
        path: '/',
        parent_uid: '',
        depth: 0,
        created_at: '',
        updated_at: '',
        children: roots
      };
    }

    return roots[0] || null;
  };

  const renderTree = useCallback(() => {
    if (!svgRef.current || clusters.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    // Create tree data
    const treeData = createTreeData(clusters);
    if (!treeData) return;

    // Create hierarchy
    const root = d3.hierarchy(treeData, (d: TreeData) => d.children);
    const treeLayout = d3.tree()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

    treeLayout(root);

    // Create main group first
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event: any) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom as any);

    // Create links
    g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
      )
      .style('fill', 'none')
      .style('stroke', '#475569')
      .style('stroke-width', '2px')
      .style('stroke-opacity', 0.8);

    // Create nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Add circles for nodes
    node.append('circle')
      .attr('r', (d: any) => d.data.uid === 'virtual-root' ? 8 : 12)
      .style('fill', (d: any) => {
        if (d.data.uid === 'virtual-root') return '#6366f1';
        return d.data.status === 'active' ? '#22c55e' : '#ef4444';
      })
      .style('stroke', '#1e293b')
      .style('stroke-width', '3px')
      .on('click', (event: any, d: any) => {
        if (d.data.uid !== 'virtual-root') {
          setSelectedNode(d.data);
          setIsModalOpen(true);
        }
      })
      .on('mouseover', function(event: any, d: any) {
        if (d.data.uid !== 'virtual-root') {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 16)
            .style('stroke-width', '4px');
        }
      })
      .on('mouseout', function(event: any, d: any) {
        if (d.data.uid !== 'virtual-root') {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 12)
            .style('stroke-width', '3px');
        }
      });

    // Add labels
    node.append('text')
      .attr('dy', (d: any) => d.data.uid === 'virtual-root' ? '0.35em' : '2.5em')
      .attr('text-anchor', 'middle')
      .style('fill', '#e2e8f0')
      .style('font-size', (d: any) => d.data.uid === 'virtual-root' ? '12px' : '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .text((d: any) => {
        if (d.data.uid === 'virtual-root') return '';
        const name = d.data.name;
        return name.length > 15 ? name.substring(0, 15) + '...' : name;
      });

    // Add path labels
    node.filter((d: any) => d.data.uid !== 'virtual-root')
      .append('text')
      .attr('dy', '3.8em')
      .attr('text-anchor', 'middle')
      .style('fill', '#64748b')
      .style('font-size', '9px')
      .style('pointer-events', 'none')
      .text((d: any) => d.data.path);
  }, [clusters]);

  useEffect(() => {
    renderTree();
  }, [renderTree]);

  const handleZoomIn = () => {
    if (zoomRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (zoomRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomRef.current.scaleBy, 0.67);
    }
  };

  const handleResetZoom = () => {
    if (zoomRef.current && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(500).call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Taxonomy Tree</h2>
          <p className="text-slate-400">Visual representation of your taxonomy hierarchy</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomIn}
            icon={<ZoomIn className="w-4 h-4" />}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomOut}
            icon={<ZoomOut className="w-4 h-4" />}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetZoom}
            icon={<RotateCcw className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        {clusters.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TreePine className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No taxonomy data</h3>
            <p className="text-slate-500">Create clusters to visualize your taxonomy tree</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden">
              <svg
                ref={svgRef}
                width="100%"
                height="600"
                viewBox="0 0 800 600"
                style={{ background: '#0f172a' }}
              />
            </div>
            
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Inactive</span>
              </div>
              <div className="flex items-center space-x-2">
                <Maximize2 className="w-4 h-4" />
                <span>Click nodes for details</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Node Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cluster Details"
        size="md"
      >
        {selectedNode && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{selectedNode.name}</h3>
              <StatusBadge status={selectedNode.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Path:</span>
                <div className="text-white font-mono">{selectedNode.path}</div>
              </div>
              <div>
                <span className="text-slate-400">Sort Order:</span>
                <div className="text-white">{selectedNode.sort_order}</div>
              </div>
            </div>

            {selectedNode.description && (
              <div>
                <span className="text-slate-400 text-sm">Description:</span>
                <p className="text-white mt-1">{selectedNode.description}</p>
              </div>
            )}

            {selectedNode.area_count !== undefined && (
              <div className="bg-slate-800 rounded-lg p-3">
                <span className="text-slate-400 text-sm">Areas:</span>
                <div className="text-lg font-semibold text-indigo-300">
                  {selectedNode.area_count} area{selectedNode.area_count !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TreeGraphView;