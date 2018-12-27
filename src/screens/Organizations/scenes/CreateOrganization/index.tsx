import * as React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { createOrganization } from '../../../../services/api';

type FormDataType = {
  [key: string]: string;
  name: string;
  adminEmail: string;
};

type Props = {
  isAuthenticated: boolean;
};

type CreateOrganizationState = {
  didCreate: boolean;
  formData: FormDataType;
};

class CreateOrganization extends React.Component<Props, CreateOrganizationState> {

  protected sourceToken: CancelTokenSource;

  constructor(props: Props) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      didCreate: false,
      formData: {
        name: '',
        adminEmail: '',
      },
    };

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentWillUnmount() {
    this.sourceToken.cancel();
  }

  clearForm() {
    this.setState({
      formData: {name: '', adminEmail: ''}
    });
  }

  handleFormChange(event: React.FormEvent<HTMLInputElement>) {
    const obj = this.state.formData;
    obj[event.currentTarget.name] = event.currentTarget.value;
    this.setState({formData: obj});
  }

  handleUserFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = this.state.formData.name,
          adminEmail = this.state.formData.adminEmail;

    createOrganization(name, adminEmail, this.sourceToken)
      .then((res) => {
        this.setState({ didCreate: true });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          // tslint:disable-next-line:no-console
          console.log(error);
        }
      });
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;
    }
    if (this.state.didCreate) {
      return <Redirect to="/organizations" />;
    }
    return (
      <Row>
        <Helmet>
          <title>MetaGenScope :: Create Organization</title>
        </Helmet>
        <Col lg={6}>
          <h1>Create Organization</h1>
          <form onSubmit={(event) => this.handleUserFormSubmit(event)}>
            <div className="form-group">
              <label htmlFor="organizationName" className="control-label">Organization Name</label>
              <input
                id="organizationName"
                name="name"
                className="form-control"
                type="text"
                value={this.state.formData.name}
                onChange={this.handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="organizationEmail" className="control-label">Admin Email Address</label>
              <input
                id="organizationEmail"
                name="adminEmail"
                className="form-control"
                placeholder="email@domain.org"
                type="email"
                value={this.state.formData.adminEmail}
                onChange={this.handleFormChange}
              />
            </div>
            <Button type="submit">
              Create
            </Button>
          </form>
          <br />
          <p>Back to <Link to="/organizations">Organizations</Link>.</p>
        </Col>
      </Row>
    );
  }
}

export default CreateOrganization;
