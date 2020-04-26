import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';

import DropdownSelect from '../../../../../controls/DropdownSelect';

type ControlsProps = {
  properties: string[];
  activeProperty: string;
  handlePropertyChange(property: string): void;
};

const MicrobeDirectoryControls: React.SFC<ControlsProps> = (props) => {
  return (
    <Well>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <DropdownSelect
            label="Property"
            options={props.properties}
            activeOption={props.activeProperty}
            handleOptionChange={props.handlePropertyChange}
          />
        </Col>
      </Row>
    </Well>
  );
};

export default MicrobeDirectoryControls;
