import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { TopTaxaType } from '../../services/api/models/queryResult';

import { TopTaxaContainer } from './components/TopTaxaContainer';

export class TopTaxaModule extends HighchartsDisplayContainer<TopTaxaType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Top Taxa';
    this.moduleName = 'metagenscope::v3.0.0::top_taxa';
    this.fieldName = 'top_taxa';
    this.description = <p>This chart shows the average-abundance and prevalence for the top 100 taxa.</p>;
  }

  /** @inheritdoc */
  plotContainer(data: TopTaxaType): JSX.Element {
    return <TopTaxaContainer data={data} chartRef={el => this.chart = el} />;
  }
}
