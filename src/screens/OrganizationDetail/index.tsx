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

import { OrganizationType } from '../../services/api/models/organization';
import { getOrganization } from '../../services/api';

interface OrganizationsProps {
  uuid: string;
  isAuthenticated: boolean;
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
                <h2>Organization</h2>
              </Col>
            </Row>
            <Row>
              <Nav bsStyle="tabs" activeKey="1">
                <LinkContainer to={`/organizations/${this.props.uuid}`} exact={true}>
                  <NavItem eventKey="1"><Glyphicon glyph="star" /> Sample Groups <Badge>
                    0
                  </Badge></NavItem>
                </LinkContainer>
                <LinkContainer to={`/organizations/${this.props.uuid}/people`}>
                  <NavItem eventKey="2"><Glyphicon glyph="user" /> People <Badge>
                    0
                  </Badge></NavItem>
                </LinkContainer>
              </Nav>
            </Row>
            <br />
            <Switch>
              <Route
                exact={true}
                path="/organizations/:uuid"
                render={(props) => {
                  return (
                    <OrganizationProjects
                      uuid={props.match.params.uuid}
                      userUUIDs={[]}
                      sampleGroupUUIDs={[]}
                    />
                  );
                }}
              />
              <Route
                exact={true}
                path="/organizations/:uuid/people"
                render={(props) => {
                  return (
                    <PeopleList
                      orguuid={props.match.params.uuid}
                      peopleUUIDs={[]}
                      peopleUsernames={[]}
                    />
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
