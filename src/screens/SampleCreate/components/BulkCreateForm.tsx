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


export const BulkCreateSampleForm = withFormik<CreateSampleFormProps, BulkCreateSampleValues>({
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
