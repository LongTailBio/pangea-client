import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { AlphaDivResultType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

import AlphaDiversityControls from './components/AlphaDiversityControls';

export interface AlphaDivProps extends ChartRefProps {
  data: AlphaDivResultType;
}

export interface AlphaDivState {
  activeTool: string;
  activeTaxaRank: string;
  activeMetric: string;
  activeCategory: string;
}

type CategoryDatum = {
  by_metric: {
    [key: string]: number[];
  };
};

export default class AlphaDivContainer extends React.Component<AlphaDivProps, AlphaDivState> {

  protected color: d3.ScaleOrdinal<string, string>;

  constructor(props: AlphaDivProps) {
    super(props);

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    this.handleToolChange = this.handleToolChange.bind(this);
    this.handleMetricChange = this.handleMetricChange.bind(this);
    this.handleTaxaRankChange = this.handleTaxaRankChange.bind(this);
    this.handleColorByCategoryChanged = this.handleColorByCategoryChanged.bind(this);

    const categories = Object.keys(this.props.data.categories).sort(),
          activeCategory = categories[0],
          tools = this.props.data.tool_names,
          activeTool = tools[0],
          activeTaxaRank = this.props.data.by_tool[activeTool].taxa_ranks[0],
          rankData = this.props.data.by_tool[activeTool].by_taxa_rank[activeTaxaRank],
          metrics = rankData.by_category_name[activeCategory][0].metrics,
          activeMetric = metrics[0];
    this.state = {
      activeTool,
      activeTaxaRank,
      activeMetric,
      activeCategory,
    };
  }

  handleToolChange(tool: string) {
    let newState: AlphaDivState = Object.assign({}, this.state);
    newState.activeTool = tool;

    // Pass changes downward because we can't be sure that each branch of the
    // options tree is the same and may need to reset an invalid value
    newState = this.downstreamTaxaRank(newState);

    this.setState(newState);
  }

  handleTaxaRankChange(taxaRank: string) {
    let newState: AlphaDivState = Object.assign({}, this.state);
    newState.activeTaxaRank = taxaRank;

    // Pass changes downward because we can't be sure that each branch of the
    // options tree is the same and may need to reset an invalid value
    newState = this.downstreamCategory(newState);

    this.setState(newState);
  }

  downstreamTaxaRank(upstreamState: AlphaDivState): AlphaDivState {
    const {activeTool, activeTaxaRank} = upstreamState,
          taxaRanks = this.props.data.by_tool[activeTool].taxa_ranks;

    if (taxaRanks.indexOf(activeTaxaRank) < 0) {
      upstreamState.activeTaxaRank = taxaRanks[0];
    }

    upstreamState = this.downstreamCategory(upstreamState);

    return upstreamState;
  }

  handleColorByCategoryChanged(category: string) {
    let newState: AlphaDivState = Object.assign({}, this.state);
    newState.activeCategory = category;

    // Pass changes downward because we can't be sure that each branch of the
    // options tree is the same and may need to reset an invalid value
    newState = this.downstreamMetrics(newState);

    this.setState(newState);
  }

  downstreamCategory(upstreamState: AlphaDivState): AlphaDivState {
    // Categories are defined at the top level and will always be valid, just pass this down
    return this.downstreamMetrics(upstreamState);
  }

  handleMetricChange(metric: string) {
    this.setState({
      activeMetric: metric,
    });
  }

  downstreamMetrics(upstreamState: AlphaDivState): AlphaDivState {
    const {activeTool, activeTaxaRank, activeMetric, activeCategory} = upstreamState,
          rankData = this.props.data.by_tool[activeTool].by_taxa_rank[activeTaxaRank],
          metrics = rankData.by_category_name[activeCategory][0].metrics;

    if (metrics.indexOf(activeMetric) < 0) {
      upstreamState.activeMetric = metrics[0];
    }

    return upstreamState;
  }

  chartOptions(activeCategory: string, activeMetric: string, categoryData: CategoryDatum[]): Highcharts.Options {
    const categoryValues = this.props.data.categories[activeCategory].sort();

    const dataPoints: Highcharts.DataPoint[] = categoryData.map((categoryDatum, index) => {
      const datum = categoryDatum.by_metric[activeMetric];
      return {
        low: datum[0],
        q1: datum[1],
        median: datum[2],
        q3: datum[3],
        high: datum[4],
        color: this.color(categoryValues[index]),
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
          text: activeMetric,
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
    const {activeTool, activeTaxaRank, activeMetric, activeCategory} = this.state,
          activeCategoryValues = this.props.data.categories[activeCategory],
          toolData = this.props.data.by_tool[activeTool],
          taxaRanks = toolData.taxa_ranks,
          categoryData = toolData.by_taxa_rank[activeTaxaRank].by_category_name[activeCategory],
          metrics = categoryData[0].metrics;

    const chartOptions = this.chartOptions(activeCategory, activeMetric, categoryData);

    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="alpha-diversity"
            options={chartOptions}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
          <AlphaDiversityControls
            categories={Object.keys(this.props.data.categories)}
            activeCategory={activeCategory}
            activeCategoryValues={activeCategoryValues}
            activeCategoryColor={this.color}
            handleCategoryChange={() => {}}  // tslint:disable-line no-empty
            handleColorByCategoryChanged={this.handleColorByCategoryChanged}
            metrics={metrics}
            activeMetric={activeMetric}
            handleMetricChange={this.handleMetricChange}
            taxaRanks={taxaRanks}
            activeTaxaRank={activeTaxaRank}
            handleTaxaRankChange={this.handleTaxaRankChange}
            tools={this.props.data.tool_names}
            activeTool={activeTool}
            handleToolChange={this.handleToolChange}
          />
        </Col>
      </Row>
    );
  }

}
