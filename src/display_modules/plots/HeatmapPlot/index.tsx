import * as React from 'react';

import HeatMap, { HeatMapOptions } from './util/heatmap';
import { SvgRefProps } from '../../components/DisplayContainer/d3';

import './style.css';

export interface HeatMapProps extends HeatMapOptions, SvgRefProps {}

export default class HeatMapPlot extends React.Component<HeatMapProps, {}> {
  private rootDiv: HTMLDivElement | undefined;
  private heatmapSvg: SVGSVGElement | undefined;

  private heatmap: HeatMap | undefined;

  componentDidMount() {
    if (!(this.rootDiv === undefined || this.heatmapSvg === undefined)) {
      this.heatmap = new HeatMap(this.rootDiv, this.heatmapSvg);
      this.heatmap.update(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: HeatMapProps) {
    if (this.heatmap !== undefined) {
      this.heatmap.update(nextProps);
    }
  }

  shouldComponentUpdate(_nextProps: HeatMapProps) {
    return false;
  }

  componentWillUnmount() {
    if (this.heatmap !== undefined) {
      this.heatmap.teardown();
    }

    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }
  }

  render() {
    return (
      <div
        ref={elem => {
          if (elem) this.rootDiv = elem;
        }}
      >
        <svg
          ref={elem => {
            if (elem) {
              this.heatmapSvg = elem;
              this.props.svgRef(elem);
            }
          }}
        />
      </div>
    );
  }
}
