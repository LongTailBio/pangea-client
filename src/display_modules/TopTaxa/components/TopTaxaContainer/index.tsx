import * as React from 'react';
import * as Highcharts from 'highcharts';
import { Row, Col } from 'react-bootstrap';

import HighChartsPlot from '../../../plots/HighChartsPlot';
import { TopTaxaType } from '../../../../services/api/models/queryResult';
import { ChartRefProps } from '../../../components/DisplayContainer/highcharts';

import TopTaxaControls from './components/TopTaxaControls';

const chartOptions = function(data: TopTaxaType, state: TopTaxaState): Highcharts.Options {
  const { category, categoryValue, tool, kingdom } = state;
  const chartData = data.categories[category][categoryValue][tool][kingdom];

  const taxaNames = Object.keys(chartData.abundance).sort((left, right) => {
    if (chartData.abundance[left] < chartData.abundance[right]) {
      return 1;
    } else if (chartData.abundance[left] > chartData.abundance[right]) {
      return -1;
    }
    return 0;
  });
  const abundanceSeries = taxaNames.map(taxaName => chartData.abundance[taxaName]);
  const prevalenceSeries = taxaNames.map(taxaName => chartData.prevalence[taxaName]);

  const colors = Highcharts.getOptions().colors!;

  const options: Highcharts.Options = {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: '',
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

export interface TopTaxaState {
  category: string;
  categoryValue: string;
  tool: string;
  kingdom: string;
}

const expandSelectedValues = (data: TopTaxaType, selectedValues?: TopTaxaState) => {
  const defaults = { category: '', categoryValue: '', tool: '', kingdom: '' };
  let { category, categoryValue, tool, kingdom} = selectedValues || defaults;

  const categoryNames = Object.keys(data.categories);
  category = category || categoryNames[0];
  const categoryData = data.categories[category];

  const categoryValues = Object.keys(categoryData);
  categoryValue = categoryValue || categoryValues[0];
  const categoryValueData = categoryData[categoryValue];

  const toolNames = Object.keys(categoryValueData);
  tool = tool || toolNames[0];
  const firstTool = categoryValueData[tool];

  const kingdomNames = Object.keys(firstTool);
  kingdom = kingdom || kingdomNames[0];

  return { categoryNames, category,
           categoryValues, categoryValue,
           toolNames, tool,
           kingdomNames, kingdom };
};

export class TopTaxaContainer extends React.Component<TopTaxaProps, TopTaxaState> {

  constructor(props: TopTaxaProps) {
    super(props);

    this.state = expandSelectedValues(this.props.data);

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(category: string) {
    const categoryValue = Object.keys(this.props.data.categories[category])[0];
    this.setState({ category, categoryValue });
  }

  render() {
    const options = chartOptions(this.props.data, this.state);

    const { categoryNames, category,
            categoryValues, categoryValue,
            toolNames, tool,
            kingdomNames, kingdom } = expandSelectedValues(this.props.data, this.state);

    return (
      <Row>
        <Col lg={9}>
          <HighChartsPlot
            chartId="top-taxa"
            options={options}
            chartRef={this.props.chartRef}
          />
        </Col>
        <Col lg={3}>
          <TopTaxaControls
            categories={categoryNames}
            selectedCategory={category}
            categoryValues={categoryValues}
            selectedCategoryValue={categoryValue}
            tools={toolNames}
            selectedTool={tool}
            kingdoms={kingdomNames}
            selectedKingdom={kingdom}
            handleCategoryChange={this.handleCategoryChange}
            handleCategoryValueChange={newValue => this.setState({ categoryValue: newValue })}
            handleToolChange={newTool => this.setState({ tool: newTool })}
            handleKingdomChange={newKingdom => this.setState({ kingdom: newKingdom })}
          />
        </Col>
      </Row>
    );
  }
}
