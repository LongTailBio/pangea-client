import * as React from 'react';
import * as d3 from 'd3';

import { Entry, createScatter } from './util/scatter';
import { SvgRefProps } from '../../components/DisplayContainer/d3';

import './style.css';

export type ScatterPlotEntry = Entry;

export interface ScatterPlotProps extends SvgRefProps {
  color: d3.ScaleOrdinal<string, string>;
  data: Entry[];
  focusedCategory?: string;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export default class ScatterPlot extends React.Component<ScatterPlotProps, {}> {
  private rootDiv: HTMLDivElement | null = null;
  private scatterSVG: SVGSVGElement | null = null;

  componentDidMount() {
    this.renderScatter(this.props);
  }

  shouldComponentUpdate(nextProps: ScatterPlotProps) {
    // TODO: Animate this change based on `name` attributes of data
    this.renderScatter(nextProps);

    return false;
  }

  renderScatter(props: ScatterPlotProps) {
    const plotOptions = {
      xAxisTitle: props.xAxisTitle,
      yAxisTitle: props.yAxisTitle,
      focusedCategory: props.focusedCategory,
    };

    if (this.rootDiv !== null && this.scatterSVG !== null) {
      // TODO: hold onto D3 reference so we can later manipulate it when props update
      createScatter(this.rootDiv, this.scatterSVG, props.data, plotOptions, props.color);
    }
  }

  render() {
    return (
      <div ref={(elem) => { this.rootDiv = elem; }}>
        <svg
          ref={(elem) => {
            this.scatterSVG = elem;
            this.props.svgRef(elem);
          }}
        />
      </div>
    );
  }
}
