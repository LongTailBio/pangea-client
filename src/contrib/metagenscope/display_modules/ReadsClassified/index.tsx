import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { ReadsClassifiedType } from '../../services/api/models/queryResult';

import ReadsClassifiedContainer from './components/ReadsClassifiedContainer';

interface ReadsClassifiedProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export class ReadsClassifiedModule extends HighchartsDisplayContainer<ReadsClassifiedType, ReadsClassifiedProps> {

  constructor(props: ReadsClassifiedProps) {
    super(props);

    this.title = 'Reads Classified';
    this.moduleName = 'metagenscope::v0.1.0::reads_classified';
    this.fieldName = 'json';
    this.description = (
      <p>This chart shows the proportion of reads in each sample {' '}
        assigned to different groups.</p>
    );
  }

  /** @inheritdoc */
  plotContainer(data: ReadsClassifiedType): JSX.Element {
    return (
      <ReadsClassifiedContainer data={data} chartRef={el => this.chart = el} isSingleton={this.props.isSingleton} />
    );
  }
}
