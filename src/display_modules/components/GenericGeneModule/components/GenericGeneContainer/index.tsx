import * as React from 'react';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import HeatmapPlot, { HeatMapProps } from '../../../../../display_modules/plots/HeatmapPlot';
import HighChartsPlot from '../../../../plots/HighChartsPlot';
import { HeatMapDatum } from '../../../../../display_modules/plots/HeatmapPlot/util/heatmap';
import { GenericGeneType } from '../../../../../services/api/models/queryResult';
import { SvgRefProps } from '../../../DisplayContainer/d3';

import GenericGeneControls from './components/GenericGeneControls';

export interface GenericGeneProps extends SvgRefProps {
  data: GenericGeneType;
  chartId: string;
  yAxisTitle: string;
  legendTitle: string;
  isSingleton?: boolean;
}

export interface GenericGeneState {
  activeMetric: string;
}

export default class GenericGeneContainer extends React.Component<GenericGeneProps, GenericGeneState> {

  protected color: d3.ScaleOrdinal<string, string>;

  constructor(props: GenericGeneProps) {
    super(props);

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.state = {
      activeMetric: 'rpkm',
    };

    this.handleMetricChange = this.handleMetricChange.bind(this);
  }

  createChartOptions(data: GenericGeneType): Highcharts.Options {
    const samples = data.samples,
          sample = samples[Object.keys(samples)[0]],
          metrics = Object.keys(sample),
          geneNames = Object.keys(sample[metrics[0]]);

    const series: Highcharts.IndividualSeriesOptions[] = metrics.map(metric => {
      const dataPoints = geneNames.map(geneName => sample[metric][geneName]);
      return {
        name: metric.displayFormat(),
        data: dataPoints,
      };
    });

    const chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: geneNames,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: this.props.yAxisTitle,
        },
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      exporting: {
        enabled: false,
      },
      series,
    };
    return chartOptions;
  }

  heatMapOptions(): HeatMapProps {
    const metric = this.state.activeMetric,
          data = this.props.data.samples;

    const columnNames = Object.keys(data),
          firstMetric = Object.keys(data[columnNames[0]])[0],
          rowNames = Object.keys(data[columnNames[0]][firstMetric]);

    let newValues: HeatMapDatum[] = [];
    columnNames.forEach((columnName, column) => {
      rowNames.forEach((rowName, row) => {
        newValues.push({
          x: column,
          y: row,
          value: data[columnName][metric][rowName],
        });
      });
    });

    let result: HeatMapProps = {
      axis: {
        x: columnNames.map(name => ({name})),
        y: rowNames,
      },
      data: newValues,
      buckets: 10,
      maxAxisNameLength: 100,
      legend: {
        precision: 3,
        name: this.props.legendTitle,
      },
      svgRef: this.props.svgRef,
    };

    return result;
  }

  controlProps() {
    return {
      metrics: ['rpkm', 'rpkmg'],
      activeMetric: this.state.activeMetric,
      handleMetricChange: this.handleMetricChange,
    };
  }

  handleMetricChange(metric: string) {
    this.setState({activeMetric: metric});
  }

  render() {
    const isSingleton = this.props.isSingleton || false;

    if (isSingleton) {
      const chartOptions = this.createChartOptions(this.props.data);
      return (
        <Row>
          <Col lg={12}>
            <HighChartsPlot
              chartId={this.props.chartId}
              options={chartOptions}
              chartRef={(chart) => {
                // no-op
              }}
            />
          </Col>
        </Row>
      );
    }

    const heatMapProps = this.heatMapOptions();
    const controlProps = this.controlProps();
    return (
      <Row>
        <Col lg={9}>
          <HeatmapPlot {...heatMapProps} />
        </Col>
        <Col lg={3}>
          <GenericGeneControls {...controlProps} />
        </Col>
      </Row>
    );
  }

}
