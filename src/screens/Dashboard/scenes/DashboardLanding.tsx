import * as React from 'react';
import { Row, Col } from 'react-bootstrap';

class DashboardLanding extends React.Component<{}, {}> {
  render() {
    return (
      <Row>
        <Col lg={12}>
          <h1>Dashboard</h1>
          <p>Something will go here eventually&hellip;</p>
        </Col>
      </Row>
    );
  }
}

export default DashboardLanding;
