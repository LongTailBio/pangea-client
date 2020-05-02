import * as React from 'react';
import { FormGroup } from 'react-bootstrap';

class Search extends React.Component<{}, {}> {
  render() {
    return (
      <form>
        <FormGroup>
          <input placeholder="Search samples" />
        </FormGroup>
      </form>
    );
  }
}

export default Search;
