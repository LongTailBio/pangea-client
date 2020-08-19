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
import { SampleType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';


interface SampleListPanelProps {
  samples: Array<SampleType>;
}

export const SampleListPanel = (props: SampleListPanelProps) => {
  const { authToken } = window.localStorage;
  const samples = props.samples;
  let metadata_count = 0;
  samples.map(
    sample => (metadata_count += Object.keys(sample.metadata).length),
  );
  return (
    <Row>
      <Col lg={8}>
        {samples.length > 0 &&
          samples.map(sample => (
            <ul key={sample.uuid} className="analysis-group-list">
              <li className="analysis-group-list-item">
                <Link to={`/samples/${sample.uuid}`}>
                  {sample.name}
                </Link>
              </li>
            </ul>
          ))}
        {samples.length === 0 && (
          <Well className="text-center">
            <h4>This sample group has no samples.</h4>
          </Well>
        )}
      </Col>
      <Col lg={2} lgOffset={2}>
        <Link to="/samples/create" className="btn btn-primary">
          Add Sample
        </Link>
      </Col>
    </Row>
  );
};

export default SampleListPanel;
