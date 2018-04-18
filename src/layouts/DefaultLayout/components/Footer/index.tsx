import * as React from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';

interface FooterModelState {
  showModal: boolean;
}

class Footer extends React.Component<{}, FooterModelState> {
  constructor(props: {}) {
    super(props);

    this.state = { showModal: false };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <Row>
          <Col lg={12}>
            <hr />
            <Button bsStyle="link" onClick={this.open}>About/Attributions/License</Button>
          </Col>
        </Row>

        <Modal show={this.state.showModal} onHide={this.close} bsSize="lg">
          <Modal.Header closeButton={true}>
            <Modal.Title>About/Attributions/License</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>All of the data presented (including but not limited to *.json, *.txt and figures, text, analyses
              and conclusions generated by those data either through this website or separately) is restricted
              for use and requires explicit permission from the right holders. Participant will indemnify, defend
              and hold harmless LongTail Biotech and affiliates from and against any and all losses, damages,
              liabilities, expenses and costs, caused by (a) accidental negligence or willful misconduct, or (b)
              the breach of any of the covenants, warranties and representations. This page is purely for
              demonstration and the results presented do not constitute a clinical diagnosis or scientific
              evaluation of any kind.</p>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Footer;
