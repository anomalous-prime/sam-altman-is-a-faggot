'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Info,
  Eye,
  EyeOff,
  Maximize2,
  Settings
} from 'lucide-react';
import * as d3 from 'd3';

// Types
interface NetworkNode {
  id: string;
  name: string;
  level: number;
  areaCount: number;
  color: string;
  category: string;
  description: string;
  tags: string[];
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

interface NetworkLink {
  source: string | NetworkNode;
  target: string | NetworkNode;
  value: number;
  distance: number;
}

interface LegendItem {
  color: string;
  label: string;
  count: number;
}

// Mock data - Claude's fascinating knowledge domains
const mockNetworkData: NetworkNode[] = [
  // Root nodes
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    level: 0,
    areaCount: 156,
    color: '#8B5CF6',
    category: 'Technology',
    description: 'The study of intelligence in machines and computational systems',
    tags: ['foundational', 'theory', 'applied']
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    level: 0,
    areaCount: 89,
    color: '#6366F1',
    category: 'Humanities',
    description: 'The study of fundamental questions about existence, knowledge, and reality',
    tags: ['consciousness', 'ethics', 'logic']
  },
  {
    id: 'cognitive-science',
    name: 'Cognitive Science',
    level: 0,
    areaCount: 92,
    color: '#10B981',
    category: 'Science',
    description: 'Interdisciplinary study of mind and intelligence',
    tags: ['cognition', 'psychology', 'neuroscience']
  },
  {
    id: 'complexity',
    name: 'Complex Systems',
    level: 0,
    areaCount: 67,
    color: '#F59E0B',
    category: 'Science',
    description: 'Study of systems with emergent properties',
    tags: ['emergence', 'nonlinearity', 'adaptation']
  },

  // Level 1 nodes
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    level: 1,
    areaCount: 134,
    color: '#06B6D4',
    category: 'Technology',
    description: 'Algorithms that improve through experience',
    tags: ['algorithms', 'data', 'prediction']
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    level: 1,
    areaCount: 89,
    color: '#EC4899',
    category: 'Technology',
    description: 'Understanding and generating human language',
    tags: ['language', 'semantics', 'syntax']
  },
  {
    id: 'ethics',
    name: 'Ethics',
    level: 1,
    areaCount: 67,
    color: '#EF4444',
    category: 'Humanities',
    description: 'Study of moral principles and values',
    tags: ['morality', 'values', 'responsibility']
  },
  {
    id: 'consciousness',
    name: 'Consciousness Studies',
    level: 1,
    areaCount: 45,
    color: '#8B5CF6',
    category: 'Science',
    description: 'Investigation of subjective experience and awareness',
    tags: ['qualia', 'awareness', 'phenomenology']
  },
  {
    id: 'memory',
    name: 'Memory Systems',
    level: 1,
    areaCount: 56,
    color: '#06B6D4',
    category: 'Science',
    description: 'How information is encoded, stored, and retrieved',
    tags: ['encoding', 'retrieval', 'consolidation']
  },
  {
    id: 'emergence',
    name: 'Emergent Phenomena',
    level: 1,
    areaCount: 38,
    color: '#10B981',
    category: 'Science',
    description: 'Properties arising from collective interactions',
    tags: ['collective-behavior', 'self-organization', 'phase-transitions']
  },

  // Level 2 nodes
  {
    id: 'neural-networks',
    name: 'Neural Networks',
    level: 2,
    areaCount: 78,
    color: '#8B5CF6',
    category: 'Technology',
    description: 'Brain-inspired computational models',
    tags: ['neurons', 'backpropagation', 'deep-learning']
  },
  {
    id: 'transformers',
    name: 'Transformer Architecture',
    level: 2,
    areaCount: 45,
    color: '#F59E0B',
    category: 'Technology',
    description: 'Attention-based neural architecture',
    tags: ['attention', 'self-attention', 'parallel']
  },
  {
    id: 'ai-alignment',
    name: 'AI Alignment',
    level: 2,
    areaCount: 34,
    color: '#EF4444',
    category: 'Technology',
    description: 'Ensuring AI systems pursue intended goals',
    tags: ['safety', 'values', 'control']
  },
  {
    id: 'embodied-cognition',
    name: 'Embodied Cognition',
    level: 2,
    areaCount: 29,
    color: '#06B6D4',
    category: 'Science',
    description: 'Role of the body in shaping cognition',
    tags: ['embodiment', 'sensorimotor', 'grounding']
  },
  {
    id: 'swarm-intelligence',
    name: 'Swarm Intelligence',
    level: 2,
    areaCount: 23,
    color: '#10B981',
    category: 'Technology',
    description: 'Collective behavior of decentralized systems',
    tags: ['collective', 'distributed', 'optimization']
  },

  // Level 3 nodes
  {
    id: 'llms',
    name: 'Large Language Models',
    level: 3,
    areaCount: 67,
    color: '#EC4899',
    category: 'Technology',
    description: 'Massive transformer models for language tasks',
    tags: ['scaling', 'emergence', 'capabilities']
  },
  {
    id: 'constitutional-ai',
    name: 'Constitutional AI',
    level: 3,
    areaCount: 19,
    color: '#8B5CF6',
    category: 'Technology',
    description: 'Training AI systems with explicit principles',
    tags: ['principles', 'harmlessness', 'helpfulness']
  }
];

