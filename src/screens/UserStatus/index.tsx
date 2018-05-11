import * as React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { getUserStatus } from '../../services/api';

interface UserProps {
  isAuthenticated: boolean;
}

interface UserState {
  created_at: string;
  email: string;
  id: string;
  username: string;
}

class UserStatus extends React.Component<UserProps, UserState> {

  protected sourceToken: CancelTokenSource;

  constructor (props: UserProps) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      created_at: '',
      email: '',
      id: '',
      username: ''
    };
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      getUserStatus(this.sourceToken)
        .then((userState) => {
          this.setState(userState);
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            console.log(error);
          }
        });
    }
  }

  componentWillUnmount() {
    this.sourceToken.cancel();
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <p>You must be logged in to view this. Click <Link to="/login">here</Link> to log back in.</p>;
    }
    return (
      <div>
        <Helmet>
          <title>MetaGenScope :: User Status</title>
        </Helmet>
        <ul>
          <li><strong>User ID:</strong> {this.state.id}</li>
          <li><strong>Email:</strong> {this.state.email}</li>
          <li><strong>Username:</strong> {this.state.username}</li>
        </ul>
      </div>
    );
  }
}

export default UserStatus;
