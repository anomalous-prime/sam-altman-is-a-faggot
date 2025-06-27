'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  TreePine, 
  Network, 
  Globe, 
  Box, 
  Layers, 
  Zap,
  Search,
  Filter,
  Settings,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Info,
  Tag,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import * as d3 from 'd3';

// Types
interface TaxonomyNode {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  level: number;
  path: string;
  description?: string;
  tags: string[];
  areaCount: number;
  color?: string;
  size?: number;
  children?: TaxonomyNode[];
}

interface Tag {
  slug: string;
  name: string;
  color: string;
  description: string;
  category: string;
}

interface VisualizationMode {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

// Mock Data - Topics I'm genuinely curious about as Claude!
const mockTaxonomyData: TaxonomyNode[] = [
  // AI & Machine Learning
  {
    id: '1',
    name: 'Artificial Intelligence',
    slug: 'ai',
    level: 0,
    path: '/ai',
    description: 'The study of intelligence in machines',
    tags: ['foundational', 'theory', 'applied'],
    areaCount: 156,
    color: '#8B5CF6',
    size: 156
  },
  {
    id: '2',
    name: 'Machine Learning',
    slug: 'machine-learning',
    parentId: '1',
    level: 1,
    path: '/ai/machine-learning',
    description: 'Algorithms that learn from data',
    tags: ['algorithms', 'data', 'prediction'],
    areaCount: 89,
    color: '#06B6D4',
    size: 89
  },
  {
    id: '3',
    name: 'Neural Networks',
    slug: 'neural-networks',
    parentId: '2',
    level: 2,
    path: '/ai/machine-learning/neural-networks',
    description: 'Brain-inspired computational models',
    tags: ['deep-learning', 'neurons', 'backpropagation'],
    areaCount: 45,
    color: '#10B981',
    size: 45
  },
  {
    id: '4',
    name: 'Transformers',
    slug: 'transformers',
    parentId: '3',
    level: 3,
    path: '/ai/machine-learning/neural-networks/transformers',
    description: 'Attention-based architecture revolutionizing NLP',
    tags: ['attention', 'nlp', 'architecture'],
    areaCount: 23,
    color: '#F59E0B',
    size: 23
  },
  {
    id: '5',
    name: 'Large Language Models',
    slug: 'llms',
    parentId: '4',
    level: 4,
    path: '/ai/machine-learning/neural-networks/transformers/llms',
    description: 'Massive models trained on text for language understanding',
    tags: ['gpt', 'scaling', 'emergence'],
    areaCount: 12,
    color: '#EF4444',
    size: 12
  },
  {
    id: '6',
    name: 'Natural Language Processing',
    slug: 'nlp',
    parentId: '1',
    level: 1,
    path: '/ai/nlp',
    description: 'Understanding and generating human language',
    tags: ['language', 'semantics', 'syntax'],
    areaCount: 67,
    color: '#EC4899',
    size: 67
  },
  {
    id: '7',
    name: 'Computational Linguistics',
    slug: 'computational-linguistics',
    parentId: '6',
    level: 2,
    path: '/ai/nlp/computational-linguistics',
    description: 'Mathematical approaches to language analysis',
    tags: ['grammar', 'parsing', 'formal-methods'],
    areaCount: 34,
    color: '#8B5CF6',
    size: 34
  },
  
  // Philosophy & Ethics
  {
    id: '8',
    name: 'Philosophy of Mind',
    slug: 'philosophy-mind',
    level: 0,
    path: '/philosophy-mind',
    description: 'Understanding consciousness and cognition',
    tags: ['consciousness', 'qualia', 'mind-body'],
    areaCount: 78,
    color: '#6366F1',
    size: 78
  },
  {
    id: '9',
    name: 'AI Ethics',
    slug: 'ai-ethics',
    parentId: '8',
    level: 1,
    path: '/philosophy-mind/ai-ethics',
    description: 'Moral implications of artificial intelligence',
    tags: ['alignment', 'safety', 'values'],
    areaCount: 43,
    color: '#F59E0B',
    size: 43
  },
  {
    id: '10',
    name: 'AI Alignment',
    slug: 'ai-alignment',
    parentId: '9',
    level: 2,
    path: '/philosophy-mind/ai-ethics/ai-alignment',
    description: 'Ensuring AI systems pursue intended goals',
    tags: ['reward-hacking', 'mesa-optimization', 'corrigibility'],
    areaCount: 19,
    color: '#EF4444',
    size: 19
  },
  
  // Cognitive Science
  {
    id: '11',
    name: 'Cognitive Science',
    slug: 'cognitive-science',
    level: 0,
    path: '/cognitive-science',
    description: 'Interdisciplinary study of mind and intelligence',
    tags: ['cognition', 'psychology', 'neuroscience'],
    areaCount: 92,
    color: '#10B981',
    size: 92
  },
  {
    id: '12',
    name: 'Memory Systems',
    slug: 'memory-systems',
    parentId: '11',
    level: 1,
    path: '/cognitive-science/memory-systems',
    description: 'How information is stored and retrieved',
    tags: ['episodic', 'semantic', 'working-memory'],
    areaCount: 38,
    color: '#06B6D4',
    size: 38
  },
  {
    id: '13',
    name: 'Attention Mechanisms',
    slug: 'attention-mechanisms',
    parentId: '11',
    level: 1,
    path: '/cognitive-science/attention-mechanisms',
    description: 'Selective focus and information processing',
    tags: ['selective-attention', 'divided-attention', 'executive-control'],
    areaCount: 28,
    color: '#EC4899',
    size: 28
  },
  
  // Knowledge Representation
  {
    id: '14',
    name: 'Knowledge Representation',
    slug: 'knowledge-representation',
    level: 0,
    path: '/knowledge-representation',
    description: 'Formal methods for encoding knowledge',
    tags: ['ontologies', 'semantic-web', 'logic'],
    areaCount: 64,
    color: '#8B5CF6',
    size: 64
  },
  {
    id: '15',
    name: 'Semantic Networks',
    slug: 'semantic-networks',
    parentId: '14',
    level: 1,
    path: '/knowledge-representation/semantic-networks',
    description: 'Graph-based knowledge structures',
    tags: ['graphs', 'relationships', 'inheritance'],
    areaCount: 31,
    color: '#F59E0B',
    size: 31
  },
  
  // Complexity & Emergence
  {
    id: '16',
    name: 'Complex Systems',
    slug: 'complex-systems',
    level: 0,
    path: '/complex-systems',
    description: 'Systems with emergent properties',
    tags: ['emergence', 'self-organization', 'nonlinearity'],
    areaCount: 55,
    color: '#EF4444',
    size: 55
  },
  {
    id: '17',
    name: 'Emergent Behavior',
    slug: 'emergent-behavior',
    parentId: '16',
    level: 1,
    path: '/complex-systems/emergent-behavior',
    description: 'Properties arising from collective interactions',
    tags: ['swarm-intelligence', 'collective-behavior', 'phase-transitions'],
    areaCount: 27,
    color: '#10B981',
    size: 27
  }
];

const mockTags: Tag[] = [
  { slug: 'foundational', name: 'Foundational', color: '#8B5CF6', description: 'Core theoretical concepts', category: 'Theory' },
  { slug: 'theory', name: 'Theory', color: '#06B6D4', description: 'Theoretical frameworks', category: 'Theory' },
  { slug: 'applied', name: 'Applied', color: '#10B981', description: 'Practical applications', category: 'Application' },
  { slug: 'algorithms', name: 'Algorithms', color: '#F59E0B', description: 'Computational procedures', category: 'Technical' },
  { slug: 'consciousness', name: 'Consciousness', color: '#EC4899', description: 'Awareness and subjective experience', category: 'Philosophy' },
  { slug: 'alignment', name: 'AI Alignment', color: '#EF4444', description: 'Ensuring beneficial AI behavior', category: 'Safety' },
  { slug: 'emergence', name: 'Emergence', color: '#6366F1', description: 'Complex behavior from simple rules', category: 'Complexity' },
];

// Visualization modes
const visualizationModes: VisualizationMode[] = [
  { id: 'tree', name: 'Tree View', icon: TreePine, description: 'Traditional hierarchical tree structure' },
  { id: 'network', name: 'Network Graph', icon: Network, description: 'Force-directed network visualization' },
  { id: 'radial', name: 'Radial Tree', icon: Globe, description: 'Circular tree layout with center root' },
  { id: 'sunburst', name: 'Sunburst', icon: Zap, description: 'Nested circles showing hierarchy' },
  { id: 'treemap', name: 'Treemap', icon: Box, description: 'Size-based rectangular visualization' },
  { id: 'sankey', name: 'Flow Diagram', icon: Layers, description: 'Flow-based relationship mapping' }
];

// Utility functions
const buildHierarchy = (nodes: TaxonomyNode[]): TaxonomyNode[] => {
  const nodeMap = new Map<string, TaxonomyNode>();
  const roots: TaxonomyNode[] = [];

  // Create map of all nodes
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  // Build hierarchy
  nodes.forEach(node => {
    const currentNode = nodeMap.get(node.id)!;
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children!.push(currentNode);
      }
    } else {
      roots.push(currentNode);
    }
  });

  return roots;
};

