import * as React from 'react';
import * as d3 from 'd3';
import { Well, Row, Col } from 'react-bootstrap';

import DropdownSelect from '../../../../../controls/DropdownSelect';
import SelectCategory from '../../../../../controls/SelectCategory';

type ControlsProps = {
  color: d3.ScaleOrdinal<string, string>;
  axisChoices: string[];
  xAxis: string;
  yAxis: string;
  categories: string[];
  selectedCategory: string;
  categoryValues: string[];
  handleXAxisChange(xAxis: string): void;
  handleYAxisChange(yAxis: string): void;
  handleCategoryChange(category: string): void;
};

class MultiAxisControls extends React.Component<ControlsProps, {}> {
  constructor(props: ControlsProps) {
    super(props);
  }

  render() {
    const values = this.props.categoryValues.map(categoryValue => {
      return {
        name: categoryValue,
        color: this.props.color(categoryValue),
      };
    });

    return (
      <Well>
        <Row>
          <Col lg={12} md={4} sm={12}>
            <DropdownSelect
              label="X Axis"
              options={this.props.axisChoices}
              activeOption={this.props.xAxis}
              controlId="mutli-axis-x-select"
              handleOptionChange={this.props.handleXAxisChange}
            />
          </Col>
          <Col lg={12} md={4} sm={12}>
            <DropdownSelect
              label="Y Axis"
              options={this.props.axisChoices}
              activeOption={this.props.yAxis}
              controlId="mutli-axis-y-select"
              handleOptionChange={this.props.handleYAxisChange}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <SelectCategory
              categories={this.props.categories}
              selectedCategoryName={this.props.selectedCategory}
              categoryValues={values}
              activeCategoryChanged={() => {}} // eslint-disable-line
              colorByCategoryChanged={this.props.handleCategoryChange}
            />
          </Col>
        </Row>
      </Well>
    );
  }
}

export default MultiAxisControls;