// Connection data - representing relationships between concepts
const mockLinkData: Omit<NetworkLink, 'distance'>[] = [
  // AI connections
  { source: 'ai', target: 'machine-learning', value: 10 },
  { source: 'ai', target: 'nlp', value: 8 },
  { source: 'ai', target: 'ethics', value: 6 },
  { source: 'machine-learning', target: 'neural-networks', value: 9 },
  { source: 'neural-networks', target: 'transformers', value: 8 },
  { source: 'transformers', target: 'llms', value: 10 },
  { source: 'nlp', target: 'transformers', value: 7 },
  { source: 'nlp', target: 'llms', value: 9 },
  
  // Philosophy connections
  { source: 'philosophy', target: 'ethics', value: 9 },
  { source: 'philosophy', target: 'consciousness', value: 8 },
  { source: 'ethics', target: 'ai-alignment', value: 7 },
  { source: 'ai', target: 'ai-alignment', value: 6 },
  { source: 'ai-alignment', target: 'constitutional-ai', value: 8 },
  
  // Cognitive Science connections
  { source: 'cognitive-science', target: 'consciousness', value: 8 },
  { source: 'cognitive-science', target: 'memory', value: 7 },
  { source: 'consciousness', target: 'embodied-cognition', value: 6 },
  { source: 'memory', target: 'neural-networks', value: 5 },
  
  // Complex Systems connections
  { source: 'complexity', target: 'emergence', value: 9 },
  { source: 'emergence', target: 'swarm-intelligence', value: 7 },
  { source: 'ai', target: 'swarm-intelligence', value: 4 },
  
  // Cross-domain connections
  { source: 'neural-networks', target: 'consciousness', value: 4 },
  { source: 'machine-learning', target: 'emergence', value: 5 },
  { source: 'cognitive-science', target: 'ai', value: 6 },
  { source: 'embodied-cognition', target: 'ai', value: 3 }
];

const NetworkGraphVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const simulationRef = useRef<d3.Simulation<NetworkNode, NetworkLink> | null>(null);

  // Process data for D3
  const { nodes, links } = useMemo(() => {
    const filteredNodes = mockNetworkData.filter(node => 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = mockLinkData
      .filter(link => nodeIds.has(link.source as string) && nodeIds.has(link.target as string))
      .map(link => ({
        ...link,
        distance: 80 + (10 - link.value) * 10 // Stronger connections = shorter distance
      }));

    return {
      nodes: filteredNodes.map(node => ({ ...node })),
      links: filteredLinks
    };
  }, [searchQuery]);

  // Legend data
  const legendData: LegendItem[] = useMemo(() => {
    const categories = [...new Set(nodes.map(n => n.category))];
    return categories.map(category => ({
      color: nodes.find(n => n.category === category)?.color || '#8B5CF6',
      label: category,
      count: nodes.filter(n => n.category === category).length
    }));
  }, [nodes]);

  // Size scale
  const sizeScale = useMemo(() => {
    const extent = d3.extent(nodes, d => d.areaCount) as [number, number];
    return d3.scaleLinear()
      .domain(extent)
      .range([8, 25]);
  }, [nodes]);

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

  // D3 Force Simulation
  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        setZoomLevel(event.transform.k);
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Create simulation
    const simulation = d3.forceSimulation<NetworkNode>(nodes)
      .force('link', d3.forceLink<NetworkNode, NetworkLink>(links)
        .id(d => d.id)
        .distance(d => d.distance)
        .strength(0.3))
      .force('charge', d3.forceManyBody()
        .strength(-200)
        .distanceMax(200))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide()
        .radius(d => sizeScale(d.areaCount) + 2))
      .alpha(0.3)
      .alphaDecay(0.01);

    simulationRef.current = simulation;

    // Create links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .style('stroke', '#475569')
      .style('stroke-width', d => Math.max(1, d.value / 3))
      .style('stroke-opacity', 0.6)
      .style('stroke-dasharray', d => d.value < 5 ? '2,2' : 'none');

    // Create nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');
    const node = nodeGroup.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => sizeScale(d.areaCount))
      .style('fill', d => d.color)
      .style('stroke', d => selectedNode === d.id ? '#FFF' : 'rgba(255,255,255,0.2)')
      .style('stroke-width', d => selectedNode === d.id ? 3 : 1.5)
      .style('cursor', 'pointer')
      .style('opacity', d => hoveredNode && hoveredNode !== d.id ? 0.4 : 0.9)
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(selectedNode === d.id ? null : d.id);
      })
      .on('mouseover', (event, d) => {
        setHoveredNode(d.id);
        
        // Highlight connected nodes and links
        const connectedNodeIds = new Set<string>();
        connectedNodeIds.add(d.id);
        
        links.forEach(link => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          
          if (sourceId === d.id) connectedNodeIds.add(targetId);
          if (targetId === d.id) connectedNodeIds.add(sourceId);
        });
        
        node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.2);
        link.style('opacity', l => {
          const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
          const targetId = typeof l.target === 'string' ? l.target : l.target.id;
          return sourceId === d.id || targetId === d.id ? 0.9 : 0.1;
        });
      })
      .on('mouseout', () => {
        setHoveredNode(null);
        node.style('opacity', 0.9);
        link.style('opacity', 0.6);
      })
      .call(d3.drag<SVGCircleElement, NetworkNode>()
        .on('start', (event, d) => {
          if (!event.active && simulation) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active && simulation) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Create labels (conditionally shown)
    const labelGroup = g.append('g').attr('class', 'labels');
    const labels = labelGroup.selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .style('text-anchor', 'middle')
      .style('fill', '#E2E8F0')
      .style('font-size', '11px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('opacity', showLabels ? 1 : 0)
      .text(d => d.name);

    // Update label visibility
    labels.style('opacity', showLabels ? 1 : 0);

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as NetworkNode).x!)
        .attr('y1', d => (d.source as NetworkNode).y!)
        .attr('x2', d => (d.target as NetworkNode).x!)
        .attr('y2', d => (d.target as NetworkNode).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      labels
        .attr('x', d => d.x!)
        .attr('y', d => d.y! - sizeScale(d.areaCount) - 8);
    });

    // Click to deselect
    svg.on('click', () => setSelectedNode(null));

    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions, selectedNode, hoveredNode, showLabels, sizeScale]);

  // Control functions
  const toggleSimulation = () => {
    if (simulationRef.current) {
      if (isRunning) {
        simulationRef.current.stop();
      } else {
        simulationRef.current.restart();
      }
      setIsRunning(!isRunning);
    }
  };

  const resetSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
      setIsRunning(true);
    }
  };

  const zoomIn = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.5
    );
  };

  const zoomOut = () => {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.67
    );
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-3">
              <Network className="w-8 h-8 text-indigo-400" />
              <span>Knowledge Network</span>
            </h1>
            <p className="text-slate-400 mt-2">
              Interactive network visualization of interconnected knowledge domains
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSimulation}
              className={`p-2 rounded-lg transition-colors ${
                isRunning ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'
              }`}
              title={isRunning ? 'Pause simulation' : 'Start simulation'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            
            <button
              onClick={resetSimulation}
              className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg transition-colors text-slate-400"
              title="Reset layout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={zoomIn}
              className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg transition-colors text-slate-400"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            <button
              onClick={zoomOut}
              className="p-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg transition-colors text-slate-400"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-2 rounded-lg transition-colors ${
                showLabels ? 'bg-indigo-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle labels"
            >
              {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Visualization */}
        <div className="lg:col-span-3">
          <div 
            ref={containerRef}
            className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-5 h-[700px] relative overflow-hidden"
          >
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
            
            {/* Status indicator */}
            <div className="absolute top-4 right-4 bg-slate-800/80 rounded-lg px-3 py-1 text-xs text-slate-300">
              Zoom: {Math.round(zoomLevel * 100)}% | 
              Nodes: {nodes.length} | 
              Links: {links.length}
            </div>
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

          {/* Legend */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Categories</h3>
            <div className="space-y-2">
              {legendData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNodeData && (
            <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-3">Node Details</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-1">{selectedNodeData.name}</h4>
                  <span className="inline-block px-2 py-1 text-xs rounded-full" style={{
                    backgroundColor: `${selectedNodeData.color}20`,
                    color: selectedNodeData.color,
                    border: `1px solid ${selectedNodeData.color}40`
                  }}>
                    {selectedNodeData.category}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400">{selectedNodeData.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Areas:</span>
                  <span className="text-slate-300">{selectedNodeData.areaCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Level:</span>
                  <span className="text-slate-300">{selectedNodeData.level}</span>
                </div>
                
                {selectedNodeData.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedNodeData.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4">
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Interactions</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center justify-between">
                <span>Click:</span>
                <span className="text-slate-300">Select node</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Drag:</span>
                <span className="text-slate-300">Move node</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hover:</span>
                <span className="text-slate-300">Highlight connections</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Wheel:</span>
                <span className="text-slate-300">Zoom in/out</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Node size:</span>
                <span className="text-slate-300">Area count</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Link thickness:</span>
                <span className="text-slate-300">Connection strength</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraphVisualizer;