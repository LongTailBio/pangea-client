import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem, FormGroup, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route, Redirect } from 'react-router';
import { PangeaUserType } from '../../../../../services/api/models/user';
import { pangeaFetch } from '../../../../../services/api/coreApi';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';

 const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


interface ProfileFormValues {
    name: string;
    biography: string;
    url: string;
    twitter_username: string;
    github_username: string;
    company: string;
    location: string;
}


interface UserSettingsProfileProps {
  user: PangeaUserType;
}

interface UserSettingsProfileState {
  formVals: ProfileFormValues;
}


 const UserInfoInnerForm = (props: FormikProps<ProfileFormValues>) => {
   const { touched, errors, isSubmitting } = props;
   return (
     <Form> 
       <FormGroup>
           <label htmlFor="name">Name</label>
           <Field id="name" name="name" placeholder="Name" />
       </FormGroup>
       <FormGroup>
           <label htmlFor="bio">Bio</label>
           <Field id="bio" name="biography" placeholder="Biography" />
       </FormGroup>
       <FormGroup>
           <label htmlFor="url">Website</label>
           <Field id="url" name="url" />
       </FormGroup>
       <FormGroup>
           <label htmlFor="twitter">Twitter</label>
           <Field id="twitter" name="twitter_username" placeholder="twitter" />
       </FormGroup>
       <FormGroup>
           <label htmlFor="github">GitHub</label>
           <Field id="github" name="github_username" placeholder="github" />
       </FormGroup>
       <FormGroup>
           <label htmlFor="company">Company</label>
           <Field id="company" name="company" placeholder="company" />
       </FormGroup>
       <FormGroup>
           <label htmlFor="location">Location</label>
           <Field id="location" name="location" placeholder="location" />
       </FormGroup>                                 
       <button type="submit">Submit</button>
     </Form>
   );
 };

 interface UserFormProps {
     user: PangeaUserType
     formVals: ProfileFormValues
 }


 const UserInfoForm = withFormik<UserFormProps, ProfileFormValues>({
   mapPropsToValues: props => {
     return props.formVals;
   },

   handleSubmit: (values, formikBag) => {
    pangeaFetch(`/users/${formikBag.props.user.uuid}`, 'PUT', JSON.stringify(values))
        .then(response => response.json())
        .then(data => window.location.reload(false));  
   },
 })(UserInfoInnerForm);


export default class UserSettingsProfile extends React.Component<UserSettingsProfileProps, UserSettingsProfileState> {

  constructor(props: UserSettingsProfileProps) {
    super(props);
    this.state = {
        formVals: {
            name: props.user.name,
            biography: props.user.biography,
            url: props.user.url,
            twitter_username: props.user.twitter_username,
            github_username: props.user.github_username,
            company: props.user.company,
            location: props.user.location,
        }
    };
  }

  render() {
    return (
     <div>
       <h1>User Info</h1>
       <UserInfoForm user={this.props.user} formVals={this.state.formVals} />
     </div>
    )
  }
}
