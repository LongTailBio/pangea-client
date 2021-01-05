import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Well } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios } from '../../services/api/index';
import { TagType } from '../../services/api/models/tag';

type TagResult = {
  count: number;
  results: TagType[];
};

export const TagList = () => {
  const [{ data, loading, error }] = usePangeaAxios<TagResult>(
    '/contrib/tags',
  );

  return (
    <>
      <Helmet>
        <title>Pangea :: Tags</title>
      </Helmet>
      <Row>
        <h1>Tags</h1>
      </Row>
      <Row>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data && (
          <Col lg={12}>
            {data.results.length > 0 && (
              <ul>
                {data.results.map(tag => (
                  <li key={tag.uuid}>
                    <Link to={`/tags/${tag.uuid}`}>
                      {tag.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {data.results.length === 0 && (
              <Well className="text-center">
                <h4>No tags.</h4>
              </Well>
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export default TagList;
 