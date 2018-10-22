import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { ReadStatsResultType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

import ReadStatsControls from './components/ReadStatsControls';

const READ_STATS_SOURCES = ['num_reads', 'gc_content'];

export interface ReadStatsProps extends ChartRefProps {
  data: ReadStatsResultType;
}

export interface ReadStatsState {
  minimumCount: number;
  activeSource: string;
}

export class ReadStatsContainer extends React.Component<ReadStatsProps, ReadStatsState> {

  protected color: d3.ScaleOrdinal<string, string>;

  constructor(props: ReadStatsProps) {
    super(props);

    this.handleSourceChange = this.handleSourceChange.bind(this);

    this.state = {
      activeSource: READ_STATS_SOURCES[0],
      minimumCount: 0,
    };
  }

  handleSourceChange(source: string) {
    this.setState({
      activeSource: source,
    });
  }

  chartOptions(activeSource: string): Highcharts.Options {
    // Keep sample name and value together so we can sort without losing the name
    let valueList: Array<[string, number]> = [];
    const samples = this.props.data.samples;

    Object.keys(samples).forEach(sampleName => {
      const value = samples[sampleName][activeSource];
      valueList.push([sampleName, value]);
    });

    let sortedVals: Array<[string, number]> = valueList.sort((el0, el1) => el0[1] - el1[1]);
    const sampleNames = sortedVals.map(el => el[0]);
    const dataPoints = sortedVals.map(el => el[1]).filter(num => num >= this.state.minimumCount);

    let yAxisTitle = '[unnamed]';
    if (activeSource === 'num_reads') {
      yAxisTitle = 'Num. Reads';
    } else if (activeSource === 'gc_content') {
      yAxisTitle = 'GC Percentage';
    }

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
        categories: sampleNames,
      },
      yAxis: {
        title: {
          text: yAxisTitle,
        },
      },
      exporting: {
        enabled: false,
      },
      series: [{
        name: 'Sample',
        data: dataPoints,
      }],
    };

    return chartOptions;
  }

  render() {
    const activeSource = this.state.activeSource;
    const chartOptions = this.chartOptions(activeSource);

    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="read-stats"
            options={chartOptions}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
          <ReadStatsControls
            sources={READ_STATS_SOURCES}
            activeSource={activeSource}
            activeCount={this.state.minimumCount}
            handleSourceChange={this.handleSourceChange}
            handleMinimumChange={val => this.setState({minimumCount: val})}
          />
        </Col>
      </Row>
    );
  }

}

export default ReadStatsContainer;
