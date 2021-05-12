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
  Collapse,
  Button,
  Panel
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { SampleType } from '../../../../services/api/models/sample';
import { AnalysisResultType } from '../../../../services/api/models/analysisResult';


interface AnalysisResultPanelProps {
  uuid: string;
  analysisResults: Array<AnalysisResultType>;
}


const arHtml = (analysisResult: AnalysisResultType, uuid: string) => {

  return (
    <ul
      key={analysisResult.uuid}
      className="analysis-group-list"
    >
      <li className="analysis-group-list-item">
        <Link
          to={`/sample-groups/${uuid}/analysis-results/${analysisResult.uuid}`}
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
  )
}


const arList = (analysisResults: AnalysisResultType[], uuid: string) => {
  if(analysisResults.length === 0) {
    return (<></>)
  }
  return (
    <>
      {analysisResults.map(aR => arHtml(aR, uuid))}
    </>
  )
}

export const AnalysisResultPanel = (props: AnalysisResultPanelProps) => {
  const [open, setOpen] = React.useState(false);
  const { authToken } = window.localStorage;
  const analysisResults = props.analysisResults;
  const linkToCreateAr = {
    pathname: `/sample-groups/${props.uuid}/create-analysis-results`,
  }
  const shownResults = analysisResults.filter(ar => !ar.is_hidden);
  const hiddenResults = analysisResults.filter(ar => ar.is_hidden);
  return (
      <Row>
        <Col lg={12}>
          {arList(shownResults, props.uuid)}
          
          { hiddenResults.length > 0 && (
            <>
              <hr/>
              <Button
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
              >
                {open ? "Hide Hidden Results" : "Show Hidden Results"}
              </Button>
              <br/>
              <Collapse in={open}>
                <Panel>
                {arList(hiddenResults, props.uuid)}
                </Panel>
              </Collapse>
            </>
          )}
          <br/>
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