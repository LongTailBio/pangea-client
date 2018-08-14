import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { MultiAxisType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import { MultiAxisContainer } from './components/MultiAxisContainer';

export class MultiAxisModule extends HighchartsDisplayContainer<MultiAxisType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Multi-Axis';
    this.description = (
      <div>
        <p>This plot allows comparison across multiple properties by selecting x and y axis.</p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<MultiAxisType>(this.props.uuid, 'multi_axis_abundance', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: MultiAxisType): JSX.Element {
    return <MultiAxisContainer data={data} chartRef={el => this.chart = el} />;
  }
}
