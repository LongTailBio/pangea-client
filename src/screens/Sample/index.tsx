import * as React from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';
import { getSample } from '../../services/api';
import { SampleType } from '../../services/api/models/sample';

interface SampleScreenProps {
  sampleUUID: string;
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}

class SampleScreen extends React.Component<SampleScreenProps, SampleType> {
    
    protected sourceToken: CancelTokenSource;

    constructor(props: SampleScreenProps) {
        super(props);
        this.sourceToken = axios.CancelToken.source();
        this.state = {
            uuid: '',
            name: '',
            library_id: '',
            metadata: {},
            created_at: '',
            updated_at: '',
        };
    }

    componentDidMount() {
        // Assume that we are authenticated because Dashboard catches that
        getSample(this.props.sampleUUID, this.sourceToken)
            .then((sample) => {
                this.setState(sample);
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
                    <title>{`Pangea :: ${this.state.name}`}</title>
                </Helmet>
                <Row>
                    <h1>{this.state.name}</h1>
                    <h2>Sample</h2>
                </Row>
                <Row>
                    <Link to={`/sample-groups/${this.state.library_id}`}>Library</Link>
                </Row>

                <Row>
                    <Nav bsStyle="tabs" activeKey="1">
                        <LinkContainer to={`/samples/${this.props.sampleUUID}`}>
                            <NavItem eventKey="1"><Glyphicon glyph="folder-open" /> Analysis Results <Badge>
                                0
                            </Badge></NavItem>
                        </LinkContainer>
                    </Nav>
                </Row>

                <br />

                <Switch>
                    <Route
                        exact={true}
                        path="/samples/:uuid"
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
                                                <h4>This sample has no analysis results.</h4>
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

export default SampleScreen;
