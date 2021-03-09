import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route, Redirect } from 'react-router';
import { PangeaUserType } from '../../../../../services/api/models/user';


interface UserSettingsDetailsProps {
  user: PangeaUserType;
}

export const UserSettingsDetails = (props: UserSettingsDetailsProps) => {
  return (
    <ul>
      <li><strong>Email:</strong> {props.user.email}</li>
      <li><strong>User ID:</strong> {props.user.id}</li>
      <li><strong>User UUID:</strong> {props.user.uuid}</li>
    </ul>
  );
}

export default UserSettingsDetails;