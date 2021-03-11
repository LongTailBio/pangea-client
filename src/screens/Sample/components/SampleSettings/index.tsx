import * as React from 'react';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem, Tab, Tabs,  } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SampleType } from '../../../../services/api/models/sample';
import SampleSettingWorkOrder from './components/WorkOrders';

interface SampleSettingsProps {
  sample: SampleType;
}


const SampleSettings = (props: SampleSettingsProps) => {

  return (
    <Row>
      <Tabs id="sample_settings_tabs">
        <Tab eventKey={1} title="Work Orders">
          <SampleSettingWorkOrder sample={props.sample}/>
        </Tab>
      </Tabs>
    </Row>    
  );
}
export default SampleSettings;