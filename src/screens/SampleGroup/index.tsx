import * as React from "react";
import { Switch, Route } from "react-router";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge
} from "react-bootstrap";
import { Helmet } from "react-helmet";

import { usePangeaAxios, PaginatedResult } from "../../services/api";
import { SampleGroupType } from "../../services/api/models/sampleGroup";
import { SampleType } from "../../services/api/models/sample";
import { AnalysisResultType } from "../../services/api/models/analysisResult";

const useSampleGroup = (uuid: string) => {
  const [sampleGroupResult] = usePangeaAxios<SampleGroupType>(
    `/sample_groups/${uuid}`
  );
  const [samplesResult] = usePangeaAxios<PaginatedResult<SampleType>>(
    `/sample_groups/${uuid}/samples`
  );
  const [analysisResultsResult] = usePangeaAxios<
    PaginatedResult<AnalysisResultType>
  >(`/sample_group_ars?sample_group=${uuid}`);

  const data = {
    group: sampleGroupResult.data,
    samples: samplesResult.data,
    analysisResults: analysisResultsResult.data
  };
  const loading =
    sampleGroupResult.loading ||
    samplesResult.loading ||
    analysisResultsResult.loading;
  const error =
    sampleGroupResult.error ||
    samplesResult.error ||
    analysisResultsResult.error ||
    undefined;
  return [{ data, loading, error }];
};

interface SampleGroupScreenProps {
  uuid: string;
}

export const SampleGroupScreen = (props: SampleGroupScreenProps) => {
  const [{ data, loading, error }] = useSampleGroup(props.uuid);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: Sample Group</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
          <h2>Sample Group</h2>
        </Row>
      </>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? "Not Found" : "Error";
    return (
      <>
        <Helmet>
          <title>{`Pangea :: ${title}`}</title>
        </Helmet>
        <Row>
          <h1>{title}</h1>
          <h2>Sample Group</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  const { group, samples, analysisResults } = data;

  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${group.name}`}</title>
      </Helmet>
      <Row>
        <h1>{group.name}</h1>
        <h2>Sample Group</h2>
        <p>{group.is_public ? "Public" : "Private"}</p>
        <p>{new Date(group.created_at).toLocaleDateString()}</p>
      </Row>
      <Row>
        <Link to={`/organizations/${group.organization}`}>
          Owner Organization
        </Link>
      </Row>

      <Row>
        <Nav bsStyle="tabs" activeKey="1">
          <LinkContainer to={`/sample-groups/${props.uuid}`} exact={true}>
            <NavItem eventKey="1">
              <Glyphicon glyph="star" /> Samples <Badge>{samples.count}</Badge>
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/sample-groups/${props.uuid}/analysis-results`}>
            <NavItem eventKey="2">
              <Glyphicon glyph="folder-open" /> Analysis Results{" "}
              <Badge>0</Badge>
            </NavItem>
          </LinkContainer>
        </Nav>
      </Row>

      <br />
      <Switch>
        <Route
          exact={true}
          path="/sample-groups/:uuid"
          render={() => (
            <Row>
              <Col lg={12}>
                {samples.count > 0 &&
                  samples.results.map(sample => (
                    <ul key={sample.uuid} className="analysis-group-list">
                      <li className="analysis-group-list-item">
                        <Link to={`/samples/${sample.uuid}`}>
                          {sample.name}
                        </Link>
                      </li>
                    </ul>
                  ))}
                {samples.count === 0 && (
                  <Well className="text-center">
                    <h4>This sample group has no samples.</h4>
                  </Well>
                )}
              </Col>
            </Row>
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:uuid/analysis-results"
          render={() => (
            <Row>
              <Col lg={12}>
                {analysisResults.count > 0 &&
                  analysisResults.results.map(analysisResult => (
                    <ul
                      key={analysisResult.uuid}
                      className="analysis-group-list"
                    >
                      <li className="analysis-group-list-item">
                        <Link to={`/analysis-results/${analysisResult.uuid}`}>
                          {analysisResult.module_name}
                        </Link>
                      </li>
                    </ul>
                  ))}
                {analysisResults.count === 0 && (
                  <Well className="text-center">
                    <h4>This sample group has no analysis results.</h4>
                  </Well>
                )}
              </Col>
            </Row>
          )}
        />
      </Switch>
    </>
  );
};

export default SampleGroupScreen;
