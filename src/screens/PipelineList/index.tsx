import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Well } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios } from '../../services/api/index';
import { PipelineType } from '../../services/api/models/pipeline';
import { getAllPipelines }from '../../services/api/pipelineApi';

type PipelineResult = {
  count: number;
  results: PipelineType[];
};

export const PipelineList = () => {
  const [{ data, loading, error }] = usePangeaAxios<PipelineResult>(
    '/pipelines',
  );

  return (
    <>
      <Helmet>
        <title>Pangea :: Pipelines</title>
      </Helmet>
      <Row>
        <h1>Pipelines</h1>
      </Row>
      <Row>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data && (
          <Col lg={12}>
            {data.results.length > 0 && (
              <ul>
                {data.results.map(pipeline => (
                  <li key={pipeline.uuid}>
                    <Link to={`/pipelines/${pipeline.uuid}`}>
                      {pipeline.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {data.results.length === 0 && (
              <Well className="text-center">
                <h4>No pipelines.</h4>
              </Well>
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export default PipelineList;
 