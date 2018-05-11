import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { ReadsClassifiedType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import ReadsClassifiedContainer from './components/ReadsClassifiedContainer';

interface ReadsClassifiedProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export class ReadsClassifiedModule extends HighchartsDisplayContainer<ReadsClassifiedType, ReadsClassifiedProps> {

  constructor(props: ReadsClassifiedProps) {
    super(props);

    this.title = 'Reads Classified';
    this.description = (
      <p>This chart shows the proportion of reads in each sample {' '}
        assigned to different groups.</p>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<ReadsClassifiedType>(this.props.uuid, 'reads_classified', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: ReadsClassifiedType): JSX.Element {
    return (
      <ReadsClassifiedContainer data={data} chartRef={el => this.chart = el} isSingleton={this.props.isSingleton} />
    );
  }
}
