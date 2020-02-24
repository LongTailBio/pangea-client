import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { AxiosError } from "axios";

import { createAxios } from "../../../../services/api";

interface FormProp {
  formType: string;
  isAuthenticated: boolean;
  onLoginUser(token: string): void;
}

export const AuthForm = (props: FormProp) => {
  const { formType, isAuthenticated, onLoginUser } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authErrors, setAuthErrors] = useState<string[]>([]);

  if (isAuthenticated) return <Redirect to="/" />;

  const handleAuthError = (error: AxiosError) => {
    let errorMessages = [error.message];

    if (error.response) {
      const data = error.response.data as { [key: string]: string[] };
      errorMessages = Object.keys(error.response.data).reduce(
        (acc, key) => acc.concat(data[key]),
        [error.message]
      );
    }

    setAuthErrors(errorMessages);
  };

  const handleUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthErrors([]);

    const client = createAxios();
    const payload = { email, password };

    const register = () => client.post("/auth/users/", payload);
    const login = () =>
      client.post("/auth/token/login/", payload).then(res => {
        setEmail("");
        setPassword("");
        onLoginUser(res.data.auth_token);
      });

    if (formType === "login") {
      return login().catch(handleAuthError);
    }
    if (formType === "register") {
      return register()
        .then(login)
        .catch(handleAuthError);
    }
  };

  const displayFormType = formType.capitalize();

  return (
    <Row>
      <Helmet>
        <title>MetaGenScope :: {displayFormType}</title>
      </Helmet>
      <h1>{displayFormType}</h1>
      <hr />
      <br />
      <Col lg={6} lgOffset={3}>
        <form onSubmit={handleUserFormSubmit}>
          {authErrors &&
            authErrors.map(authError => (
              <p key={authError} style={{ color: "red" }}>
                {authError}
              </p>
            ))}
          <div className="form-group">
            <input
              name="email"
              className="form-control input-lg"
              type="email"
              placeholder="Enter an email address"
              required={true}
              value={email}
              onChange={event => setEmail(event.currentTarget.value)}
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              className="form-control input-lg"
              type="password"
              placeholder="Enter a password"
              required={true}
              value={password}
              onChange={event => setPassword(event.currentTarget.value)}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            value="Submit"
          />
        </form>
        <br />
        {formType === "register" && (
          <p>
            Already have an account? <Link to="/login">Log in.</Link>
          </p>
        )}
        {formType === "login" && (
          <p>
            Don't have an account? <Link to="/register">Create one.</Link>
          </p>
        )}
      </Col>
    </Row>
  );
};

export default AuthForm;
