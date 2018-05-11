import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';

import SelectSource from '../../../../../controls/SelectSource';

type ControlsProps = {
  sources: string[];
  activeSource: string;
  handleSourceChange(newSource: string): void;
};

class ReadStatsControls extends React.Component<ControlsProps, {}> {
  constructor(props: ControlsProps) {
    super(props);
    this.handleSourceChange = this.handleSourceChange.bind(this);
  }

  handleSourceChange(newSource: string) {
    this.props.handleSourceChange(newSource);
  }

  render() {
    return (
      <Well>
        <Row>
          <Col lg={12} md={4} sm={12}>
            <SelectSource {...this.props} />
          </Col>
        </Row>
      </Well>
    );
  }
}

export default ReadStatsControls;