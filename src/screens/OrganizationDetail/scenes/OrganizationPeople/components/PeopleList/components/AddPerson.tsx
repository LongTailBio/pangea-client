import React from 'react';
import CSS from 'csstype';
import { Row, Col } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';

import { OrganizationType } from '../../../../../../../services/api/models/organization';
import { UserType } from         '../../../../../../../services/api/models/user';
import { getAllUsers } from      '../../../../../../../services/api/userApi';
import { addUserToOrg } from     '../../../../../../../services/api/orgApi';

const highlighted: CSS.Properties = {
  color: 'blue',
};

interface AddUserState {
  userName: string;
  allUsers: UserType[];
  filteredUsers: UserType[];
  activeSuggestion: number;
  activeUser?: UserType;

}

interface AddUserProps  {
  org : OrganizationType;
};

export class AddUserForm extends React.Component<AddUserProps, AddUserState>{
  protected sourceToken: CancelTokenSource;

  constructor(props: AddUserProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.state = {
      userName: '',
      activeSuggestion: 0,
      allUsers: [],
      filteredUsers: [],
    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    getAllUsers(this.sourceToken)
      .then(users => {
        this.setState({
          allUsers: users,
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { activeSuggestion, filteredUsers } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e?.keyCode && e.keyCode === 13) {
      this.handleValueChange(filteredUsers[activeSuggestion].email)
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredUsers.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    this.handleValueChange(value)
  }

  handleValueChange(value: string){
    const users: UserType[] = this.state.allUsers.filter(
      user =>
        user.email.toLowerCase().indexOf(value) > -1
    )
    var user: UserType | undefined = undefined;
    if(users.length === 1){
      if(value === users[0].email){
        user = users[0]
      }
    }
    this.setState({userName: value, filteredUsers: users, activeUser: user})  
  }

  handleSubmit(event: React.MouseEvent<HTMLInputElement>) {  
    if(!this.state.activeUser){
      return
    }
    addUserToOrg(this.props.org, this.state.activeUser, this.sourceToken)
      .then(sample => {
        window.location.reload(false)
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.log(error);
        }
      });
  }

  render() {
    let suggestionsListComponent;
    if (this.state.userName.length < 1){
      suggestionsListComponent = (
        <div className="no-suggestions">
          <em>Start typing to see suggestions.</em>
        </div>
      );
    } else if (this.state.filteredUsers.length) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {this.state.filteredUsers.map((user, index) => {
            let className;
            let style;

            // Flag the active suggestion with a class
            if (index === this.state.activeSuggestion) {
              className = 'suggestion-active';
              style = highlighted;
            }

            return (
              <li
                className={className}
                key={user.email}
                style={style}
              >
                {user.email}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = (
        <div className="no-suggestions">
          <em>No matching users.</em>
        </div>
      );
    }
    return (
      <form onSubmit={e => {e.preventDefault()}}>
        <Row>
          <Col lg={2}>
            <h3>Add User</h3>
          </Col>
          <Col lg={8}>
            <input
              className="form-control input-lg input-grp-btn"
              type="text"
              key="username"
              id="username"
              required={true}
              value={this.state.userName}
              onChange={this.handleChange}
              onKeyDown={this.onKeyDown}
            />
            {suggestionsListComponent}
          </Col>
          <Col lg={2}>
            <input
              type="button"
              className="btn btn-success btn-lg btn-block"
              onClick={this.handleSubmit}
              value='Add'
            />
          </Col>          
        </Row>    
      </form>

    )
  }

}

export default AddUserForm;