import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import OrganizationProjects from './scenes/OrganizationProjects';
import PeopleList from './scenes/OrganizationPeople/components/PeopleList';
import PersonDetail from './scenes/OrganizationPeople/components/PersonDetail';
import OrganizationSettings from './scenes/OrganizationSettings';

import { OrganizationType } from '../../../../services/api/models/organization';
import { getOrganization } from '../../../../services/api';

interface OrganizationsProps {
  uuid: string;
}

interface OrganizationState {
  organization?: OrganizationType;
}

class OrganizationDetail extends React.Component<OrganizationsProps, OrganizationState> {

  protected sourceToken: CancelTokenSource;

  constructor(props: OrganizationsProps) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      organization: undefined,
    };
  }

  componentDidMount() {
    // Assume that we are authenticated because Dashboard catches that
    getOrganization(this.props.uuid, this.sourceToken)
      .then((organization) => {
        this.setState({ organization });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          // tslint:disable-next-line:no-console
          console.log(error);
        }
      });
  }

  componentWillUnmount() {
    this.sourceToken.cancel();
  }

  render() {
    return (
      <div>
        <Helmet>
          {this.state.organization &&
            <title>{`MetaGenScope :: ${this.state.organization.name}`}</title>
          }
          {!this.state.organization &&
            <title>MetaGenScope :: Not Found</title>
          }
        </Helmet>
        {!this.state.organization &&
          <Row>
            <Col lg={12}>
              <h1>Not Found</h1>
              Go back to the <Link to="/organizations">organizations list</Link>.
            </Col>
          </Row>
        }
        {this.state.organization &&
          <div>
            <Row>
              <Col lg={12}>
                <h1>{this.state.organization.name}</h1>
                <p>Admin email: <Link to={`mailto:${this.state.organization.adminEmail}`}>
                  {this.state.organization.adminEmail}
                </Link></p>
              </Col>
            </Row>
            <Row>
              <Nav bsStyle="tabs" activeKey="1">
                <LinkContainer to={`/organizations/${this.props.uuid}`} exact={true}>
                  <NavItem eventKey="1"><Glyphicon glyph="star" /> Sample Groups <Badge>
                    {this.state.organization.sampleGroups.length}
                  </Badge></NavItem>
                </LinkContainer>
                <LinkContainer to={`/organizations/${this.props.uuid}/people`}>
                  <NavItem eventKey="2"><Glyphicon glyph="user" /> People <Badge>
                    {this.state.organization.users.length}
                  </Badge></NavItem>
                </LinkContainer>
                <LinkContainer to={`/organizations/${this.props.uuid}/settings`}>
                  <NavItem eventKey="3"><Glyphicon glyph="cog" /> Settings</NavItem>
                </LinkContainer>
              </Nav>
            </Row>
            <br />
            <Switch>
              <Route
                exact={true}
                path="/organizations/:uuid"
                render={(props) => {
                  const users = this.state.organization ? this.state.organization.users : [];
                  const sampleGroups = this.state.organization ? this.state.organization.sampleGroups : [];
                  return (
                    <OrganizationProjects
                      uuid={props.match.params.uuid}
                      users={users}
                      sampleGroups={sampleGroups}
                    />
                  );
                }}
              />
              <Route
                exact={true}
                path="/organizations/:uuid/people"
                render={(props) => {
                  const users = this.state.organization ? this.state.organization.users : [];
                  return (
                    <PeopleList orguuid={props.match.params.uuid} people={users} />
                  );
                }}
              />
              <Route
                exact={true}
                path="/organizations/:uuid/people/:username"
                render={(props) => (
                  <PersonDetail
                    orguuid={props.match.params.uuid}
                    username={props.match.params.username}
                  />
                )}
              />
              <Route
                path="/organizations/:uuid/settings"
                render={(props) => (
                  <OrganizationSettings uuid={props.match.params.uuid} />
                )}
              />
            </Switch>
          </div>
        }
      </div>
    );
  }
}

export default OrganizationDetail;
