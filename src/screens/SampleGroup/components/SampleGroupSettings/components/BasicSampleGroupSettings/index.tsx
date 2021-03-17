import * as React from 'react';
import { Link } from 'react-router-dom';

import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Tab, Tabs,  } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';

import SampleGroupName from './components/SampleGroupName';
import SampleGroupPublic from './components/SampleGroupPublic';


interface BasicSampleGroupSettingsProps {
  grp: SampleGroupType;
}


const BasicSampleGroupSettings = (props: BasicSampleGroupSettingsProps) => {
  return (
    <>
      <Row>
        <Col lg={6} lgOffset={2}>
          <SampleGroupName grp={props.grp} />
        </Col>
      </Row>
      <Row>
        <Col lg={6} lgOffset={2}>
          <SampleGroupPublic grp={props.grp} />
        </Col>
      </Row>
    </>
  );
}
export default BasicSampleGroupSettings;