import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';

import DropdownSelect from '../../../../../controls/DropdownSelect';

type ControlsProps = {
  axisChoices: string[];
  xAxis: string;
  yAxis: string;
  handleXAxisChange(xAxis: string): void;
  handleYAxisChange(yAxis: string): void;
};

class MultiAxisControls extends React.Component<ControlsProps, {}> {
  constructor(props: ControlsProps) {
    super(props);
  }

  render() {
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
      </Well>
    );
  }
}

export default MultiAxisControls;
