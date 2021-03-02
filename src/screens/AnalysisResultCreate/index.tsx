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

const getSampleCmds = (props: CreateAnalysisResultFormPageProps, location: any, user: any): ReactElement =>  {
  var sample = undefined;
  if(location.state){
    sample = location.state.sample ? location.state.sample : undefined
  }
  const cmd_sample = sample ? sample.name : '<your sample>'
  const cmd_email = user ? user.email : '<your email>';
  var cmd_grp = '<grp name>';
  var cmd_org = '<org name>';
  if(sample){
    cmd_grp = sample.library_obj.name;
    cmd_org = sample.library_obj.organization_obj.name;
  }
  const shcmd1 = (
    `pangea-api create sample-ar -e '${cmd_email}' -p *** -r '<replicate id>' '${cmd_org}' '${cmd_grp}' '${cmd_sample}' 'Your Module Name'`

  );
  const shcmd2 = (
    `pangea-api create sample-ar -e '${cmd_email}' -p *** -r '<replicate id>' '${props.sampleUUID}'  'Your Module Name'`
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, "${cmd_email}", "***").login()
    org = Organization(knex, "${cmd_org}").idem()
    grp = org.sample_group("${cmd_grp}").idem()
    sample = grp.sample("Your Sample Name").idem()
    ar = sample.analysis_result("Your Module Name", "<replicate id>").idem()
  `;
  const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";

  return (
    <>
      <Row>
        <h4>From the <a href={apilink}>Command Line</a></h4>
        <code>
          {shcmd1}
        </code>
        <br/>Or<br/>
        <code>
          {shcmd2}
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
    </>
  )
}

const getSampleGroupCmds = (props: CreateAnalysisResultFormPageProps, location: any, user: any): ReactElement =>  {
  return (
    <>
    </>
  )
}


export const CreateAnalysisResultFormPage = (props: CreateAnalysisResultFormPageProps) => {
  let location = useLocation() as any
  let history = useHistory();
  const {user} = useUserContext();  
  if (!props.isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;

  
  const sampledesc = `
  Analysis results contain files and data such as reads.

  Analysis Results can have multiple fields \
  this makes it easy to group related files \
  together such as the first and second reads \
  from a sequencing run.
  `;
  

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Analysis Result</title>
      </Helmet>
      <div>
        <h1>Create New Analysis Result
          <InfoButton desc={sampledesc} />
        </h1>
      </div>      
      <hr />
      <br />
      <Col lg={5} lgOffset={0}>
        <CreateAnalysisResultForm uuid={props.sampleUUID} history={history} kind={props.kind} />
      </Col>
      <Col lg={6} lgOffset={1}>
        {props.kind === 'sample' && getSampleCmds(props, location, user)}
        {props.kind === 'sample-group' && getSampleGroupCmds(props, location, user)}
      </Col>
    </Row>
  );
};

export default CreateAnalysisResultFormPage;