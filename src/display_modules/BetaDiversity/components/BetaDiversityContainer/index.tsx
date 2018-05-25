import * as React from 'react';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import HeatmapPlot, { HeatMapProps } from '../../../../display_modules/plots/HeatmapPlot';
import { HeatMapDatum } from '../../../../display_modules/plots/HeatmapPlot/util/heatmap';
import { BetaDiversityType } from '../../../../services/api/models/queryResult';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';

import BetaDiversityControls from './components/BetaDiversityControls';

export interface BetaDiversityProps extends SvgRefProps {
  data: BetaDiversityType;
}

export interface BetaDiversityState {
  activeRank: string;
  activeMetric: string;
  activeTool: string;
}

export default class BetaDiversityContainer extends React.Component<BetaDiversityProps, BetaDiversityState> {

  protected color: d3.ScaleOrdinal<string, string>;

  constructor(props: BetaDiversityProps) {
    super(props);

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    const metadata = this.metaDataFromProps(this.props);
    this.state = {
      activeRank: metadata.ranks[0],
      activeMetric: metadata.metrics[0],
      activeTool: metadata.tools[0],
    };

    this.handleRankChange = this.handleRankChange.bind(this);
    this.handleMetricChange = this.handleMetricChange.bind(this);
    this.handleToolChange = this.handleToolChange.bind(this);
  }

  chartOptions(): HeatMapProps {
    const rank = this.state.activeRank,
          metric = this.state.activeMetric,
          tool = this.state.activeTool,
          data = this.props.data.data[rank][metric][tool];

    const columnNames = Object.keys(data);
    const rowNames = Object.keys(data[columnNames[0]]);

    const newValues: HeatMapDatum[] = [];
    columnNames.forEach((columnName, column) => {
      rowNames.forEach((rowName, row) => {
        newValues.push({
          x: column,
          y: row,
          value: data[columnName][rowName],
        });
      });
    });

    const result = {
      axis: {
        x: columnNames.map(name => ({name})),
        y: rowNames,
      },
      data: newValues,
      buckets: 10,
      maxAxisNameLength: 100,
      axisNameSize: 12,
      legend: {
        precision: 3,
      },
      svgRef: this.props.svgRef,
    };

    return result;
  }

  metaDataFromProps(props: BetaDiversityProps) {
    const trueData = props.data.data;
    const ranks = Object.keys(trueData);
    const metrics = Object.keys(trueData[ranks[0]]);
    const tools = Object.keys(trueData[ranks[0]][metrics[0]]);
    return {ranks, metrics, tools};
  }

  controlProps() {
    const metadata = this.metaDataFromProps(this.props);
    return {
      ranks: metadata.ranks,
      metrics: metadata.metrics,
      tools: metadata.tools,
      activeRank: this.state.activeRank,
      activeMetric: this.state.activeMetric,
      activeTool: this.state.activeTool,
      handleRankChange: this.handleRankChange,
      handleMetricChange: this.handleMetricChange,
      handleToolChange: this.handleToolChange,
    };
  }

  handleRankChange(rank: string) {
    this.setState({activeRank: rank});
  }

  handleMetricChange(metric: string) {
    this.setState({activeMetric: metric});
  }

  handleToolChange(tool: string) {
    this.setState({activeTool: tool});
  }

  render() {
    const chartProps = this.chartOptions();
    const controlProps = this.controlProps();

    return (
      <Row>
        <Col lg={9}>
          <HeatmapPlot {...chartProps} />
        </Col>
        <Col lg={3}>
          <BetaDiversityControls {...controlProps} />
        </Col>
      </Row>
    );
  }

}
