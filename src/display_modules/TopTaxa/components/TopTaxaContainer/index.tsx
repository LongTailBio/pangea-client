import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { TopTaxaType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

const chartOptions = function(data: TopTaxaProps): Highcharts.Options {
  const samples = data.data.samples;
  const sampleNames = Object.keys(samples);

  const abundanceSeries = sampleNames.map(sampleName => samples[sampleName].abundance);
  const prevalenceSeries = sampleNames.map(sampleName => samples[sampleName].prevalence);

  const options: Highcharts.Options = {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: 'Top 100 Taxa',
    },
    xAxis: [{
      categories: sampleNames,
      crosshair: true,
    }],
    yAxis: [
      { // Primary yAxis
        title: {
          text: 'Abundance',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        labels: {
          format: '{value}°C',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
      },
      { // Secondary yAxis
        title: {
          text: 'Prevalence',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value} mm',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 120,
      verticalAlign: 'top',
      y: 100,
      floating: true,
      backgroundColor: '#FFFFFF',
    },
    exporting: {
      enabled: false,
    },
    series: [
      {
        name: 'Abundance',
        type: 'column',
        data: abundanceSeries,
      },
      {
        name: 'Prevalence',
        type: 'spline',
        data: prevalenceSeries,
        yAxis: 1,
      },
    ],
  };

  return options;
};

export interface TopTaxaProps extends ChartRefProps {
  data: TopTaxaType;
}

export const TopTaxaContainer: React.SFC<TopTaxaProps> = (props) => {
  const options = chartOptions(props);

  return (
    <Row>
      <Col lg={12}>
        <HighChartsPlot
          chartId="top-taxa"
          options={options}
          chartRef={this.props.chartRef}
        />
      </Col>
    </Row>
  );
};
