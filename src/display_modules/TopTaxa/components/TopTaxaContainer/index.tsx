import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { TopTaxaType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

const chartOptions = function(data: TopTaxaProps): Highcharts.Options {
  const categoryNames = Object.keys(data.data.categories),
        firstCategory = data.data.categories[categoryNames[0]];
  const categoryValues = Object.keys(firstCategory),
        firstValue = firstCategory[categoryValues[0]];
  const toolNames = Object.keys(firstValue),
        firstTool = firstValue[toolNames[0]];
  const kingdomNames = Object.keys(firstTool),
        firstKingdom = firstTool[kingdomNames[0]];

  const taxaNames = Object.keys(firstKingdom.abundance);
  const abundanceSeries = taxaNames.map(taxaName => firstKingdom.abundance[taxaName]);
  const prevalenceSeries = taxaNames.map(taxaName => firstKingdom.prevalence[taxaName]);

  const colors = Highcharts.getOptions().colors!;

  const options: Highcharts.Options = {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: 'Top 100 Taxa',
    },
    xAxis: [{
      categories: taxaNames,
      crosshair: true,
    }],
    yAxis: [
      { // Primary yAxis
        title: {
          text: 'Abundance',
          style: {
            color: colors[0],
          }
        },
        labels: {
          // format: '{value}°C',
          style: {
            color: colors[0]
          }
        },
      },
      { // Secondary yAxis
        title: {
          text: 'Prevalence',
          style: {
            color: colors[1]
          }
        },
        labels: {
          // format: '{value} mm',
          style: {
            color: colors[1]
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
          chartRef={props.chartRef}
        />
      </Col>
    </Row>
  );
};
