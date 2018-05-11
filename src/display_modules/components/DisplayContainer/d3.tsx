import { saveSvgAsPng } from 'save-svg-as-png';

import { DisplayContainer } from '.';

export interface SvgRefProps {
  svgRef(ref: SVGSVGElement | null): void;
}

export default class D3DisplayContainer<D, P = {}> extends DisplayContainer<D, P> {

  protected svgCanvas: SVGSVGElement | null;

  /** @inheritdoc */
  saveSvg() {
    if (this.svgCanvas === null || this.svgCanvas === undefined) {
      throw new Error('Missing svgCanvas! Did you forget to pass down \'svgRef\'?');
    }

    saveSvgAsPng(this.svgCanvas, 'plot.png');
  }

}
