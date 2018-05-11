import * as React from 'react';

import D3DisplayContainer from '../DisplayContainer/d3';
import { DisplayContainerProps } from '../DisplayContainer';
import { GenericGeneType } from '../../../services/api/models/queryResult';

import GenericGeneContainer from './components/GenericGeneContainer';

export interface GenericGeneProps extends DisplayContainerProps {
  isSingleton?: boolean;
}

export default class GenericGeneModule extends D3DisplayContainer<GenericGeneType, GenericGeneProps> {

  protected chartId: string;
  protected yAxisTitle: string;

  /** @inheritdoc */
  plotContainer(data: GenericGeneType): JSX.Element {
    return (
      <GenericGeneContainer
        data={data}
        svgRef={el => this.svgCanvas = el}
        chartId={this.chartId}
        yAxisTitle={this.yAxisTitle}
        legendTitle={'log10 RPKM[G]'}
        isSingleton={this.props.isSingleton}
      />
    );
  }
}
