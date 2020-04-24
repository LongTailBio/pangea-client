import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { AGSResultType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

import AGSControls from './components/AGSControls';

export interface HMPProps extends ChartRefProps {
  data: AGSResultType;
}

export interface HMPState {
  activeCategory: string;
}

export class HMPContainer extends React.Component<HMPProps, HMPState> {

  protected color: d3.ScaleOrdinal<string, string>;

  constructor(props: HMPProps) {
    super(props);

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleColorByCategoryChanged = this.handleColorByCategoryChanged.bind(this);

    this.state = {
      activeCategory: Object.keys(this.props.data.categories)[0],
    };
  }

  handleCategoryChange(category: string) {
    this.setState({
      activeCategory: category,
    });
  }

  handleColorByCategoryChanged(category: string) {
    this.setState({
      activeCategory: category,
    });
  }

  chartOptions(activeCategory: string): Highcharts.Options {
    const data = this.props.data.distributions[activeCategory];
    const categoryValues = Object.keys(data).sort();

    const dataPoints: Highcharts.DataPoint[] = categoryValues.map(categoryValue => {
      const datum = data[categoryValue];
      return {
        low: datum[0],
        q1: datum[1],
        median: datum[2],
        q3: datum[3],
        high: datum[4],
        color: this.color(categoryValue),
      };
    });
    const categorySeries = {
      name: activeCategory,
      data: dataPoints,
      showInLegend: false,
    };

    const chartOptions: Highcharts.Options = {
      chart: {
        type: 'boxplot',
      },
      title: {
        text: null,
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        categories: categoryValues,
      },
      yAxis: {
        title: {
          text: 'Base Pairs',
        },
      },
      exporting: {
        enabled: false,
      },
      series: [categorySeries],
    };

    return chartOptions;
  }

  render() {
    const activeCategory = this.state.activeCategory,
          activeCategoryValues = this.props.data.categories[activeCategory].sort();
    const chartOptions = this.chartOptions(activeCategory);

    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="average-genome-size"
            options={chartOptions}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
          <AGSControls
            categories={Object.keys(this.props.data.categories)}
            activeCategory={activeCategory}
            activeCategoryValues={activeCategoryValues}
            activeCategoryColor={this.color}
            handleCategoryChange={this.handleCategoryChange}
            handleColorByCategoryChanged={this.handleColorByCategoryChanged}
          />
        </Col>
      </Row>
    );
  }

}

export default HMPContainer;
