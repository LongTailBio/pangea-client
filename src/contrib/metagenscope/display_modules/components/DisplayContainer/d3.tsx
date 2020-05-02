import { DisplayContainer } from '.';

export interface SvgRefProps {
  svgRef(ref: SVGSVGElement | null): void;
}

export default class D3DisplayContainer<D, P = {}> extends DisplayContainer<
  D,
  P
> {
  protected svgCanvas: SVGSVGElement | null = null;

  /** @inheritdoc */
  saveSvg() {
    if (this.svgCanvas === null || this.svgCanvas === undefined) {
      throw new Error(
        "Missing svgCanvas! Did you forget to pass down 'svgRef'?",
      );
    }

    // Disabled until build issue is addressed: https://github.com/exupero/saveSvgAsPng/issues/171
    // saveSvgAsPng(this.svgCanvas, 'plot.png');
  }
}
