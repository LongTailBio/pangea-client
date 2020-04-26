import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';

import DropdownSelect from '../../../../../controls/DropdownSelect';

type ToolProps = {
  tools: string[];
  activeTool: string;
  handleToolChange(tool: string): void;
};

type CategoryProps = {
  categories: string[];
  activeCategory: string;
  handleCategoryChange(category: string): void;
};

type CategoryValueProps = {
  categoryValues: string[];
  activeCategoryValue: string;
  handleCategoryValueChange(value: string): void;
};

type ControlsProps = ToolProps & CategoryProps & CategoryValueProps;

const VolcanoControls: React.SFC<ControlsProps> = (props) => {
  return (
    <Well>
      <Row>
        <Col lg={12} md={4} sm={12}>
          <DropdownSelect
            label="Tool"
            options={props.tools}
            activeOption={props.activeTool}
            handleOptionChange={props.handleToolChange}
          />
        </Col>
        <Col lg={12} md={4} sm={12}>
          <DropdownSelect
            label="Category"
            options={props.categories}
            activeOption={props.activeCategory}
            handleOptionChange={props.handleCategoryChange}
          />
        </Col>
        <Col lg={12} md={4} sm={12}>
          <DropdownSelect
            label="Category Value"
            options={props.categoryValues}
            activeOption={props.activeCategoryValue}
            handleOptionChange={props.handleCategoryValueChange}
          />
        </Col>
      </Row>
    </Well>
  );
};

export default VolcanoControls;
