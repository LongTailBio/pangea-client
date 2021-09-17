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
import { withFormik, FormikProps, FormikErrors, Form, Field, FieldArray } from 'formik';
import { SampleLinkType } from '../../../../../services/api/models/sample';


interface SampleListFormValues  {
  samples: SampleLinkType[];
  checked: {[key: string]: boolean};
  checkAllChecked: boolean;
};

interface SampleListFormProps {
	samples: SampleLinkType[];
}


const metadataToStr = (sampleLink: SampleLinkType): string => {
  if(! sampleLink?.metadata){
    return "No metadata";
  }
  var out = "";
  Object.keys(sampleLink.metadata).map(key => {
    out += key
    out += ": "
    out += sampleLink.metadata[key]
    out += ", "
  })
  if(out.length > 100){
    out = out.slice(0, 97) + '...'
  } else if(out.length == 0){
    return "No metadata"
  }
  return out
}


const SampleListInnerForm = (props: FormikProps<SampleListFormValues>) => {
	const { touched, errors, isSubmitting, values, setFieldValue,  } = props;
	const samples = values.samples;
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
		<Form>
			<Row>
				<Col sm={9}>
					<form>
		                <input
		                  name="checkall"
		                  type="checkbox"
		                  required={true}
		                  onChange={flipCheckAll}
		                />
		                {' '}Check All
		            </form>
	            </Col>
				<Col sm={3}>
					<button type="submit" className="btn btn-primary btn-lg btn-block">Create</button>
				</Col>
			</Row>
			{
		      samples.map(sample => (
		        <ul key={sample.uuid} className="analysis-group-list">
		          <li className="analysis-group-list-item">
		          	<Field type="checkbox" name={`checked.${sample.uuid}`} />
		          	{" "}
		            <Link to={`/samples/${sample.uuid}`}>
		              {sample.name}
		            </Link>
		            <>
		              <br/>
		              <p>{metadataToStr(sample)}</p>
		            </>
		          </li>
		        </ul>
		      ))}
			}
		</Form>
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

