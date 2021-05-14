
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


interface FilterNumberMetadataValues {
  minVal: number|undefined|"";
  maxVal: number|undefined|"";
}

const FilterNumberMetadataInnerForm = (props: FormikProps<FilterNumberMetadataValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form>
      <Row>
        <Col lg={12}>
          <FormGroup>
             <Field id="minVal" name="minVal" placeholder="min" type="number" className="form-control input-lg"/>
             <Field id="maxVal" name="maxVal" placeholder="max" type="number" className="form-control input-lg"/>
          </FormGroup>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Filter</button>
        </Col>
      </Row>
    </Form>
  );  
}

interface FilterNumberMetadataFormProps {
  metadataKey: string;
  callback: (key: string, minVal: number|undefined, maxVal: number|undefined) => void;
}

export const FilterNumberMetadataForm = withFormik<FilterNumberMetadataFormProps, FilterNumberMetadataValues>({
  mapPropsToValues: props => {
    return {
      minVal: undefined,
      maxVal: undefined,
    };
  },

  handleSubmit: (values, formikBag) => {
    formikBag.props.callback(formikBag.props.metadataKey, 
      values.minVal === "" ? undefined : values.minVal,
      values.maxVal === "" ? undefined : values.maxVal,)
  },
})(FilterNumberMetadataInnerForm);