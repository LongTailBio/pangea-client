import * as React from 'react';
import { CancelTokenSource } from 'axios';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { AncestryType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import AncestryContainer from './components/AncestryContainer';

export default class AncestryModule extends D3DisplayContainer<AncestryType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Ancestry';
    this.description = (
      <p>Description pending.</p>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<AncestryType>(this.props.uuid, 'putative_ancestry', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: AncestryType): JSX.Element {
    return <AncestryContainer data={data} svgRef={el => this.svgCanvas = el} />;
  }
}