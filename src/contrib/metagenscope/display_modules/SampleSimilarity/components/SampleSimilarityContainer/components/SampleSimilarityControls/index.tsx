import * as React from 'react';
import * as d3 from 'd3';
import { Well, Row, Col } from 'react-bootstrap';

import SelectCategory from '../../../../../controls/SelectCategory';
import SelectSource from '../../../../../controls/SelectSource';

type ControlsProps = {
  color: d3.ScaleOrdinal<string, string>;
  sources: string[];
  activeSource: string;
  categories: string[];
  activeCategory: string;
  activeCategoryValues: string[];
  handleSourceChange(newSource: string): void;
  handleCategoryChange(category?: string): void;
  handleColorByCategoryChanged(category?: string): void;
};

class SampleSimilarityControls extends React.Component<ControlsProps, {}> {
  constructor(props: ControlsProps) {
    super(props);

    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleColorByCategoryChanged = this.handleColorByCategoryChanged.bind(
      this,
    );
  }

  handleSourceChange(newSource: string) {
    this.props.handleSourceChange(newSource);
  }

  handleCategoryChange(category?: string) {
    this.props.handleCategoryChange(category);
  }

  handleColorByCategoryChanged(name: string) {
    this.props.handleColorByCategoryChanged(name);
  }

  render() {
    const values = this.props.activeCategoryValues.map(category => {
      return {
        name: category,
        color: this.props.color(category),
      };
    });

    return (
      <Well>
        <Row>
          <Col lg={12} md={4} sm={12}>
            <SelectCategory
              categories={this.props.categories}
              selectedCategoryName={this.props.activeCategory}
              categoryValues={values}
              activeCategoryChanged={this.handleCategoryChange}
              colorByCategoryChanged={this.handleColorByCategoryChanged}
            />
          </Col>
          <Col lg={12} md={4} sm={12}>
            <SelectSource {...this.props} />
          </Col>
        </Row>
      </Well>
    );
  }
}

export default SampleSimilarityControls;
