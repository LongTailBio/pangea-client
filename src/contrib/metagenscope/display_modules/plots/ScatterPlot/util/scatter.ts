import * as d3 from 'd3';

export type Entry = {
  name: string;
  category: string;
  x: number;
  y: number;
};

export type Options = {
  xAxisTitle?: string;
  yAxisTitle?: string;
  focusedCategory?: string;
};

export function createScatter(
  rootDiv: HTMLDivElement,
  rawSVG: SVGSVGElement,
  data: Entry[],
  options: Options,
  color: d3.ScaleOrdinal<string, string>,
) {
  const boundingSize = d3
      .select(rootDiv)
      .node()!
      .getBoundingClientRect(),
    canvasWidth = boundingSize.width,
    canvasHeight = (canvasWidth * 9) / 16,
    svg = d3
      .select(rawSVG)
      .attr('width', canvasWidth)
      .attr('height', canvasHeight);

  // One potential way to deal with scaling of the page.
  /*
        svg = d3.select(rawSVG)
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`)
          .attr('width', '100%');
  */

  // Add the tooltip area to the webpage
  const tooltip = d3
    .select(rootDiv)
    .append('div')
    .attr('class', 'scatter-tooltip')
    .style('z-index', 5)
    .style('opacity', 0);

  const margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = canvasWidth - margin.left - margin.right,
    height = canvasHeight - margin.top - margin.bottom;

  // Set up x
  const xValue = function(d: Entry) {
      return d.x;
    },
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d: Entry) {
      return xScale(xValue(d));
    },
    xAxis = d3.axisBottom(xScale);

  // Set up y
  const yValue = function(d: Entry) {
      return d.y;
    },
    yScale = d3.scaleLinear().range([height, 0]),
    yMap = function(d: Entry) {
      return yScale(yValue(d));
    },
    yAxis = d3.axisLeft(yScale);

  const cValue = function(d: Entry) {
    return d.category;
  };

  // Add some padding between dots and axis
  const xMin = d3.min(data, xValue) as number,
    xMax = d3.max(data, xValue) as number,
    xRange = xMax - xMin,
    xBuffer = 0.05 * xRange;
  const yMin = d3.min(data, yValue) as number,
    yMax = d3.max(data, yValue) as number,
    yRange = yMax - yMin,
    yBuffer = 0.05 * yRange;
  xScale.domain([xMin - xBuffer, xMax + xBuffer]);
  yScale.domain([yMin - yBuffer, yMax + yBuffer]);

  // Clear canvas
  svg.selectAll('*').remove();

  // Add the graph canvas to the body of the webpage
  const canvas = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // x-axis
  const xAxisElement = canvas
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  if (options.xAxisTitle !== undefined) {
    xAxisElement
      .append('text')
      .attr('class', 'label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text(options.xAxisTitle);
  }

  // y-axis
  const yAxisElement = canvas
    .append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  if (options.yAxisTitle !== undefined) {
    yAxisElement
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text(options.yAxisTitle);
  }

  // Add appropriate class if a particular category value is highlighted
  let className = 'dots';
  if (options.focusedCategory !== undefined) {
    className = `${className} focused`;
  }

  // Draw dots
  canvas
    .append('g')
    .attr('class', className)
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', d => {
      let dotClassName = 'dot';
      if (d.category === options.focusedCategory) {
        dotClassName = `${className} focused`;
      }
      return dotClassName;
    })
    .attr('r', 8)
    .attr('cx', xMap)
    .attr('cy', yMap)
    .style('fill', d => color(cValue(d)))
    .on('mouseover', function(d: Entry) {
      const [eventX, eventY] = d3.mouse(rootDiv);
      tooltip
        .transition()
        .duration(200)
        .style('opacity', 0.9);
      tooltip
        .html(d.name)
        .style('left', `${eventX + 15}px`)
        .style('top', `${eventY - 40}px`);
    })
    .on('mouseout', function(d: Entry) { // eslint-disable-line
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });
}
