import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import AwsS3Multipart, { AwsS3Part } from '@uppy/aws-s3-multipart';
import { DragDrop, StatusBar } from '@uppy/react';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs,
} from 'react-bootstrap';
import { S3Uploader } from '../../../components/Uploader';
import { pangeaFetch } from '../../../services/api/coreApi';
import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { useUserContext } from '../../../components/UserContext' 
import { InfoButton, multilineText } from '../../../components/CreateForm'
import { LoadingErrorMessage } from '../../../components/LoadingErrorMessage'
import { AnalysisResultType } from '../../../services/api/models/analysisResult';

import { PangeaUserType, OrgLink } from '../../../services/api/models/user';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/status-bar/dist/style.css';


import CSS from 'csstype';

type ARType = 'sample' | 'sample-group';

interface CreateFieldValues {
    name: string;
}


const CreateFieldInnerForm = (props: FormikProps<CreateFieldValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Name
          <InfoButton desc={"The name for the field. Names must be unique within the analysis result."} />
        </label>
         <Field id="name" name="name" placeholder="Name" className="form-control input-lg"/>
      </FormGroup>    
      <button type="submit" className="btn btn-primary btn-lg btn-block">Upload</button>
    </Form>
  );
}; 



interface CreateFieldFormProps {
  arUUID: string;
  kind: ARType;
  history: any;
  uploadTo: (rootUrl: string) => void;
}


const CreateSampleForm = withFormik<CreateFieldFormProps, CreateFieldValues>({
  mapPropsToValues: props => {
    return {
      name: '',
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      name: values.name,
      analysis_result: formikBag.props.arUUID,
      stored_data: {},
    }
  const baseUrl = 
    formikBag.props.kind === 'sample'
      ? `/sample_ar_fields`
      : `/sample_group_ar_fields`;
    pangeaFetch(baseUrl, 'POST', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => baseUrl + `/${data.uuid}`)
        .then(url => {
          formikBag.props.uploadTo(url);
        });   
  },   
})(CreateFieldInnerForm);

interface CreateFieldFormParentProps {
  arUUID: string;
  kind: ARType;
  history: any;
}
interface CreateFieldFormParentState {
  rootUrl: string;
  upload: boolean;
}

class CreateFieldFormParent extends React.Component<CreateFieldFormParentProps, CreateFieldFormParentState> {

  state = {
    upload: false,
    rootUrl: '',
  };

  constructor(props: CreateFieldFormProps) {
    super(props);
    this.uploadTo = this.uploadTo.bind(this);
    this.getRootUrl = this.getRootUrl.bind(this)
  }

  uploadTo(rootUrl: string){
    this.setState({rootUrl: rootUrl, upload: true})
  }

  getRootUrl(){
    return this.state.rootUrl
  }

  render(): React.ReactElement {
    return (
      <>
        <CreateSampleForm
          arUUID={this.props.arUUID}
          kind={this.props.kind}
          history={this.props.history}
          uploadTo={this.uploadTo}
        />
        <S3Uploader
          getRootUrl={this.getRootUrl}
          upload={this.state.upload}
          uploadDone={() => window.location.reload()}
        />
      </>
    )
  }
}


type CreateFieldFormPageProps = {
  isAuthenticated: boolean;
  analysisResult: AnalysisResultType;
  kind: ARType;
};

export const CreateFieldFormPage = (props: CreateFieldFormPageProps) => {
  let location = useLocation() as any
  let history = useHistory();
  const {user} = useUserContext();  
  if (!props.isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;

  var sample = undefined;
  if(location.state){
    sample = location.state.sample ? location.state.sample : undefined
  }
  const cmd_ar_uuid = props.analysisResult.uuid;
  const cmd_ar_module = props.analysisResult.module_name;
  const cmd_ar_rep = props.analysisResult.replicate;
  const cmd_email = user ? user.email : '<your email>';
  const cmd_sample = sample ? sample.name : '<sample name>';
  var cmd_grp = '<grp name>';
  var cmd_org = '<org name>';
  if(sample){
    cmd_grp = sample.library_obj.name;
    cmd_org = sample.library_obj.organization_obj.name;
  }
  const shcmd1 = (
    `pangea-api create field -e '${cmd_email}' -p *** -r '${cmd_ar_rep}' '${cmd_org}' '${cmd_grp}' '${cmd_sample}' '${cmd_ar_module}' 'Your Field Name' <your filename>`

  );
  const shcmd2 = (
    `pangea-api create field -e '${cmd_email}' -p *** '${cmd_ar_uuid}'' 'Your Field Name' <your filename>`
  );
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, "${cmd_email}", "***").login()
    org = Organization(knex, "${cmd_org}").idem()
    grp = org.sample_group("${cmd_grp}").idem()
    sample = grp.sample("Your Sample Name").idem()
    ar = sample.analysis_result("${cmd_ar_module}", "${cmd_ar_rep}").idem()
    field = ar.field("Your field name").idem()
    field.upload_file(<your filename>)
  `;
  const fielddesc = `
  Fields contain single files.

  Analysis Results can have multiple fields \
  this makes it easy to group related files \
  together such as the first and second reads \
  from a sequencing run.
  `;
  const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";
  return (
    <Row>
      <div>
        <h2>Upload New Analysis Result Field
          <InfoButton desc={fielddesc} />
        </h2>
      </div>      
      <h4>Analysis Result: {props.analysisResult.module_name}{" "}{props.analysisResult.replicate}</h4>
      <Col lg={5} lgOffset={0}>
        <CreateFieldFormParent
          arUUID={props.analysisResult.uuid}
          kind={props.kind}
          history={history}
        />
      </Col>
      <Col lg={6} lgOffset={1}>
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
      </Col>       
    </Row>
  );
};

export default CreateFieldFormPage;