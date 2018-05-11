import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';

import { getSampleGroupSamples } from '../../../../../../services/api';
import { SampleType } from '../../../../../../services/api/models/sample';

import SampleReducer from './components/SampleReducer';

interface SampleListProps {
  sampleGroupUuid: string;
}

interface SampleListState {
  error?: string;
  samples?: SampleType[];
}

class SampleList extends React.Component<SampleListProps, SampleListState> {

  protected sourceToken: CancelTokenSource;

  constructor(props: SampleListProps) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {
      error: undefined,
      samples: undefined,
    };
  }

  componentDidMount() {
    getSampleGroupSamples(this.props.sampleGroupUuid, this.sourceToken)
      .then((samples) => {
        this.setState({ samples });
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          this.setState({ error: 'There was an error fetching the sample list for this group.' });
        }
      });
  }

  componentWillUnmount() {
    this.sourceToken.cancel();
  }

  render() {
    return (
      <Panel id="sample-list">
        <Panel.Heading>Samples</Panel.Heading>
        {this.state.samples === undefined && this.state.error === undefined &&
          <Panel.Body>
            <h3>Loading...</h3>
          </Panel.Body>
        }
        {this.state.error !== undefined &&
          <Panel.Body>
            <h3>Error:</h3>
            <p>{this.state.error}</p>
          </Panel.Body>
        }
        {this.state.samples !== undefined &&
          <Panel.Body>
            {this.state.samples.length > 0 &&
              <SampleReducer samples={this.state.samples} />
            }
            {this.state.samples.length <= 0 &&
              <p>No samples found for this Sample Group.</p>
            }
          </Panel.Body>
        }
      </Panel>
    );
  }
}

export default SampleList;
