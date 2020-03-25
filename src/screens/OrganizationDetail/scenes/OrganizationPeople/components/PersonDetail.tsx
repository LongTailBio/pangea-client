import React from 'react';
import {
  Row,
  Col,
  Panel,
  Button,
  ListGroup,
  ListGroupItem,
  Well,
  Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface PersonDetailProps {
  orguuid: string;
  username: string;
}

const PersonDetail: React.FC<PersonDetailProps> = props => (
  <Row>
    <Col lg={3}>
      <Panel>
        <Panel.Heading>Benjamin Chrobot</Panel.Heading>
        <ListGroup fill={true}>
          <LinkContainer
            to={`/organizations/${props.orguuid}/people/${props.username}`}
          >
            <ListGroupItem>0 Projects</ListGroupItem>
          </LinkContainer>
          <ListGroupItem>Membership</ListGroupItem>
        </ListGroup>
      </Panel>
      <Button bsStyle="danger" block={true}>
        Remove from organization
      </Button>
    </Col>
    <Col lg={9}>
      <Well className="text-center">
        <Glyphicon glyph="book" />
        <h4>No projects</h4>
        <p>
          It doesn’t look like <strong>bchrobot</strong> has access to any
          projects yet.
        </p>
      </Well>
    </Col>
  </Row>
);

export default PersonDetail;
