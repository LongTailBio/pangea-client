
import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';

import CSS from 'csstype';


interface FilterMetadataValues {
  value: string;
}

const FilterMetadataInnerForm = (props: FormikProps<FilterMetadataValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form>
      <Row>
        <Col lg={8}>
          <FormGroup>
             <Field id="value" name="value" placeholder="Value" className="form-control input-lg"/>
          </FormGroup>
        </Col>
        <Col lg={4}>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Filter</button>
        </Col>
      </Row>
    </Form>
  );  
}

interface FilterMetadataFormProps {
  metadataKey: string;
  callback: (key: string, value: string) => void;
}

export const FilterMetadataForm = withFormik<FilterMetadataFormProps, FilterMetadataValues>({
  mapPropsToValues: props => {
    return {
      value: '',
    };
  },

  handleSubmit: (values, formikBag) => {
    formikBag.props.callback(formikBag.props.metadataKey, values.value)
  },
})(FilterMetadataInnerForm);