
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
import { usePangeaAxios, PaginatedResult } from '../../../../services/api';
import { API_BASE_URL } from '../../../../services/api/utils';

import { LoadingErrorMessage } from '../../../../components/LoadingErrorMessage'
import { SampleGroupType } from '../../../../services/api/models/sampleGroup';
import { WorkOrderProtoType } from '../../../../services/api/models/workOrder';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray, useFormikContext, useField } from 'formik';
import { pangeaFetch, pangeaGet } from '../../../../services/api/coreApi';

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
    checked: string[];
}

interface ICreateSampleInnerFormProps {
  handleDataChange: (e: React.ChangeEvent<any>) => void;
  workOrders: WorkOrderProtoType[];
}




const ICreateSampleInnerForm = (props: ICreateSampleInnerFormProps & FormikProps<ICreateSampleValues>) => {
  const { values, touched, errors, handleChange, isSubmitting, handleDataChange, workOrders } = props;
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
      <FormGroup>
        <h4>Work Orders<InfoButton desc={"Analyses to run on this sample"} /></h4>
        <div role="group" aria-labelledby="checkbox-group">
          {workOrders.map(wo => {
            return (
              <>
                <label>
                  <Field type="checkbox" name="checked" value={wo.name} />
                  {wo.name}
                </label>
                <InfoButton desc={wo.description} />
                <br/>
              </>            
            )
          })}
        </div> 
      </FormGroup>          
      <button type="submit" className="btn btn-primary btn-lg btn-block">Create and Upload</button>
    </Form>
  );
};

interface CreateSampleFormProps {
  lib: string;
  history: any;
  handleDataChange: (e: React.ChangeEvent<any>) => void;
  workOrders: WorkOrderProtoType[];
  uploadTo: (fieldName: string, rootUrl: string) => void;
  setSampleUUID: (sampleUUID: string) => void;
}

const MiddleCreateSampleForm = withFormik<CreateSampleFormProps, ICreateSampleValues>({
  mapPropsToValues: props => {
    return {
      sampleName: '',
      dataType: dataTypeChoices[0],
      handleDataChange: props.handleDataChange,
      workOrders: props.workOrders,
      checked: [],
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      name: values.sampleName,
      library: formikBag.props.lib,
    }
    const createSamplePromise = pangeaFetch(`/samples`, 'POST', JSON.stringify(postData))
        .then(response => response.json())
    const createWorkOrdersPromise = createSamplePromise.then(data => {
      formikBag.props.setSampleUUID(data.uuid)
      values.checked.map(woName => {
        const wo = formikBag.props.workOrders.filter(el => el.name === woName)[0]
        pangeaFetch(`/samples/${data.uuid}/work_orders/${wo.uuid}`, 'POST', JSON.stringify({}))
          .then(response => response.json())        
      })
      return data
    })
    createWorkOrdersPromise.then(data => {
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
                formikBag.props.uploadTo(fieldName, url);
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
}
interface IntegratedCreateSampleFormState {
  rootUrl: {[key: string]: RootUrl};
  dataType: string;
  workOrders: WorkOrderProtoType[];
  nToUpload: number;
  nUploaded: number;
  sampleUUID: string;
}


export class IntegratedCreateSampleForm extends React.Component<IntegratedCreateSampleFormProps, IntegratedCreateSampleFormState> {

  state = {
    rootUrl: {} as {[key: string]: RootUrl},
    dataType: dataTypeChoices[0],
    workOrders: [],
    nToUpload: 0,
    nUploaded: 0,
    sampleUUID: '',
  };

  constructor(props: IntegratedCreateSampleFormProps) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.uploadTo = this.uploadTo.bind(this);
    this.getRootUrl = this.getRootUrl.bind(this)
    this.getUpload = this.getUpload.bind(this)
    this.uploadDone = this.uploadDone.bind(this)
    this.setSampleUUID = this.setSampleUUID.bind(this)
  }

  setSampleUUID(sampleUUID: string){
    this.setState({ sampleUUID })
  }

  componentDidMount(){
    pangeaGet(`/work_order_prototypes`)
        .then(response => response.json())
        .then(rawData => {
          const data = rawData as PaginatedResult<WorkOrderProtoType>;
          this.setState({workOrders: data.results})
        })
  }

  handleDataChange(e: React.ChangeEvent<any>) {
    this.setState({dataType: e.target.value})
  }

  uploadTo(fieldName: string, rootUrl: string){
    const newRootUrls: {[key: string]: RootUrl} = {...this.state.rootUrl};
    const myRoot: RootUrl = {url: rootUrl, upload: true};
    newRootUrls[fieldName] = myRoot
    this.setState({rootUrl: newRootUrls, nToUpload: this.state.nToUpload + 1})
  }

  getRootUrl(field: string){
    return this.state.rootUrl.hasOwnProperty(field) ? this.state.rootUrl[field].url : ''
  }

  getUpload(field: string){
    return this.state.rootUrl.hasOwnProperty(field) ? this.state.rootUrl[field].upload : false
  }

  uploadDone(field: string){
    this.setState({nUploaded: this.state.nUploaded + 1})
    if(this.state.nUploaded === this.state.nToUpload){
        this.props.history.push(`/samples/${this.state.sampleUUID}`) 
    }
  }

  render(): React.ReactElement {
    return (
      <>
        <MiddleCreateSampleForm
          lib={this.props.lib}
          history={this.props.history}
          uploadTo={this.uploadTo}
          handleDataChange={this.handleDataChange}
          workOrders={this.state.workOrders}
          setSampleUUID={this.setSampleUUID}
        />
        {dataTypeFields[this.state.dataType].map(fieldName => {
          return (
            <>
              <h4>{fieldName}</h4>
              <S3Uploader
                getRootUrl={() => this.getRootUrl(fieldName)}
                upload={this.getUpload(fieldName)}
                uploadDone={() => this.uploadDone(fieldName)}
                height={100}
              />
            </>
          )
        })}
      </>
    )
  }
}


