import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import { SampleTaxonomyType } from '../../../../services/api/models/queryResult';

import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';
import HighChartsPlot from '../../../plots/HighChartsPlot';

import SampleTaxonomyControls from './components/SampleTaxonomyControls';

const sunburst = require('highcharts/modules/sunburst'); // eslint-disable-line
sunburst(Highcharts); // this is a weird highcharts thing see https://www.highcharts.com/blog/frameworks/react/192-use-highcharts-to-create-charts-in-react/

const baseOptions: Highcharts.Options = {
  chart: {
    height: '100%',
  },

  title: {
    text: 'Sample Taxonomy',
  },
  tooltip: {
    headerFormat: '',
    pointFormat:
      'The proportion of <b>{point.name}</b> is <b>{point.value}%</b>',
    valueDecimals: 4,
  },
};

const sampleOptions = (
  data: Highcharts.PointOptionsObject[],
): Highcharts.Options => {
  const seriesOptions: Highcharts.Options = {
    legend: {
      enabled: false,
    },
    series: [
      {
        type: 'sunburst',
        data: data,
        allowTraversingTree: true,
        cursor: 'pointer',
        dataLabels: {
          format: '{point.name}',
          filter: {
            property: 'innerArcLength',
            operator: '>',
            value: 16,
          },
        },
        colorByPoint: true,
      },
    ],
  };

  return seriesOptions;
};

export interface SampleTaxonomyProps extends ChartRefProps {
  data: SampleTaxonomyType;
}

export interface SampleSimilarityState {
  activeTool: string;
}

export class SampleTaxonomyContainer extends React.Component<
  SampleTaxonomyProps,
  SampleSimilarityState
> {
  constructor(props: SampleTaxonomyProps) {
    super(props);

    this.handleSourceChange = this.handleSourceChange.bind(this);

    this.state = {
      activeTool: Object.keys(this.props.data)[0],
    };
  }

  handleSourceChange(newSource: string) {
    this.setState({
      activeTool: newSource,
    });
  }

  render() {
    const data = this.props.data,
      activeTool = this.state.activeTool,
      seriesOptions = sampleOptions(data[this.state.activeTool]),
      chartOptions = Object.assign(baseOptions, seriesOptions);
    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="sunburst-taxonomy"
            options={chartOptions}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
          <SampleTaxonomyControls
            sources={Object.keys(data)}
            activeSource={activeTool}
            handleSourceChange={this.handleSourceChange}
          />
        </Col>
      </Row>
    );
  }
}
