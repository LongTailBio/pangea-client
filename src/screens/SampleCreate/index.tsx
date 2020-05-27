import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Row, Col, Button, Checkbox } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import useAxios from 'axios-hooks'
import { usePangeaAxios } from '../../services/api';
import { API_BASE_URL } from '../../services/api/utils';

import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { SampleGroupType } from '../../services/api/models/sampleGroup';

type SampleGroupResult = {
  count: number;
  results: SampleGroupType[];
};

type CreateSampleProps = {
  isAuthenticated: boolean;
};

export const CreateSampleForm = (props: CreateSampleProps) => {
  const { isAuthenticated } = props;

  const [name, setName] = useState('');
  const [createSampleErrors, setCreateSampleErrors] = useState<string[]>([]);
  const [lib, setLib] = useState('');
  const [isCreated, setCreated] = useState(false);

  const { authToken } = window.localStorage;
  const [
    { data: putData, loading: putLoading, error: putError },
    executePut
  ] = useAxios(
    {
      url: `${API_BASE_URL}/samples`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken ? `Token ${authToken}` : undefined,
      },
    },
    { manual: true }
  )

  const [{ data: grpData, loading: grpLoading, error: grpError }] = usePangeaAxios<SampleGroupResult>(
    '/sample_groups',
  );

  const grps: {[key: string]: string} = {};
  if (!grpLoading && ! grpError){
    var el: any;
    for (el in grpData.results) {
      el = grpData.results[el]
      if(el.is_library){
        grps[el.name] = el.uuid
      }
    }
  }

  if (!isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;
  if (putError || putLoading) return <LoadingErrorMessage loading={putLoading} error={putError} name={'Organization'} message={putError?.message} />;

  const handleUserFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateSampleErrors([]);

    executePut({
      data: {
        name,
        library: lib,
      }
    })
    setCreated(true);
  }

  if (isCreated){
    return (<Redirect to={`/samples/${putData.uuid}`} />)
  }

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
            <label htmlFor="inputLib">Library</label>
            <select
              id="inputLib"
              className="form-control"
              onChange={event => setLib(grps[event.currentTarget.value])}
            >
              <option selected>Library...</option>
              {Object.keys(grps).map(libName => (<option>{libName}</option>))}
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