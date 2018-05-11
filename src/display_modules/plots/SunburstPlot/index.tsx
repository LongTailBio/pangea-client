import * as React from 'react';

import Sunburst, { SunburstOptionsType } from './util/sunburst';
import { SvgRefProps } from '../../components/DisplayContainer/d3';

import './style.css';

export interface SunburstProps extends SunburstOptionsType, SvgRefProps { }

export default class SunburstPlot extends React.Component<SunburstProps, {}> {

  private rootDiv: HTMLDivElement | null;
  private sunburstSvg: SVGSVGElement | null;

  private sunburst: Sunburst | null;

  componentDidMount() {
    if (!(this.rootDiv === null || this.sunburstSvg === null)) {
      this.sunburst = new Sunburst(this.rootDiv, this.sunburstSvg);
      this.sunburst.update(this.props);
    }
  }

  componentWillReceiveProps(nextProps: SunburstProps) {
    if (this.sunburst !== null) {
      this.sunburst.update(nextProps);
    }
  }

  shouldComponentUpdate(nextProps: SunburstProps) {
    return false;
  }

  componentWillUnmount() {
    if (this.sunburst !== null) {
      this.sunburst.teardown();
    }

    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }
  }

  render() {
    return (
      <div style={{textAlign: 'center'}} ref={(elem) => { this.rootDiv = elem; }}>
        <svg
          ref={(elem) => {
            this.sunburstSvg = elem;
            this.props.svgRef(elem);
          }}
        />
      </div>
    );
  }
}
