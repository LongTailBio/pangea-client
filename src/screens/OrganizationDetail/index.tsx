import React from 'react';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import OrganizationProjects from './scenes/OrganizationProjects';
import PeopleList from './scenes/OrganizationPeople/components/PeopleList';
import PersonDetail from './scenes/OrganizationPeople/components/PersonDetail';
import OrganizationSettings from './scenes/OrganizationSettings';
import { HandleErrorLoading } from '../../components/ErrorLoadingHandler'
import WikiPanel from '../../components/WikiPanel'

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { WikiType } from '../../services/api/models/wiki';
import { OrganizationType } from '../../services/api/models/organization';
import { SampleGroupType } from '../../services/api/models/analysisGroup';
import { UserType } from '../../services/api/models/user';


const useOrganization = (uuid: string) => {
  const [organization] = usePangeaAxios<OrganizationType>(
    `/organizations/${uuid}`,
  );
  const [sampleGroups] = usePangeaAxios<PaginatedResult<SampleGroupType>>(
    `/sample_groups?organization_id=${uuid}`,
  );

  const [people] = usePangeaAxios<PaginatedResult<UserType>>(
    `/organizations/${uuid}/users`,
  );

  const [wiki] = usePangeaAxios<WikiType>(
    `/organizations/${uuid}/wiki`,
  );
  const data = {
    organization: organization.data,
    sampleGroups: sampleGroups.data,
    people: people.data,
    wiki: wiki.data,
  };
  const loading =
    organization.loading || sampleGroups.loading || people.loading || wiki.loading;
  const error =
    organization.error || sampleGroups.error || people.error || wiki.error || undefined;

  return [{ data, loading, error }];
};

interface OrganizationsProps {
  uuid: string;
}

export const OrganizationDetail = (props: OrganizationsProps) => {
  const [{ data, loading, error }] = useOrganization(props.uuid);

  if(loading || error){
    return (<HandleErrorLoading loading={loading} error={error}/>)
  }

  const { organization, sampleGroups, people, wiki } = data;
  console.log(wiki)
  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${organization.name}`}</title>
      </Helmet>
      <Row>
        <Row>
          <Col lg={12}>
            <h1>{organization.name}</h1>
            <h2>Organization</h2>
          </Col>
        </Row>
        <Row>
          <Nav bsStyle="tabs" activeKey="1">
            <LinkContainer to={`/organizations/${props.uuid}`} exact={true}>
              <NavItem eventKey="1">
                <Glyphicon glyph="star" /> Sample Groups{' '}
                <Badge>{sampleGroups.count}</Badge>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={`/organizations/${props.uuid}/wiki`}>
              <NavItem eventKey="2">
                <Glyphicon glyph="book" /> Wiki
              </NavItem>
            </LinkContainer>            
            <LinkContainer to={`/organizations/${props.uuid}/people`}>
              <NavItem eventKey="3">
                <Glyphicon glyph="user" /> People <Badge>{people.count}</Badge>
              </NavItem>
            </LinkContainer>
            <LinkContainer to={`/organizations/${props.uuid}/settings`}>
              <NavItem eventKey="4">
                <Glyphicon glyph="cog" /> Settings
              </NavItem>
            </LinkContainer>            
          </Nav>
        </Row>
        <br />
        <Switch>
          <Route
            exact={true}
            path="/organizations/:uuid"
            render={() => (
              <OrganizationProjects sampleGroups={sampleGroups} organization={organization} />
            )}
          />
          <Route
            exact={true}
            path="/organizations/:uuid/wiki"
            render={_props => <WikiPanel uuid={organization.uuid} wiki={wiki} kind="organizations" />}
          />          
          <Route
            exact={true}
            path="/organizations/:uuid/people"
            render={_props => <PeopleList people={people.results} org={organization} />}
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
              <OrganizationSettings org={organization} />
            )}
          />
        </Switch>
      </Row>
    </>
  );
};

export default OrganizationDetail;
