import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { HMPResultType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import HMPContainer from './components/HMPContainer';

interface HMPProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export default class HMPModule extends HighchartsDisplayContainer<HMPResultType, HMPProps> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Human Body Sites';
    this.description = (
      <p>This chart shows the similarity between bacterial communities in {' '}
         the samples and human body sites from the Human Microbiome Project. {' '}
         Higher values are more similar.</p>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<HMPResultType>(this.props.uuid, 'hmp', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: HMPResultType): JSX.Element {
    return (
      <HMPContainer
        data={data}
        chartRef={el => this.chart = el}
        isSingleton={this.props.isSingleton}
      />
    );
  }
}
