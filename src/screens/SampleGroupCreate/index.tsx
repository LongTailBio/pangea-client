import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Button, Checkbox } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import useAxios from 'axios-hooks'
import { usePangeaAxios } from '../../services/api';
import { API_BASE_URL } from '../../services/api/utils';

import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { OrganizationType } from '../../services/api/models/organization';

type OrganizationResult = {
  count: number;
  results: OrganizationType[];
};


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
  const [org, setOrg] = useState('');
  const [pub, setPub] = useState(false);
  const [library, setLib] = useState(false);
  const [desc, setDesc] = useState('');
  const [createSampleGroupErrors, setCreateSampleGroupErrors] = useState<string[]>([]);
  const [isCreated, setCreated] = useState(false);

  const { authToken } = window.localStorage;
  const [
    { data: putData, loading: putLoading, error: putError },
    executePut
  ] = useAxios(
    {
      url: `${API_BASE_URL}/sample_groups`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken ? `Token ${authToken}` : undefined,
      },
    },
    { manual: true }
  )

  const [{ data: orgData, loading: orgLoading, error: orgError }] = usePangeaAxios<OrganizationResult>(
    '/organizations',
  );

  const orgs: {[key: string]: string} = {};
  if (!orgLoading && ! orgError){
    orgData.results.map(el => (
      orgs[el.name] = el.uuid
    ))
  }

  if (!isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;
  if (putError || putLoading) return <LoadingErrorMessage loading={putLoading} error={putError} name={'Organization'} message={putError?.message} />;

  const handleUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateSampleGroupErrors([]);

    executePut({
      data: {
        name,
        organization: org,
        public: pub,
        library,
        description: desc,
      }
    })
    setCreated(true);
  }

  if (isCreated){
    return (<Redirect to={`/sample-groups/${putData.uuid}`} />)
  }

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
            <select
              id="inputOrg"
              className="form-control"
              onChange={event => setOrg(orgs[event.currentTarget.value])}
            >
              <option selected>Organization...</option>
              {Object.keys(orgs).map(orgName => (<option>{orgName}</option>))}
            </select>
            <label htmlFor="grpPub">Public  </label>
            <input type='checkbox' id="grpPub" name="public" onClick={event => setPub(!pub)} /><br/>
            <label htmlFor="grpLib">Library </label>
            <input type='checkbox' id="grpLib" name="library" onClick={event => setLib(!library)} /><br/>
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              rows={3}
              onChange={event => setDesc(event.currentTarget.value)}
            ></textarea>
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
