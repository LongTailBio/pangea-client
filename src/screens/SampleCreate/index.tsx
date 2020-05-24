import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Button, Checkbox } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import { usePangeaAxios } from '../../services/api';

import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { OrganizationType } from '../../services/api/models/organization';


type FormDataType = {
  name: string;
  org: string;
  library: boolean;
  public: boolean;
  description: string;
};

type CreateSampleProps = {
  isAuthenticated: boolean;
};

export const CreateSampleForm = (props: CreateSampleProps) => {
  const { isAuthenticated } = props;

  const [name, setName] = useState('');
  const [createSampleErrors, setCreateSampleErrors] = useState<string[]>([]);

  if (!isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;;

  const handleCreateSampleError = (error: AxiosError) => {};

  const handleUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {}

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Sample</title>
      </Helmet>
      <h1>Create New Sample</h1>
      <hr />
      <br />
      <Col lg={6} lgOffset={3}>
        <form onSubmit={handleUserFormSubmit}>
          <div className="form-group">
            <label htmlFor="sampleName">Name</label>
            <input
              id="sampleName"
              name="name"
              className="form-control input-lg"
              type="text"
              placeholder="Sample Name"
              required={true}
              value={name}
              onChange={event => setName(event.currentTarget.value)}
            />
            <label htmlFor="inputOrg">Library</label>
            <select id="inputOrg" className="form-control">
              <option selected>Library...</option>
              {['MetaSUB'].map(libName => (<option>{libName}</option>))}
            </select>
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

export default CreateSampleForm;