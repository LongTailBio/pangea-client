import * as React from 'react';
import { Row, Col, Panel, ListGroup, ListGroupItem, FormGroup, FormControl, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route, Redirect } from 'react-router';
import { PangeaUserType } from '../../../../../services/api/models/user';
import { pangeaFetch } from '../../../../../services/api/coreApi';
import { withFormik, FormikProps, FormikErrors, Form, Field } from 'formik';

 const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


interface PasswordFormValues {
  curpass: string;
  newpass: string;
  renewpass: string;
}




 const PasswordInnerForm = (props: FormikProps<PasswordFormValues>) => {
   const { touched, errors, isSubmitting } = props;
   return (
     <Form> 
       <FormGroup>
           <label htmlFor="curpass">Current Password</label>
           <Field id="curpass" name="curpass" placeholder="Current Password" type="password" className="form-control input-lg"/>
           <label htmlFor="newpass">New Password</label>
           <Field id="newpass" name="newpass" placeholder="New Password" type="password" className="form-control input-lg"/>
           <label htmlFor="renewpass">Retype New Password</label>
           <Field id="renewpass" name="renewpass" placeholder="Retype New Password" type="password" className="form-control input-lg"/>           
       </FormGroup>                   
       <button type="submit">Submit</button>
     </Form>
   );
 };

 interface PasswordFormProps {
     user: PangeaUserType;
     callbackOk: () => void;
     callbackBad: () => void;
 }


 const UserPasswordForm = withFormik<PasswordFormProps, PasswordFormValues>({
   mapPropsToValues: props => {
     return {
      curpass: '',
      newpass: '',
      renewpass: '',
     };
   },

   handleSubmit: (values, formikBag) => {
    const data = {
      new_password: values.newpass,
      re_new_password: values.renewpass,
      current_password: values.curpass,
    }
    pangeaFetch(`/auth/users/set_password/`, 'POST', JSON.stringify(data))
        .then(response => {
          if(response['ok']){
            formikBag.props.callbackOk()
          } else {
            formikBag.props.callbackBad()
          }
        })
   },
 })(PasswordInnerForm);


interface UserPasswordFormPageProps {
  user: PangeaUserType;
}

interface UserPasswordFormPageState {
  status: "ok"|"bad"|"pending";
}



export default class UserPasswordFormPage extends React.Component<UserPasswordFormPageProps, UserPasswordFormPageState> {

  constructor(props: UserPasswordFormPageProps) {
    super(props);
    this.state = {
      status: "pending",
    }
    this.callbackOk = this.callbackOk.bind(this);
    this.callbackBad = this.callbackBad.bind(this);
  }

  callbackOk(){
    this.setState({
      status: "ok"
    })
  }

  callbackBad(){
    this.setState({
      status: "bad"
    })
  }

  render() {
    return (
     <div>
       <h1>Change Password</h1>
       {this.state.status === "ok" && <div className={"alert alert-success"}>Password changed successfully.</div>}
       {this.state.status === "bad" && <div className={"alert alert-danger"}>Password not changed.</div>}
       <UserPasswordForm user={this.props.user} callbackOk={this.callbackOk} callbackBad={this.callbackBad} />
     </div>
    )
  }
}