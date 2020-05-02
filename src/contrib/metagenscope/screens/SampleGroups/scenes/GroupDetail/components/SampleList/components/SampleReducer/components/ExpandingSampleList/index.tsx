import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { SampleType } from '../../../../../../../../../../../../services/api/models/sample';

const SAMPLE_COUNT_THRESHOLD = 5;

interface ExpandingListProps {
  samples: SampleType[];
}

interface ExpandingListState {
  showAll: boolean;
}

class ExpandingSampleList extends React.Component<ExpandingListProps, ExpandingListState> {

  constructor(props: ExpandingListProps) {
    super(props);

    this.state = {showAll: false};

    this.toggleShowAll = this.toggleShowAll.bind(this);
  }

  toggleShowAll() {
    const showAll = !this.state.showAll;
    this.setState({showAll});
  }

  render() {
    let displaySamples = this.props.samples;
    if (displaySamples.length === 0) {
      return (
        <ListGroup>
          <ListGroupItem>No matching samples</ListGroupItem>
        </ListGroup>
      );
    }

    let moreCount = 0;
    if (!this.state.showAll) {
      const end = Math.min(displaySamples.length, SAMPLE_COUNT_THRESHOLD);
      moreCount = displaySamples.length - end;
      displaySamples = displaySamples.slice(0, end);
    }
    return (
      <ListGroup>
        {this.state.showAll &&
          <ListGroupItem style={{textAlign: 'center'}} onClick={this.toggleShowAll}>
            Hide additional samples
          </ListGroupItem>
        }
        {displaySamples.map((sample, index) => {
          const url = `/contrib/metagenscope/samples/${sample.uuid}`;
          return (
            <LinkContainer key={index} to={url}>
              <ListGroupItem>{sample.name}</ListGroupItem>
            </LinkContainer>
          );
        })}
        {!this.state.showAll && moreCount > 0 &&
          <ListGroupItem style={{textAlign: 'center'}} onClick={this.toggleShowAll}>
            Show {moreCount} more
          </ListGroupItem>
        }
        {this.state.showAll &&
          <ListGroupItem style={{textAlign: 'center'}} onClick={this.toggleShowAll}>
            Hide additional samples
          </ListGroupItem>
        }
      </ListGroup>
    );
  }
}

export default ExpandingSampleList;
