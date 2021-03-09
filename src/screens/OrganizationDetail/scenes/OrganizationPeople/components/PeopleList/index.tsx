import React from 'react';
import {
  Row,
  Col,
  Panel,
  ListGroup,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { OrganizationType } from '../../../../../../services/api/models/organization';
import { UserType } from '../../../../../../services/api/models/user';
import { AddUserForm } from './components/AddPerson';

interface PersonRowProps {
  user: UserType;
}

const PersonRow = (props: PersonRowProps) => {
  return (
    <li className="list-group-item">
      <Link to={`/users-id/${props.user.id}`}>{props.user.email}</Link>
      <span className="pull-right">
        <DropdownButton
          title="Settings"
          id={'dropdown-basic-uuid'}
          pullRight={true}
        >
          <MenuItem eventKey="1">Manage</MenuItem>
          <MenuItem eventKey="2" style={{ color: 'red' }}>
            Remove from organization
          </MenuItem>
        </DropdownButton>
      </span>
      <span className="clearfix" />
    </li>
  );
};

interface PeopleListProps {
  people: UserType[];
  org : OrganizationType;
}

export const PeopleList = (props: PeopleListProps) => {
  const people = props.people;

  return (
    <>
      <Row>
        <Col lg={12}>
          <Panel>
            <Panel.Heading>Members</Panel.Heading>
            <Panel.Body>
              <ListGroup fill={true} componentClass="ul">
                {people.map(user => (
                  <PersonRow key={user.id} user={user} />
                ))}
              </ListGroup>
              <AddUserForm org={props.org} />
            </Panel.Body>
          </Panel>
        </Col>
      </Row>

    </>
  );
};

export default PeopleList;
