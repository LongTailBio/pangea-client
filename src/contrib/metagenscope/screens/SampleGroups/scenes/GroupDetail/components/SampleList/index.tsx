import * as React from 'react';
import { Panel } from 'react-bootstrap';
import { default as axios, CancelTokenSource } from 'axios';

import { SampleType } from '../../../../../../../../services/api/models/sample';

import SampleReducer from './components/SampleReducer';

interface SampleListProps {
  samples: SampleType[];
}

class SampleList extends React.Component<SampleListProps, {}> {
  protected sourceToken: CancelTokenSource;

  constructor(props: SampleListProps) {
    super(props);

    this.sourceToken = axios.CancelToken.source();
    this.state = {};
  }

  componentWillUnmount() {
    this.sourceToken.cancel();
  }

  render() {
    return (
      <Panel id="sample-list">
        <Panel.Heading>Samples</Panel.Heading>
        {this.props.samples === undefined && (
          <Panel.Body>
            <h3>Loading...</h3>
          </Panel.Body>
        )}
        {this.props.samples !== undefined && (
          <Panel.Body>
            {this.props.samples.length > 0 && (
              <SampleReducer samples={this.props.samples} />
            )}
            {this.props.samples.length <= 0 && (
              <p>No samples found for this Sample Group.</p>
            )}
          </Panel.Body>
        )}
      </Panel>
    );
  }
}

export default SampleList;
