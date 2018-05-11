import * as React from 'react';
import { CancelTokenSource } from 'axios';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { BetaDiversityType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import BetaDiversityContainer from './components/BetaDiversityContainer';

export default class BetaDiversityModule extends D3DisplayContainer<BetaDiversityType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Beta Diverstiy';
    this.description = (
      <p>It's got colors and whatnot.</p>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<BetaDiversityType>(this.props.uuid, 'beta_diversity', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: BetaDiversityType): JSX.Element {
    return <BetaDiversityContainer data={data} svgRef={el => this.svgCanvas = el} />;
  }
}
