import * as React from 'react';
import CSS from 'csstype';
import { Row, Col } from 'react-bootstrap';

const highlighted: CSS.Properties = {
  color: 'blue',
};

interface TaxonEntryBarProps {
  onSubmitAction: (sampleUUID: string) => void;
  suggestions: string[];
}

interface TaxonEntryBarState {
  activeSuggestion: number;
  filteredSuggestions: string[];
  showSuggestions: boolean;
  userInput: string;
}

class TaxonEntryBar extends React.Component<
  TaxonEntryBarProps,
  TaxonEntryBarState
> {
  state = {
    userInput: '',
    activeSuggestion: 0,
    filteredSuggestions: [],
    showSuggestions: false,
  };

  handleFormChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { suggestions } = this.props;
    const userInput = event.currentTarget.value;

    let filteredSuggestions: string[] = [];
    if (userInput.length >= 3) {
      // Filter our suggestions that don't contain the user's input
      filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1,
      );
    }

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: event.currentTarget.value,
    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = (event: React.MouseEvent<HTMLLIElement>) => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: event.currentTarget.innerText,
    });
  };

  // Event fired when the user presses a key down
  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e);
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e?.keyCode && e.keyCode === 13) {
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
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
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  handleSubmitSearch = (_event: React.FormEvent<HTMLFormElement>) => {
    _event.preventDefault();
    let taxon = this.state.userInput;
    taxon = taxon[0].toUpperCase() + taxon.substr(1).toLowerCase();
    this.props.onSubmitAction(taxon);
    this.setState({ userInput: '' });
  };

  render() {
    let suggestionsListComponent;

    if (this.state.showSuggestions && this.state.userInput) {
      if (this.state.filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {this.state.filteredSuggestions.map((suggestion, index) => {
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
                  key={suggestion}
                  onClick={this.onClick}
                  style={style}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions.</em>
          </div>
        );
      }
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
                placeholder="Search for a taxon..."
                required={true}
                value={this.state.userInput}
                onChange={this.handleFormChange}
                onKeyDown={this.onKeyDown}
              />
              {suggestionsListComponent}
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

export default TaxonEntryBar;
