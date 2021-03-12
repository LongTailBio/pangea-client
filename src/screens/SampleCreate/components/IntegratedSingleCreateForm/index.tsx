
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
import { usePangeaAxios } from '../../../../services/api';
import { API_BASE_URL } from '../../../../services/api/utils';

import { LoadingErrorMessage } from '../../../../components/LoadingErrorMessage'
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray, useFormikContext, useField } from 'formik';
import { pangeaFetch } from '../../../../services/api/coreApi';

import { PangeaUserType, OrgLink } from '../../../../services/api/models/user';
import CSS from 'csstype';
import { useUserContext } from '../../../../components/UserContext' 
import { InfoButton, multilineText } from '../../../../components/CreateForm'
import { sampledesc, createSampleCmds, createBulkSampleCmds } from '../../../../components/Docs'
import { S3Uploader } from '../../../../components/Uploader';

const dataTypeChoices: string[] = [
  'raw::paired_short_reads',
  'raw::single_short_reads',
  'raw::basecalled_nanopore_reads',
];

const dataTypeFields: {[key: string]: string[]} = {
  'raw::paired_short_reads': ['read_1', 'read_2'],
  'raw::single_short_reads': ['reads'],
  'raw::basecalled_nanopore_reads': ['reads'],  
}

interface ICreateSampleValues {
    sampleName: string;
    dataType: string;
}

interface ICreateSampleInnerFormProps {
  handleDataChange: (e: React.ChangeEvent<any>) => void;
}




const ICreateSampleInnerForm = (props: ICreateSampleInnerFormProps & FormikProps<ICreateSampleValues>) => {
  const { values, touched, errors, handleChange, isSubmitting, handleDataChange } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Name
          <InfoButton desc={"The name for the sample. Names must be unique within the library."} />
        </label>
         <Field id="sampleName" name="sampleName" placeholder="Name" className="form-control input-lg"/>
      </FormGroup>
      <FormGroup>
        <label htmlFor="dataType">Data Type
          <InfoButton desc={"The type of data to add with this group."} />
        </label><br/>
        <Field
          name="dataType" as="select"
          onChange={(e: React.ChangeEvent<any>) => {handleChange(e); handleDataChange(e)}} >
          {dataTypeChoices.map(el => (<option key={el} value={el}>{el}</option>))}
        </Field>
      </FormGroup>          
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create and Upload</button>
    </Form>
  );
};

interface CreateSampleFormProps {
  lib: string;
  history: any;
  uploadTo: (fieldName: string, rootUrl: string, uploadDone: () => void) => void;
  handleDataChange: (e: React.ChangeEvent<any>) => void;
}

const MiddleCreateSampleForm = withFormik<CreateSampleFormProps, ICreateSampleValues>({
  mapPropsToValues: props => {
    return {
      sampleName: '',
      dataType: dataTypeChoices[0],
      handleDataChange: props.handleDataChange,
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      name: values.sampleName,
      library: formikBag.props.lib,
    }
    pangeaFetch(`/samples`, 'POST', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => {
          const arPostData = {
            module_name: values.dataType,
            sample: data.uuid,
          }
          pangeaFetch(`/sample_ars`, 'POST', JSON.stringify(arPostData))
            .then(arResponse => arResponse.json())
            .then(arData => {
              dataTypeFields[values.dataType].map(fieldName => {
                const arFieldPostData = {
                  name: fieldName,
                  analysis_result: arData.uuid,
                  stored_data: {},
                }
                pangeaFetch(`/sample_ar_fields`, 'POST', JSON.stringify(arFieldPostData))
                  .then(response => response.json())
                  .then(data => `/sample_ar_fields/${data.uuid}`)
                  .then(url => {
                    var uploadDone = function(){};
                    if(dataTypeFields[values.dataType].indexOf(fieldName) === dataTypeFields[values.dataType].length - 1){
                      uploadDone = function(){formikBag.props.history.push(`/samples/${data.uuid}`)}
                    }
                    formikBag.props.uploadTo(fieldName, url, uploadDone);
                  });                                  
              })
            })
        })
  },   
})(ICreateSampleInnerForm);


interface IntegratedCreateSampleFormProps {
  lib: string;
  history: any;
}
interface RootUrl {
  url: string;
  upload: boolean;
  uploadDone: () => void;
}
interface IntegratedCreateSampleFormState {
  rootUrl: {[key: string]: RootUrl};
  dataType: string;
}



export class IntegratedCreateSampleForm extends React.Component<IntegratedCreateSampleFormProps, IntegratedCreateSampleFormState> {

  state = {
    rootUrl: {} as {[key: string]: RootUrl},
    dataType: dataTypeChoices[0],
  };

  constructor(props: IntegratedCreateSampleFormProps) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.uploadTo = this.uploadTo.bind(this);
    this.getRootUrl = this.getRootUrl.bind(this)
    this.getUpload = this.getUpload.bind(this)
    this.getUploadDone = this.getUploadDone.bind(this)
  }

  handleDataChange(e: React.ChangeEvent<any>) {
    this.setState({dataType: e.target.value})
  }

  uploadTo(fieldName: string, rootUrl: string, uploadDone: () => void){
    const newRootUrls: {[key: string]: RootUrl} = {...this.state.rootUrl};
    const myRoot: RootUrl = {url: rootUrl, upload: true, uploadDone: uploadDone};
    newRootUrls[fieldName] = myRoot
    this.setState({rootUrl: newRootUrls})
  }

  getRootUrl(field: string){
    return this.state.rootUrl.hasOwnProperty(field) ? this.state.rootUrl[field].url : ''
  }

  getUpload(field: string){
    return this.state.rootUrl.hasOwnProperty(field) ? this.state.rootUrl[field].upload : false
  }

  getUploadDone(field: string){
    return this.state.rootUrl.hasOwnProperty(field) ? this.state.rootUrl[field].uploadDone : () => {}
  }

  render(): React.ReactElement {
    return (
      <>
        <MiddleCreateSampleForm
          lib={this.props.lib}
          history={this.props.history}
          uploadTo={this.uploadTo}
          handleDataChange={this.handleDataChange}
        />
        {dataTypeFields[this.state.dataType].map(fieldName => {
          return (
            <>
              <h4>{fieldName}</h4>
              <S3Uploader
                getRootUrl={() => this.getRootUrl(fieldName)}
                upload={this.getUpload(fieldName)}
                uploadDone={this.getUploadDone(fieldName)}
                height={100}
              />
            </>
          )
        })}
      </>
    )
  }
}