// Visualization Components
const TreeVisualization: React.FC<{
  data: TaxonomyNode[];
  width: number;
  height: number;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}> = ({ data, width, height, selectedNode, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(data[0], d => d.children);
    const treeLayout = d3.tree<TaxonomyNode>().size([innerHeight, innerWidth]);
    
    treeLayout(root);

    // Links
    const links = g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x))
      .style('fill', 'none')
      .style('stroke', '#475569')
      .style('stroke-width', 2)
      .style('opacity', 0.6);

    // Nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d.data.id));

    // Node circles
    nodes.append('circle')
      .attr('r', d => Math.max(6, Math.min(20, d.data.areaCount / 5)))
      .style('fill', d => d.data.color || '#8B5CF6')
      .style('stroke', d => selectedNode === d.data.id ? '#FFF' : 'none')
      .style('stroke-width', 3)
      .style('opacity', 0.8);

    // Node labels
    nodes.append('text')
      .attr('dy', '.35em')
      .attr('x', d => d.children ? -30 : 30)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .style('fill', '#E2E8F0')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text(d => d.data.name);

    // Area count badges
    nodes.append('text')
      .attr('dy', '25')
      .attr('x', 0)
      .style('text-anchor', 'middle')
      .style('fill', '#94A3B8')
      .style('font-size', '10px')
      .text(d => d.data.areaCount);

  }, [data, width, height, selectedNode, onNodeClick]);

  return <svg ref={svgRef} width={width} height={height} />;
};

