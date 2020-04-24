import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { TopTaxaType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import { TopTaxaContainer } from './components/TopTaxaContainer';

export class TopTaxaModule extends HighchartsDisplayContainer<TopTaxaType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Top Taxa';
    this.description = <p>This chart shows the average-abundance and prevalence for the top 100 taxa.</p>;
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    const out = getAnalysisResult<TopTaxaType>(
      this.props.orgID,
      this.props.groupID,
      'metagenscope::v0.1.0::top_taxa',
      'top_taxa',
      sourceToken
    );
    return out
  }

  /** @inheritdoc */
  plotContainer(data: TopTaxaType): JSX.Element {
    return <TopTaxaContainer data={data} chartRef={el => this.chart = el} />;
  }
}
