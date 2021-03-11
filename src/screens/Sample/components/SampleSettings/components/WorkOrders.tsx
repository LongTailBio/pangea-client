import * as React from 'react';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { SampleType } from '../../../../../services/api/models/sample';


interface SampleSettingWorkOrderProps {
  sample: SampleType;
}


const SampleSettingWorkOrder = (props: SampleSettingWorkOrderProps) => {

  return (
    <Row>
        WO
    </Row>
  );
}
export default SampleSettingWorkOrder;