import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem, Well } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { OrgLink } from '../../../../services/api/models/user';

interface UserOrgListPanelProps {
  orgs: Array<OrgLink>;
}

export const UserOrgListPanel = (props: UserOrgListPanelProps) => {

  return (
    <>
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
    </>
  );
};

export default UserOrgListPanel;