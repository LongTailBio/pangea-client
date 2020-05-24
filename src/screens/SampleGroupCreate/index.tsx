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

type CreateSampleGroupProps = {
  isAuthenticated: boolean;
};

export const CreateSampleGroupForm = (props: CreateSampleGroupProps) => {
  const { isAuthenticated } = props;

  const [name, setName] = useState('');
  const [createSampleGroupErrors, setCreateSampleGroupErrors] = useState<string[]>([]);

  if (!isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;;

  const handleCreateSampleGroupError = (error: AxiosError) => {};

  const handleUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {}

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Sample Group</title>
      </Helmet>
      <h1>Create New Sample Group</h1>
      <hr />
      <br />
      <Col lg={6} lgOffset={3}>
        <form onSubmit={handleUserFormSubmit}>
          <div className="form-group">
            <label htmlFor="grpName">Name</label>
            <input
              id="grpName"
              name="name"
              className="form-control input-lg"
              type="text"
              placeholder="Sample Group Name"
              required={true}
              value={name}
              onChange={event => setName(event.currentTarget.value)}
            />
            <label htmlFor="inputOrg">Organization</label>
            <select id="inputOrg" className="form-control">
              <option selected>Organization...</option>
              {['MetaSUB Consortium', 'Mason Lab'].map(orgName => (<option>{orgName}</option>))}
            </select>
            <Checkbox name="public" >Public</Checkbox>
            <Checkbox name="library" >Library</Checkbox>
            <label htmlFor="description">Description</label>
            <textarea className="form-control" id="description" rows={3}></textarea>
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

export default CreateSampleGroupForm;
