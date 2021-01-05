import * as React from 'react';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { CovidResultType } from '../../services/api/models/queryResult';

import CovidDisplayContainer from './components/CovidDisplayContainer';

export class CovidDisplayModule extends HighchartsDisplayContainer<CovidResultType> {
  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'COVID-19';
    this.moduleName = 'metagenscope::v3.0.0::covid_fast_detect';
    this.fieldName = 'alpha_diversity';
    this.description = (
      <div>
        <p>
          Higher alpha diversity indicates a sample with a more biologically
          diverse community with more niches.
        </p>
        <p>
          Richness and Chao1 are estimates of the total number of taxa in the
          sample, regardless of the abundance of each taxa. Shannon Index (aka:
          entropy) and the Gini-Simpson Coeffecient take the size of each group
          into account, rewarding samples with more even distributions.
        </p>
      </div>
    );
  }

  /** @inheritdoc */
  plotContainer(data: CovidResultType): JSX.Element {
    return (
      <CovidDisplayContainer data={data} chartRef={el => (this.chart = el)} />
    );
  }
}
