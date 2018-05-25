import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { HMPResultType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

import HMPControls from './components/HMPControls';

type DatumType = {name: string, data: number[][]};
type ColorChoice = d3.ScaleOrdinal<string, string>;

const createOptions = function(data: DatumType[], categories: string[], color: ColorChoice): Highcharts.Options {
  data = data.sort((datum1, datum2) => {
    const textA = datum1.name.toUpperCase();
    const textB = datum2.name.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  const series: Highcharts.IndividualSeriesOptions[] = data.map(source => {
    const dataPoints: Highcharts.DataPoint[] = source.data.map(datum => {
      return {
        low: datum[0],
        q1: datum[1],
        median: datum[2],
        q3: datum[3],
        high: datum[4],
      };
    });
    return {
      name: source.name.displayFormat(),
      data: dataPoints,
      color: color(source.name),
    };
  });

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
      categories: categories.map(name => name.displayFormat()),
    },
    yAxis: {
      title: {
        text: 'Cosine Similarity',
      },
    },
    exporting: {
      enabled: false,
    },
    series,
  };

  return chartOptions;
};

export interface HMPProps extends ChartRefProps {
  data: HMPResultType;
  isSingleton?: boolean;
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

  render() {
    const activeCategory = this.state.activeCategory,
          data = this.props.data.data[activeCategory],
          chartOptions = createOptions(data, this.props.data.sites, this.color),
          activeCategoryValues = this.props.data.categories[activeCategory].sort(),
          isSingleton = this.props.isSingleton || false;

    return (
      <Row>
        <Col lg={isSingleton ? 12 : 9}>
          <HighChartsPlot
            chartId="human-body-sites"
            options={chartOptions}
            chartRef={this.props.chartRef}
            forceRecreate={true}
          />
        </Col>
        {!isSingleton &&
          <Col lg={3}>
            <HMPControls
              categories={Object.keys(this.props.data.categories)}
              activeCategory={activeCategory}
              activeCategoryValues={activeCategoryValues}
              activeCategoryColor={this.color}
              handleCategoryChange={this.handleCategoryChange}
              handleColorByCategoryChanged={this.handleColorByCategoryChanged}
            />
          </Col>
        }
      </Row>
    );
  }

}

export default HMPContainer;
