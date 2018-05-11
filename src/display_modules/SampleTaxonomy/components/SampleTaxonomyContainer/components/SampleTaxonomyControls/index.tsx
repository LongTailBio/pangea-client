import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';

import SelectSource from '../../../../../controls/SelectSource';

type ControlsProps = {
  sources: string[];
  activeSource: string;
  handleSourceChange(newSource: string): void;
};

const SampleTaxonomyControls: React.SFC<ControlsProps> = (props) => {
  return (
    <Well>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <SelectSource {...props} />
        </Col>
      </Row>
    </Well>
  );
};

export default SampleTaxonomyControls;
