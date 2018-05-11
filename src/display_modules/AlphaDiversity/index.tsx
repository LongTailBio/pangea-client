import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { AlphaDivResultType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import AlphaDiversityContainer from './components/AlphaDiversityContainer';

export default class AlphaDiversityModule extends HighchartsDisplayContainer<AlphaDivResultType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Alpha Diversity';
    this.description = (
      <div>
        <p>Higher alpha diversity indicates a sample with a more  {' '}
          biologically diverse community with more niches.</p>
        <p>Richness and Chao1 are estimates of the total number of taxa in the sample, {' '}
          regardless of the abundance of each taxa.
          Shannon Index (aka: entropy) and the Gini-Simpson Coeffecient take the size of {' '}
          each group into account, rewarding samples with more even distributions.</p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<AlphaDivResultType>(this.props.uuid, 'alpha_diversity', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: AlphaDivResultType): JSX.Element {
    return <AlphaDiversityContainer data={data} chartRef={el => this.chart = el} />;
  }
}
