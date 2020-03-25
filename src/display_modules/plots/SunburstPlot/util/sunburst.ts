import * as d3 from 'd3';

export interface SunburstDataType {
  name: string;
  parent?: string;
  color?: string;
  size: number;
  children: SunburstDataType[];
}

export type Node = d3.HierarchyRectangularNode<SunburstDataType>;

/**
 * Given a node in a partition layout, return an array of all of its ancestor
 * nodes, highest first, but excluding the root.
 * @param node
 */
function getAncestors(node: Node) {
  const ancestorPath: Node[] = [];
  let current = node;
  while (current.parent) {
    ancestorPath.unshift(current);
    current = current.parent;
  }
  return ancestorPath;
}

export interface SunburstOptionsType {
  data: SunburstDataType;
}

export default class Sunburst {
  protected rawRootDiv: HTMLDivElement;
  protected rootDiv: d3.Selection<HTMLDivElement, {}, null, undefined>;
  protected svg: d3.Selection<SVGSVGElement, {}, null, undefined>;

  protected tooltip: d3.Selection<HTMLDivElement, {}, null, undefined>;
  protected canvas: d3.Selection<SVGGElement, {}, null, undefined>;

  /**
   * Create Sunburst plot
   * @param rootDiv - wrapping div element. Used to insert tooltip into
   * @param rootSvg - the SVG element
   */
  constructor(rootDiv: HTMLDivElement, rootSvg: SVGSVGElement) {
    this.rawRootDiv = rootDiv;
    this.rootDiv = d3.select(rootDiv);
    this.svg = d3.select(rootSvg);

    // Add the tooltip area to the webpage
    this.tooltip = this.rootDiv
      .append('div')
      .attr('class', 'sunburst-tooltip')
      .style('z-index', 5)
      .style('opacity', 0);

    // Add canvas
    this.canvas = this.svg.append('g').attr('class', 'canvas');
  }

  /**
   * Render a Sunburst dataset, removing or adding SVG elements as necessary.
   * @param options - The Sunburst plot options.
   */
  update(options: SunburstOptionsType) {
    const boundingSize = this.rootDiv.node()!.getBoundingClientRect(),
      width = Math.min(boundingSize.width, 350),
      height = width,
      radius = Math.min(width, height) / 2 - 10;

    this.svg.attr('width', width).attr('height', height);

    const x = d3.scaleLinear().range([0, 2 * Math.PI]);
    const y = d3.scaleSqrt().range([0, radius]);

    const color = d3.scaleOrdinal(d3.schemeCategory20c);

    const root = d3
      .hierarchy(options.data)
      .sum(d => (d.children.length === 0 ? d.size : 0));

    // Create our sunburst data structure and size it.
    const partition = d3.partition<SunburstDataType>();
    const nodes = partition(root).descendants();

    // Calculate the sizes of each arc that we'll draw later.
    const arc = d3
      .arc<Node>()
      .startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
      .endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));

    // Capture elements to make them available within the callbacks
    const safeCanvas = this.canvas;
    const safeRootDiv = this.rootDiv;
    const safeTooltip = this.tooltip;

    /**
     * Fade all but the current sequence, and show it in the breadcrumb trail.
     * @param node The hierachy node of the arc hovered over
     */
    const onMouseOver: d3.ValueFn<SVGPathElement, Node, void> = (
      node: Node,
    ) => {
      const percentage = parseFloat(node.value!.toPrecision(3)!)!;
      const percentageString = percentage < 0.1 ? '< 0.1%' : `${percentage}%`;

      const [eventX, eventY] = d3.mouse(safeRootDiv.node()!);
      safeTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9);
      safeTooltip
        .html(`${percentageString} ${node.data.name}`)
        .style('left', `${eventX + 15}px`)
        .style('top', `${eventY - 40}px`);

      // Fade all the segments.
      safeCanvas.selectAll('path').style('opacity', 0.2);

      // Then highlight only those that are an ancestor of the current segment.
      const ancestors = getAncestors(node);
      safeCanvas
        .datum(root)
        .selectAll<SVGPathElement, Node>('path')
        .filter((filterNode: Node) => ancestors.indexOf(filterNode) >= 0)
        .style('opacity', 1);
    };

    /**
     * Restore everything to full opacity when moving off the visualization.
     */
    function onMouseLeave() {
      safeTooltip
        .transition()
        .duration(200)
        .style('opacity', 0.0);
      safeCanvas
        .selectAll<SVGPathElement, Node>('path')
        .on('mouseover', null)
        .transition()
        .duration(300)
        .style('opacity', 1.0)
        .on('end', function() {
          d3.select<SVGPathElement, Node>(this).on('mouseover', onMouseOver);
        });
    }

    /**
     * Trigger zoom in/out when node is clicked
     * @param node The hierachy node of the arc clicked
     */
    function click(node: Node) {
      safeCanvas
        .transition()
        .duration(750)
        .tween('scale', function() {
          // When zooming: interpolate the scales.
          const xd = d3.interpolate(x.domain(), [node.x0, node.x1]),
            yd = d3.interpolate(y.domain(), [node.y0, 1]),
            yr = d3.interpolate(y.range(), [node.y0 ? 20 : 0, radius]);
          return (t: number) => {
            x.domain(xd(t));
            y.domain(yd(t)).range(yr(t));
          };
        })
        .selectAll<SVGPathElement, Node>('path')
        .attrTween('d', (tweenNode: Node) => t => arc(tweenNode)!);
    }

    this.canvas
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .on('mouseleave', onMouseLeave);

    // Add a <g> element for each node in thd data, then append <path> elements and draw lines based on the arc
    // variable calculations. Last, color the lines and the slices.
    const nodeGroups = this.canvas
      .selectAll<SVGPathElement, Node>('.node')
      .data(nodes);
    nodeGroups
      .enter()
      .append('path')
      .attr('class', 'node')
      .on('mouseover', onMouseOver)
      .on('click', click)
      .merge(nodeGroups)
      .attr('d', arc)
      .style('fill', function(d: Node) {
        if (d.data.color !== undefined) {
          return d.data.color;
        }
        return color((d.children ? d : d.parent!).data.name);
      });
    nodeGroups.exit().remove();
  }

  /**
   * Handle removal from DOM tree.
   *
   * Note: this may be unnecessary / overkill
   */
  teardown() {
    // Remove elements
    this.tooltip.remove();
    this.canvas.remove();
  }
}