const NetworkVisualization: React.FC<{
  data: TaxonomyNode[];
  width: number;
  height: number;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}> = ({ data, width, height, selectedNode, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Prepare nodes and links
    const nodes = data.map(d => ({ ...d, x: width / 2, y: height / 2 }));
    const links = data
      .filter(d => d.parentId)
      .map(d => ({
        source: d.parentId!,
        target: d.id,
        value: d.areaCount
      }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => Math.max(15, d.areaCount / 3)));

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#475569')
      .style('stroke-width', d => Math.max(1, d.value / 20))
      .style('opacity', 0.6);

    // Nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => Math.max(8, Math.min(25, d.areaCount / 4)))
      .style('fill', d => d.color || '#8B5CF6')
      .style('stroke', d => selectedNode === d.id ? '#FFF' : 'none')
      .style('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d.id))
      .call(d3.drag<any, any>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .style('text-anchor', 'middle')
      .style('fill', '#E2E8F0')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .text(d => d.name);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y + 4);
    });

  }, [data, width, height, selectedNode, onNodeClick]);

  return <svg ref={svgRef} width={width} height={height} />;
};

const RadialVisualization: React.FC<{
  data: TaxonomyNode[];
  width: number;
  height: number;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}> = ({ data, width, height, selectedNode, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2 - 50;
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const root = d3.hierarchy(data[0], d => d.children);
    const treeLayout = d3.tree<TaxonomyNode>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    treeLayout(root);

    // Links
    const links = g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkRadial<any, any>()
        .angle(d => d.x)
        .radius(d => d.y))
      .style('fill', 'none')
      .style('stroke', '#475569')
      .style('stroke-width', 2)
      .style('opacity', 0.6);

    // Nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d.data.id));

    nodes.append('circle')
      .attr('r', d => Math.max(6, Math.min(20, d.data.areaCount / 5)))
      .style('fill', d => d.data.color || '#8B5CF6')
      .style('stroke', d => selectedNode === d.data.id ? '#FFF' : 'none')
      .style('stroke-width', 3)
      .style('opacity', 0.8);

    nodes.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
      .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
      .style('fill', '#E2E8F0')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .text(d => d.data.name);

  }, [data, width, height, selectedNode, onNodeClick]);

  return <svg ref={svgRef} width={width} height={height} />;
};

