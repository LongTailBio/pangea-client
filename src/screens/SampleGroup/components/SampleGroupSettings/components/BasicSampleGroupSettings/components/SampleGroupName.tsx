import * as React from 'react';
import {
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import { withFormik, FormikProps, FormikErrors, Form, Field, } from 'formik';
import { InfoButton, multilineText } from '../../../../../../../components/CreateForm'

import { pangeaFetch } from '../../../../../../../services/api/coreApi';
import { SampleGroupType } from '../../../../../../../services/api/models/sampleGroup';



interface SampleGroupNameValues {
    name: string;
}


const SampleGroupNameInnerForm = (props: FormikProps<SampleGroupNameValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Sample Group Name
          <InfoButton desc={"The name of this sample group."} />
        </label>
         <Field id="name" name="name" placeholder="name" className="form-control input-lg"/>
      </FormGroup>    
      <button type="submit" className="btn btn-primary btn-lg btn-block">Save</button>
    </Form>
  );
}; 

interface SampleGroupNameFormProps {
  uuid: string;
  name: string;
}

const SampleGroupNameForm = withFormik<SampleGroupNameFormProps, SampleGroupNameValues>({
  mapPropsToValues: props => {
    return {
      name: props.name,
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      name: values.name,
    }
    pangeaFetch(`/sample_groups/${formikBag.props.uuid}`, 'PATCH', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => window.location.reload(false))   
  },   
})(SampleGroupNameInnerForm);


interface SampleGroupNameProps {
  grp: SampleGroupType
}

export default class SampleGroupName extends React.Component<
  SampleGroupNameProps,
  {}
> {
  render() {
    return (
      <SampleGroupNameForm uuid={this.props.grp.uuid} name={this.props.grp.name}/>
    );
  }
}