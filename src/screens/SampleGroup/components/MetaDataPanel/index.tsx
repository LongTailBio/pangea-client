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


interface MetaDataPanelProps {
  group: SampleGroupType;
  samples: Array<SampleType>;
  analysisResults: Array<AnalysisResultType>;
}

export const MetaDataPanel = (props: MetaDataPanelProps) => {
  const { authToken } = window.localStorage;
  const group = props.group;
  const samples = props.samples;
  const analysisResults = props.analysisResults;
  let metadata_count = 0;
  samples.map(
    sample => (metadata_count += Object.keys(sample.metadata).length),
  );
  return (
    <Row>
      <ul key="get-manifest" className="analysis-group-list">
        <li className="analysis-group-list-item">
          <a
            href={`/api/sample_groups/${group.uuid}/module_counts?format=json&token=${authToken}`}
          >
            Module Counts - the number of modules of each type
            attached to this group
          </a>
        </li>
        <li className="analysis-group-list-item">
          <a
            href={`/api/sample_groups/${group.uuid}/manifest?format=json&token=${authToken}`}
          >
            Data Manifest - A file describing this group and
            everything in it
          </a>
        </li>
        <li className="analysis-group-list-item">
          <a
            href={`/api/sample_groups/${group.uuid}/metadata?kind=csv&token=${authToken}`}
          >
            Metadata - Download metadata for this group as a CSV
          </a>
        </li>
      </ul>
      <Col lg={12}>
        {samples.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Sample</th>
                <th scope="col">Feature</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {samples.map(sample =>
                Object.keys(sample.metadata).map(key => (
                  <tr key={sample.name + key}>
                    <th scope="row">{sample.name}</th>
                    <td>{key}</td>
                    <td>{sample.metadata[key]}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        )}
        {samples.length === 0 && (
          <Well className="text-center">
            <h4>This sample group has no samples.</h4>
          </Well>
        )}
      </Col>
    </Row>
  );
};

export default MetaDataPanel;
