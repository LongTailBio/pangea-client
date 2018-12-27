import * as d3 from 'd3';
import * as d3_sankey from 'd3-sankey';
import chroma from 'chroma-js';

// Input types
export interface Node {
  id: string;
  name: string;
  value: number;
  percentage?: number;
}

export interface Edge {
  source: string;
  target: string;
  value: number;
}

export interface Data {
  nodes: Node[];
  edges: Edge[];
}

// Convenience types
type SankeyLink = d3_sankey.SankeyLink<Node, {}>;
type SankeyNode = d3_sankey.SankeyNode<Node, {}>;

// Constants
const rankNames = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species', 'Sample'];

// Convenience function for sorting by generated Sankey node "value" (height)
const nodeSort = function(a: SankeyNode, b: SankeyNode) {
  // Sort by y0, y1 delta because .height property is not correct
  return d3.descending((a.y1! - a.y0!), (b.y1! - b.y0!));
};

// Create a Map<[nodeId], [color]> given a set of input nodes
const createColorMap = function(nodes: SankeyNode[]): Map<string, string> {
  const colorMap = new Map<string, string>();

  const scaleValues = ['green', 'yellow', 'orange', 'red', 'pink', 'purple', 'blue'];

  for (let depth = 0; depth < rankNames.length; depth++) {
    const nodesAtDepth = nodes.filter(node => node.depth === depth).sort(nodeSort);
    const chromaColors = chroma.scale(scaleValues).colors(nodesAtDepth.length);
    const d3colors = d3.scaleOrdinal(d3.schemeCategory10);
    nodesAtDepth.forEach((node, index) => {
      let color: string;
      if (depth === 0) {
        color = chromaColors[index];
      } else if (depth === rankNames.length - 1) {
        color = chroma('slategray').hex();
      } else {
        const parentNode = node.targetLinks![0].source as SankeyNode;
        const parentColor = colorMap.get(parentNode.id)!;
        const mixColor = d3colors(node.name.replace(/ .*/, ''));
        color = chroma.mix(chroma(parentColor), chroma(mixColor), 0.3).hex();
      }
      colorMap.set(node.id, color);
    });
  }

  return colorMap;
};

// Top align nodes at each depth and sort by value
const alignNodes = function(nodes: SankeyNode[], yMarginTop: number, nodePadding: number) {
  const depths = nodes.map(node => node.depth!),
        minDepth = Math.min(...depths),
        maxDepth = Math.max(...depths);

  for (let depth = minDepth; depth <= maxDepth; depth++) {
    // Sort nodes at this depth
    const nodesAtDepth = nodes.filter(node => node.depth === depth).sort(nodeSort);

    // Update node y positions
    let yOffset = yMarginTop;
    let rankHeight = 0;
    nodesAtDepth.forEach(graphNode => {
      const height = graphNode.y1! - graphNode.y0!;
      graphNode.y0 = yOffset;
      graphNode.y1 = yOffset + height;
      yOffset += height + nodePadding;
      rankHeight += height;
    });
    // Calculate percentage of total for each node (except samples)
    if (depth < maxDepth) {
      nodesAtDepth.forEach(graphNode => {
        const height = graphNode.y1! - graphNode.y0!;
        graphNode.percentage = height / rankHeight * 100;
      });
    }
  }
};

