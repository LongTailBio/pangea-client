import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';
import { getSampleGroup } from '../../services/api';
import { SampleGroupType } from '../../services/api/models/sampleGroup';

interface SampleGroupScreenProps {
  groupUUID: string;
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}

class SampleGroupScreen extends React.Component<SampleGroupScreenProps, SampleGroupType> {

    protected sourceToken: CancelTokenSource;

    constructor(props: SampleGroupScreenProps) {
        super(props);
        this.sourceToken = axios.CancelToken.source();
        this.state = {
            uuid: '',
            organization_id: '',
            name: '',
            description: '',
            theme: '',
            is_public: false,
            created_at: '',
            updated_at: '',
        };
    }

    componentDidMount() {
        // Assume that we are authenticated because Dashboard catches that
        getSampleGroup(this.props.groupUUID, this.sourceToken)
            .then((sampleGroup) => {
                this.setState(sampleGroup);
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.log(error);
                }
            });
    }

    render() {
        let publicity = 'Public';
        if (! this.state.is_public){
            publicity = 'Private';
        }
        return (
            <div>
                <Helmet>
                    <title>{`Pangea :: ${this.state.name}`}</title>
                </Helmet>
                <Row>
                    <h1>{this.state.name}</h1>
                    <h2>Sample Group</h2>
                    <p>{publicity}</p>
                    <p>{this.state.created_at}</p>                 
                </Row>
                <Row>
                    <Link to={`/organizations/${this.state.organization_id}`}>Owner Organization</Link>
                </Row>

                <Row>
                    <Nav bsStyle="tabs" activeKey="1">
                        <LinkContainer to={`/sample-groups/${this.props.groupUUID}`} exact={true}>
                            <NavItem eventKey="1"><Glyphicon glyph="star" /> Samples <Badge>
                                0
                            </Badge></NavItem>
                        </LinkContainer>
                        <LinkContainer to={`/sample-groups/${this.props.groupUUID}/analysis-results`}>
                            <NavItem eventKey="2"><Glyphicon glyph="folder-open" /> Analysis Results <Badge>
                                0
                            </Badge></NavItem>
                        </LinkContainer>
                    </Nav>
                </Row>

                <br />
                <Switch>
                    <Route
                        exact={true}
                        path="/sample-groups/:uuid"
                        render={(props) => {
                            return (
                                <Row>
                                    <Col lg={12}>
                                        {false &&
                                            [].map((sample_uuid, i) => {
                                                return (
                                                    <ul className="analysis-group-list">
                                                        <li className="analysis-group-list-item">
                                                            <Link to={`/samples/${sample_uuid}`}>{[][i]}</Link>
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }
                                        {true &&
                                            <Well className="text-center">
                                                <h4>This sample group has no samples.</h4>
                                            </Well>
                                        }
                                    </Col>
                                </Row>
                            );
                        }}
                    />
                    <Route
                        exact={true}
                        path="/sample-groups/:uuid/analysis-results"
                        render={(props) => {
                            return (
                                <Row>
                                    <Col lg={12}>
                                        {false &&
                                            [].map((ar_uuid, i) => {
                                                return (
                                                    <ul className="analysis-group-list">
                                                        <li className="analysis-group-list-item">
                                                            <Link to={`/analysis-results/${ar_uuid}`}>{[][i]}</Link>
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }
                                        {true &&
                                            <Well className="text-center">
                                                <h4>This sample group has no analysis results.</h4>
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

export default SampleGroupScreen;
