import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs, Modal, Dropdown, MenuItem, ButtonToolbar
} from 'react-bootstrap';
import { useUserContext } from '../../../../../../../components/UserContext' 
import { SampleLinkType } from '../../../../../../../services/api/models/sample';
import { OrgLink } from '../../../../../../../services/api/models/user';
import { pangeaFetch } from '../../../../../../../services/api/coreApi';

import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { InfoButton, multilineText } from '../../../../../../../components/CreateForm'


interface CreateGroupWithSamplesInnerFormValues {
  groupName: string;
  inputOrg: string;
  public: boolean;
  description: string;
}

interface CreateGroupWithSamplesInnerFormProps {
  orgs: OrgLink[];
}


const CreateGroupWithSamplesInnerForm = (props: CreateGroupWithSamplesInnerFormProps & FormikProps<CreateGroupWithSamplesInnerFormValues>) => {
  const { touched, errors, isSubmitting, orgs } = props;
  return (
    <Form>
      <Row>
        <Col lg={8}>
          <FormGroup>
            <label htmlFor="inputOrg">Organization
              <InfoButton desc={"The organization this group will be created in."} />
            </label><br/>
            <Field name="inputOrg" as="select">
              {orgs.map(el =>
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
             <Field id="groupName" name="groupName" placeholder="Group Name" className="form-control input-lg"/>
          </FormGroup>
          <FormGroup>
            <label htmlFor="description">Description</label>
            <InfoButton desc={"A brief description of this sample group."} />

            <Field id="description" name="description" placeholder="Description" className="form-control input-lg"/>
          </FormGroup>
        </Col>
        <Col lg={4}>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
        </Col>
      </Row>
    </Form>
  );  
}


interface CreateGroupWithSamplesFormProps {
  samples: SampleLinkType[];
  orgs: OrgLink[];
  history: any;
  callback: () => void;
}

 
export const CreateGroupWithSamplesForm = withFormik<CreateGroupWithSamplesFormProps, CreateGroupWithSamplesInnerFormValues>({
  mapPropsToValues: props => {
    return {
      groupName: '',
      inputOrg: '',
      description: '',
      public: false,
      orgs: props.orgs,
    };
  },

  handleSubmit: (values, formikBag) => {
    var orgUUID = formikBag.props.orgs[0].uuid;
    if(formikBag.props.orgs){
      var match = formikBag.props.orgs.filter(el => {return el.name == values.inputOrg})
      orgUUID = match[0].uuid;
    }
    const createGroupPostData = {
      name: values.groupName,
      is_public: values.public,
      is_library: false,
      organization: orgUUID,
      description: values.description ? values.description : values.groupName,
      storage_provider_name: 'default',
    }
    const addSamplesPostData = {
      sample_uuids: formikBag.props.samples.map(s => s.uuid),
    }
    pangeaFetch(`/sample_groups`, 'POST', JSON.stringify(createGroupPostData))
        .then(response => response.json())
        .then(data => {
          pangeaFetch(
            `/sample_groups/${data.uuid}/samples`,
            'POST',
            JSON.stringify(addSamplesPostData)
          ).then(url => formikBag.props.history.push(`/sample-groups/${data.uuid}`));
        }) 

    formikBag.props.callback()
  },
})(CreateGroupWithSamplesInnerForm);


interface SampleModalProps {
  show: boolean;
  onHide: () => void;
  samples: SampleLinkType[];
}


export const CreateGroupWithSamplesModal = (props: SampleModalProps) => {
  let history = useHistory();
  const {user} = useUserContext();
  const orgs = user ? user.organization_objs : []
  return (
    <Modal show={props.show} onHide={() => { props.onHide() }}>
        <Modal.Header closeButton>
          <Modal.Title>Add {props.samples.length} Samples To New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	<CreateGroupWithSamplesForm
            samples={props.samples}
            orgs={orgs}
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