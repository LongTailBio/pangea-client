import * as React from 'react';

import D3DisplayContainer from '../components/DisplayContainer/d3';
import { DisplayContainerProps } from '../components/DisplayContainer';
import { SampleSimilarityResultType } from '../../services/api/models/queryResult';

import { SampleSimilarityContainer } from './components/SampleSimilarityContainer';

export class SampleSimilarityModule extends D3DisplayContainer<
  SampleSimilarityResultType
> {
  constructor(props: DisplayContainerProps) {
    super(props);

    this.title = 'Sample Similarity';
    this.moduleName = 'metagenscope::sample_similarity';
    this.fieldName = 'dim_reduce';
    this.description = (
      <div>
        <p>This plot displays a dimensionality reduction of the data.</p>
        <p>
          Samples are drawn near to similar samples in high dimensional space
          using UMAP.
        </p>
        <p>
          The plot can be colored by different sample metadata and the position
          of the points can be adjust to reflect the analyses of different
          tools.
        </p>
      </div>
    );
  }

  /** @inheritdoc */
  plotContainer(data: SampleSimilarityResultType): JSX.Element {
    return (
      <SampleSimilarityContainer
        data={data}
        svgRef={el => (this.svgCanvas = el)}
      />
    );
  }
}
