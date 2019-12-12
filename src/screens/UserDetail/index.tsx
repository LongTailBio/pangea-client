import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';
import { getUser } from '../../services/api';
import { UserType } from '../../services/api/models/user';

interface UserDetailScreenProps {
  userUUID: string;
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}

class UserDetailScreen extends React.Component<UserDetailScreenProps, UserType> {
    
    protected sourceToken: CancelTokenSource;

    constructor(props: UserDetailScreenProps) {
        super(props);
        this.sourceToken = axios.CancelToken.source();
        this.state = {
            uuid: '',
            username: '',
            email: '',
            is_deleted: false,
            created_at: '',
            organization_uuids: [],
            organization_names: [],
        };
    }

    componentDidMount() {
        // Assume that we are authenticated because Dashboard catches that
        getUser(this.props.userUUID, this.sourceToken)
            .then((user) => {
                this.setState(user);
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.log(error);
                }
            });
    }

    render() {
        return (
            <div>
                <Row>
                    <h1>{this.state.username}</h1>
                    <h2>User</h2>
                    <p>{this.state.email}</p>
                    <p>{this.state.created_at}</p>
                </Row>
                <Row>
                    <h2>Organizations</h2>
                    {
                        this.state.organization_uuids.map((org_uuid, i) => {
                            return (
                                <Link to={`/organizations/${org_uuid}`}>{this.state.organization_names[i]}</Link>
                            );
                        })
                    }
                </Row>
            </div>
        );
    }                    

}

export default UserDetailScreen;