import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { AGSResultType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import AGSContainer from './components/AGSContainer';


export class AGSModule extends HighchartsDisplayContainer<AGSResultType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Average Genome Size';
    this.description = (
      <div>
        <p>Generally a larger average genome size indicates a community   {' '}
          with broader function, as opposed to specific niches.
          Average Genome Size can also be used to estimate what proportion of their
          genomes bacteria devot to certain functions.</p>
        <p>This estimate only applies to Bacterial species in each sample.</p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    const out = getAnalysisResult<AGSResultType>(
      this.props.orgID,
      this.props.groupID,
      'metagenscope::v0.1.0::ave_genome_size',
      'ags',
      sourceToken
    );
    return out
  }

  /** @inheritdoc */
  plotContainer(data: AGSResultType): JSX.Element {
    return <AGSContainer data={data} chartRef={el => this.chart = el} />;
  }
}
