import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as d3 from 'd3';
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
  selectedCategory: string;
}

export class MultiAxisContainer extends React.Component<
  MultiAxisProps,
  MultiAxisState
> {
  constructor(props: MultiAxisProps) {
    super(props);

    const axes = Object.keys(props.data.axes),
      categories = Object.keys(props.data.categories);
    this.state = {
      xAxis: axes[0],
      yAxis: axes[1],
      selectedCategory: categories[0],
    };
  }

  render() {
    const axesData = this.props.data.axes;
    const { xAxis, yAxis, selectedCategory } = this.state;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const categories = Object.keys(this.props.data.categories),
      categoryValues = this.props.data.categories[selectedCategory];

    const sampleNames = Object.keys(axesData[xAxis].vals);
    const dataPoints: Highcharts.PointOptionsObject[] = sampleNames.map(
      sampleName => {
        const datumColor = color(
          this.props.data.metadata[sampleName][selectedCategory],
        );
        return {
          x: axesData[xAxis].vals[sampleName],
          y: axesData[yAxis].vals[sampleName],
          color: datumColor,
        };
      },
    );

    const series: Highcharts.SeriesScatterOptions[] = [
      {
        data: dataPoints,
        type: 'scatter',
      },
    ];

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
      },
      title: {
        text: `${xAxis.displayFormat()} Versus ${yAxis.displayFormat()}`,
      },
      xAxis: {
        title: {
          text: xAxis.displayFormat(),
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: yAxis.displayFormat(),
        },
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
            hover: {},
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x}, {point.y}',
          },
        },
      },
      series,
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
            color={color}
            axisChoices={Object.keys(axesData)}
            xAxis={xAxis}
            yAxis={yAxis}
            categories={categories}
            selectedCategory={selectedCategory}
            categoryValues={categoryValues}
            handleXAxisChange={newXAxis => this.setState({ xAxis: newXAxis })}
            handleYAxisChange={newYAxis => this.setState({ yAxis: newYAxis })}
            handleCategoryChange={newValue =>
              this.setState({ selectedCategory: newValue })
            }
          />
        </Col>
      </Row>
    );
  }
}
