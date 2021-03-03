import React, { useState, ReactElement } from 'react';
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
import { SampleType } from '../../services/api/models/sample';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { pangeaFetch } from '../../services/api/coreApi';

import { PangeaUserType, OrgLink } from '../../services/api/models/user';
import CSS from 'csstype';
import { useUserContext } from '../../components/UserContext' 
import { InfoButton, multilineText } from '../../components/CreateForm'
import {
  ardesc,
  createSampleAnalysisResultCmds,
  createSampleGroupAnalysisResultCmds
} from '../../components/Docs'


type ARType = 'sample' | 'sample-group';


interface CreateAnalysisResultValues {
    module_name: string;
    replicate: string;
}


const CreateAnalysisResultInnerForm = (props: FormikProps<CreateAnalysisResultValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Module Name
          <InfoButton desc={"The name of the module. e.g. 'raw::raw_reads'"} />
        </label>
         <Field id="module_name" name="module_name" placeholder="Module Name" className="form-control input-lg"/>
      </FormGroup>
      <FormGroup>
        <label htmlFor="name">Replicate
          <InfoButton desc={"A replicate id or version number"} />
        </label>
         <Field id="replicate" name="replicate" placeholder="Replicate" className="form-control input-lg"/>
      </FormGroup>     
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
    </Form>
  );
}; 



interface CreateAnalysisResultFormProps {
  uuid: string;
  history: any;
  kind: ARType;
}

interface postDataType {
  module_name: string;
  replicate: string;
  sample?: string;
  sample_group?: string;
}


const CreateAnalysisResultForm = withFormik<CreateAnalysisResultFormProps, CreateAnalysisResultValues>({
  mapPropsToValues: props => {
    return {
      module_name: '',
      replicate: ''
    };
  },

  handleSubmit: (values, formikBag) => {
    var postData: postDataType = {
      module_name: values.module_name,
      replicate: values.replicate,
    }
    if(formikBag.props.kind === 'sample'){
      postData['sample'] = formikBag.props.uuid;
    } else {
      postData['sample_group'] = formikBag.props.uuid;
    }
  const baseUrl = 
    formikBag.props.kind === 'sample'
      ? `/sample_ars`
      : `/sample_group_ars`;
    pangeaFetch(baseUrl, 'POST', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => {
          const url = 
            formikBag.props.kind === 'sample'
              ? `/samples/${formikBag.props.uuid}/analysis-results/${data.uuid}`
              : `/sample-groups/${formikBag.props.uuid}/analysis-results/${data.uuid}`;
          return url
        })
        .then(url => formikBag.props.history.push(url));    
  },   
})(CreateAnalysisResultInnerForm);



type CreateAnalysisResultFormPageProps = {
  isAuthenticated: boolean;
  sampleUUID: string;
  kind: ARType;
};


export const CreateAnalysisResultFormPage = (props: CreateAnalysisResultFormPageProps) => {
  let location = useLocation() as any
  let history = useHistory();
  const {user} = useUserContext();  
  if (!props.isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;

  
  var grp = undefined;
  var sample = undefined;
  if(location.state){
    grp = location.state.grp ? location.state.grp : undefined
    sample = location.state.sample ? location.state.sample : undefined
  }
  

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Analysis Result</title>
      </Helmet>
      <div>
        <h1>Create New Analysis Result
          <InfoButton desc={ardesc} />
        </h1>
      </div>      
      <hr />
      <br />
      <Col lg={5} lgOffset={0}>
        <CreateAnalysisResultForm uuid={props.sampleUUID} history={history} kind={props.kind} />
      </Col>
      <Col lg={6} lgOffset={1}>
        {props.kind === 'sample' && createSampleAnalysisResultCmds(user, sample)}
        {props.kind === 'sample-group' && createSampleGroupAnalysisResultCmds(user, grp)}
      </Col>
    </Row>
  );
};

export default CreateAnalysisResultFormPage;