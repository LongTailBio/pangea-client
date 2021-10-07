import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs, Modal, Dropdown, MenuItem, ButtonToolbar
} from 'react-bootstrap';

import { useUserContext } from '../../../../../../../components/UserContext' 
import { SampleLinkType } from '../../../../../../../services/api/models/sample';

import { usePangeaAxios, PaginatedResult } from '../../../../../../../services/api';
import { pangeaFetch } from '../../../../../../../services/api/coreApi';
import { SampleGroupType } from '../../../../../../../services/api/models/sampleGroup';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { InfoButton, multilineText } from '../../../../../../../components/CreateForm'
import { HandleErrorLoading } from '../../../../../../../components/ErrorLoadingHandler'


interface AddSamplesToGroupInnerFormValues {
  inputGrp: '';
}

interface AddSamplesToGroupInnerFormProps {
  grps: SampleGroupType[];
}


const AddSamplesToGroupInnerForm = (props: AddSamplesToGroupInnerFormProps & FormikProps<AddSamplesToGroupInnerFormValues>) => {
  const { touched, errors, isSubmitting, grps } = props;
  return (
    <Form>
      <Row>
        <Col lg={8}>
          <FormGroup>
            <label htmlFor="inputGrp">Sample Group
              <InfoButton desc={"The group which samples will be added to"} />
            </label><br/>
            <Field name="inputGrp" as="select">
              {grps.map(el =>
                (<option key={el.name} value={el.name}>{el.name}</option>)
              )}
            </Field>
          </FormGroup>
        </Col>
        <Col lg={4}>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Add</button>
        </Col>
      </Row>
    </Form>
  );  
}


interface AddSamplesToGroupFormProps {
  samples: SampleLinkType[];
  grps: SampleGroupType[];
  history: any;
  callback: () => void;
}

 
export const AddSamplesToGroupForm = withFormik<AddSamplesToGroupFormProps, AddSamplesToGroupInnerFormValues>({
  mapPropsToValues: props => {
    return {
      inputGrp: '',
      grps: props.grps,
    };
  },

  handleSubmit: (values, formikBag) => {
    var grpUUID = formikBag.props.grps[0].uuid;
    if(formikBag.props.grps){
      var match = formikBag.props.grps.filter(el => {return el.name == values.inputGrp})
      grpUUID = match[0].uuid;
    }
    const addSamplesPostData = {
      sample_uuids: formikBag.props.samples.map(s => s.uuid),
    }
    pangeaFetch(
      `/sample_groups/${grpUUID}/samples`,
      'POST',
      JSON.stringify(addSamplesPostData)
    ).then(url => formikBag.props.history.push(`/sample-groups/${grpUUID}`)); 

    formikBag.props.callback()
  },
})(AddSamplesToGroupInnerForm);


interface SampleModalProps {
  show: boolean;
  onHide: () => void;
  samples: SampleLinkType[];
  grp: SampleGroupType;
}


export const AddSamplesToGroupModal = (props: SampleModalProps) => {
  let history = useHistory();
  let location = useLocation() as any
  const org = props.grp.organization_obj
  const [sampleGroups] = usePangeaAxios<PaginatedResult<SampleGroupType>>(
    `/sample_groups?organization_id=${org.uuid}`,
  );
  if(sampleGroups.loading || sampleGroups.error){
    return (<HandleErrorLoading loading={sampleGroups.loading} error={sampleGroups.error}/>)
  }
  console.log(sampleGroups.data)
  

  return (
    <Modal show={props.show} onHide={() => { props.onHide() }}>
        <Modal.Header closeButton>
          <Modal.Title>Add {props.samples.length} Samples To Existing Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	<AddSamplesToGroupForm
            samples={props.samples}
            grps={sampleGroups.data.results}
            history={history}
            callback={props.onHide}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => { props.onHide() }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  );
}