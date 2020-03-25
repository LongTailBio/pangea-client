import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route, Redirect } from 'react-router';

import Settings from './components/Profile';

interface OrganizationSettingsProps {
  uuid: string;
}

export default class OrganizationSettings extends React.Component<
  OrganizationSettingsProps,
  {}
> {
  render() {
    return (
      <Row>
        <Col lg={3}>
          <Panel>
            <Panel.Heading>Organization Settings</Panel.Heading>
            <Panel.Body>
              <ListGroup fill={true}>
                <LinkContainer
                  to={`/organizations/${this.props.uuid}/settings/profile`}
                >
                  <ListGroupItem>Profile</ListGroupItem>
                </LinkContainer>
                <LinkContainer
                  to={`/organizations/${this.props.uuid}/settings/member_privileges`}
                >
                  <ListGroupItem>Member privileges</ListGroupItem>
                </LinkContainer>
                <LinkContainer
                  to={`/organizations/${this.props.uuid}/settings/projects`}
                >
                  <ListGroupItem>Projects</ListGroupItem>
                </LinkContainer>
              </ListGroup>
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Heading>Developer Settings</Panel.Heading>
            <Panel.Body>
              <ListGroup fill={true}>
                <LinkContainer
                  to={`/organizations/${this.props.uuid}/settings/tokens`}
                >
                  <ListGroupItem>API Tokens</ListGroupItem>
                </LinkContainer>
              </ListGroup>
            </Panel.Body>
          </Panel>
        </Col>
        <Col lg={9}>
          <Switch>
            <Route
              exact={true}
              path="/organizations/:uuid/settings"
              render={props => (
                <Redirect
                  to={`/organizations/${this.props.uuid}/settings/profile`}
                />
              )}
            />
            <Route
              exact={true}
              path="/organizations/:uuid/settings/profile"
              render={props => <Settings uuid={this.props.uuid} />}
            />
            <Route
              exact={true}
              path="/organizations/:uuid/settings/member_privileges"
              render={props => (
                <div>
                  <h3>Member Privileges</h3>
                  <hr />
                </div>
              )}
            />
            <Route
              exact={true}
              path="/organizations/:uuid/settings/projects"
              render={props => (
                <div>
                  <h3>Projects</h3>
                  <hr />
                </div>
              )}
            />
            <Route
              exact={true}
              path="/organizations/:uuid/settings/tokens"
              render={props => (
                <div>
                  <h3>API Tokens</h3>
                  <hr />
                </div>
              )}
            />
          </Switch>
        </Col>
      </Row>
    );
  }
}
