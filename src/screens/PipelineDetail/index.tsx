import React from 'react';
import { default as axios, CancelTokenSource } from 'axios';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import PipelineModules from './scenes/PipelineModules';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { PipelineType } from '../../services/api/models/pipeline';
import { PipelineModuleType } from '../../services/api/models/pipelineModule';
import { modifyPipelineDescription } from '../../services/api/pipelineApi'

import EditableText from '../../components/EditableText';


const usePipeline = (uuid: string) => {
  const [pipeline] = usePangeaAxios<PipelineType>(
    `/pipelines/${uuid}`,
  );
  const [modules] = usePangeaAxios<PaginatedResult<PipelineModuleType>>(
    `/pipeline_modules?pipeline=${uuid}`,
  );

  const data = {
    pipeline: pipeline.data,
    modules: modules.data,
  };
  const loading =
    pipeline.loading || modules.loading;
  const error =
    pipeline.error || modules.error || undefined;

  return [{ data, loading, error }];
};

interface PipelineProps {
  uuid: string;
}

export const PipelineDetail = (props: PipelineProps) => {
  const [{ data, loading, error }] = usePipeline(props.uuid);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: Pipelines</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
          <h2>Pipeline</h2>
        </Row>
      </>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
      <>
        <Helmet>
          <title>{`Pangea :: ${title}`}</title>
        </Helmet>
        <Row>
          <h1>{title}</h1>
          <h2>Pipeline</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  const { pipeline, modules } = data;

  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${pipeline.name}`}</title>
      </Helmet>
      <Row>
        <Row>
          <Col lg={12}>
            <h1>{pipeline.name}</h1>
            <h2>Pipeline</h2>
          </Col>
          <EditableText
            onSubmit={(text: string) => modifyPipelineDescription(pipeline, text, axios.CancelToken.source(), false)}
            initialText={pipeline.description}
            inputType={"inline"}
            title={"Description"}
          />
          <EditableText
            onSubmit={(text: string) => modifyPipelineDescription(pipeline, text, axios.CancelToken.source(), true)}
            initialText={pipeline.long_description}
            inputType={"area"}
            title={"Long Description"}
          />          
        </Row>
        <Row>
          <Nav bsStyle="tabs" activeKey="1">
            <LinkContainer to={`/pipelines/${props.uuid}`} exact={true}>
              <NavItem eventKey="1">
                <Glyphicon glyph="star" /> Modules{' '}
                <Badge>{modules.count}</Badge>
              </NavItem>
            </LinkContainer>
          </Nav>
        </Row>
        <br />
        <Switch>
          <Route
            exact={true}
            path="/pipelines/:uuid"
            render={() => (
              <PipelineModules modules={modules.results} />
            )}
          />
        </Switch>
      </Row>
    </>
  );
};

export default PipelineDetail;
