import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';
import DropdownSelect from '../../../../../controls/DropdownSelect';

type ControlsProps = {
  categories: string[];
  selectedCategory: string;
  categoryValues: string[];
  selectedCategoryValue: string;
  tools: string[];
  selectedTool: string;
  kingdoms: string[];
  selectedKingdom: string;
  handleCategoryChange(category: string): void;
  handleCategoryValueChange(value: string): void;
  handleToolChange(tool: string): void;
  handleKingdomChange(kingdom: string): void;
};

class TopTaxaControls extends React.Component<ControlsProps, {}> {
  constructor(props: ControlsProps) {
    super(props);
  }

  render() {
    return (
      <Well>
        <Row>
          <Col lg={12} md={4} sm={12}>
            <DropdownSelect
              label="Category"
              options={this.props.categories}
              activeOption={this.props.selectedCategory}
              controlId="top-taxa-category"
              handleOptionChange={this.props.handleCategoryChange}
            />
          </Col>
          <Col lg={12} md={4} sm={12}>
            <DropdownSelect
              label="Category Value"
              options={this.props.categoryValues}
              activeOption={this.props.selectedCategoryValue}
              controlId="top-taxa-category-value"
              handleOptionChange={this.props.handleCategoryValueChange}
            />
          </Col>
          <Col lg={12} md={4} sm={12}>
            <DropdownSelect
              label="Tool"
              options={this.props.tools}
              activeOption={this.props.selectedTool}
              controlId="top-taxa-tool"
              handleOptionChange={this.props.handleToolChange}
            />
          </Col>
          <Col lg={12} md={4} sm={12}>
            <DropdownSelect
              label="Kingdom"
              options={this.props.kingdoms}
              activeOption={this.props.selectedKingdom}
              controlId="top-taxa-category"
              handleOptionChange={this.props.handleKingdomChange}
            />
          </Col>
        </Row>
      </Well>
    );
  }
}

export default TopTaxaControls;
