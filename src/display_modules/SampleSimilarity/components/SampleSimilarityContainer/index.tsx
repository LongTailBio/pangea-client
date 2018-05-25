import * as React from 'react';
import * as d3 from 'd3';
import { Row, Col } from 'react-bootstrap';

import { SampleSimilarityResultType } from '../../../../services/api/models/queryResult';

import ScatterPlot, { ScatterPlotEntry } from '../../../plots/ScatterPlot';
import SampleSimilarityControls from './components/SampleSimilarityControls';
import { SvgRefProps } from '../../../components/DisplayContainer/d3';

const SAMPLE_ID_KEY = 'SampleID';

export interface SampleSimilarityProps extends SvgRefProps {
  data: SampleSimilarityResultType;
}

export interface SampleSimilarityState {
  activeTool: string;
  activeCategory: string;
  focusedCategory?: string;
}

export class SampleSimilarityContainer extends React.Component<SampleSimilarityProps, SampleSimilarityState> {
  constructor(props: SampleSimilarityProps) {
    super(props);

    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleColorByCategoryChange = this.handleColorByCategoryChange.bind(this);

    this.state = {
      activeTool: Object.keys(this.props.data.tools)[0],
      activeCategory: Object.keys(this.props.data.categories)[0],
    };
  }

  handleSourceChange(newSource: string) {
    this.setState({
      activeTool: newSource,
    });
  }

  handleCategoryChange(category?: string) {
    this.setState({
      focusedCategory: category,
    });
  }

  handleColorByCategoryChange(category: string) {
    this.setState({
      activeCategory: category,
    });
  }

  parsedData(toolName: string, categoryName: string): ScatterPlotEntry[] {
    return this.props.data.data_records.map((record) => {
      const requiredKeys = [SAMPLE_ID_KEY, categoryName, `${toolName}_x`, `${toolName}_y`];
      requiredKeys.forEach(key => {
        if (!(key in record)) {
          throw new Error(`Sample Similarity record missing ${key}`);
        }
      });

      return {
        name: record[SAMPLE_ID_KEY],
        category: record[categoryName],
        x: record[`${toolName}_x`],
        y: record[`${toolName}_y`],
      };
    });
  }

  axisTitles(toolName: string) {
    return {
      xAxisTitle: this.props.data.tools[toolName].x_label,
      yAxisTitle: this.props.data.tools[toolName].y_label,
    };
  }

  render() {
    const activeCategory = this.state.activeCategory,
          activeCategoryValues = this.props.data.categories[activeCategory].sort(),
          color = d3.scaleOrdinal(d3.schemeCategory10);

    return (
      <Row>
        <Col lg={9}>
          <ScatterPlot
            data={this.parsedData(this.state.activeTool, this.state.activeCategory)}
            focusedCategory={this.state.focusedCategory}
            {...this.axisTitles(this.state.activeTool)}
            svgRef={this.props.svgRef}
            color={color}
          />
        </Col>
        <Col lg={3}>
          <SampleSimilarityControls
            color={color}
            activeSource={this.state.activeTool}
            sources={Object.keys(this.props.data.tools)}
            categories={Object.keys(this.props.data.categories)}
            activeCategory={this.state.activeCategory}
            activeCategoryValues={activeCategoryValues}
            handleSourceChange={this.handleSourceChange}
            handleCategoryChange={this.handleCategoryChange}
            handleColorByCategoryChanged={this.handleColorByCategoryChange}
          />
        </Col>
      </Row>
    );
  }
}