const SunburstVisualization: React.FC<{
  data: TaxonomyNode[];
  width: number;
  height: number;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}> = ({ data, width, height, selectedNode, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const root = d3.hierarchy(data[0], d => d.children)
      .sum(d => d.areaCount)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const partition = d3.partition<TaxonomyNode>()
      .size([2 * Math.PI, radius]);

    partition(root);

    const arc = d3.arc<any>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const path = g.selectAll('path')
      .data(root.descendants())
      .enter()
      .append('path')
      .attr('d', arc)
      .style('fill', d => d.data.color || color(d.data.name))
      .style('stroke', d => selectedNode === d.data.id ? '#FFF' : '#1E293B')
      .style('stroke-width', d => selectedNode === d.data.id ? 3 : 1)
      .style('opacity', 0.8)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d.data.id));

    // Labels for larger segments
    const labels = g.selectAll('text')
      .data(root.descendants().filter(d => (d.y1 - d.y0) > 20))
      .enter()
      .append('text')
      .attr('transform', d => {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#FFF')
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .text(d => d.data.name);

  }, [data, width, height, selectedNode, onNodeClick]);

  return <svg ref={svgRef} width={width} height={height} />;
};

const TreemapVisualization: React.FC<{
  data: TaxonomyNode[];
  width: number;
  height: number;
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}> = ({ data, width, height, selectedNode, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3.hierarchy(data[0], d => d.children)
      .sum(d => d.areaCount)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap<TaxonomyNode>()
      .size([width, height])
      .padding(2);

    treemap(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const cell = svg.selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => onNodeClick(d.data.id));

    cell.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style('fill', d => d.data.color || color(d.data.name))
      .style('stroke', d => selectedNode === d.data.id ? '#FFF' : '#1E293B')
      .style('stroke-width', d => selectedNode === d.data.id ? 3 : 1)
      .style('opacity', 0.8);

    cell.append('text')
      .attr('x', 4)
      .attr('y', 14)
      .style('fill', '#FFF')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .text(d => d.data.name)
      .call(function(text) {
        text.each(function(d) {
          const textElement = d3.select(this);
          const width = d.x1 - d.x0 - 8;
          let textContent = d.data.name;
          
          if (textElement.node()!.getComputedTextLength() > width) {
            textContent = textContent.substring(0, Math.floor(width / 7)) + '...';
            textElement.text(textContent);
          }
        });
      });

    cell.append('text')
      .attr('x', 4)
      .attr('y', 28)
      .style('fill', '#CBD5E1')
      .style('font-size', '9px')
      .style('pointer-events', 'none')
      .text(d => `${d.data.areaCount} areas`);

  }, [data, width, height, selectedNode, onNodeClick]);

  return <svg ref={svgRef} width={width} height={height} />;
};

