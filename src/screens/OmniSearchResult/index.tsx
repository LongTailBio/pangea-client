import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { omnisearch } from '../../services/api';
import { OmniSearchResultType } from '../../services/api/models/omniSearchResult';

interface OmniSearchResultScreenProps {
  query: string;
}

interface OmniSearchResultScreenState {
  result: OmniSearchResultType;
  loading: boolean;
}

class OmniSearchResultScreen extends React.Component<
  OmniSearchResultScreenProps,
  OmniSearchResultScreenState
> {
  protected sourceToken: CancelTokenSource;

  constructor(props: OmniSearchResultScreenProps) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.state = {
      result: {
        search_term: '',
        sample_groups: [],
        samples: [],
        organizations: [],
        taxa: [],
      },
      loading: true,
    };
  }

  componentDidMount() {
    omnisearch(this.props.query, this.sourceToken)
      .then(searchResult => {
        this.setState({
          result: searchResult,
          loading: false,
        });
      })
      .catch(error => {
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
        {this.state.loading && (<h2>Loading...</h2>)}
        {!this.state.loading && (
          <Row>
            <Nav bsStyle="tabs" activeKey="1">
              <LinkContainer to={`/omnisearch/${this.props.query}`} exact={true}>
                <NavItem eventKey="1">
                  <Glyphicon glyph="star" /> Sample Groups{' '}
                  <Badge>{this.state.result.sample_groups.length}</Badge>
                </NavItem>
              </LinkContainer>

              <LinkContainer
                to={`/omnisearch/${this.props.query}/samples`}
                exact={true}
              >
                <NavItem eventKey="2">
                  <Glyphicon glyph="star" /> Samples{' '}
                  <Badge>{this.state.result.samples.length}</Badge>
                </NavItem>
              </LinkContainer>

              <LinkContainer to={`/omnisearch/${this.props.query}/orgs`} exact={true}>
                <NavItem eventKey="3">
                  <Glyphicon glyph="star" /> Organizations{' '}
                  <Badge>{this.state.result.organizations.length}</Badge>
                </NavItem>
              </LinkContainer>

              <LinkContainer to={`/omnisearch/${this.props.query}/taxa`} exact={true}>
                <NavItem eventKey="4">
                  <Glyphicon glyph="star" /> Taxa{' '}
                  <Badge>{this.state.result.taxa.length}</Badge>
                </NavItem>
              </LinkContainer>
            </Nav>
          </Row>
          )}
          <br />
          <Switch>
            <Route
              exact={true}
              path="/omnisearch/:query"
              render={_props => (
                <Row>
                  <Col lg={12}>
                    {this.state.result.sample_groups && (
                      <ul className="analysis-group-list">
                        {this.state.result.sample_groups.map((sample_grp, _i) => {
                          const { uuid, name } = sample_grp;
                          return (
                            <li key={uuid} className="analysis-group-list-item">
                              <Link to={`/sample-groups/${uuid}`}>{name}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {!this.state.result.sample_groups && (
                      <Well className="text-center">
                        <h4>This search did not find any sample groups.</h4>
                      </Well>
                    )}
                  </Col>
                </Row>
              )}
            />

            <Route
              exact={true}
              path="/omnisearch/:query/samples"
              render={_props => (
                <Row>
                  <Col lg={12}>
                    {this.state.result.samples && (
                      <ul className="analysis-group-list">
                        {this.state.result.samples.map((sample, _i) => {
                          const { name, uuid } = sample;
                          return (
                            <li key={uuid} className="analysis-group-list-item">
                              <Link to={`/samples/${uuid}`}>{name}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {!this.state.result.samples && (
                      <Well className="text-center">
                        <h4>This search did not find any samples.</h4>
                      </Well>
                    )}
                  </Col>
                </Row>
              )}
            />

            <Route
              exact={true}
              path="/omnisearch/:query/orgs"
              render={_props => (
                <Row>
                  <Col lg={12}>
                    {this.state.result.organizations && (
                      <ul className="analysis-group-list">
                        {this.state.result.organizations.map((org, _i) => {
                          const { name, uuid } = org;
                          return (
                            <li key={uuid} className="analysis-group-list-item">
                              <Link to={`/organizations/${uuid}`}>{name}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {!this.state.result.organizations && (
                      <Well className="text-center">
                        <h4>This search did not find any organizations.</h4>
                      </Well>
                    )}
                  </Col>
                </Row>
              )}
            />

            <Route
              exact={true}
              path="/omnisearch/:query/taxa"
              render={_props => (
                <Row>
                  <Col lg={12}>
                    {this.state.result.taxa && (
                      <ul className="analysis-group-list">
                        {this.state.result.taxa.map((taxon, _i) => {
                          const { canon_name } = taxon;
                          return (
                            <li key={canon_name} className="analysis-group-list-item">
                              canon_name
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    {!this.state.result.taxa && (
                      <Well className="text-center">
                        <h4>This search did not find any taxa.</h4>
                      </Well>
                    )}
                  </Col>
                </Row>
              )}
            />
          </Switch>
      </div>
    );
  }
}

export default OmniSearchResultScreen;