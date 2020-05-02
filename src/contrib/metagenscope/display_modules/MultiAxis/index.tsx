import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { MultiAxisType } from '../../services/api/models/queryResult';

import { MultiAxisContainer } from './components/MultiAxisContainer';

export class MultiAxisModule extends HighchartsDisplayContainer<MultiAxisType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Multi-Axis';
    this.moduleName = 'metagenscope::v3.0.0::multi_axis';
    this.fieldName = 'multi_axis';
    this.description = (
      <div>
        <p>This plot allows comparison across multiple properties by selecting x and y axis.</p>
      </div>
    );
  }

  /** @inheritdoc */
  plotContainer(data: MultiAxisType): JSX.Element {
    return <MultiAxisContainer data={data} chartRef={el => this.chart = el} />;
  }
}
