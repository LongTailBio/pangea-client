import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Well } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios } from '../../services/api/index';
import { OrganizationType } from '../../services/api/models/organization';

type OrganizationResult = {
  count: number;
  results: OrganizationType[];
};

export const OrganizationList = () => {
  const [{ data, loading, error }] = usePangeaAxios<OrganizationResult>(
    '/organizations',
  );

  return (
    <>
      <Helmet>
        <title>Pangea :: Organizations</title>
      </Helmet>
      <Row>
        <h1>Organizations</h1>
      </Row>
      <Row>
        {loading && <p>Loading...</p>}
        {error && <p>{error.message}</p>}
        {data && (
          <Col lg={12}>
            {data.results.length > 0 && (
              <ul>
                {data.results.map(organization => (
                  <li key={organization.uuid}>
                    <Link to={`/organizations/${organization.uuid}`}>
                      {organization.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {data.results.length === 0 && (
              <Well className="text-center">
                <h4>No organizations.</h4>
              </Well>
            )}
          </Col>
        )}
      </Row>
    </>
  );
};

export default OrganizationList;
