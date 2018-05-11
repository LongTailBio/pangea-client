import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { OrganizationType } from '../../../../services/api/models/organization';
import { getOrganizations } from '../../../../services/api';

interface OrganizationsState {
  organizations: Array<OrganizationType>;
}

class OrganizationsList extends React.Component<{}, OrganizationsState> {

  protected sourceToken: CancelTokenSource;

  constructor(props: {}) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      organizations: [],
    };
  }

  componentDidMount() {
    // Assume that we are authenticated because Dashboard catches that
    getOrganizations(this.sourceToken)
      .then((organizations) => {
        this.setState({ organizations });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });
  }

  componentWillUnmount() {
    this.sourceToken.cancel();
  }

  render() {
    return (
      <Row>
        <Helmet>
          <title>MetaGenScope :: Organizations</title>
        </Helmet>
        <Col lg={12}>
          <h1>Organizations</h1>
          <Table striped={true} hover={true}>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Admin Email</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.organizations.map((organization, index) => {
                  return (
                    <tr key={index}>
                      <td><Link to={`/organizations/${organization.uuid}`}>{organization.name}</Link></td>
                      <td>{organization.adminEmail}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </Table>
          <LinkContainer to="/organizations/new">
            <Button>
              Create Organization
            </Button>
          </LinkContainer>
        </Col>
      </Row>
    );
  }
}

export default OrganizationsList;
