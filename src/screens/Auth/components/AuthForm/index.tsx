import * as React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { AxiosPromise } from 'axios';

import { authenticate } from '../../../../services/api';

interface FormDataType {
  username: string;
  email: string;
  password: string;
}

interface AuthFormState {
  formData: FormDataType;
}

interface FormProp {
  formType: string;
  isAuthenticated: boolean;
  loginUser(token: string): void;
}

class AuthForm extends React.Component<FormProp, AuthFormState> {
  constructor(props: FormProp) {
    super(props);

    this.state = {
      formData: {
        username: '',
        email: '',
        password: ''
      }
    };

    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  componentWillReceiveProps(nextProps: FormProp) {
    if (this.props.formType !== nextProps.formType) {
      this.clearForm();
    }
  }

  clearForm() {
    this.setState({
      formData: {username: '', email: '', password: ''}
    });
  }

  handleFormChange(event: React.FormEvent<HTMLInputElement>) {
    const obj = this.state.formData;
    obj[event.currentTarget.name] = event.currentTarget.value;
    this.setState({formData: obj});
  }

  handleUserFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formType = this.props.formType;
    let request: AxiosPromise;
    if (formType === 'login') {
      request = authenticate(formType, {
        email: this.state.formData.email,
        password: this.state.formData.password,
      });
    }
    if (formType === 'register') {
      request = authenticate(formType, {
        username: this.state.formData.username,
        email: this.state.formData.email,
        password: this.state.formData.password,
      });
    }
    request!
      .then((res) => {
        this.clearForm();
        this.props.loginUser(res.data.data.auth_token);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <Row>
        <Helmet>
          <title>MetaGenScope :: {this.props.formType.capitalize()}</title>
        </Helmet>
        <h1>{this.props.formType.capitalize()}</h1>
        <hr/><br/>
        <Col lg={6} lgOffset={3}>
          <form onSubmit={(event) => this.handleUserFormSubmit(event)}>
            {this.props.formType === 'register' &&
              <div className="form-group">
                <input
                  name="username"
                  className="form-control input-lg"
                  type="text"
                  placeholder="Enter a username"
                  required={true}
                  value={this.state.formData.username}
                  onChange={this.handleFormChange}
                />
              </div>
            }
            <div className="form-group">
              <input
                name="email"
                className="form-control input-lg"
                type="email"
                placeholder="Enter an email address"
                required={true}
                value={this.state.formData.email}
                onChange={this.handleFormChange}
              />
            </div>
            <div className="form-group">
              <input
                name="password"
                className="form-control input-lg"
                type="password"
                placeholder="Enter a password"
                required={true}
                value={this.state.formData.password}
                onChange={this.handleFormChange}
              />
            </div>
            <input
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              value="Submit"
            />
          </form>
          <br />
          {this.props.formType === 'register' &&
            <p>Already have an account? <Link to="/login">Log in.</Link></p>
          }
          {this.props.formType === 'login' &&
            <p>Don't have an account? <Link to="/register">Create one.</Link></p>
          }
        </Col>
      </Row>
    );
  }
}

export default AuthForm;
