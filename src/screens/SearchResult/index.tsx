import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Well, Nav, NavItem, Glyphicon, Badge } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { search, SearchResultType } from '../../services/api';

interface SearchResultScreenProps {
  query: string;
}

class SearchResultScreen extends React.Component<SearchResultScreenProps, SearchResultType> {

    protected sourceToken: CancelTokenSource;

    constructor(props: SearchResultScreenProps) {
        super(props);
        this.sourceToken = axios.CancelToken.source();
        this.state = {
            search_term: '',
            sample_groups: [],
            samples: [],
            organizations: [],
        };
    }

    componentDidMount() {
        search(this.props.query, this.sourceToken)
            .then((searchResult) => {
                this.setState(searchResult);
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.log(error);
                }
            });
    }

    render() {
        // Note  cant use <SearchBar/> here because of routing issues
        return (
            <div>
                <Helmet>
                    <title>{`Pangea :: Search`}</title>
                </Helmet>
                <Row>
                    <h1>Search: {this.props.query}</h1>               
                </Row>

                <Row>
                    <Nav bsStyle="tabs" activeKey="1">
                        <LinkContainer to={`/search/${this.props.query}`} exact={true}>
                            <NavItem eventKey="1"><Glyphicon glyph="star" /> Sample Groups <Badge>
                                {this.state.sample_groups.length}
                            </Badge></NavItem>
                        </LinkContainer>
                        <LinkContainer to={`/search/${this.props.query}/samples`} exact={true}>
                            <NavItem eventKey="2"><Glyphicon glyph="star" /> Samples <Badge>
                                {this.state.samples.length}
                            </Badge></NavItem>
                        </LinkContainer>
                        <LinkContainer to={`/search/${this.props.query}/orgs`} exact={true}>
                            <NavItem eventKey="4"><Glyphicon glyph="star" /> Organizations <Badge>
                                {this.state.organizations.length}
                            </Badge></NavItem>
                        </LinkContainer>
                    </Nav>
                </Row>

                <br />
                <Switch>
                    <Route
                        exact={true}
                        path="/search/:query"
                        render={(props) => {
                            return (
                                <Row>
                                    <Col lg={12}>
                                        {this.state.sample_groups && 
                                            this.state.sample_groups.map((sample_grp, i) => {
                                                const name = sample_grp['name'];
                                                const uuid = sample_grp['uuid'];
                                                return (
                                                    <ul className="analysis-group-list">
                                                        <li className="analysis-group-list-item">
                                                            <Link to={`/sample-groups/${uuid}`}>{name}</Link>
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }
                                        {!this.state.sample_groups &&
                                            <Well className="text-center">
                                                <h4>This search did not find any sample groups.</h4>
                                            </Well>
                                        }
                                    </Col>
                                </Row>
                            );
                        }}
                    />

                    <Route
                        exact={true}
                        path="/search/:query/samples"
                        render={(props) => {
                            return (
                                <Row>
                                    <Col lg={12}>
                                        {this.state.samples && 
                                            this.state.samples.map((sample, i) => {
                                                const name = sample['name'];
                                                const uuid = sample['uuid'];
                                                return (
                                                    <ul className="analysis-group-list">
                                                        <li className="analysis-group-list-item">
                                                            <Link to={`/samples/${uuid}`}>{name}</Link>
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }
                                        {!this.state.samples &&
                                            <Well className="text-center">
                                                <h4>This search did not find any samples.</h4>
                                            </Well>
                                        }
                                    </Col>
                                </Row>
                            );
                        }}
                    />

                    <Route
                        exact={true}
                        path="/search/:query/orgs"
                        render={(props) => {
                            return (
                                <Row>
                                    <Col lg={12}>
                                        {this.state.organizations && 
                                            this.state.organizations.map((org, i) => {
                                                const name = org['name'];
                                                const uuid = org['uuid'];
                                                return (
                                                    <ul className="analysis-group-list">
                                                        <li className="analysis-group-list-item">
                                                            <Link to={`/organizations/${uuid}`}>{name}</Link>
                                                        </li>
                                                    </ul>
                                                );
                                            })
                                        }
                                        {!this.state.organizations &&
                                            <Well className="text-center">
                                                <h4>This search did not find any organizations.</h4>
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

export default SearchResultScreen;