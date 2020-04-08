import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import Plot from 'react-plotly.js';

interface TaxonEntryBarProps {
  onSubmitAction: (sampleUUID: string) => void;
}

interface TaxonEntryBarState {
  searchBar: string;
}


class TaxonEntryBar extends React.Component<TaxonEntryBarProps, TaxonEntryBarState> {
  state = { searchBar: '' };

  handleFormChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    this.setState({ searchBar: value });
  };

  handleSubmitSearch = (_event: React.FormEvent<HTMLFormElement>) => {
    _event.preventDefault();
    var taxon = this.state.searchBar
    taxon = taxon[0].toUpperCase() + taxon.substr(1).toLowerCase()
    this.props.onSubmitAction(taxon);
    this.setState({ searchBar: ''});

  }

  render() {
    return (
      <Row>
        <form onSubmit={this.handleSubmitSearch}>
          <Col lg={10}>
            <div className="form-group">
              <input
                name="query"
                className="form-control input-lg"
                type="text"
                placeholder="Search for a taxon..."
                required={true}
                value={this.state.searchBar}
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
    )
  }
}

export default TaxonEntryBar;
