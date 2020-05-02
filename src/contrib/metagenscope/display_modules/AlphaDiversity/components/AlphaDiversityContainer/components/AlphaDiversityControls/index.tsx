import * as React from 'react';
import * as d3 from 'd3';
import { Well, Row, Col } from 'react-bootstrap';

import DropdownSelect from '../../../../../controls/DropdownSelect';
import SelectCategory from '../../../../../controls/SelectCategory';

type ToolProps = {
  tools: string[];
  activeTool: string;
  handleToolChange(tool?: string): void;
};

type RankProps = {
  taxaRanks: string[];
  activeTaxaRank: string;
  handleTaxaRankChange(taxaRank?: string): void;
};

type MetricProps = {
  metrics: string[];
  activeMetric: string;
  handleMetricChange(metric?: string): void;
};

type CategoryProps = {
  categories: string[];
  activeCategory: string;
  activeCategoryValues: string[];
  activeCategoryColor: d3.ScaleOrdinal<string, string>;
  handleCategoryChange(category?: string): void;
  handleColorByCategoryChanged(category?: string): void;
};

type ControlsProps = ToolProps & RankProps & MetricProps & CategoryProps;

const AlphaDiversityControls: React.SFC<ControlsProps> = props => {
  const values = props.activeCategoryValues.sort().map(category => {
    return {
      name: category,
      color: props.activeCategoryColor(category),
    };
  });

  return (
    <Well>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <DropdownSelect
            label="Tools"
            options={props.tools}
            activeOption={props.activeTool}
            handleOptionChange={props.handleToolChange}
          />
          <DropdownSelect
            label="Taxa Rank"
            options={props.taxaRanks}
            activeOption={props.activeTaxaRank}
            handleOptionChange={props.handleTaxaRankChange}
          />
          <DropdownSelect
            label="Metric"
            options={props.metrics}
            activeOption={props.activeMetric}
            handleOptionChange={props.handleMetricChange}
          />
          <SelectCategory
            categories={props.categories}
            selectedCategoryName={props.activeCategory}
            categoryValues={values}
            activeCategoryChanged={props.handleCategoryChange}
            colorByCategoryChanged={props.handleColorByCategoryChanged}
          />
        </Col>
      </Row>
    </Well>
  );
};

export default AlphaDiversityControls;
