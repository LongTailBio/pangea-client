import * as d3 from 'd3';

const DEFAULT_BUCKETS = 9;
const DEFAULT_LEGEND_PRECISION = 0;
const DEFAULT_MAX_AXIS_NAME_LENGTH = 40;

export interface HeatMapDatum {
  x: number;
  y: number;
  value: number;
}

export interface HeatMapPlotOptions {
  buckets?: number;
  maxAxisNameLength?: number;
  legend?: {
    precision?: number;
  };
}

export interface HeatMapOptions extends HeatMapPlotOptions {
  axis: {
    x: {
      name: string;
      category?: string;
    }[];
    y: string[];
    categoryColors?: string[];
  };
  data: HeatMapDatum[];
}

export default class HeatMap {

  protected rawRootDiv: HTMLDivElement;
  protected rootDiv: d3.Selection<HTMLDivElement, {}, null, undefined>;
  protected svg: d3.Selection<SVGSVGElement, {}, null, undefined>;

  protected tooltip: d3.Selection<d3.BaseType, {}, null, undefined>;
  protected xAxis: d3.Selection<d3.BaseType, {}, null, undefined>;
  protected yAxis: d3.Selection<d3.BaseType, {}, null, undefined>;
  protected canvas: d3.Selection<d3.BaseType, {}, null, undefined>;
  protected legend: d3.Selection<d3.BaseType, {}, null, undefined>;

  protected margin: {top: number, right: number, bottom: number, left: number};

  /**
   * Create Heat Map plot
   * @param rootDiv - wrapping div element. Used to insert tooltip into
   * @param rootSvg - the SVG element
   */
  constructor(rootDiv: HTMLDivElement, rootSvg: SVGSVGElement) {
    this.margin = {top: 0, right: 0, bottom: 0, left: 0};

    this.rawRootDiv = rootDiv;
    this.rootDiv = d3.select(rootDiv);
    this.svg = d3.select(rootSvg);

    // Add the tooltip area to the webpage
    this.tooltip = this.rootDiv.append('div')
      .attr('class', 'heatmap-tooltip')
      .style('z-index', 5)
      .style('opacity', 0);

    // Add root elements
    this.xAxis = this.svg.append('g').attr('class', 'x-axis');
    this.yAxis = this.svg.append('g').attr('class', 'y-axis');
    this.canvas = this.svg.append('g').attr('class', 'canvas');
    this.legend = this.svg.append('g').attr('class', 'legend');
  }

  parseOptions(options: HeatMapPlotOptions) {
    let result = {
      buckets: DEFAULT_BUCKETS,
      maxAxisNameLength: DEFAULT_MAX_AXIS_NAME_LENGTH,
      legend: {
        precision: DEFAULT_LEGEND_PRECISION,
      }
    };

    if (options.buckets !== undefined) {
      result.buckets = options.buckets;
    }

    if (options.legend !== undefined) {
      if (options.legend.precision !== undefined) {
        result.legend.precision = options.legend.precision;
      }
    }

    return result;
  }