export function createTaxonAbundance(rootDiv: HTMLDivElement, rawSVG: SVGSVGElement, inputData: Data) {
  // Set up canvas
  const boundingSize = d3.select(rootDiv).node()!.getBoundingClientRect(),
      canvasWidth = boundingSize.width,
      canvasHeight = canvasWidth * 3 / 4,
      svg = d3.select(rawSVG)
        .attr('width', canvasWidth)
        .attr('height', canvasHeight);

  // Define constants
  const nodeWidth = 30,
        nodePadding = 1;

  // Create Sankey graph helper
  const sankey = d3_sankey.sankey<Node, {}>()
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .nodeId(n => n.id)
      .nodeAlign(d3_sankey.sankeyLeft)
      .extent([[1, 30], [canvasWidth - 1, canvasHeight - 1]]);

  // Render titles for each rank
  rankNames.forEach((name, index, arr) => {
    const isLast = index === arr.length - 1;
    const anchor = (index === 0) ? 'beginning' : (!isLast ? 'middle' : 'end');
    svg.append('text')
      .attr('x', index * canvasWidth / (arr.length - 1))
      .attr('text-anchor', anchor)
      .attr('y', 15)
      .text(name);
  });

  // Create group to hold all the links
  let linksGroup = svg.append('g')
      .attr('class', 'links')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.4)
    .selectAll('path');

  // Create group to hold all the nodes
  let nodesGroup = svg.append('g')
      .attr('class', 'nodes')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
    .selectAll('g');

  // Add the tooltip area to the webpage
  const tooltip = d3.select(rootDiv).append('div')
    .attr('class', 'taxonomy-tooltip')
    .style('z-index', 5)
    .style('opacity', 0);

  // Convert input nodes
  const sankeyNodes: SankeyNode[] = inputData.nodes;

  // Create Sankey graph from inputs
  const graph: d3_sankey.SankeyGraph<Node, {}> = {
    nodes: sankeyNodes,
    links: inputData.edges,
  };

  // Perform inital layout pass
  sankey(graph);
  // Vertically align and sort nodes in each rank
  alignNodes(graph.nodes, sankey.extent()[0][1], nodePadding);
  // Perform second layout pass to update link paths for the new node posiitons
  sankey.update(graph);
  // Generate colors for the nodes
  const colorMap = createColorMap(graph.nodes);

  // Render links
  linksGroup.data(graph.links)
    .enter().append('path')
    .attr('d', d3_sankey.sankeyLinkHorizontal())
    .attr('stroke', (d: SankeyLink) => {
      const parent = d.source! as SankeyNode;
      return colorMap.get(parent.id)!;
    })
    .attr('stroke-width', (d) => Math.max(1, d.width!))
    .attr('class', 'link')
    .on('mouseover', function() {
      d3.select(this).attr('class', 'link on');
    })
    .on('mouseout', function() {
      d3.select(this).attr('class', 'link');
    });

  // Render nodes
  const nodes = nodesGroup
    .data(graph.nodes)
    .enter().append('g');

  const tooltipContent = (node: SankeyNode) => {
    const title = node.name;
    const subtitle = node.percentage ? `${node.percentage.toFixed(2)}%` : '';
    return `<span>${title}</span>${subtitle}`;
  };

  nodes.append('rect')
    .attr('x', (d) => d.x0!)
    .attr('y', (d) => d.y0!)
    .attr('height', (d) => d.y1! - d.y0!)
    .attr('width', (d) => d.x1! - d.x0!)
    .attr('fill', (d) => {
      return colorMap.get(d.id) || 'red';
    })
    .on('mouseover', function(node: SankeyNode) {
      // Show tooltip
      const [eventX, eventY] = d3.mouse(rootDiv);
      tooltip.transition()
        .duration(200)
        .style('opacity', .95);
      tooltip.html(tooltipContent(node))
        .style('left', `${(eventX + 15)}px`)
        .style('top', `${(eventY - 40)}px`);

      // Highlight all connected links (incoming and outgoing)
      svg.selectAll<SVGPathElement, SankeyLink>('.link')
        .attr('class', (link: SankeyLink) => {
          const source = link.source as SankeyNode,
                target = link.target as SankeyNode,
                isOn = (source.id === node.id || target.id === node.id);
          return `link${isOn ? ' on' : ''}`;
        });
      d3.select(this).attr('class', 'node on');
    })
    .on('mouseout', function() {
      // Hide tooltip
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);

      // Unhighlight connected links
      svg.selectAll('.link.on').attr('class', 'link');
      d3.select(this).attr('class', 'node');
    })
    .attr('class', 'node');
}
