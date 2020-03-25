import * as React from 'react';

import Sunburst, { SunburstOptionsType } from './util/sunburst';
import { SvgRefProps } from '../../components/DisplayContainer/d3';

import './style.css';

export interface SunburstProps extends SunburstOptionsType, SvgRefProps {}

export default class SunburstPlot extends React.Component<SunburstProps, {}> {
  private rootDiv: HTMLDivElement | undefined;
  private sunburstSvg: SVGSVGElement | undefined;

  private sunburst: Sunburst | undefined;

  componentDidMount() {
    if (!(this.rootDiv === undefined || this.sunburstSvg === undefined)) {
      this.sunburst = new Sunburst(this.rootDiv, this.sunburstSvg);
      this.sunburst.update(this.props);
    }
  }

  componentWillReceiveProps(nextProps: SunburstProps) {
    if (this.sunburst !== undefined) {
      this.sunburst.update(nextProps);
    }
  }

  shouldComponentUpdate(nextProps: SunburstProps) {
    return false;
  }

  componentWillUnmount() {
    if (this.sunburst !== undefined) {
      this.sunburst.teardown();
    }

    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }
  }

  render() {
    return (
      <div
        style={{ textAlign: 'center' }}
        ref={elem => {
          if (elem) this.rootDiv = elem;
        }}
      >
        <svg
          ref={elem => {
            if (elem) {
              this.sunburstSvg = elem;
              this.props.svgRef(elem);
            }
          }}
        />
      </div>
    );
  }
}
