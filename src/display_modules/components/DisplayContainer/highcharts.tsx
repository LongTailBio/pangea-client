import * as Highcharts from 'highcharts';

import { DisplayContainer } from '.';

export interface ChartRefProps {
  chartRef(ref: Highcharts.ChartObject | null): void;
}

export default class HighchartsDisplayContainer<D, P = {}> extends DisplayContainer<D, P> {

  protected chart: Highcharts.ChartObject | null;

  /** @inheritdoc */
  saveSvg() {
    if (this.chart === null || this.chart === undefined) {
      throw new Error('Missing chart! Did you forget to pass down \'chartRef\'?');
    }

    this.chart.exportChart();
  }

}