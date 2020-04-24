import * as React from 'react';

import * as Highcharts from 'highcharts';

const HighchartsMore = require('highcharts/highcharts-more'),
      HighchartsExporting = require('highcharts/modules/exporting'),
      HighchartsOfflineExporting = require('highcharts/modules/offline-exporting');
HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);
HighchartsMore(Highcharts);

import { ChartRefProps } from '../../components/DisplayContainer/highcharts';

export interface HighChartsPlotProps extends ChartRefProps {
  options: Highcharts.Options;
  chartId: string;
  forceRecreate?: boolean;
}

export default class HighChartsPlot extends React.Component<HighChartsPlotProps, {}> {

  protected chart: Highcharts.ChartObject | undefined;

  /** @inheritdoc */
  componentDidMount() {
    this.chart = Highcharts.chart(`${this.props.chartId}-chart`, this.props.options);
    this.props.chartRef(this.chart);
  }

  /** Update the chart for the new chart options. */
  shouldComponentUpdate(nextProps: HighChartsPlotProps) {
    if (this.chart !== undefined) {
      const forceRecreate = nextProps.forceRecreate !== undefined ? nextProps.forceRecreate : false;
      if (forceRecreate) {
        this.chart.destroy();
        this.chart = Highcharts.chart(`${this.props.chartId}-chart`, nextProps.options);
        this.props.chartRef(this.chart);
      } else {
        this.chart.update(nextProps.options);
      }
    }

    return false;
  }

  /** @inheritdoc */
  componentWillUnmount() {
    if (super.componentWillUnmount) {
      super.componentWillUnmount();
    }

    if (this.chart !== undefined) {
      this.chart.destroy();
    }
  }

  /** @inheritdoc */
  render() {
    return <div id={`${this.props.chartId}-chart`} />;
  }
}
