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
import { sampledesc, createSampleCmds, createBulkSampleCmds, iCreateSampleCmds } from '../../components/Docs'
import { CreateSampleForm } from './components/SingleCreateForm';
import { IntegratedCreateSampleForm } from './components/IntegratedSingleCreateForm';
import { BulkCreateSampleForm } from './components/BulkCreateForm';



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
        <Tab eventKey={1} title="One Sample with Data">
          <Col lg={5} lgOffset={0}>
            <IntegratedCreateSampleForm lib={props.libraryUUID} history={history} />
          </Col>
          <Col lg={6} lgOffset={1}>
            {iCreateSampleCmds(user, grp)}
          </Col>
        </Tab>      
        <Tab eventKey={2} title="One Sample">
          <Col lg={5} lgOffset={0}>
            <CreateSampleForm lib={props.libraryUUID} history={history} />
          </Col>
          <Col lg={6} lgOffset={1}>
            {createSampleCmds(user, grp)}
          </Col>
        </Tab>
        <Tab eventKey={3} title="Bulk">
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