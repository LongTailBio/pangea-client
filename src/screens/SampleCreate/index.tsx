import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import useAxios from 'axios-hooks'
import { usePangeaAxios } from '../../services/api';
import { API_BASE_URL } from '../../services/api/utils';

import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { SampleGroupType } from '../../services/api/models/sampleGroup';
import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { pangeaFetch } from '../../services/api/coreApi';

import { PangeaUserType, OrgLink } from '../../services/api/models/user';
import CSS from 'csstype';
import { useUserContext } from '../../components/UserContext' 
import { InfoButton, multilineText } from '../../components/CreateForm'
import { sampledesc, createSampleCmds, createBulkSampleCmds } from '../../components/Docs'

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

interface BulkCreateSampleValues  {
  names: Array<CreateSampleValues>;
};


const BulkCreateSampleInnerForm = (props: FormikProps<BulkCreateSampleValues>) => {
  const { touched, errors, isSubmitting, values } = props;
  return (
    <Form> 
      <FieldArray name="names">
        {({ insert, remove, push }) => (
          <div>
            {values.names.length > 0 &&
              values.names.map((name, index) => (
                <div className="row" key={index}>
                  <div className="col">
                    <Row>
                      <Col lg={10}>
                        <Field
                          name={`names.${index}.name`}
                          placeholder="Name"
                          type="text"
                          className="form-control input-md"
                        />
                      </Col>
                      <Col lg={2}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-md"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </Col>
                    </Row>
                  </div>
                </div>
              ))}
            <br/>
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={() => push({ name: '' })}
            >
              Add Sample
            </button>
          </div>
        )}
      </FieldArray>  
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


const BulkCreateSampleForm = withFormik<CreateSampleFormProps, BulkCreateSampleValues>({
  mapPropsToValues: props => {
    return {
      names: [{name: ''}],
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      names: values.names.map(el => el.name),
      library: formikBag.props.lib,
    }
    pangeaFetch(`/bulk_samples`, 'POST', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => `/sample-groups/${formikBag.props.lib}`)
        .then(url => formikBag.props.history.push(url));    
  },   
})(BulkCreateSampleInnerForm);


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
      <Tabs id="user_settings_tabs">
        <Tab eventKey={1} title="One Sample">
          <Col lg={5} lgOffset={0}>
            <CreateSampleForm lib={props.libraryUUID} history={history} />
          </Col>
          <Col lg={6} lgOffset={1}>
            {createSampleCmds(user, grp)}
          </Col>
        </Tab>
        <Tab eventKey={2} title="Bulk">
          <Col lg={5} lgOffset={0}>
            <BulkCreateSampleForm lib={props.libraryUUID} history={history} />
          </Col>
          <Col lg={6} lgOffset={1}>
            {createBulkSampleCmds(user, grp)}
          </Col>          
        </Tab>        
      </Tabs>
    </Row>
  );
};

export default CreateSampleFormPage;