import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
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

import { SampleGroupType } from '../../../../services/api/models/sampleGroup';


interface VizPanelProps {
  group: SampleGroupType;
}

export const VizPanel = (props: VizPanelProps) => {
  const group = props.group;
  return (
    <Row>
      <Col lg={12}>
        <ul key="get-manifest" className="analysis-group-list">

          <li className="analysis-group-list-item">
            <Link
              to={`/contrib/metagenscope/sample-groups/${group.uuid}`}
            >
              MetaGenScope - Automated Data Visualization
            </Link>
          </li>
        </ul>
      </Col>
    </Row>
  );
};

export default VizPanel;
