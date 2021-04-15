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


interface AnalysisResultPanelProps {
  uuid: string;
  analysisResults: Array<AnalysisResultType>;
}

export const AnalysisResultPanel = (props: AnalysisResultPanelProps) => {
  const { authToken } = window.localStorage;
  const analysisResults = props.analysisResults;
  const linkToCreateAr = {
    pathname: `/sample-groups/${props.uuid}/create-analysis-results`,
  }  
  return (
      <Row>
        <Col lg={12}>
          {analysisResults.length > 0 &&
            analysisResults.map(analysisResult => (
              <ul
                key={analysisResult.uuid}
                className="analysis-group-list"
              >
                <li className="analysis-group-list-item">
                  <Link
                    to={`/sample-groups/${props.uuid}/analysis-results/${analysisResult.uuid}`}
                  >
                    {analysisResult.module_name} -{' '}
                    {analysisResult.replicate}
                  </Link>
                  {analysisResult.description && (
                    <>
                      <br/>
                      <p>{analysisResult.description}</p>
                    </>)}                  
                </li>
              </ul>
            ))}
          <Link to={linkToCreateAr} className="btn btn-primary">
            Create Analysis Result
          </Link>
          {analysisResults.length === 0 && (
            <Well className="text-center">
              <h4>This sample group has no analysis results.</h4>
            </Well>
          )}
        </Col>
      </Row>
  );
};

export default AnalysisResultPanel;