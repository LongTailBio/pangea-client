import * as React from 'react';
import { Link } from 'react-router-dom';

import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Tab, Tabs,  } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';

import BasicSampleGroupSettings from './components/BasicSampleGroupSettings'

interface SampleGroupSettingsProps {
  grp: SampleGroupType;
}


const SampleGroupSettings = (props: SampleGroupSettingsProps) => {
  return (
    <Row>
      <Tabs id="user_settings_tabs">
        <Tab eventKey={1} title="Basics">
          <BasicSampleGroupSettings grp={props.grp} />
        </Tab>       
      </Tabs>
    </Row>
  );
}
export default SampleGroupSettings;