  /**
   * Render a Heat Map dataset, removing or adding SVG elements as necessary.
   * @param data - The Heat Map dataset.
   */
  update(data: HeatMapOptions) {
    // Examine data
    const xMax = d3.max(data.data, (d: HeatMapDatum) => d.x)!,
          yMax = d3.max(data.data, (d: HeatMapDatum) => d.y)!,
          valMax = d3.max(data.data, (d: HeatMapDatum) => d.value)!;

    const options = this.parseOptions(data);

    // Establish sizing contraints
    this.canvas.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    const maxRowNameLength = d3.max(data.axis.y.map(d => d.length))!,
          boundingSize = this.rootDiv.node()!.getBoundingClientRect(),
          canvasWidth = boundingSize.width - this.margin.left - this.margin.right;
    let gridSize = Math.floor(canvasWidth / (xMax + 1));
    const rowNameWidth = Math.min(maxRowNameLength * gridSize, options.maxAxisNameLength);
    gridSize = Math.floor((canvasWidth - rowNameWidth) / (xMax + 1));
    gridSize = (canvasWidth - rowNameWidth) / (xMax + 1);
    let canvasHeight = 0;

    // Column names
    const columnNames = this.xAxis.selectAll('.column-name')
        .data(data.axis.x, (d: {name: string, category?: string}) => d.name);
    const maxStringLength = d3.max(data.axis.x.map(d => d.name.length))!;
    const itemHeight = Math.min(maxStringLength * gridSize, options.maxAxisNameLength);
    columnNames.enter().append('text')
      .attr('class', 'column-name')
      .merge(columnNames)
          .text(d => d.name)
          .attr('font-size', gridSize)
          .attr('transform', (d, i) => `translate(${(gridSize * (i + 1)) + rowNameWidth}, ${itemHeight}) rotate(-75)`);

    columnNames.exit().remove();

    canvasHeight += itemHeight;

    // Row names
    const rowNames = this.yAxis.selectAll('.row-name')
        .data(data.axis.x, (d: {name: string, category?: string}) => d.name);
    rowNames.enter().append('text')
      .attr('class', 'row-name')
      .attr('text-anchor', 'end')
      .merge(rowNames)
          .text(d => d.name)
          .attr('font-size', gridSize)
          .attr('transform', (d, i) => `translate(${rowNameWidth - 1}, ${canvasHeight + (gridSize * (i + 1))})`);

    rowNames.exit().remove();

    // Heatmap color mapping
    const colorGenerator = d3.scaleLinear<string>()
          .domain([0, (options.buckets - 1) / 2, options.buckets - 1])
          .range(['green', 'yellow', 'red']);
    const colors = d3.range(options.buckets).map(colorGenerator);
    const colorScale = d3.scaleQuantile<string>()
        .domain([0, valMax])
        .range(colors);

    const cards = this.canvas.selectAll('.cell')
        .data(data.data, (d: HeatMapDatum) => `${d.x}:${d.y}`);

    const safeRootDiv = this.rootDiv;
    const safeTooltip = this.tooltip;
    cards.enter().append('rect')
        .attr('class', 'cell bordered')
        .style('fill', colors[0])
        .on('mouseover', function(d: HeatMapDatum) {
          const [eventX, eventY] = d3.mouse(safeRootDiv.node()!);
          safeTooltip.transition()
              .duration(200)
              .style('opacity', 0.9);
          safeTooltip.html(`(${data.axis.x[d.x].name}, ${data.axis.y[d.y]}) <b>${d.value}</b>`)
              .style('left', `${(eventX + 15)}px`)
              .style('top', `${(eventY - 40)}px`);
        })
        .on('mouseout', function(d: HeatMapDatum) {
          safeTooltip.transition()
              .duration(500)
              .style('opacity', 0);
        })
        .merge(cards)
            .attr('x', (d: HeatMapDatum) => (d.x * gridSize) + rowNameWidth)
            .attr('y', (d: HeatMapDatum) => canvasHeight + (d.y * gridSize))
            .attr('width', gridSize)
            .attr('height', gridSize)
            .style('fill', (d: HeatMapDatum) => {
              return colorScale(d.value);
            });

    cards.exit().remove();

    // Update canvas height
    canvasHeight += gridSize * (yMax + 1);

    // Add padding
    canvasHeight += gridSize;

    // Draw legend
    const legendElementWidth = canvasWidth / options.buckets,
          legendElementHeight = 20,
          legendHeight =  2 * legendElementHeight;

    const legend = this.legend.selectAll('.legend')
        .data([0].concat(colorScale.quantiles()), d => '' + d);

    const legendValues = legend.enter().append('g')
        .attr('class', 'legend');

    legendValues.append('rect')
        .attr('x', (d, i) => legendElementWidth * i)
        .attr('y', canvasHeight)
        .attr('width', legendElementWidth)
        .attr('height', legendElementHeight)
        .style('fill', (d, i) => colors[i]);

    legendValues.append('text')
      .attr('class', 'mono')
      .text(d => {
        if (options.legend.precision > 0) {
          return '≥ ' + d.toPrecision(options.legend.precision);
        }
        return '≥ ' + Math.round(d);
      })
      .attr('x', (d, i) => legendElementWidth * i)
      .attr('y', canvasHeight + (legendElementHeight * 2));

    legend.exit().remove();

    // Add legend height
    canvasHeight += legendHeight;

    // Update final SVG size
    const svgHeight = this.margin.top + canvasHeight + this.margin.bottom;
    this.svg.attr('width', boundingSize.width).attr('height', svgHeight);
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