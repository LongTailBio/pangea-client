import * as React from 'react';

import { Redirect } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';

interface SearchFormDataType {
  [field: string]: string;
}

interface SearchBarState {
  formData: SearchFormDataType;
  submitted: boolean;
}

export class SearchBar extends React.Component<{}, SearchBarState> {
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

  handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) =>
    this.setState({ submitted: true });

  render() {
    if (this.state.submitted) {
      const path = `/search/${this.state.formData.query}`;
      return <Redirect to={path} />;
    }
    return (
      <Row>
        <form onSubmit={this.handleSubmitSearch}>
          <Col lg={10}>
            <div className="form-group">
              <input
                name="query"
                className="form-control input-lg"
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
    );
  }
}

export default SearchBar;