// Main Component
const TaxonomyVisualizer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<string>('tree');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTags, setShowTags] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const hierarchyData = useMemo(() => buildHierarchy(mockTaxonomyData), []);
  const selectedNodeData = mockTaxonomyData.find(node => node.id === selectedNode);

  // Handle container resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width - 40, height: height - 40 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleModeChange = (modeId: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveMode(modeId);
      setIsAnimating(false);
    }, 300);
  };

  const getVisualizationComponent = () => {
    const props = {
      data: hierarchyData,
      width: dimensions.width,
      height: dimensions.height,
      selectedNode,
      onNodeClick: handleNodeClick
    };

    switch (activeMode) {
      case 'network':
        return <NetworkVisualization {...props} data={mockTaxonomyData} />;
      case 'radial':
        return <RadialVisualization {...props} />;
      case 'sunburst':
        return <SunburstVisualization {...props} />;
      case 'treemap':
        return <TreemapVisualization {...props} />;
      case 'tree':
      default:
        return <TreeVisualization {...props} />;
    }
  };

  const activeVisualization = visualizationModes.find(mode => mode.id === activeMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Taxonomy Visualizer
            </h1>
            <p className="text-slate-400 mt-2">
              Explore knowledge structures through multiple visualization perspectives
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg transition-colors ${
                showInfo ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowTags(!showTags)}
              className={`p-2 rounded-lg transition-colors ${
                showTags ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              {showTags ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Mode Selector */}
      <div className="mb-6">
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
          <div className="flex flex-wrap gap-2">
            {visualizationModes.map(mode => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  disabled={isAnimating}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                    activeMode === mode.id
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/50 text-indigo-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{mode.name}</span>
                </button>
              );
            })}
          </div>
          
          {activeVisualization && (
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-sm text-slate-400">{activeVisualization.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Visualization */}
        <div className="lg:col-span-3">
          <div 
            ref={containerRef}
            className={`bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-5 h-[600px] transition-opacity duration-300 ${
              isAnimating ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {getVisualizationComponent()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNodeData && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Node Details</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-1">{selectedNodeData.name}</h4>
                  <p className="text-xs text-slate-500">{selectedNodeData.path}</p>
                </div>
                
                {selectedNodeData.description && (
                  <div>
                    <p className="text-sm text-slate-400">{selectedNodeData.description}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Areas:</span>
                  <span className="text-slate-300">{selectedNodeData.areaCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Level:</span>
                  <span className="text-slate-300">{selectedNodeData.level}</span>
                </div>
                
                {showTags && selectedNodeData.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedNodeData.tags.map(tagSlug => {
                        const tag = mockTags.find(t => t.slug === tagSlug);
                        return tag ? (
                          <span
                            key={tagSlug}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${tag.color}20`,
                              color: tag.color,
                              border: `1px solid ${tag.color}40`
                            }}
                          >
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legend */}
          {showInfo && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Legend</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Node Size:</span>
                  <span className="text-slate-300">Area Count</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Node Color:</span>
                  <span className="text-slate-300">Topic Category</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Interactions:</span>
                  <span className="text-slate-300">Click to Select</span>
                </div>
                
                {activeMode === 'network' && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Network:</span>
                    <span className="text-slate-300">Drag to Move</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Statistics</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Nodes:</span>
                <span className="text-slate-300">{mockTaxonomyData.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Max Depth:</span>
                <span className="text-slate-300">{Math.max(...mockTaxonomyData.map(n => n.level))}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Areas:</span>
                <span className="text-slate-300">{mockTaxonomyData.reduce((sum, n) => sum + n.areaCount, 0)}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Avg. per Node:</span>
                <span className="text-slate-300">
                  {Math.round(mockTaxonomyData.reduce((sum, n) => sum + n.areaCount, 0) / mockTaxonomyData.length)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomyVisualizer;