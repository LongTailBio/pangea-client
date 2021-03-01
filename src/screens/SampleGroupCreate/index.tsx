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
import { OrganizationType } from '../../services/api/models/organization';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import { pangeaFetch } from '../../services/api/coreApi';

import { PangeaUserType, OrgLink } from '../../services/api/models/user';
import CSS from 'csstype';
import { useUserContext } from '../../components/UserContext' 
import { InfoButton, multilineText } from '../../components/CreateForm'

interface CreateGrpValues {
    name: string;
    public: boolean;
    library: boolean;
    inputOrg: string;
    description: string;
}

interface GrpInnerFormProps {
  orgNames: Array<OrgLink> | undefined;
}


const CreateGrpInnerForm = (props: GrpInnerFormProps & FormikProps<CreateGrpValues>) => {
  const { touched, errors, isSubmitting, orgNames } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Name
          <InfoButton desc={"The name for the group. Names must be unique within the organization."} />
        </label>
         <Field id="name" name="name" placeholder="Name" className="form-control input-lg"/>
      </FormGroup>
      <FormGroup>
        <label htmlFor="inputOrg">Organization
          <InfoButton desc={"The organization this group will be created in."} />
        </label><br/>
        <Field name="inputOrg" as="select">
          {orgNames && orgNames.map(el =>
            (<option key={el.name} value={el.name}>{el.name}</option>)
          )}
        </Field>
      </FormGroup>
        <label>
          <Field type="checkbox" name="public" />
          Public
          <InfoButton desc={"Make this group and the samples in it public."} />
        </label>      
      <FormGroup>
        <label>
          <Field type="checkbox" name="library" />
          Library
          <InfoButton desc={`
            Sample groups can optionally be libraries.

            If a sample group is a library it can have its own samples.

            If a sample group is not a library it can only contain \
            samples from other libraries. However, libraries can \
            only hold their own samples.

            If you are uploading new data you should use a library.
          `} />
        </label>      
      </FormGroup>
      <FormGroup>
        <label htmlFor="description">Description</label>
        <InfoButton desc={"A brief description of this sample group."} />

        <Field id="description" name="description" placeholder="Description" className="form-control input-lg"/>
      </FormGroup>      
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
    </Form>
  );
};


interface CreateGrpFormProps {
  user: PangeaUserType | undefined;
  org: OrganizationType | undefined;
  history: any;
  orgNames: Array<OrgLink> | undefined;
}


const CreateGrpForm = withFormik<CreateGrpFormProps, CreateGrpValues>({
  mapPropsToValues: props => {
    return {
      name: '',
      public: false,
      library: true,
      inputOrg: props.org ? props.org.name : '',
      description: '',
      orgNames: props.orgNames,
    };
  },

  handleSubmit: (values, formikBag) => {
    var orgUUID = '';
    if(formikBag.props.orgNames){
      var match = formikBag.props.orgNames.filter(el => {return el.name == values.inputOrg})
      orgUUID = match[0].uuid;
    }
    const postData = {
      name: values.name,
      is_public: values.public,
      is_library: values.library,
      organization: orgUUID,
      description: values.description ? values.description : values.name,
    }
    pangeaFetch(`/sample_groups`, 'POST', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => `/sample-groups/${data.uuid}`)
        .then(url => formikBag.props.history.push(url));    
  },   
})(CreateGrpInnerForm);


type CreateGrpFormPageProps = {
  isAuthenticated: boolean;
};


export const CreateGrpFormPage = (props: CreateGrpFormPageProps) => {
  let location = useLocation() as any
  let history = useHistory();
  const {user} = useUserContext();  
  if (!props.isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;

  var org = undefined;
  if(location.state){
    org = location.state.org ? location.state.org : undefined
  }
  const orgNames = user ? user.organization_objs : []

  const cmd_email = user ? user.email : '<your email>';
  const cmd_org = org ? org.name : '<org name>';
  const shcmd = 'pangea-api create sample-group -e ' + cmd_email + ' -p *** "' + cmd_org + '" "Your Group Name"';
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, ${cmd_email}, '***').login()
    org = Organization(knex, "${cmd_org}")
    org.idem()  # creates the org or fetches it if it already exists
    grp = org.sample_group("${cmd_org}", is_public=False, is_library=True)
    grp.idem()  # creates the org or fetches it if it already exists
  `;
  const grpdesc = `
  Sample groups contain samples.

  Sample groups are meant to hold samples from the same \
  project so that they can be analyzed together.

  Sample groups can be libraries that contain new data \
  or can be regular sample groups that hold samples originally \
  from other groups. The latter is most useful for meta-analysis.

  Samples can be in any number of sample groups but only one \
  library.
  `;
  const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Sample Group</title>
      </Helmet>
      <div>
        <h1>Create New Sample Group
          <InfoButton desc={grpdesc} />
        </h1>
      </div>      
      <hr />
      <br />
      <Col lg={5} lgOffset={0}>
        <CreateGrpForm user={user} org={org} history={history} orgNames={orgNames} />
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

export default CreateGrpFormPage;

