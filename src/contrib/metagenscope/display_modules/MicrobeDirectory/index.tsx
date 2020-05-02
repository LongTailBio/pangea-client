import * as React from 'react';
import { CancelTokenSource } from 'axios';

import HighchartsDisplayContainer from '../components/DisplayContainer/highcharts';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { MicrobeDirectoryType } from '../../services/api/models/queryResult';

import MicrobeDirectoryContainer from './components/MicrobeDirectoryContainer';

interface MicrobeDirectoryProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export class MicrobeDirectoryModule extends HighchartsDisplayContainer<MicrobeDirectoryType, MicrobeDirectoryProps> {

  constructor(props: MicrobeDirectoryProps) {
    super(props);

    this.title = 'Microbe Directory';
    this.moduleName = 'metagenscope::v3.0.0::microbe_directory';
    this.fieldName = 'md1';
    this.description = (
      <p>This chart shows the proportion of different known microbiological {' '}
        features in each sample. Features are sourced from the {' '}
        <a href="https://microbe.directory/" target="_blank">Microbe Directory</a>.</p>
    );
  }

  /** @inheritdoc */
  plotContainer(data: MicrobeDirectoryType): JSX.Element {
    return (
      <MicrobeDirectoryContainer
        data={data}
        chartRef={el => this.chart = el}
        isSingleton={this.props.isSingleton}
      />
    );
  }
}
