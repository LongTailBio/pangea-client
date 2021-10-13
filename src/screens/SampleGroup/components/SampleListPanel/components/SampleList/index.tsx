import React, { useState } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import {
  Row, Col, Panel, ListGroup, ListGroupItem, FormGroup,
  FormControl, Popover, OverlayTrigger, Button, Glyphicon,
  Tab, Tabs, Modal, Dropdown, MenuItem, ButtonToolbar
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource, AxiosError } from 'axios';
import useAxios from 'axios-hooks'
import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { SampleLinkType } from  '../../../../../../services/api/models/sample';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';

import { CreateGroupWithSamplesModal } from './components/CreateGroupWithSamplesModal';
import { AddSamplesToGroupModal } from './components/AddSamplesToGroupModal';

import { SampleLine } from './components/SampleLine';


interface SampleListFormValues  {
  samples: SampleLinkType[];
  checked: {[key: string]: boolean};
  checkAllChecked: boolean;
};

interface SampleListFormProps {
	samples: SampleLinkType[];
	grp: SampleGroupType;
}


const SampleListInnerForm = (props: SampleListFormProps & FormikProps<SampleListFormValues>) => {
	const [addSamplesModalShow, setAddSamplesModalShow] = React.useState(false);
	const [createGrpModalShow, setCreateGrpModalShow] = React.useState(false);

	const { touched, errors, isSubmitting, values, setFieldValue,  } = props;
	const samples = props.samples;
	const flipCheckAll = () => {
		setFieldValue(
			'checkAllChecked',
			!values.checkAllChecked
		)
		setFieldValue(
			'checked',
			Object.fromEntries(samples.map(s => [s.uuid, !values.checkAllChecked]))
		)
	}
	return (
		<>
			<Panel>
				<div className="panel-heading">
					<Row>
						<Col lg={9}>
			                <input
			                  name="checkall"
			                  type="checkbox"
			                  required={true}
			                  onChange={flipCheckAll}
			                />{' Check '}{samples.length} Samples				       
			            </Col>
			            <Col lg={3}>
			            	<ButtonToolbar>
							<Dropdown id="dropdown-sample-group" pullRight={true}>
							  <Dropdown.Toggle>
							    Manage Samples
							  </Dropdown.Toggle>

							  <Dropdown.Menu>
							  	<MenuItem eventKey="#/action-1" onClick={() => setAddSamplesModalShow(true)}>Add to Existing Group</MenuItem>
							    <MenuItem eventKey="#/action-2" onClick={() => setCreateGrpModalShow(true)}>Create New Group</MenuItem>
							  </Dropdown.Menu>
							</Dropdown>
							</ButtonToolbar>
						</Col>				
					</Row>
				</div>
				<div className="panel-body">
					{
				      samples.map(sample => <SampleLine sample={sample}/>)
					}
				</div>
			</Panel>

			
			<CreateGroupWithSamplesModal
		        show={createGrpModalShow}
		        onHide={() => setCreateGrpModalShow(false)}
		        samples={samples.filter((s: SampleLinkType) => values.checked[s.uuid])}
		    />
			<AddSamplesToGroupModal
		        show={addSamplesModalShow}
		        onHide={() => setAddSamplesModalShow(false)}
		        grp={props.grp}
		        samples={samples.filter((s: SampleLinkType) => values.checked[s.uuid])}
		    />
	    </>
	)
}


export const SampleListForm = withFormik<SampleListFormProps, SampleListFormValues>({
	mapPropsToValues: props => {
    	return {
      		samples: props.samples,
      		checked: Object.fromEntries(props.samples.map(s => [s.uuid, false])),
      		checkAllChecked: false,
    	};
  	},

  	handleSubmit: (values, formikBag) => {
  		console.log(values);
  	},
})(SampleListInnerForm);