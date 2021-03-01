import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import useAxios from 'axios-hooks'
import { usePangeaAxios } from '../../services/api';
import { API_BASE_URL } from '../../services/api/utils';

import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { SampleGroupType } from '../../services/api/models/sampleGroup';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import { pangeaFetch } from '../../services/api/coreApi';

import { PangeaUserType, OrgLink } from '../../services/api/models/user';
import CSS from 'csstype';
import { useUserContext } from '../../components/UserContext' 
import { InfoButton, multilineText } from '../../components/CreateForm'

interface CreateSampleValues {
    name: string;
}


const CreateSampleInnerForm = (props: FormikProps<CreateSampleValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Name
          <InfoButton desc={"The name for the sample. Names must be unique within the library."} />
        </label>
         <Field id="name" name="name" placeholder="Name" className="form-control input-lg"/>
      </FormGroup>    
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
    </Form>
  );
};


interface CreateSampleFormProps {
  lib: string;
  history: any;
}


const CreateSampleForm = withFormik<CreateSampleFormProps, CreateSampleValues>({
  mapPropsToValues: props => {
    return {
      name: '',
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      name: values.name,
      library: formikBag.props.lib,
    }
    pangeaFetch(`/samples`, 'POST', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => `/samples/${data.uuid}`)
        .then(url => formikBag.props.history.push(url));    
  },   
})(CreateSampleInnerForm);


type CreateSampleFormPageProps = {
  isAuthenticated: boolean;
  libraryUUID: string;
};


export const CreateSampleFormPage = (props: CreateSampleFormPageProps) => {
  let location = useLocation() as any
  let history = useHistory();
  const {user} = useUserContext();  
  if (!props.isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;

  var grp = undefined;
  if(location.state){
    grp = location.state.grp ? location.state.grp : undefined
  }
  const cmd_email = user ? user.email : '<your email>';
  const cmd_grp = grp ? grp.name : '<grp name>';
  var cmd_org = '<org name>';
  if(grp){
    cmd_org = grp.organization_obj.name;
  }
  const shcmd = (
    'pangea-api create sample -e ' +
    cmd_email + ' -p *** "' + cmd_org +
    '" "' + cmd_grp + '" "Your Sample Name"' 
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, ${cmd_email}, '***').login()
    org = Organization(knex, "${cmd_org}")
    org.idem()  # creates the org or fetches it if it already exists
    grp = org.sample_group("${cmd_grp}")
    grp.idem()  # creates the grp or fetches it if it already exists
    sample = grp.sample("Your Sample Name")
    sample.idem()  # creates the sample or fetches it if it already exists
  `;
  const sampledesc = `
  Samples contain data, results, and metadata.

  Each sample belongs to exactly one sample library \
  but can be added to any number of sample groups. \
  Samples are only public if their library is public, \
  otherwise they are private.
  `;
  const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Sample</title>
      </Helmet>
      <div>
        <h1>Create New Sample
          <InfoButton desc={sampledesc} />
        </h1>
      </div>      
      <hr />
      <br />
      <h4>Library: {grp ? grp.name : props.libraryUUID}</h4>
      <Col lg={5} lgOffset={0}>
        <CreateSampleForm lib={props.libraryUUID} history={history} />
        <br />
      </Col>
      <Col lg={6} lgOffset={1}>
        <Row>
          <h4>From the <a href={apilink}>Command Line</a></h4>
          <code>
            {shcmd}
          </code>
        </Row>
        <br/><br/>
        <Row>
          <h4>Using <a href={apilink}>Python</a></h4>
          <pre>
            <code style={multilineText}>
              {pycmd}
            </code>
          </pre>
        </Row>
      </Col>
    </Row>
  );
};

export default CreateSampleFormPage;