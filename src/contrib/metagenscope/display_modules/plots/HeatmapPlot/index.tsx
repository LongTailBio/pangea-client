import * as React from 'react';

import HeatMap, { HeatMapOptions } from './util/heatmap';
import { SvgRefProps } from '../../components/DisplayContainer/d3';

import './style.css';

export interface HeatMapProps extends HeatMapOptions, SvgRefProps { }

export default class HeatMapPlot extends React.Component<HeatMapProps, {}> {

  private rootDiv: HTMLDivElement | null = null;
  private heatmapSvg: SVGSVGElement | null = null;

  private heatmap: HeatMap | null = null;

  componentDidMount() {
    if (!(this.rootDiv === null || this.heatmapSvg === null)) {
      this.heatmap = new HeatMap(this.rootDiv, this.heatmapSvg);
      this.heatmap.update(this.props);
    }
  }

  componentWillReceiveProps(nextProps: HeatMapProps) {
    if (this.heatmap !== null) {
      this.heatmap.update(nextProps);
    }
  }

  shouldComponentUpdate(nextProps: HeatMapProps) {
    return false;
  }

  componentWillUnmount() {
    if (this.heatmap !== null) {
      this.heatmap.teardown();
    }

    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }
  }

  render() {
    return (
      <div ref={(elem) => { this.rootDiv = elem; }}>
        <svg
          ref={(elem) => {
            this.heatmapSvg = elem;
            this.props.svgRef(elem);
          }}
        />
      </div>
    );
  }
}
