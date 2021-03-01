import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import useAxios from 'axios-hooks'
import { API_BASE_URL } from '../../services/api/utils';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';
import { pangeaFetch } from '../../services/api/coreApi';

import { PangeaUserType } from '../../services/api/models/user';
import { LoadingErrorMessage } from '../../components/LoadingErrorMessage'
import { OrganizationType } from '../../services/api/models/organization';
import CSS from 'csstype';


interface CreateOrgValues {
    name: string;
    adminEmail: string;
}

interface CreateOrgFormProps {
  user: PangeaUserType | undefined;
  history: any;
}


type CreateOrgFormPageProps = {
  isAuthenticated: boolean;
};


const multilineText: CSS.Properties = {
  whiteSpace: 'pre-line',
};

const popoverDescription = (description: React.ReactNode) => (
  <Popover id="popover-description" title="" arrowOffsetLeft="300" style={multilineText}>
    {description}
  </Popover>
);


const CreateOrgInnerForm = (props: FormikProps<CreateOrgValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Name
          <OverlayTrigger
            trigger="click"
            rootClose={true}
            placement="bottom"
            overlay={popoverDescription("The name for the org. Names must be globally unique.")}
          >
            <Button bsStyle="link" bsSize="large">
              <Glyphicon glyph="info-sign" />
            </Button>
          </OverlayTrigger>
        </label>
         <Field id="name" name="name" placeholder="Name" className="form-control input-lg"/>
      </FormGroup>                         
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
    </Form>
  );
};


const CreateOrgForm = withFormik<CreateOrgFormProps, CreateOrgValues>({
  mapPropsToValues: props => {
    return {
      name: '',
      adminEmail: props.user ? props.user.email : '',
    };
  },

  handleSubmit: (values, formikBag) => {
    pangeaFetch(`/organizations`, 'POST', JSON.stringify(values))
        .then(response => response.json())
        .then(data => `/organizations/${data.uuid}`)
        .then(url => formikBag.props.history.push(url));  
   },   
})(CreateOrgInnerForm);




export const CreateOrgFormPage = (props: CreateOrgFormPageProps) => {
  let location = useLocation() as any
  let history = useHistory();
  if (!props.isAuthenticated) return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;

  var user = undefined;
  if(location.state){
    user = location.state.user ? location.state.user : undefined
  }
  const cmd_email = user ? user.email : '<your email>';
  const shcmd = 'pangea-api create org -e ' + cmd_email + ' -p *** "Your Org Name"';
  const pycmd = `
    from pangea_api import Knex, User, Organization

    knex = Knex()
    User(knex, ${cmd_email}, '***').login()
    org = Organization(knex, 'Your Org Name')
    org.idem()  # creates the org or fetches it if it already exists
  `;
  const orgdesc = `
  Organizations group users and projects together.

  Members of an organization can create samples and groups within the organization that can be viewed by other members of the org.

  Organizations usually represent a lab, consortium, or company.
  `;
  const apilink = "https://github.com/LongTailBio/pangea-django/tree/master/api-client";

  return (
    <Row>
      <Helmet>
        <title>Pangea :: New Organization</title>
      </Helmet>
      <div>
        <h1>Create New Organization
          <OverlayTrigger
            trigger="click"
            rootClose={true}
            placement="bottom"
            overlay={popoverDescription(orgdesc)}
          >
            <Button bsStyle="link" bsSize="large">
              <Glyphicon glyph="info-sign" />
            </Button>
          </OverlayTrigger>
        </h1>
      </div>      
      <hr />
      <br />
      <Col lg={5} lgOffset={0}>
        <CreateOrgForm user={user} history={history} />
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

export default CreateOrgFormPage;
