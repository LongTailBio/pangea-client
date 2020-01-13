import * as React from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
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
                <Helmet>
                    <title>{`Pangea :: ${this.state.username}`}</title>
                </Helmet>         
                <Row>
                    <h1>{this.state.username}</h1>
                    <h2>User</h2>
                    <p>{this.state.email}</p>
                    <p>{this.state.created_at}</p>
                </Row>

                <Row>
                    <Nav bsStyle="tabs" activeKey="1">
                        <LinkContainer to={`/users/${this.props.userUUID}`}>
                            <NavItem eventKey="1"><Glyphicon glyph="star" /> Organizations <Badge>
                                {this.state.organization_uuids.length}
                            </Badge></NavItem>
                        </LinkContainer>
                    </Nav>
                </Row>

                <br />

                <Switch>
                    <Route
                        exact={true}
                        path="/users/:uuid"
                        render={(props) => {
                            return (
                                <Row>
                                    <Col lg={12}>
                                        {this.state.organization_uuids &&
                                            this.state.organization_uuids.map((org_uuid, i) => {
                                                return (
                                                    <ul className="analysis-group-list">
                                                        <li className="analysis-group-list-item">
                                                            <Link to={`/organizations/${org_uuid}`}>{this.state.organization_names[i]}</Link>
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }
                                        {!this.state.organization_uuids &&
                                            <Well className="text-center">
                                                <h4>This user is not in any organizations.</h4>
                                            </Well>
                                        }
                                    </Col>
                                </Row>
                            );
                        }}
                    />
                </Switch>

            </div>
        );
    }                    

}

export default UserDetailScreen;