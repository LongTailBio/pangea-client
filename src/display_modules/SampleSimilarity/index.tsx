import * as React from 'react';
import { CancelTokenSource } from 'axios';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { SampleSimilarityResultType } from '../../services/api/models/queryResult';
import { getAnalysisResult } from '../../services/api';

import { SampleSimilarityContainer } from './components/SampleSimilarityContainer';

export class SampleSimilarityModule extends D3DisplayContainer<SampleSimilarityResultType> {

  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Sample Similarity';
    this.description = (
      <div>
        <p>This plot displays a dimensionality reduction of the data.</p>
        <p>Samples are drawn near to similar samples in high dimensional space using a {' '}
          machine learning algorithm: T-Stochastic Neighbours Embedding.</p>
        <p>The plot can be colored by different sample metadata and the position of the {' '}
          points can be adjust to reflect the analyses of different tools.</p>
      </div>
    );
  }

  /** @inheritdoc */
  fetchData(sourceToken: CancelTokenSource) {
    return getAnalysisResult<SampleSimilarityResultType>(this.props.uuid, 'sample_similarity', sourceToken);
  }

  /** @inheritdoc */
  plotContainer(data: SampleSimilarityResultType): JSX.Element {
    return <SampleSimilarityContainer data={data} svgRef={el => this.svgCanvas = el} />;
  }
}
