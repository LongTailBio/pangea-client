import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import { usePangeaAxios } from '../../services/api';

import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { OrganizationType } from '../../services/api/models/organization';


type FormDataType = {
  name: string;
  adminEmail: string;
};

type CreateOrgProps = {
  isAuthenticated: boolean;
};

export const CreateOrgForm = (props: CreateOrgProps) => {
  const { isAuthenticated } = props;

  const [adminEmail, setAdminEmail] = useState('');
  const [name, setName] = useState('');
  const [orgUUID, setOrgUUID] = useState('');
  const [createOrgErrors, setCreateOrgErrors] = useState<string[]>([]);

  if (!isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;;

  const handleCreateOrgError = (error: AxiosError) => {
    let errorMessages = [error.message];

    if (error.response) {
      const data = error.response.data as { [key: string]: string[] };
      errorMessages = Object.keys(error.response.data).reduce(
        (acc, key) => acc.concat(data[key]),
        [error.message],
      );
    }
  };

  const handleUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {}
  //   event.preventDefault();
  //   setCreateOrgErrors([]);

  //   const payload = { name, admin_email: adminEmail,};

  //   usePangeaAxios<OrganizationType>({
  //     url: '/organizations',
  //     method: 'POST',
  //     data: {
  //       name,
  //       admin_email: adminEmail,
  //     }
  //   })
  //    //  .then(res => {
  //    //    setOrgUUID(res.data.uuid);
  //    //  })
  //    // .catch(handleCreateOrgError);
  // };
  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Organization</title>
      </Helmet>
      <h1>Create New Organization</h1>
      <hr />
      <br />
      <Col lg={6} lgOffset={3}>
        <form onSubmit={handleUserFormSubmit}>
          <div className="form-group">
            <input
              name="name"
              className="form-control input-lg"
              type="text"
              placeholder="Organization Name"
              required={true}
              value={name}
              onChange={event => setName(event.currentTarget.value)}
            />
          </div>          
          <div className="form-group">
            <input
              name="email"
              className="form-control input-lg"
              type="email"
              placeholder="Admin Email"
              required={true}
              value={adminEmail}
              onChange={event => setAdminEmail(event.currentTarget.value)}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            value="Create"
          />
        </form>
        <br />
      </Col>
    </Row>
  );
};

export default CreateOrgForm;
