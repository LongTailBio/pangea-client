import * as React from 'react';

import { Redirect } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';
import { Link } from 'react-router-dom';

interface SearchFormDataType {
  [field: string]: string;
}

interface OmniSearchBarState {
  formData: SearchFormDataType;
  submitted: boolean;
}

export class OmniSearchBar extends React.Component<{}, OmniSearchBarState> {
  protected sourceToken: CancelTokenSource;

  constructor(props: {}) {
    super(props);
    this.sourceToken = axios.CancelToken.source();
    this.state = {
      formData: {
        query: '',
      },
      submitted: false,
    };
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.handleRandomSearch = this.handleRandomSearch.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    this.setState({
      formData: { query: '' },
      submitted: false,
    });
  }

  handleFormChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const formData = Object.assign({}, this.state.formData, { [name]: value });
    this.setState({ formData });
  };

  handleSubmitSearch = (_event: React.FormEvent<HTMLFormElement>) =>
    this.setState({ submitted: true });

  handleRandomSearch = (_event: React.MouseEvent) => {
    const searches: string[] = [
      'MetaSUB',
      'CAMDA',
      'city=doha',
      'coastal=coastal',
      'fairbanks',
      'Staphylococcus aureus',
      'Escherichia coli',
      'ATGGTGACAAAGAGAGTGCAACGGATGATGTT',
      'ATGATGTTCGCGGCGGCGGCGTGCATTCCGCT',
    ] 
    return this.setState({
      submitted: true,
      formData: {
        query: searches[Math.floor(Math.random() * searches.length)]
      }
    });    
  }


  render() {
    if (this.state.submitted) {
      const path = `/omnisearch/${this.state.formData.query}`;
      return <Redirect to={path} />;
    }
    return (
      <>
        <Row>
          <form onSubmit={this.handleSubmitSearch}>
            <Col lg={10}>
              <div className="form-group">
                <input
                  name="query"
                  className="form-control input-lg input-grp-btn"
                  type="text"
                  placeholder="Search..."
                  required={true}
                  value={this.state.formData.query}
                  onChange={this.handleFormChange}
                />
              </div>
            </Col>
            <Col lg={2}>
              <input
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                value="Search"
              />
            </Col>
          </form>
          </Row>
          <Row>
            <Col lg={2}>
              <Link to="/comingsoon">Advanced Search</Link>
            </Col>
            <Col lg={2} lgOffset={8}>
              <button
                className="btn btn-secondary btn-sm btn-block"
                onClick={this.handleRandomSearch}
              >{'Random'}</button>
            </Col>
        </Row>
      </>
    );
  }
}

export default OmniSearchBar;
