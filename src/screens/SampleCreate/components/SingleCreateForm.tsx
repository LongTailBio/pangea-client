
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
import { usePangeaAxios } from '../../../services/api';
import { API_BASE_URL } from '../../../services/api/utils';

import { LoadingErrorMessage } from '../../../components/LoadingErrorMessage'
import { SampleGroupType } from '../../../services/api/models/sampleGroup';
import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { pangeaFetch } from '../../../services/api/coreApi';

import { PangeaUserType, OrgLink } from '../../../services/api/models/user';
import CSS from 'csstype';
import { useUserContext } from '../../../components/UserContext' 
import { InfoButton, multilineText } from '../../../components/CreateForm'
import { sampledesc, createSampleCmds, createBulkSampleCmds } from '../../../components/Docs'

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


export const CreateSampleForm = withFormik<CreateSampleFormProps, CreateSampleValues>({
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

