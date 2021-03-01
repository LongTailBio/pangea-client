import React from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
} from 'react-bootstrap';

import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';
import { getUser } from '../../services/api';
import { PangeaUserType } from '../../services/api/models/user';
import { usePangeaAxios } from '../../services/api';
import PangeaUserSettings from './components/SettingsPanel'
import UserOrgListPanel from './components/OrgListPanel'
import {useUserContext} from '../../components/UserContext'

interface PangeaUserDetailScreenProps {
  isAuthenticated: boolean;
  isDjoserId: boolean;
  currentUser: boolean;
  id: string;
}


const usePangeaUser = (props: PangeaUserDetailScreenProps) => {
  const {handleFetchUserProfile} = useUserContext();
  var url = '';
  if(props.isDjoserId){
    url = `/users/id/${props.id}`;
  } else if(props.id){
    url = `/users/${props.id}`;
  } else if(props.currentUser){
    url = `/users/me`;
  }
  const [{ data, loading, error }] = usePangeaAxios<PangeaUserType>(
      url,
    );
  handleFetchUserProfile(data);
  return [{ data, loading, error }];
};


export const PangeaUserDetail = (props: PangeaUserDetailScreenProps) => {
  const [{ data, loading, error }] = usePangeaUser(props);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <Helmet>
        <title>Pangea :: User Detail</title>
      </Helmet> 
      <Row>
        <Col lg={3}>
          {(data.name) && (<h4>{data.name}</h4>)}
          {(data.biography) && (<p>{data.biography}</p>)}

          {(data.company) && (<h5><Glyphicon glyph="education"/> {data.company}</h5>)}
          {(data.location) && (<h5><Glyphicon glyph="map-marker"/> {data.location}</h5>)}
          {(data.twitter_username) && (<h5><Glyphicon glyph="asterisk"/> <a href={`https://twitter.com/${data.twitter_username}`}>{' Twitter: @'}{data.twitter_username}</a></h5>)}
          {(data.github_username) && (<h5><Glyphicon glyph="asterisk"/><a href={`https://github.com/${data.github_username}`}>{' GitHub: '}{data.github_username}</a></h5>)}
        </Col>
        <Col lg={9}>

          <Row>
            <Nav bsStyle="tabs" activeKey="1">
              <LinkContainer to={`/users/${data.uuid}`} exact={true}>
                <NavItem eventKey="1">
                  <Glyphicon glyph="bookmark" /> Organizations <Badge>{data.organization_objs.length}</Badge>
                </NavItem>
              </LinkContainer>
              <LinkContainer to={`/users/${data.uuid}/settings`}>
                <NavItem eventKey="2">
                  <Glyphicon glyph="cog" /> Settings
                </NavItem>
              </LinkContainer>
            </Nav>
          </Row>

          <br />
          <Switch>
            <Route
              exact={true}
              path="/users/:uuid"
              render={() => (
                <UserOrgListPanel orgs={data.organization_objs} user={data}/>
              )}
            />
            <Route
              exact={true}
              path="/users/:uuid/settings"
              render={() => (
                <PangeaUserSettings user={data}/>
              )}
            />
          </Switch>


        </Col>
      </Row>
    </>
  );
};

PangeaUserDetail.defaultProps = {
  isDjoserId: false,
  id: '',
  currentUser: true,
}

export default PangeaUserDetail;
