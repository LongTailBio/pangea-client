import * as React from 'react';
import { Well, Row, Col } from 'react-bootstrap';

import SelectSource from '../../../../../controls/SelectSource';
import MinimumCount from './components/MinimumCount';

type ControlsProps = {
  sources: string[];
  activeSource: string;
  activeCount: number;
  handleMinimumChange(newSource: number): void;
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
          <Col lg={12} md={4} sm={12}>
            <MinimumCount
              activeCount={this.props.activeCount}
              handleCountChange={this.props.handleMinimumChange}
            />
          </Col>
        </Row>
      </Well>
    );
  }
}

export default ReadStatsControls;