import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem, Tab, Tabs } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router';
import { PangeaUserType } from '../../../../services/api/models/user';

import UserSettingsDetails from './components/Details'
import UserSettingsProfile from './components/Profile'
import UserPasswordFormPage from './components/Password'

interface PangeaUserSettingsProps {
  user: PangeaUserType;
}

interface PangeaUserSettingsState {
  activeTab: number;
}


export default class PangeaUserSettings extends React.Component<PangeaUserSettingsProps, PangeaUserSettingsState> {

  constructor(props: PangeaUserSettingsProps) {
    super(props);
    this.state = {
      activeTab: 1
    };
    
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event: any) {
    let tab = event as number;
    this.setState({
      activeTab: tab
    });
  }

  render() {
    return (
      <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect} id="user_settings_tabs">
        <Tab eventKey={1} title="Details">
          <UserSettingsDetails user={this.props.user} />
        </Tab>
        <Tab eventKey={2} title="Profile Settings">
          <UserSettingsProfile user={this.props.user} />
        </Tab>
        <Tab eventKey={3} title="Log Out">
          <Link to="/logout" className="btn btn-danger">Log Out</Link>
        </Tab> 
        <Tab eventKey={4} title="Change Password">
          <UserPasswordFormPage user={this.props.user} />
        </Tab>                   
      </Tabs>
    );
  }
}

