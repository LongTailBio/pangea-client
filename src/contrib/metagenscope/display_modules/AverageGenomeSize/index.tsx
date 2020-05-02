import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { AGSResultType } from '../../services/api/models/queryResult';

import AGSContainer from './components/AGSContainer';


export class AGSModule extends HighchartsDisplayContainer<AGSResultType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Average Genome Size';
    this.moduleName = 'metagenscope::v3.0.0::ave_genome_size';
    this.fieldName = 'ags';
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
  plotContainer(data: AGSResultType): JSX.Element {
    return <AGSContainer data={data} chartRef={el => this.chart = el} />;
  }
}
