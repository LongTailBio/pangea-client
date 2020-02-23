import * as React from "react";
import { Switch, Route } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Row, Col, Nav, NavItem, Glyphicon, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet";

import OrganizationProjects from "./scenes/OrganizationProjects";
import PeopleList from "./scenes/OrganizationPeople/components/PeopleList";
import PersonDetail from "./scenes/OrganizationPeople/components/PersonDetail";
import OrganizationSettings from "./scenes/OrganizationSettings";

import { OrganizationType } from "../../services/api/models/organization";
import { usePangeaAxios } from "../../services/api";

interface OrganizationsProps {
  uuid: string;
}

export const OrganizationDetail = (props: OrganizationsProps) => {
  const [{ data, loading, error }] = usePangeaAxios<OrganizationType>(
    `/organizations/${props.uuid}`
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: Organizations</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
          <h2>Organizations</h2>
        </Row>
      </>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? "Not Found" : "Error";
    return (
      <>
        <Helmet>
          <title>{`Pangea :: ${title}`}</title>
        </Helmet>
        <Row>
          <h1>{title}</h1>
          <h2>Organization</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${data.name}`}</title>
      </Helmet>
      <Row>
        <Row>
          <Col lg={12}>
            <h1>{data.name}</h1>
            <h2>Organization</h2>
          </Col>
        </Row>
        <Row>
          <Nav bsStyle="tabs" activeKey="1">
            <LinkContainer to={`/organizations/${props.uuid}`} exact={true}>
              <NavItem eventKey="1">
                <Glyphicon glyph="star" /> Sample Groups <Badge>0</Badge>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={`/organizations/${props.uuid}/people`}>
              <NavItem eventKey="2">
                <Glyphicon glyph="user" /> People <Badge>0</Badge>
              </NavItem>
            </LinkContainer>
          </Nav>
        </Row>
        <br />
        <Switch>
          <Route
            exact={true}
            path="/organizations/:uuid"
            render={() => <OrganizationProjects uuid={props.uuid} />}
          />
          <Route
            exact={true}
            path="/organizations/:uuid/people"
            render={props => {
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
            render={props => (
              <PersonDetail
                orguuid={props.match.params.uuid}
                username={props.match.params.username}
              />
            )}
          />
          <Route
            path="/organizations/:uuid/settings"
            render={props => (
              <OrganizationSettings uuid={props.match.params.uuid} />
            )}
          />
        </Switch>
      </Row>
    </>
  );
};

export default OrganizationDetail;
