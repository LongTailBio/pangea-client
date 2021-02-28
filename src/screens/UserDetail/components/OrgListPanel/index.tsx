import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem, Well } from 'react-bootstrap';
import { PangeaUserType } from '../../../../services/api/models/user';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { OrgLink } from '../../../../services/api/models/user';

interface UserOrgListPanelProps {
  orgs: Array<OrgLink>;
  user: PangeaUserType;
}

export const UserOrgListPanel = (props: UserOrgListPanelProps) => {

  const linkTo = {
    pathname: "/organizations/create",
    state: {
      user: props.user,
    }
  }
  return (
    <Row>
      <Col lg={8}>
        {props.orgs.length > 0 && (
          <ul>
            {props.orgs.map(org => (
              <li key={org.uuid}>
                <Link to={`/organizations/${org.uuid}`}>
                  {org.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {props.orgs.length === 0 && (
          <Well className="text-center">
            <h4>No organizations.</h4>
          </Well>
        )}
      </Col>
      <Col lg={2}>
        <Link to={linkTo} className="btn btn-primary">
          New Organization
        </Link>
      </Col>
    </Row>
  );
};

export default UserOrgListPanel;