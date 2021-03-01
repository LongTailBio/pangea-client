import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem, Tab, Tabs, } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route, Redirect } from 'react-router';
import { OrganizationType } from '../../../../services/api/models/organization';
import OrgSettingsProfile from './components/Profile';
import OrgSettingsCloudStorage from './components/CloudStorage';

interface OrganizationSettingsProps {
  org: OrganizationType;
}

export default class OrganizationSettings extends React.Component<OrganizationSettingsProps, {}> {
  render() {
    return (

      <Row>
        <Tabs id="user_settings_tabs">
          <Tab eventKey={1} title="Profile">
            <OrgSettingsProfile org={this.props.org} />
          </Tab>
          <Tab eventKey={2} title="Storage">
            <OrgSettingsCloudStorage uuid={this.props.org.uuid} />
          </Tab>        
        </Tabs>
      </Row>
    );
  }
}
