import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import HeatmapPlot, { HeatMapProps } from '../../../../display_modules/plots/HeatmapPlot';
import HighChartsPlot from '../../../plots/HighChartsPlot';
import { HeatMapDatum } from '../../../../display_modules/plots/HeatmapPlot/util/heatmap';
import { PathwaysType } from '../../../../services/api/models/queryResult';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';

import PathwaysControls from './components/PathwaysControls';

export interface PathwaysProps extends SvgRefProps {
  data: PathwaysType;
  isSingleton?: boolean;
}

export interface PathwaysState {
  activeMetric: string;
}

export default class BetaDiversityContainer extends React.Component<PathwaysProps, PathwaysState> {

  protected color: d3.ScaleOrdinal<string, string> | undefined;

  constructor(props: PathwaysProps) {
    super(props);

    const metadata = this.metaDataFromProps(props);
    this.state = {
      activeMetric: metadata.metrics[0],
    };

    this.handleMetricChange = this.handleMetricChange.bind(this);
  }

  chartOptions(): Highcharts.Options {
    const {sampleNames} = this.metaDataFromProps(this.props),
          metric = this.state.activeMetric,
          dataSet: {[key: string]: number} = this.props.data.samples[sampleNames[0]][metric],
          pathways = Object.keys(dataSet);

    const data = pathways.map(pathway => dataSet[pathway]);

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'column',
      },
      title: {
        text: null,
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        categories: pathways,
      },
      yAxis: {
        title: {
          text: 'Relative Abundance',
        },
      },
      exporting: {
        enabled: false,
      },
      series: [{
        name: metric.displayFormat(),
        data,
      }],
    };

    return chartOptions;
  }

  heatmapOptions(): HeatMapProps {
    const {sampleNames, pathways} = this.metaDataFromProps(this.props),
          metric = this.state.activeMetric;

    const newValues: HeatMapDatum[] = [];
    sampleNames.forEach((columnName, column) => {
      pathways.forEach((rowName, row) => {
        newValues.push({
          x: column,
          y: row,
          value: this.props.data.samples[columnName][metric][rowName],
        });
      });
    });

    const result = {
      axis: {
        x: sampleNames.map(name => ({name})),
        y: pathways,
      },
      data: newValues,
      buckets: 10,
      maxAxisNameLength: 100,
      axisNameSize: 12,
      legend: {
        precision: 3,
      },
      svgRef: this.props.svgRef,
    };

    return result;
  }

  metaDataFromProps(props: PathwaysProps) {
    const sampleNames = Object.keys(props.data.samples),
          metrics = Object.keys(props.data.samples[sampleNames[0]]),
          pathways = Object.keys(props.data.samples[sampleNames[0]].pathway_abundances);
    return {sampleNames, metrics, pathways};
  }

  controlProps() {
    const metadata = this.metaDataFromProps(this.props);
    return {
      metrics: metadata.metrics,
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
      const chartOptions = this.chartOptions();
      return (
        <Row>
          <Col lg={12}>
            <HighChartsPlot
              chartId="pathways"
              options={chartOptions}
              chartRef={() => {}} // tslint:disable-line no-empty
            />
          </Col>
        </Row>
      );
    }

    const chartProps = this.heatmapOptions(),
          controlProps = this.controlProps();

    return (
      <Row>
        <Col lg={9}>
          <HeatmapPlot {...chartProps} />
        </Col>
        <Col lg={3}>
          <PathwaysControls {...controlProps} />
        </Col>
      </Row>
    );
  }

}
