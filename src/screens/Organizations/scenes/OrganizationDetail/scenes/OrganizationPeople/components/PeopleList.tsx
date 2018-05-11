import * as React from 'react';
import { Row, Col, Panel, ListGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { UserType } from '../../../../../../../services/api/models/user';

interface PersonRowProps {
  orguuid: string;
  user: UserType;
}

const PersonRow: React.SFC<PersonRowProps> = (props) => {
  return (
    <li className="list-group-item">
      <span className="pull-right">
        <DropdownButton title="Settings" id={'dropdown-basic-uuid'} pullRight={true}>
          <MenuItem eventKey="1">Manage</MenuItem>
          <MenuItem eventKey="2" style={{color: 'red'}}>Remove from organization</MenuItem>
        </DropdownButton>
      </span>
      <p><Link to={`/organizations/${props.orguuid}/people/${props.user.username}`}>
        {props.user.username}
      </Link></p>
    </li>
  );
};

interface PeopleListProps {
  orguuid: string;
  people: Array<UserType>;
}

const PeopleList: React.SFC<PeopleListProps> = (props) => {
  return (
    <Row>
      <Col lg={12}>
        <Panel>
          <Panel.Heading>Select All</Panel.Heading>
          <Panel.Body>
            <ListGroup fill={true} componentClass="ul">
              {
                props.people.map((user, index) => {
                  return <PersonRow key={index} orguuid={props.orguuid} user={user} />;
                })
              }
            </ListGroup>
          </Panel.Body>
        </Panel>
      </Col>
    </Row>
  );
};

export default PeopleList;
