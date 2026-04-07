import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';

export default function KnowledgeGraph({ papers = [], relationships = [] }) {
  const svgRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  const containerRef = useRef(null);

  // Category colors - distinct palette for different research categories
  const categoryColors = {
    'cs.LG': '#3b82f6',  // blue
    'cs.CV': '#8b5cf6',  // purple
    'cs.AI': '#ec4899',  // pink
    'cs.CL': '#10b981',  // green
    'cs.NE': '#f59e0b',  // amber
    'default': '#6b7280' // gray
  };

  // Relationship colors and styles
  const relationshipStyles = {
    extends: { color: '#3b82f6', dash: 'none', label: 'extends' },
    contradicts: { color: '#ef4444', dash: 'none', label: 'contradicts' },
    related: { color: '#9ca3af', dash: '5,5', label: 'related' },
    replicates: { color: '#10b981', dash: 'none', label: 'replicates' }
  };

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 500
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Truncate title for display
  const truncateTitle = (title, maxWords = 4) => {
    const words = title.split(' ');
    if (words.length <= maxWords) return title;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Handle node click
  const handleNodeClick = useCallback((event, d) => {
    event.stopPropagation();
    setSelectedNode(d);
  }, []);

  // Main D3 visualization
  useEffect(() => {
    if (!svgRef.current || !papers.length || dimensions.width === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const { width, height } = dimensions;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create main group for zoom/pan
    const g = svg.append('g');

    // Transform data for D3
    const nodes = papers.map(p => ({
      id: p.arxiv_id,
      title: p.title,
      authors: p.authors,
      published: p.published,
      categories: p.categories,
      url: p.url
    }));

    const links = relationships.map(r => ({
      source: r.source_id,
      target: r.target_id,
      relationship: r.relationship,
      confidence: r.confidence
    }));

    // Calculate node degree (connection count)
    const nodeDegree = {};
    nodes.forEach(n => { nodeDegree[n.id] = 0; });
    links.forEach(l => {
      nodeDegree[l.source] = (nodeDegree[l.source] || 0) + 1;
      nodeDegree[l.target] = (nodeDegree[l.target] || 0) + 1;
    });

    // Node radius based on degree
    const getNodeRadius = (nodeId) => {
      const degree = nodeDegree[nodeId] || 0;
      return Math.min(40, Math.max(20, 20 + degree * 3));
    };

    // Get node color based on category
    const getNodeColor = (node) => {
      const category = node.categories?.[0] || 'default';
      return categoryColors[category] || categoryColors.default;
    };

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => getNodeRadius(d.id) + 10));

    // Create arrow markers for directed edges
    const defs = svg.append('defs');
    Object.entries(relationshipStyles).forEach(([type, style]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', style.color);
    });

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => relationshipStyles[d.relationship]?.color || '#9ca3af')
      .attr('stroke-width', d => Math.max(1, d.confidence * 3))
      .attr('stroke-dasharray', d => relationshipStyles[d.relationship]?.dash || 'none')
      .attr('marker-end', d => `url(#arrow-${d.relationship})`)
      .attr('opacity', 0.6);

    // Create link labels (hidden by default, shown on hover)
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('class', 'link-label')
      .attr('text-anchor', 'middle')
      .attr('fill', '#e8e6e3')
      .attr('font-size', '10px')
      .attr('opacity', 0)
      .text(d => relationshipStyles[d.relationship]?.label || d.relationship);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'graph-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', '#1a1f29')
      .style('color', '#e8e6e3')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('border', '1px solid #374151')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('max-width', '300px');

    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => getNodeRadius(d.id))
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer');

    // Add selection ring (hidden by default)
    node.append('circle')
      .attr('class', 'selection-ring')
      .attr('r', d => getNodeRadius(d.id) + 5)
      .attr('fill', 'none')
      .attr('stroke', '#d4a574')
      .attr('stroke-width', 3)
      .attr('opacity', 0);

    // Add labels to nodes
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => getNodeRadius(d.id) + 15)
      .attr('fill', '#e8e6e3')
      .attr('font-size', '11px')
      .attr('pointer-events', 'none')
      .text(d => truncateTitle(d.title, 4));

    // Node hover effects
    node.on('mouseenter', function(event, d) {
      // Highlight this node
      d3.select(this).select('circle').attr('stroke-width', 4);

      // Dim unconnected nodes and edges
      const connectedNodeIds = new Set();
      connectedNodeIds.add(d.id);
      
      links.forEach(l => {
        if (l.source.id === d.id || l.target.id === d.id) {
          connectedNodeIds.add(l.source.id);
          connectedNodeIds.add(l.target.id);
        }
      });

      node.attr('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.2);
      link.attr('opacity', l => 
        (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
      );

      // Show tooltip
      const authors = d.authors.slice(0, 2).join(', ') + (d.authors.length > 2 ? ' et al.' : '');
      const year = new Date(d.published).getFullYear();
      
      tooltip.html(`
        <div style="font-weight: 600; margin-bottom: 8px;">${d.title}</div>
        <div style="color: #9ca3af; margin-bottom: 4px;">${authors}</div>
        <div style="color: #9ca3af;">${year}</div>
      `)
        .style('visibility', 'visible');
    })
    .on('mousemove', function(event) {
      tooltip
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseleave', function() {
      d3.select(this).select('circle').attr('stroke-width', 2);
      node.attr('opacity', 1);
      link.attr('opacity', 0.6);
      tooltip.style('visibility', 'hidden');
    })
    .on('click', (event, d) => handleNodeClick(event, d));

    // Link hover effects
    link.on('mouseenter', function(event, d) {
      d3.select(this).attr('stroke-width', Math.max(2, d.confidence * 4));
      linkLabel.filter(l => l === d).attr('opacity', 1);
    })
    .on('mouseleave', function(event, d) {
      d3.select(this).attr('stroke-width', Math.max(1, d.confidence * 3));
      linkLabel.attr('opacity', 0);
    });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Click on empty space to deselect
    svg.on('click', () => setSelectedNode(null));

    // Cleanup
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [papers, relationships, dimensions, handleNodeClick]);

  // Update selection ring when selectedNode changes
  useEffect(() => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current)
      .selectAll('.selection-ring')
      .attr('opacity', d => d.id === selectedNode?.id ? 1 : 0);
  }, [selectedNode]);

  // Get relationships for selected node
  const getNodeRelationships = (nodeId) => {
    if (!nodeId) return [];
    return relationships.filter(r => r.source_id === nodeId || r.target_id === nodeId);
  };

  // Empty state
  if (!papers.length) {
    return (
      <div className="bg-card-bg rounded-lg border border-gray-700 p-8 h-[500px] flex items-center justify-center">
        <div className="text-center text-text-secondary">
          <svg className="w-16 h-16 mx-auto opacity-50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="font-serif text-lg">Run an analysis to see the knowledge graph</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <h3 className="font-serif text-xl font-semibold text-text-primary">
          Knowledge Graph
        </h3>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-accent-sage/20 text-accent-sage text-xs font-semibold rounded-full">
            {papers.length} papers
          </span>
          <span className="px-3 py-1 bg-accent-amber/20 text-accent-amber text-xs font-semibold rounded-full">
            {relationships.length} connections
          </span>
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative" ref={containerRef}>
        <svg ref={svgRef} className="bg-page-bg" />

        {/* No relationships message */}
        {relationships.length === 0 && papers.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-card-bg border border-gray-700 px-4 py-2 rounded-lg">
            <p className="text-text-secondary text-sm">
              No relationships detected between papers
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card-bg/90 border border-gray-700 rounded-lg p-3 text-xs">
          <div className="font-semibold text-text-primary mb-2">Relationships</div>
          <div className="space-y-1">
            {Object.entries(relationshipStyles).map(([type, style]) => (
              <div key={type} className="flex items-center gap-2">
                <svg width="30" height="2">
                  <line
                    x1="0" y1="1" x2="30" y2="1"
                    stroke={style.color}
                    strokeWidth="2"
                    strokeDasharray={style.dash}
                  />
                </svg>
                <span className="text-text-secondary capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Detail Panel */}
        {selectedNode && (
          <div className="absolute top-0 right-0 w-80 h-full bg-card-bg border-l border-gray-700 p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex items-start justify-between mb-4">
              <h4 className="font-serif text-lg font-semibold text-text-primary">
                Paper Details
              </h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-amber hover:text-accent-amber/80 font-medium"
                >
                  {selectedNode.title}
                </a>
              </div>

              {/* Authors */}
              <div>
                <div className="text-xs text-text-secondary mb-1">Authors</div>
                <div className="text-sm text-text-primary">
                  {selectedNode.authors.join(', ')}
                </div>
              </div>

              {/* Published */}
              <div>
                <div className="text-xs text-text-secondary mb-1">Published</div>
                <div className="text-sm text-text-primary">
                  {new Date(selectedNode.published).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              {/* Categories */}
              <div>
                <div className="text-xs text-text-secondary mb-1">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.categories.map(cat => (
                    <span
                      key={cat}
                      className="px-2 py-1 bg-accent-sage/10 text-accent-sage text-xs rounded border border-accent-sage/30"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Abstract note */}
              <div className="p-3 bg-page-bg rounded border border-gray-700">
                <p className="text-xs text-text-secondary italic">
                  Click title to read full paper on ArXiv
                </p>
              </div>

              {/* Relationships */}
              {getNodeRelationships(selectedNode.id).length > 0 && (
                <div>
                  <div className="text-xs text-text-secondary mb-2">Relationships</div>
                  <div className="space-y-2">
                    {getNodeRelationships(selectedNode.id).map((rel, idx) => {
                      const isSource = rel.source_id === selectedNode.id;
                      const otherId = isSource ? rel.target_id : rel.source_id;
                      const otherPaper = papers.find(p => p.arxiv_id === otherId);
                      
                      return (
                        <div key={idx} className="text-sm bg-page-bg p-2 rounded border border-gray-700">
                          <span style={{ color: relationshipStyles[rel.relationship]?.color }} className="font-semibold">
                            {rel.relationship}
                          </span>
                          {' → '}
                          <span className="text-text-primary">
                            {otherPaper ? truncateTitle(otherPaper.title, 6) : otherId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="px-6 py-3 bg-page-bg/50 border-t border-gray-700 text-xs text-text-secondary">
        <span className="font-semibold">Tip:</span> Drag nodes to rearrange • Scroll to zoom • Click nodes for details • Hover for info
      </div>
    </div>
  );
}
