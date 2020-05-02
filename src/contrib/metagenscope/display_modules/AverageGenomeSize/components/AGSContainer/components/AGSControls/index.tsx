import * as React from 'react';
import * as d3 from 'd3';
import { Well, Row, Col } from 'react-bootstrap';

import SelectCategory from '../../../../../controls/SelectCategory';

type ControlsProps = {
  categories: string[];
  activeCategory: string;
  activeCategoryValues: string[];
  activeCategoryColor: d3.ScaleOrdinal<string, string>;
  handleCategoryChange(category?: string): void;
  handleColorByCategoryChanged(category?: string): void;
};

export default class AGSControls extends React.Component<ControlsProps, {}> {
  constructor(props: ControlsProps) {
    super(props);

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleColorByCategoryChanged = this.handleColorByCategoryChanged.bind(
      this,
    );
  }

  handleColorByCategoryChanged(name: string) {
    this.props.handleColorByCategoryChanged(name);
  }

  render() {
    const values = this.props.activeCategoryValues.map(category => {
      return {
        name: category,
        color: this.props.activeCategoryColor(category),
      };
    });

    return (
      <Well>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <SelectCategory
              categories={this.props.categories}
              selectedCategoryName={this.props.activeCategory}
              categoryValues={values}
              activeCategoryChanged={() => {}} // eslint-disable-line
              colorByCategoryChanged={this.handleColorByCategoryChanged}
            />
          </Col>
        </Row>
      </Well>
    );
  }
}
