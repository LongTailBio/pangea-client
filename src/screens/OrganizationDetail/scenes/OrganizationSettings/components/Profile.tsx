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
import { InfoButton, multilineText } from '../../../../../components/CreateForm'
import { pangeaFetch } from '../../../../../services/api/coreApi';
import { OrganizationType } from '../../../../../services/api/models/organization';



interface OrgProfileValues {
    name: string;
}


const OrgProfileInnerForm = (props: FormikProps<OrgProfileValues>) => {
  const { touched, errors, isSubmitting } = props;
  return (
    <Form> 
      <FormGroup>
        <label htmlFor="name">Organization Name
          <InfoButton desc={"The name of this organization."} />
        </label>
         <Field id="name" name="name" placeholder="name" className="form-control input-lg"/>
      </FormGroup>    
      <button type="submit" className="btn btn-primary btn-lg btn-block">Save</button>
    </Form>
  );
}; 

interface OrgProfileFormProps {
  uuid: string;
  name: string;
}


const OrgProfileForm = withFormik<OrgProfileFormProps, OrgProfileValues>({
  mapPropsToValues: props => {
    return {
      name: props.name,
    };
  },

  handleSubmit: (values, formikBag) => {
    const postData = {
      name: values.name,
    }
    pangeaFetch(`/organizations/${formikBag.props.uuid}`, 'PATCH', JSON.stringify(postData))
        .then(response => response.json())
        .then(data => window.location.reload(false))   
  },   
})(OrgProfileInnerForm);


interface OrgSettingsProps {
  org: OrganizationType
}

export default class OrgSettingsProfile extends React.Component<
  OrgSettingsProps,
  {}
> {
  render() {
    return (
      <div>
        <h3>Organization profile</h3>
        <hr />
        <Row>
          <Col lg={7}>
            <OrgProfileForm uuid={this.props.org.uuid} name={this.props.org.name}/>
          </Col>
        </Row>
      </div>
    );
  }
}
