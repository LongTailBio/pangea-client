import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';
import HighChartsPlot from '../../../plots/HighChartsPlot';
import { MultiAxisType } from '../../../../services/api/models/queryResult';

import MultiAxisControls from './components/MultiAxisControls';

interface MultiAxisProps extends ChartRefProps {
  isSingleton?: boolean;
  data: MultiAxisType;
}

interface MultiAxisState {
  xAxis: string;
  yAxis: string;
}

export class MultiAxisContainer extends React.Component<MultiAxisProps, MultiAxisState> {

  constructor(props: MultiAxisProps) {
    super(props);

    const axes = Object.keys(props.data.axes);
    this.state = {
      xAxis: axes[0],
      yAxis: axes[1],
    };
  }

  render() {
    const axesData = this.props.data.axes;
    const { xAxis, yAxis } = this.state;

    const sampleNames = Object.keys(axesData[xAxis].vals);
    const data: Highcharts.DataPoint[] = sampleNames.map(sampleName => {
      return {
        x: axesData[xAxis].vals[sampleName],
        y: axesData[yAxis].vals[sampleName],
      };
    });

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
      },
      title: {
        text: `${xAxis} Versus ${yAxis}`,
      },
      xAxis: {
        title: {
          text: xAxis,
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: yAxis,
        },
      },
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)',
              },
            },
          },
          states: {
            hover: {
              marker: {
                enabled: false,
              },
            },
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x}, {point.y}',
          },
        },
      },
      series: [{
        color: 'rgba(223, 83, 83, .5)',
        data,
      }],
      exporting: {
        enabled: false,
      },
    };

    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="multi-axis"
            options={chartOptions}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
          <MultiAxisControls
            axisChoices={Object.keys(axesData)}
            xAxis={xAxis}
            yAxis={yAxis}
            handleXAxisChange={newXAxis => this.setState({ xAxis: newXAxis })}
            handleYAxisChange={newYAxis => this.setState({ yAxis: newYAxis })}
          />
        </Col>
      </Row>
    );
  }
}
